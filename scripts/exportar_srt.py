"""Gera o arquivo .srt das legendas no tempo do vídeo editado (para subir no YouTube).

Uso: python scripts/exportar_srt.py <saida.srt>

Usa a mesma lógica de src/Youtube/linhaDoTempo.ts e Legendas.tsx: posiciona os
clipes em sequência, mantém só as palavras dentro deles e agrupa em blocos curtos.
"""
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
MAX_CARACTERES = 42
MAX_PALAVRAS = 9

clipes = json.load(open(f"{RAIZ}/src/Youtube/dados/clipes.json"))
palavras = json.load(open(f"{RAIZ}/src/Youtube/dados/palavras.json"))

linha, segundos = [], 0.0
for c in clipes:
    de = round(segundos * FPS)
    segundos += c["fim"] - c["inicio"]
    linha.append({**c, "de": de, "quadros": round(segundos * FPS) - de})

itens = []
for p in palavras:
    meio = (p["s"] + p["e"]) / 2
    c = next((x for x in linha if x["parte"] == p["parte"] and x["inicio"] <= meio < x["fim"]), None)
    if not c:
        continue
    de = c["de"] + max(0, round((p["s"] - c["inicio"]) * FPS))
    ate = c["de"] + min(c["quadros"], round((p["e"] - c["inicio"]) * FPS))
    itens.append((p["w"], de, max(ate, de + 1)))

blocos, atual = [], []
for w, de, ate in itens:
    if atual:
        texto = " ".join(x[0] for x in atual + [(w,)])
        ant = atual[-1]
        if (
            de - ant[2] > 0.5 * FPS
            or re.search(r"[.!?]$", ant[0])
            or len(texto) > MAX_CARACTERES
            or len(atual) >= MAX_PALAVRAS
        ):
            blocos.append(atual)
            atual = []
    atual.append((w, de, ate))
if atual:
    blocos.append(atual)


def tempo(q):
    ms = round(q / FPS * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


with open(sys.argv[1], "w") as f:
    for i, b in enumerate(blocos, 1):
        f.write(f"{i}\n{tempo(b[0][1])} --> {tempo(b[-1][2])}\n{' '.join(x[0] for x in b)}\n\n")
print(f"{len(blocos)} blocos de legenda")
