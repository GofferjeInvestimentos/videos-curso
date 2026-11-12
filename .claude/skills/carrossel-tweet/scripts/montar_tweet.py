# Carrossel em formato de tweet (1080x1350): cabeçalho de perfil + texto + imagem da fonte, slide a slide.
# Uso: python montar_tweet.py <carrossel.json>          renderiza todos os slides + folha.jpg
#      python montar_tweet.py <carrossel.json> 3        só o slide 3 (pra ajustar)
# Formato: references/carrossel.md
import sys, os, json, re, html, math, base64, io, subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageChops

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(SKILL, "assets", "fonts", "Inter.ttf").replace("\\", "/")
PROJ = os.path.abspath(sys.argv[1]); PD = os.path.dirname(PROJ)
C = json.load(open(PROJ, encoding="utf-8"))
def path(p, base=PD): return p if os.path.isabs(p) else os.path.join(base, p)

# ---------- perfil (memória da pessoa) ----------
PF_PATH = path(C["perfil"]); PF = json.load(open(PF_PATH, encoding="utf-8")); PFD = os.path.dirname(PF_PATH)
falta = [k for k in ("nome", "instagram", "foto", "fundo") if not PF.get(k)]
if falta: raise SystemExit(f"Perfil incompleto, falta: {', '.join(falta)}. Perguntar à pessoa e salvar no perfil.")
NOME = PF.get("nome_exibicao") or PF["nome"]
HANDLE = PF["instagram"] if PF["instagram"].startswith("@") else "@" + PF["instagram"]
FUNDO = C.get("fundo") or PF["fundo"]
if FUNDO not in ("preto", "branco"): raise SystemExit('fundo tem que ser "preto" ou "branco".')
VERIF = bool(PF.get("verificado"))
TEMA = {"preto":  dict(bg="#000000", nome="#FFFFFF", handle="#71767B", texto="#E7E9EA", borda="#2F3336"),
        "branco": dict(bg="#FFFFFF", nome="#0F1419", handle="#536471", texto="#0F1419", borda="#CFD9DE")}[FUNDO]

SLIDES = C["slides"]
if not SLIDES or not SLIDES[0].get("imagem"):
    raise SystemExit("O slide 1 SEMPRE tem a imagem da fonte que embasa o conteúdo.")
for i, s in enumerate(SLIDES, 1):                   # texto demais vira slide denso (a fonte encolhe pra caber)
    n = len(re.sub(r"\*\*", "", s["texto"]).split()); lim = 65 if s.get("imagem") else 95   # calibrado no carrossel do Ramiro
    if n > lim: print(f"⚠ slide {i}: {n} palavras (limite ~{lim} {'com' if s.get('imagem') else 'sem'} imagem) — dividir ou encurtar.")
com_img = sum(1 for s in SLIDES if s.get("imagem"))
if com_img / len(SLIDES) < 0.6:
    print(f"⚠ só {com_img} de {len(SLIDES)} slides têm imagem de fonte — o ideal é a maioria ter.")

# ---------- imagens (recorte + marca-texto) em data URI ----------
MARCA = {"amarelo": (255, 214, 90), "vermelho": (255, 170, 170), "verde": (190, 240, 170)}
def data_uri(im, fmt="PNG"):
    b = io.BytesIO(); im.save(b, fmt, **({"quality": 92} if fmt == "JPEG" else {}))
    return f"data:image/{fmt.lower()};base64," + base64.b64encode(b.getvalue()).decode()

def prep(s):
    im = Image.open(path(s["imagem"])).convert("RGB")
    if s.get("recorte"): im = im.crop(tuple(s["recorte"]))
    if s.get("marcas"):
        ov = Image.new("RGB", im.size, (255, 255, 255)); d = ImageDraw.Draw(ov)
        for m in s["marcas"]:
            d.rectangle(tuple(m["caixa"]), fill=MARCA.get(m.get("cor", "amarelo"), MARCA["amarelo"]))
        im = ImageChops.multiply(im, ov)
    if im.width > 1800: im = im.resize((1800, int(im.height * 1800 / im.width)), Image.LANCZOS)
    return data_uri(im, "JPEG" if im.width * im.height > 900_000 else "PNG")

