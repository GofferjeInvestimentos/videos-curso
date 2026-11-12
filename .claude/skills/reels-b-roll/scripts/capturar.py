# Print de página (fonte) com Chrome headless num perfil TEMPORÁRIO (nunca toca no Chrome logado).
# Uso: python capturar.py <url> <saida.png> [largura=540] [altura=1100]
# - Sai em escala 2x (largura 540 -> imagem de 1080).
# - Teto de tempo por página: site cheio de anúncio segura o carregamento pra sempre.
# - Página em branco/preta = site bloqueia navegador automático. Usar outra fonte ou cartão com crédito.
# - Botão flutuante (WhatsApp, chat) cobrindo o texto: capturar com altura maior, ele desce.
import sys, os, subprocess, tempfile, shutil

url, out = sys.argv[1], os.path.abspath(sys.argv[2])
w = sys.argv[3] if len(sys.argv) > 3 else "540"
h = sys.argv[4] if len(sys.argv) > 4 else "1100"
CANDIDATOS = [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
              r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium"]
chrome = next((c for c in CANDIDATOS if os.path.exists(c) or shutil.which(c)), None)
if not chrome: sys.exit("Chrome/Edge não encontrado")
perfil = tempfile.mkdtemp(prefix="cap-")
try:
    subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={perfil}",
                    "--hide-scrollbars", "--force-device-scale-factor=2", f"--window-size={w},{h}",
                    "--timeout=9000", f"--screenshot={out}", url],
                   capture_output=True, timeout=40)
except subprocess.TimeoutExpired:
    pass
finally:
    shutil.rmtree(perfil, ignore_errors=True)
if os.path.exists(out):
    from PIL import Image
    im = Image.open(out).convert("RGB")
    cores = len(im.getcolors(10 ** 7) or [])
    print(f"OK {out} {im.size}" + ("  ⚠ poucas cores: provavelmente página bloqueada/em branco" if cores < 50 else ""))
else:
    print("FALHOU", url)
