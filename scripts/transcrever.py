"""Transcreve as gravações com Whisper (faster-whisper) e salva palavras com timestamps.

Uso: python scripts/transcrever.py <audio.wav> <saida.json> [modelo]

O prompt inicial traz o vocabulário do curso (tickers, sites, termos de mercado)
para o modelo acertar a grafia logo na primeira passada.
"""
import json
import sys

from faster_whisper import WhisperModel

VOCABULARIO = (
    "Aula de investimentos com Fernando Gofferjé, da Gofferjé Investimentos. "
    "Tesouro Direto, Tesouro Selic, Tesouro IPCA+, CDB, LCI, LCA, FII, fundos imobiliários, "
    "ações, B3, Ibovespa, dividendos, dividend yield, P/L, P/VP, ROE, liquidez, "
    "Status Invest, Investidor10, Google Finanças, home broker. "
    "TRXF11, BTLG11, GARE11, TIMS3, VULC3, CMIG4, Cemig, TIM, Vulcabras."
)

audio, saida = sys.argv[1], sys.argv[2]
modelo = sys.argv[3] if len(sys.argv) > 3 else "large-v3"

model = WhisperModel(modelo, device="cpu", compute_type="int8", cpu_threads=4)
segments, info = model.transcribe(
    audio,
    language="pt",
    beam_size=5,
    word_timestamps=True,
    vad_filter=True,
    vad_parameters={"min_silence_duration_ms": 300},
    initial_prompt=VOCABULARIO,
    condition_on_previous_text=True,
)

out = []
for seg in segments:
    out.append(
        {
            "start": round(seg.start, 3),
            "end": round(seg.end, 3),
            "text": seg.text.strip(),
            "words": [
                {"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3), "p": round(w.probability, 3)}
                for w in seg.words
            ],
        }
    )
    print(f"[{seg.start:7.2f}] {seg.text.strip()}", flush=True)

json.dump({"language": info.language, "segments": out}, open(saida, "w"), ensure_ascii=False, indent=1)
