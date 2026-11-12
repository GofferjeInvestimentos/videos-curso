# Vídeo CRU -> vídeo-base: estabiliza, trata cor e áudio, tira pausas, acelera mantendo o tom.
# Uso: python cortar.py <bruto> <transcricao.json> <pasta_saida> [perfil.json | velocidade]
#      (velocidade vem de perfil.ritmo; sem perfil, 1.25)
# Saídas: estab.mkv (intermediário), base.mkv, edl.json (planos mantidos, no tempo do bruto)
# - O ffmpeg já aplica a rotação do celular (vídeo de WhatsApp vem "deitado" com rotação -90).
# - Frame rate variável (WhatsApp) vira 30 fixo antes de tudo.
# - Cortes caem no limite do frame: áudio e vídeo de cada plano têm a mesma duração (sem dessincronizar).
import sys, json, subprocess, os

RAW, TR, OUT = sys.argv[1], sys.argv[2], os.path.abspath(sys.argv[3])
_arg = sys.argv[4] if len(sys.argv) > 4 else None
SPEED = (json.load(open(_arg, encoding="utf-8")).get("ritmo", 1.25) if _arg and _arg.endswith(".json")
         else float(_arg) if _arg else 1.25)
FPS = 30
GAP_MIN = 0.30
PAD_OUT, PAD_IN = 0.10, 0.06
os.makedirs(OUT, exist_ok=True)

def run(args):
    r = subprocess.run(args, cwd=OUT, capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-2000:])

def snap(t): return round(t * FPS) / FPS

ws = [w for s in json.load(open(TR, encoding="utf-8")) for w in s["words"]]
segs, start = [], max(0.0, ws[0]["s"] - 0.12)
for a, b in zip(ws, ws[1:]):
    if b["s"] - a["e"] >= GAP_MIN:
        segs.append([snap(start), snap(a["e"] + PAD_OUT)])
        start = b["s"] - PAD_IN
segs.append([snap(start), snap(ws[-1]["e"] + 0.30)])
kept = sum(e - s for s, e in segs)
json.dump({"speed": SPEED, "fps": FPS, "segs": segs}, open(os.path.join(OUT, "edl.json"), "w"), indent=1)
print(f"{len(segs)} planos · {kept:.1f}s mantidos -> {kept / SPEED:.1f}s a {SPEED}x")

GRADE = ("eq=contrast=1.10:brightness=-0.015:saturation=1.10:gamma=0.97,"
         "colorbalance=rs=-0.03:bs=0.05:rh=0.05:gh=0.01:bh=-0.04,"
         "curves=all='0/0 0.25/0.21 0.75/0.80 1/1',unsharp=5:5:0.7")
run(["ffmpeg", "-y", "-v", "error", "-i", RAW, "-vf", f"fps={FPS},vidstabdetect=shakiness=5:accuracy=15:result=t.trf",
     "-f", "null", "-"])
run(["ffmpeg", "-y", "-v", "error", "-i", RAW,
     "-vf", f"fps={FPS},vidstabtransform=input=t.trf:smoothing=20:zoom=3:interpol=bicubic,{GRADE}",
     "-af", "highpass=f=80,afftdn=nf=-25,acompressor=threshold=-20dB:ratio=3:attack=5:release=120",
     "-c:v", "libx264", "-crf", "14", "-preset", "fast", "-c:a", "pcm_s16le", "estab.mkv"])

fc = []
for i, (s, e) in enumerate(segs):
    d = e - s
    fc.append(f"[0:v]trim=start={s:.4f}:end={e:.4f},setpts=PTS-STARTPTS[v{i}]")
    fc.append(f"[0:a]atrim=start={s:.4f}:end={e:.4f},asetpts=PTS-STARTPTS,"
              f"afade=t=in:d=0.012,afade=t=out:st={d - 0.012:.4f}:d=0.012[a{i}]")
fc.append("".join(f"[v{i}][a{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=1[vc][ac]")
fc.append(f"[vc]setpts=PTS/{SPEED},fps={FPS}[v]")
fc.append(f"[ac]atempo={SPEED},loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000[a]")
run(["ffmpeg", "-y", "-v", "error", "-i", "estab.mkv", "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
     "-c:v", "libx264", "-crf", "14", "-preset", "fast", "-c:a", "pcm_s16le", "base.mkv"])
print("OK", os.path.join(OUT, "base.mkv"))
