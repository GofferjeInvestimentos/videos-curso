# Transcrição local com tempo por palavra (faster-whisper). O áudio não sai da máquina.
# Uso: python transcrever.py <video> <saida.json> [modelo=small]
# - Decodifica o áudio com o ffmpeg (a versão do PyAV do faster-whisper falha em alguns vídeos).
# - "medium" pode estourar memória em máquina comum; "small" dá conta de fala limpa em PT.
import sys, json, subprocess
import numpy as np
from faster_whisper import WhisperModel

src, out = sys.argv[1], sys.argv[2]
modelo = sys.argv[3] if len(sys.argv) > 3 else "small"

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                     capture_output=True).stdout
audio = np.frombuffer(raw, np.float32)
m = WhisperModel(modelo, device="cpu", compute_type="int8", cpu_threads=4)
segs, _ = m.transcribe(audio, language="pt", word_timestamps=True, vad_filter=True)
res = []
for s in segs:
    res.append({"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip(),
                "words": [{"w": w.word, "s": round(w.start, 2), "e": round(w.end, 2)} for w in s.words]})
    print(f"[{s.start:05.1f}-{s.end:05.1f}] {s.text.strip()}")
json.dump(res, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
