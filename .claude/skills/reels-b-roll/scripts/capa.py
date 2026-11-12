# Capa do reels: imagem do tema em cima, a pessoa embaixo, título num bloco de cor no meio.
# Uso: python capa.py <perfil.json> <topo.jpg> <video> <segundo> "<título>" <saida.png> [recorte=w:h:x:y]
# Saídas: <saida>.png (1080x1920) e <saida>_grid.jpg (como aparece no grid do perfil, corte 3:4).
#
# PADRÃO FIXO (não muda por vídeo): o grid do perfil mostra o centro da capa em 3:4
# (1080x1440, y 240–1680). Costura e título ficam em y=960, o centro desse corte,
# pra o título aparecer sempre centralizado no feed.
# - Cor do bloco = perfil.capa.cor (a mesma em todas as capas da pessoa).
# - Recorte do rosto = perfil.camera.recorte, ou o 7º argumento se o vídeo for diferente do padrão dela.
# - Título: até 2 linhas, nunca termina linha em número ou palavra curta.
import sys, subprocess, os, json
from PIL import Image, ImageDraw, ImageFont, ImageChops
import numpy as np

W, H = 1080, 1920
MEIO = 960                                   # centro do corte 3:4 do grid
GRID = (0, 240, 1080, 1680)
FONT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "fonts", "Montserrat.ttf")

def font(size, w=700):
    f = ImageFont.truetype(FONT, size); f.set_variation_by_axes([w]); return f

def cover(img, w, h):
    s = max(w / img.width, h / img.height)
    im = img.resize((int(img.width * s + 0.5), int(img.height * s + 0.5)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))

ROSTO_Y = 1300          # centro do rosto na capa: olhos e boca caem dentro do grid (até y=1680)

def pessoa(video, t, crop, rosto):
    """Painel de baixo com o rosto posicionado pro grid, na mesma escala do vídeo."""
    import io
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", video, "-frames:v", "1",
                          "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    if not png: raise SystemExit(f"Não consegui extrair o frame {t}s de {video}.")
    fr = Image.open(io.BytesIO(png)).convert("RGB")
    cw, ch, cx, cy = [int(v) for v in crop.split(":")]
    if cx + cw > fr.width or cy + ch > fr.height:
        raise SystemExit(f"Recorte {crop} não cabe no vídeo {fr.width}x{fr.height}.")
    rx, ry = rosto or (cw / 2, ch / 2)
    s = W / cw
    big = fr.resize((int(fr.width * s), int(fr.height * s)), Image.LANCZOS)
    ph = H - MEIO
    left = min(max((cx + rx) * s - W / 2, 0), big.width - W)
    top = min(max((cy + ry) * s - (ROSTO_Y - MEIO), 0), big.height - ph)
    return big.crop((int(left), int(top), int(left) + W, int(top) + ph))

def vignette(w, h, k=0.28):
    y, x = np.mgrid[0:h, 0:w]
    r = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h * 0.45) / (h / 2)) ** 2)
    return Image.fromarray((np.clip(1 - k * np.clip(r - 0.55, 0, None) ** 1.4, 0, 1) * 255).astype("uint8")).convert("RGB")

def wrap(text, f, maxw, d, maxl=3):
    """Linhas equilibradas; nunca termina linha em número ou palavra curta; não corta dentro de parêntese.
    Devolve (pontuação, linhas) ou None se não couber."""
    import itertools
    words = text.split()
    if d.textlength(text, font=f) <= maxw * 0.62: return (0, [text])
    best = None
    for nl in range(1, maxl + 1):
        for cuts in itertools.combinations(range(1, len(words)), nl - 1):
            idx = (0,) + cuts + (len(words),)
            ls = [" ".join(words[a:b]) for a, b in zip(idx, idx[1:])]
            ws = [d.textlength(l, font=f) for l in ls]
            if max(ws) > maxw: continue
            pen = 200 * max(0, nl - 2)
            for c in cuts:
                if words[c - 1][0].isdigit() or len(words[c - 1]) <= 2: pen += 400
                if words[c].startswith("("): pen -= 200
                elif "(" in " ".join(words[:c]) and ")" not in " ".join(words[:c]): pen += 300
            score = max(ws) - min(ws) + pen
            if best is None or score < best[0]: best = (score, ls)
    return best

def title_block(canvas, text, color):
    d = ImageDraw.Draw(canvas); opts = []
    for s in (68, 62, 56, 50, 44):                       # fonte maior e menos linhas ganham
        b = wrap(text, font(s, 700), 900, d)
        if b: opts.append((b[0] + (68 - s) * 8, s, b[1]))
    _, size, lines = min(opts) if opts else (0, 44, [text])
    f = font(size, 700)
    lh = int(size * 1.22); tw = max(d.textlength(l, font=f) for l in lines); padx, pady = 44, 30
    bw, bh = tw + 2 * padx, lh * len(lines) + 2 * pady - (lh - size) + 6
    x0, y0 = (W - bw) / 2, MEIO - bh / 2
    d.rectangle((x0, y0, x0 + bw, y0 + bh), fill=color)
    for i, l in enumerate(lines):
        d.text((W / 2, y0 + pady + i * lh + size / 2), l, font=f, fill="white", anchor="mm")

def make(perfil, top_path, video, t, text, out, crop=None):
    crop = crop or perfil.get("camera", {}).get("recorte")
    if not crop: raise SystemExit("Sem recorte: medir o rosto e salvar em perfil.camera.recorte (ou passar como argumento).")
    color = perfil.get("capa", {}).get("cor")
    if not color: raise SystemExit("Perfil sem capa.cor: definir a cor da marca antes da primeira capa.")
    top = cover(Image.open(top_path).convert("RGB"), W, MEIO)
    rosto = None if crop != perfil.get("camera", {}).get("recorte") else perfil.get("camera", {}).get("rosto")
    bot = ImageChops.multiply(pessoa(video, t, crop, rosto), vignette(W, H - MEIO))
    im = Image.new("RGB", (W, H)); im.paste(top, (0, 0)); im.paste(bot, (0, MEIO))
    title_block(im, text, color)
    im.save(out)
    im.crop(GRID).resize((540, 720)).save(os.path.splitext(out)[0] + "_grid.jpg", quality=90)
    return im

if __name__ == "__main__":
    a = sys.argv
    perfil = json.load(open(a[1], encoding="utf-8"))
    make(perfil, a[2], a[3], float(a[4]), a[5], a[6], a[7] if len(a) > 7 else None)
    print("OK", a[6], "+ prévia do grid")
