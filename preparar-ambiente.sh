#!/bin/bash
# Deixa uma sessão nova pronta para as skills reels-b-roll e carrossel-tweet (Etapa 0).
# Uso: bash preparar-ambiente.sh
set -e
PY=$(command -v python3.12 || command -v python3)

echo "1/4 Pacotes Python (faster-whisper, pillow, numpy) em $PY, sem ambiente virtual"
$PY -m pip install --user --break-system-packages -q faster-whisper pillow numpy

echo "2/4 ffmpeg com vidstab"
command -v ffmpeg >/dev/null || { apt-get update -qq && apt-get install -y -qq ffmpeg; }
ffmpeg -hide_banner -filters 2>/dev/null | grep -q vidstabdetect || { echo "ERRO: este ffmpeg não tem o filtro vidstab"; exit 1; }

echo "3/4 Chrome para os prints e slides"
HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/*/chrome-headless-shell 2>/dev/null | tail -1)
if [ -x "$HS" ]; then
  # O Chromium completo trava em modo headless no container da nuvem; usa o chrome-headless-shell.
  cat > /usr/local/bin/google-chrome <<'WRAP'
#!/bin/bash
HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/*/chrome-headless-shell 2>/dev/null | tail -1)
[ -x "$HS" ] || exec /usr/bin/google-chrome "$@"
args=(); for a in "$@"; do case "$a" in --headless|--headless=*) ;; *) args+=("$a");; esac; done
exec "$HS" --no-sandbox "${args[@]}"
WRAP
  chmod +x /usr/local/bin/google-chrome
fi

echo "4/4 Pastas da casa"
mkdir -p ~/reels-b-roll/perfis ~/carrossel-tweet/perfis

$PY -c "import faster_whisper, PIL, numpy; print('OK: faster-whisper', faster_whisper.__version__, '| pillow', PIL.__version__, '| numpy', numpy.__version__)"
echo "Pronto. Rode os scripts das skills com: $PY"