def avatar():
    im = Image.open(path(PF["foto"], PFD)).convert("RGB")
    r = PF.get("foto_recorte")                     # [x0,y0,x1,y1] opcional, senão o quadrado central
    if r: im = im.crop(tuple(r))
    else:
        s = min(im.size); im = im.crop(((im.width - s) // 2, (im.height - s) // 2, (im.width + s) // 2, (im.height + s) // 2))
    return data_uri(im.resize((256, 256), Image.LANCZOS), "JPEG")

def selo():
    pts = []
    for i in range(96):
        a = 2 * math.pi * i / 96; r = 11.2 + 0.9 * math.cos(8 * a)
        pts.append(f"{12 + r * math.cos(a):.2f},{12 + r * math.sin(a):.2f}")
    return (f'<svg viewBox="0 0 24 24"><polygon points="{" ".join(pts)}" fill="#1D9BF0"/>'
            '<path d="M7.2 12.3l3.1 3.1 6.4-6.6" fill="none" stroke="#fff" stroke-width="2.4" '
            'stroke-linecap="round" stroke-linejoin="round"/></svg>')

def fmt(t):
    t = html.escape(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return "".join(f"<p>{p.strip().replace(chr(10), '<br>')}</p>" for p in re.split(r"\n\s*\n", t.strip()))

# ---------- HTML ----------
def build():
    av = avatar(); sl = selo() if VERIF else ""
    secs = []
    for s in SLIDES:
        img = ""
        if s.get("imagem"):
            leg = f'<div class="leg">{html.escape(s["legenda"])}</div>' if s.get("legenda") else ""
            img = f'<div class="img"><img src="{prep(s)}">{leg}</div>'
        secs.append(f'<section class="s"><div class="box"><div class="who"><img class="av" src="{av}">'
                    f'<div><div class="nome">{html.escape(NOME)}{sl}</div><div class="handle">{html.escape(HANDLE)}</div></div></div>'
                    f'<div class="txt">{fmt(s["texto"])}</div>{img}</div></section>')
    T = TEMA
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Inter;src:url('file:///{FONT}');font-weight:100 900}}
html,body{{margin:0;width:1080px;height:1350px;overflow:hidden;background:{T['bg']}}}
.s{{box-sizing:border-box;width:1080px;height:1350px;padding:64px 64px;display:none;flex-direction:column;justify-content:center;font-family:Inter,Arial,sans-serif}}
.s.on{{display:flex}}
.who{{display:flex;align-items:center;gap:20px;margin-bottom:34px}}
.av{{width:128px;height:128px;border-radius:50%;object-fit:cover;flex:0 0 128px}}
.nome{{font-size:44px;font-weight:700;color:{T['nome']};display:flex;align-items:center;gap:10px;line-height:1.15}}
.nome svg{{width:40px;height:40px;flex:0 0 40px}}
.handle{{font-size:42px;color:{T['handle']};line-height:1.25}}
.txt{{font-size:52px;line-height:1.15;color:{T['texto']};font-weight:400}}
.txt p{{margin:0 0 1.15em}} .txt p:last-child{{margin-bottom:0}}
.txt b{{font-weight:700;color:{T['nome']}}}
.img{{margin-top:36px}}
.img img{{display:block;max-width:100%;border-radius:14px;border:1px solid {T['borda']}}}
.leg{{font-size:26px;color:{T['handle']};margin-top:12px}}
</style></head><body>{''.join(secs)}
<script>
const n=+(location.hash.slice(1)||1), s=document.querySelectorAll('section.s')[n-1]; s.classList.add('on');
function fit(){{
  const box=s.querySelector('.box'), img=s.querySelector('.img img'), txt=s.querySelector('.txt'), lim=1350-128;
  if(img && box.offsetHeight>lim) img.style.maxHeight=Math.max(260, img.offsetHeight-(box.offsetHeight-lim))+'px';
  let f=52; while(box.offsetHeight>lim && f>40){{ f-=2; txt.style.fontSize=f+'px'; }}
  if(img && box.offsetHeight>lim) img.style.maxHeight=Math.max(200, img.offsetHeight-(box.offsetHeight-lim))+'px';
}}
const ff=new FontFace('Inter',"url('file:///{FONT}')",{{weight:'100 900'}});
ff.load().then(f=>{{document.fonts.add(f)}}).catch(()=>0).then(()=>Promise.all([...s.querySelectorAll('img')].map(i=>i.decode().catch(()=>0)))).then(fit);
</script></body></html>"""

CHROMES = [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
           r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium"]

def render(only=None):
    chrome = next((c for c in CHROMES if os.path.exists(c) or shutil.which(c)), None)
    if not chrome: raise SystemExit("Chrome/Edge não encontrado.")
    out = path(C.get("saida", "slides")); os.makedirs(out, exist_ok=True)
    page = os.path.join(out, "_carrossel.html"); open(page, "w", encoding="utf-8").write(build())
    url = "file:///" + os.path.abspath(page).replace("\\", "/")
    feitos = []
    for i in range(1, len(SLIDES) + 1):
        if only and i != only: continue
        png = os.path.join(out, f"{i:02d}.png"); perfil = tempfile.mkdtemp(prefix="tw-")
        try:
            subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={perfil}",
                            "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1080,1350",
                            "--allow-file-access-from-files", "--virtual-time-budget=5000",
                            f"--screenshot={png}", f"{url}#{i}"], capture_output=True, timeout=60)
        finally:
            shutil.rmtree(perfil, ignore_errors=True)
        feitos.append(png)
        # conteúdo encostando na borda = texto longo demais pro slide
        im = Image.open(png).convert("L"); bgv = im.getpixel((5, 5))
        diff = ImageChops.difference(im, Image.new("L", im.size, bgv)).point(lambda v: 255 if v > 40 else 0)
        bb = diff.getbbox()
        aviso = "  ⚠ encostou na borda: encurtar o texto deste slide" if bb and (bb[1] < 30 or bb[3] > im.height - 30) else ""
        print("OK", png + aviso)
    if not only:
        ims = [Image.open(p).convert("RGB").resize((270, 338)) for p in feitos]
        cols = 5; rows = (len(ims) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * 280, rows * 348), (80, 80, 80))
        for k, im in enumerate(ims): sheet.paste(im, ((k % cols) * 280 + 5, (k // cols) * 348 + 5))
        sheet.save(os.path.join(out, "folha.jpg"), quality=90); print("folha:", os.path.join(out, "folha.jpg"))

if __name__ == "__main__":
    render(int(sys.argv[2]) if len(sys.argv) > 2 else None)
