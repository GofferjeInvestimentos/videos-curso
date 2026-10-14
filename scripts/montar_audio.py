"""Monta a trilha de áudio editada direto dos proxies, sem renderizar vídeo.

Uso: python scripts/montar_audio.py <saida.wav>

Segue a mesma linha do tempo do Remotion (src/Youtube/linhaDoTempo.ts): cada
clipe começa no quadro arredondado e ganha um fade curto (3 quadros) nas pontas.
Serve para trocar o áudio de um vídeo já renderizado sem refazer a imagem.
"""
import json
import os
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
RAMPA = 3 / FPS

clipes = json.load(open(f"{RAIZ}/src/Youtube/dados/clipes.json"))
entradas, filtros, rotulos = [], [], []
partes = sorted({c["parte"] for c in clipes})
for p in partes:
    entradas += ["-i", f"{RAIZ}/proxy/{p}.mp4"]

segundos = 0.0
for i, c in enumerate(clipes):
    de = round(segundos * FPS)
    segundos += c["fim"] - c["inicio"]
    quadros = round(segundos * FPS) - de
    inicio = round(c["inicio"] * FPS) / FPS
    dur = quadros / FPS
    idx = partes.index(c["parte"])
    filtros.append(
        f"[{idx}:a]atrim=start={inicio:.6f}:duration={dur:.6f},asetpts=PTS-STARTPTS,"
        f"afade=t=in:d={RAMPA:.4f},afade=t=out:st={max(0, dur - RAMPA):.4f}:d={RAMPA:.4f}[a{i}]"
    )
    rotulos.append(f"[a{i}]")

grafo = ";".join(filtros) + ";" + "".join(rotulos) + f"concat=n={len(clipes)}:v=0:a=1[out]"
subprocess.run(
    ["ffmpeg", "-nostdin", "-v", "error", "-y", *entradas, "-filter_complex", grafo,
     "-map", "[out]", "-ar", "48000", "-ac", "2", sys.argv[1]],
    check=True,
)
print(f"{len(clipes)} clipes, {segundos:.2f}s")
