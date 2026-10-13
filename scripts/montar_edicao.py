"""Monta a lista de cortes (clipes) e as palavras das legendas para o Remotion.

Uso: python scripts/montar_edicao.py <pasta_analise>

Lê da pasta de análise:
  layouts.json          trocas de enquadramento detectadas (câmera/celular/tela)
  <parte>.palavras.json palavras revisadas com timestamps (gravação original)
e de scripts/remover.json os trechos a descartar (erros, repetições).

Gera src/Youtube/dados/clipes.json e src/Youtube/dados/palavras.json.
"""
import json
import os
import sys

A = sys.argv[1]
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARTES = ["parte1", "parte2"]

PAUSA_MAX = 0.45      # pausas maiores que isso viram corte seco
FOLGA_ANTES = 0.10    # respiro antes da primeira palavra de um trecho
FOLGA_DEPOIS = 0.16   # respiro depois da última palavra
TROCA_ENQUADRAMENTO = 7.0  # segundos máximos no mesmo zoom em planos de câmera
ZOOM_FECHADO = 1.14

layouts = json.load(open(f"{A}/layouts.json"))
remover = json.load(open(os.path.join(RAIZ, "scripts", "remover.json")))
duracoes = {p: float(os.popen(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {RAIZ}/public/proxy/{p}.mp4").read() or 0) for p in PARTES}


def layout_em(parte, t):
    atual = layouts[parte][0][1]
    for inicio, nome in layouts[parte]:
        if t >= inicio:
            atual = nome
    return atual


def subtrair(intervalos, cortes):
    out = []
    for s, e in intervalos:
        partes = [(s, e)]
        for cs, ce in cortes:
            novo = []
            for a, b in partes:
                if ce <= a or cs >= b:
                    novo.append((a, b))
                    continue
                if a < cs:
                    novo.append((a, cs))
                if ce < b:
                    novo.append((ce, b))
            partes = novo
        out.extend(partes)
    return [(a, b) for a, b in out if b - a > 0.2]


clipes, todas_palavras = [], []
for parte in [p for p in PARTES if os.path.exists(f"{A}/{p}.palavras.json")]:
    palavras = json.load(open(f"{A}/{parte}.palavras.json"))
    cortes = [(r["de"], r["ate"]) for r in remover if r["parte"] == parte]
    # 1. Trechos de fala: junta palavras separadas por pausas curtas.
    trechos = []
    for p in palavras:
        if trechos and p["s"] - trechos[-1][1] <= PAUSA_MAX:
            trechos[-1][1] = p["e"]
        else:
            trechos.append([p["s"], p["e"]])
    trechos = [
        (max(0.0, s - FOLGA_ANTES), min(duracoes[parte] or e + 1, e + FOLGA_DEPOIS))
        for s, e in trechos
    ]
    # 2. Remove erros/repetições marcados na revisão.
    trechos = subtrair(trechos, cortes)
    # 3. Quebra nas trocas de enquadramento.
    trocas = [t for t, _ in layouts[parte][1:]]
    quebrados = []
    for s, e in trechos:
        pontos = [s] + [t for t in trocas if s < t < e] + [e]
        quebrados += [(a, b) for a, b in zip(pontos, pontos[1:]) if b - a > 0.15]
    # 4. Alterna aberto/fechado nos cortes de câmera e a cada ~7s de fala contínua.
    fronteiras = sorted({w["e"] for w in palavras} | {w["s"] for w in palavras})
    zoom_fechado = False
    for s, e in quebrados:
        layout = layout_em(parte, (s + e) / 2)
        if layout != "camera":
            clipes.append({"parte": parte, "inicio": round(s, 3), "fim": round(e, 3), "layout": layout})
            continue
        inicio = s
        while e - inicio > TROCA_ENQUADRAMENTO + 2:
            # Troca de enquadramento entre palavras, perto de 7s.
            alvo = inicio + TROCA_ENQUADRAMENTO
            # Prefere fim de frase/vírgula perto do alvo; senão, qualquer fronteira de palavra.
            candidatos = [
                (abs(w1["e"] - alvo) - (1.5 if w1["w"][-1:] in ",.?!" else 0), (w1["e"] + w2["s"]) / 2)
                for w1, w2 in zip(palavras, palavras[1:])
                if abs(w1["e"] - alvo) < 3 and inicio + 4 < w1["e"] < e - 3
            ]
            if not candidatos:
                break
            meio = min(candidatos)[1]
            clipes.append({"parte": parte, "inicio": round(inicio, 3), "fim": round(meio, 3), "layout": "camera", "zoom": ZOOM_FECHADO if zoom_fechado else 1})
            zoom_fechado = not zoom_fechado
            inicio = meio
        clipes.append({"parte": parte, "inicio": round(inicio, 3), "fim": round(e, 3), "layout": "camera", "zoom": ZOOM_FECHADO if zoom_fechado else 1})
        zoom_fechado = not zoom_fechado
    todas_palavras += [{"parte": parte, "w": p["w"], "s": p["s"], "e": p["e"]} for p in palavras]

dados = os.path.join(RAIZ, "src", "Youtube", "dados")
os.makedirs(dados, exist_ok=True)
json.dump(clipes, open(f"{dados}/clipes.json", "w"), ensure_ascii=False, indent=0)
json.dump(todas_palavras, open(f"{dados}/palavras.json", "w"), ensure_ascii=False, separators=(",", ":"))
total = sum(c["fim"] - c["inicio"] for c in clipes)
bruto = sum(duracoes.values())
print(f"{len(clipes)} clipes, {total/60:.1f} min editados de {bruto/60:.1f} min brutos")
