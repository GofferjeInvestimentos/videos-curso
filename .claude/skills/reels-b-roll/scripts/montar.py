# Motor do reels-b-roll: roteiro de inserts (projeto.json) -> reels em tela dividida.
#   topo: inserts (prints de fonte, fotos, motion) · costura: legenda · base: a pessoa falando
# Uso: python montar.py <projeto.json>            renderiza o vídeo
#      python montar.py <projeto.json> preview    folha de contato (1 frame por insert) em preview.jpg
# Formato do roteiro: references/roteiro.md
import sys, os, json, re, subprocess, functools, unicodedata
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageFilter

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(SKILL, "assets", "fonts", "Montserrat.ttf")
PROJ = os.path.abspath(sys.argv[1]); PD = os.path.dirname(PROJ)
P = json.load(open(PROJ, encoding="utf-8"))
def path(p): return p if os.path.isabs(p) else os.path.join(PD, p)
RD = PD                                   # imagens do roteiro são relativas ao arquivo do roteiro
if isinstance(P["inserts"], str):
    RD = os.path.dirname(path(P["inserts"])); P["inserts"] = json.load(open(path(P["inserts"]), encoding="utf-8"))
def ipath(p): return p if os.path.isabs(p) else os.path.join(RD, p)

# perfil da pessoa (memória entre vídeos): dá os padrões; o projeto sobrescreve
PERFIL = json.load(open(path(P["perfil"]), encoding="utf-8")) if P.get("perfil") else {}
def _merge(base, over):
    out = dict(base)
    for k, v in over.items():
        out[k] = _merge(out[k], v) if isinstance(v, dict) and isinstance(out.get(k), dict) else v
    return out
_cam, _leg = PERFIL.get("camera", {}), PERFIL.get("legenda", {})
P = _merge({"cores": {"acento": PERFIL.get("inserts", {}).get("acento", "#FFC928")},
            "legenda": {"caixa": _leg.get("caixa", "#000000"), "correcoes": _leg.get("correcoes", {})},
            "layout": {k: _cam[k] for k in ("recorte", "rosto") if _cam.get(k)}}, P)
if "recorte" not in P["layout"]:
    raise SystemExit("Falta layout.recorte (no projeto ou em perfil.camera): medir o rosto num frame do vídeo.")

LAY = P.get("layout", {})
W, H, FPS = 1080, 1920, 30
TH = LAY.get("topo", 960); BH = H - TH   # 50/50: legenda no centro do quadro, como a capa no grid

def hexrgb(h): h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
BG_TOP, BG_BOT = (16, 23, 40), (8, 12, 22)
PANEL = (24, 33, 56); WHITE = (255, 255, 255); INK = (16, 20, 28); MUTED = (160, 172, 196)
ACC = hexrgb(P.get("cores", {}).get("acento", "#FFC928")); RED = (232, 72, 77)
CORES = {"acento": ACC, "vermelho": RED, "branco": WHITE, "escuro": INK, "suave": MUTED, "painel": PANEL,
         "cinza": (90, 100, 120)}
def cor(x, default=WHITE):
    if x is None: return default
    if isinstance(x, (list, tuple)): return tuple(x)
    return CORES[x] if x in CORES else hexrgb(x)
def contraste(c): return INK if sum(c) > 450 else WHITE

# ================= palavras e tempo =================
def norm(s):
    s = unicodedata.normalize("NFKD", s.lower())
    return re.sub(r"[^\w]", "", "".join(ch for ch in s if not unicodedata.combining(ch)))

CORR = P.get("legenda", {}).get("correcoes", {})
WORDS = []
for seg in json.load(open(path(P["transcricao"]), encoding="utf-8")):
    for w in seg["words"]:
        txt = w["w"].strip()
        if not txt: continue
        if txt.startswith("-") and WORDS:
            WORDS[-1]["w"] += txt; WORDS[-1]["e"] = w["e"]; continue
        WORDS.append({"w": txt, "s": w["s"], "e": w["e"]})
for w in WORDS:
    key = w["w"].strip(".,;:!?")
    w["txt"] = w["w"].replace(key, CORR[key]) if key in CORR else w["w"]
    w["n"], w["nc"] = norm(w["w"]), norm(w["txt"])

EDL = json.load(open(path(P["edl"]))) if P.get("edl") else None
if EDL:
    SPEED, SEGS = EDL["speed"], EDL["segs"]
    def raw2out(t):
        acc = 0.0
        for s, e in SEGS:
            if t < s: return acc / SPEED
            if t <= e: return (acc + t - s) / SPEED
            acc += e - s
        return acc / SPEED
    for w in WORDS: w["s"], w["e"] = raw2out(w["s"]), raw2out(w["e"])
    SHOTS, acc = [], 0.0
    for s, e in SEGS: SHOTS.append(acc / SPEED); acc += e - s
else:
    SHOTS = [0.0]

def find(frase, depois=0.0):
    toks = [norm(t) for t in frase.split() if norm(t)]
    for i in range(len(WORDS) - len(toks) + 1):
        if WORDS[i]["s"] < depois - 0.05: continue
        if all(toks[k] in (WORDS[i + k]["n"], WORDS[i + k]["nc"]) for k in range(len(toks))):
            return WORDS[i]["s"]
    raise SystemExit(f'ÂNCORA NÃO ENCONTRADA depois de {depois:.2f}s: "{frase}" (conferir a grafia na transcrição)')

def resolve(x, base):
    if x is None: return None
    if isinstance(x, (int, float)): return base + x
    if isinstance(x, str): return find(x, base)
    return resolve(x["frase"], base) + x.get("ajuste", 0.0)

def resolve_tree(o, base):
    if isinstance(o, dict):
        return {k: (resolve(v, base) if (k == "em" or k.endswith("_em")) else resolve_tree(v, base)) for k, v in o.items()}
    if isinstance(o, list): return [resolve_tree(v, base) for v in o]
    return o

INS, prev = [], 0.0
for i, ins in enumerate(P["inserts"]):
    de = ins.get("de", 0.0)
    t0 = de if isinstance(de, (int, float)) else resolve(de, prev)
    r = resolve_tree({k: v for k, v in ins.items() if k != "de"}, t0)
    r["_t0"] = t0; INS.append(r); prev = t0
for i, r in enumerate(INS): r["_t1"] = INS[i + 1]["_t0"] if i + 1 < len(INS) else 1e9

# ================= utilitários de desenho =================
@functools.lru_cache(None)
def F(size, w=800):
    f = ImageFont.truetype(FONT, size); f.set_variation_by_axes([w]); return f
def cl(x): return max(0.0, min(1.0, x))
def eo(x): x = cl(x); return 1 - (1 - x) ** 3
def pop(x):
    x = cl(x); c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
def pr(t, t0, d=0.35): return cl((t - t0) / d)

def comp(canvas, im, x, y):
    x, y = int(round(x)), int(round(y))
    sx, sy = max(0, -x), max(0, -y)
    ex, ey = min(im.width, canvas.width - x), min(im.height, canvas.height - y)
    if ex <= sx or ey <= sy: return
    if sx or sy or ex < im.width or ey < im.height: im = im.crop((sx, sy, ex, ey))
    canvas.alpha_composite(im, (x + sx, y + sy))

def place(canvas, im, cx, cy, s=1.0, a=1.0):
    if s <= 0.01 or a <= 0.01: return
    if abs(s - 1) > 1e-3:
        im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.BILINEAR)
    if a < 0.999:
        im = im.copy(); im.putalpha(im.getchannel("A").point(lambda v: int(v * a)))
    comp(canvas, im, cx - im.width / 2, cy - im.height / 2)

def enter(canvas, im, cx, cy, t, t0, d=0.35, kind="pop", extra=1.0):
    if t0 is None or t < t0: return
    k = pr(t, t0, d)
    if kind == "pop": place(canvas, im, cx, cy, (0.6 + 0.4 * pop(k)) * extra, min(1, k * 2.5))
    else: place(canvas, im, cx, cy + 50 * (1 - eo(k)), extra, eo(k))

@functools.lru_cache(None)
def T(s, size, w=800, fill=WHITE, stroke=0, sfill=(0, 0, 0), spacing=10):
    f = F(size, w)
    d0 = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    bb = [int(round(v)) for v in d0.multiline_textbbox((0, 0), s, font=f, stroke_width=stroke, spacing=spacing, align="center")]
    im = Image.new("RGBA", (bb[2] - bb[0] + 6, bb[3] - bb[1] + 6), (0, 0, 0, 0))
    ImageDraw.Draw(im).multiline_text((3 - bb[0], 3 - bb[1]), s, font=f, fill=fill, stroke_width=stroke,
                                      stroke_fill=sfill, spacing=spacing, align="center")
    return im

@functools.lru_cache(None)
def PILL(s, size=26, bg=ACC, fg=INK, padx=24, pady=13):
    t = T(s, size, 800, fg)
    im = Image.new("RGBA", (t.width + 2 * padx, t.height + 2 * pady), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((0, 0, im.width - 1, im.height - 1), im.height // 2, fill=bg)
    im.alpha_composite(t, (padx, pady)); return im

def SOURCE(s): return PILL(s, 22, bg=(34, 46, 76), fg=(214, 222, 238), padx=20, pady=10)

def rmask(size, r):
    m = Image.new("L", size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), r, fill=255)
    return m

def card(img, width, r=26, margin=40):
    img = img.convert("RGB"); h = int(img.height * width / img.width)
    c = img.resize((width, h), Image.LANCZOS).convert("RGBA"); c.putalpha(rmask(c.size, r))
    out = Image.new("RGBA", (width + 2 * margin, h + 2 * margin), (0, 0, 0, 0))
    sh = Image.new("RGBA", out.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((margin, margin + 16, margin + width, margin + h + 16), r, fill=(0, 0, 0, 170))
    out.alpha_composite(sh.filter(ImageFilter.GaussianBlur(20))); out.alpha_composite(c, (margin, margin))
    return out

def marker(img, marks):
    ov = Image.new("RGB", img.size, WHITE); d = ImageDraw.Draw(ov)
    for (x0, y0, x1, y1), p in marks:
        if p > 0: d.rectangle((x0, y0, x0 + (x1 - x0) * p, y1), fill=(255, 214, 90))
    return ImageChops.multiply(img.convert("RGB"), ov)

def grad(top, bot, alpha=None):
    im = Image.new("RGBA", (W, TH)); d = ImageDraw.Draw(im)
    for y in range(TH):
        k = y / TH
        a = 255 if alpha is None else int(alpha[0] + (alpha[1] - alpha[0]) * k)
        d.line([(0, y), (W, y)], fill=tuple(int(top[i] * (1 - k) + bot[i] * k) for i in range(3)) + (a,))
    return im
BG = grad(BG_TOP, BG_BOT)
SHADE = grad((6, 10, 20), (6, 10, 20), (90, 210))

@functools.lru_cache(None)
def IMG(p): return Image.open(ipath(p)).convert("RGB")

# ---- b-roll em vídeo: lido em sequência no render, frame avulso no preview ----
SEQ = False
VF_CLIP = f"scale={W}:{TH}:force_original_aspect_ratio=increase,crop={W}:{TH},fps={FPS}"
class Clip:
    def __init__(self, arq, inicio):
        self.p = subprocess.Popen(["ffmpeg", "-v", "error", "-stream_loop", "-1", "-ss", str(inicio), "-i", ipath(arq),
                                   "-vf", VF_CLIP, "-an", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
        self.last = None
    def read(self):
        buf = self.p.stdout.read(W * TH * 3)
        if len(buf) == W * TH * 3: self.last = Image.frombytes("RGB", (W, TH), buf)
        return self.last
    def close(self): self.p.kill()
CLIPS = {}
@functools.lru_cache(None)
def _clip_dur(arq):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", ipath(arq)],
                                capture_output=True, text=True).stdout.strip() or 1)
def video_frame(ii, v, t, t0):
    if SEQ:
        if ii not in CLIPS:
            for k in list(CLIPS): CLIPS.pop(k).close()
            CLIPS[ii] = Clip(v["arquivo"], v.get("inicio", 0))
        return CLIPS[ii].read()
    off = (v.get("inicio", 0) + (t - t0)) % max(0.1, _clip_dur(v["arquivo"]) - 0.05)   # dá a volta como o render
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(off), "-i", ipath(v["arquivo"]),
                          "-frames:v", "1", "-vf", VF_CLIP, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return Image.frombytes("RGB", (W, TH), raw) if len(raw) == W * TH * 3 else None

def kenburns(photo, t, t0, t1, z0, z1, pan):
    k = cl((t - t0) / max(0.1, t1 - t0)); z = z0 + (z1 - z0) * k; ar = W / TH
    bw, bh = (photo.height * ar, photo.height) if photo.width / photo.height > ar else (photo.width, photo.width / ar)
    cw, ch = bw / z, bh / z
    cx = photo.width / 2 + pan[0] * k * photo.width; cy = photo.height / 2 + pan[1] * k * photo.height
    return photo.resize((W, TH), Image.BILINEAR, box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2)).convert("RGBA")

@functools.lru_cache(None)
def CAL(day, mon, w, head, headfg):
    h = int(w * 1.08); hh = int(h * 0.26)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 30, fill=WHITE)
    d.rounded_rectangle((0, 0, w - 1, hh + 30), 30, fill=head); d.rectangle((0, hh, w - 1, hh + 30), fill=WHITE)
    d.text((w / 2, hh / 2 + 4), mon, font=F(int(w * 0.16), 800), fill=headfg, anchor="mm")
    d.text((w / 2, hh + (h - hh) / 2), day, font=F(int(w * 0.46), 900), fill=INK, anchor="mm")
    return card(im, w, r=30, margin=30)

# ================= cartões de print (fontes) =================
@functools.lru_cache(None)
def CARD(ii, ci, q):
    c = INS[ii]["cards"][ci]
    im = IMG(c["imagem"])
    if c.get("recorte"): im = im.crop(tuple(c["recorte"]))
    marks = [(tuple(m["caixa"]), qq / 10) for m, qq in zip(c.get("marcas", []), q)]
    return card(marker(im, marks), c.get("largura", 940))

# ================= elementos =================
def el_pill(c, t, e, t1):
    bg = cor(e.get("cor", "acento")); fg = cor(e.get("cor_texto"), contraste(bg))
    enter(c, PILL(e["texto"], e.get("tam", 30), bg, fg), e.get("x", 540), e["y"], t, e.get("em"), 0.35, e.get("anim", "pop"))

def el_texto(c, t, e, t1):
    em = e.get("em")
    if em is None or t < em: return
    im = T(e["texto"], e.get("tam", 40), e.get("peso", 800), cor(e.get("cor", "branco")),
           e.get("contorno", 0), (0, 0, 0), e.get("espaco", 10))
    wob = 1 + 0.06 * abs(((t - em - 0.4) * 2.2) % 2 - 1) if (e.get("pulsar") and t > em + 0.4) else 1
    enter(c, im, e.get("x", 540), e["y"], t, em, 0.35, e.get("anim", "pop"), wob)

def el_calendario(c, t, e, t1):
    em = e.get("em")
    if em is None or t < em: return
    w = e.get("largura", 320); head = cor(e.get("cor", "vermelho")); x, y = e.get("x", 540), e["y"]
    im = CAL(str(e["dia"]), str(e["mes"]), w, head, cor(e.get("cor_texto"), contraste(head)))
    k = pr(t, em, 0.4)
    bump = 1 + 0.12 * (1 - eo(pr(t, e["pulsar_em"], 0.4))) if e.get("pulsar_em") and t >= e["pulsar_em"] else 1
    a = 1 - 0.55 * eo(pr(t, e["riscar_em"] + 0.4, 0.4)) if e.get("riscar_em") else 1
    place(c, im, x, y, (0.6 + 0.4 * pop(k)) * bump, min(1, k * 2.5) * a)
    if e.get("riscar_em") and t >= e["riscar_em"]:
        L = eo(pr(t, e["riscar_em"], 0.3)); ax, ay, bx, by = x - 0.47 * w, y - 0.33 * w, x + 0.47 * w, y + 0.40 * w
        ImageDraw.Draw(c, "RGBA").line([(ax, ay), (ax + (bx - ax) * L, ay + (by - ay) * L)], fill=RED, width=16)
    if e.get("legenda"):
        enter(c, T(e["legenda"], 30, 700, MUTED), x, y + w * 0.54 + 50, t, e.get("legenda_em", em + 0.3), 0.3, "up")

def el_seta(c, t, e, t1):
    em = e.get("em")
    if em is None or t < em: return
    k = eo(pr(t, em, 0.3)); (x0, y0), (x1, y1) = e["de"], e["ate"]; col = cor(e.get("cor", "acento"))
    xe, ye = x0 + (x1 - x0) * k, y0 + (y1 - y0) * k
    d = ImageDraw.Draw(c, "RGBA"); d.line([(x0, y0), (xe, ye)], fill=col, width=12)
    if k > 0.9:
        ang = np.arctan2(y1 - y0, x1 - x0); ca, sa = np.cos(ang), np.sin(ang)
        tip = (xe + 28 * ca, ye + 28 * sa)
        d.polygon([tip, (xe - 4 * ca + 26 * sa, ye - 4 * sa - 26 * ca), (xe - 4 * ca - 26 * sa, ye - 4 * sa + 26 * ca)], fill=col)

def el_numero(c, t, e, t1):
    em = e.get("em")
    if em is None or t < em: return
    n = int(e["valor"] * eo(cl((t - em) / e.get("duracao", 1.5))))
    s = f"{n:,}".replace(",", ".") + e.get("sufixo", "")
    place(c, T(e.get("prefixo", "") + s, e.get("tam", 150), 900, cor(e.get("cor", "branco"))), e.get("x", 540), e["y"], 1.0, min(1, pr(t, em, 0.2)))

def el_chips(c, t, e, t1):
    d = ImageDraw.Draw(c, "RGBA")
    bx = e.get("caixa")
    if bx and bx.get("em") is not None and t >= bx["em"]:
        a = int(255 * pr(t, bx["em"], 0.3)); x0, y0, x1, y1 = bx["ret"]
        d.rounded_rectangle((x0, y0, x1, y1), 34, fill=PANEL + (a,), outline=(120, 136, 170, a), width=4)
        d.text(((x0 + x1) / 2, y0 + 55), bx["titulo"], font=F(36, 800), fill=WHITE + (a,), anchor="mm")
        if bx.get("brilho_em") and t >= bx["brilho_em"]:
            g = 1 - eo(pr(t, bx["brilho_em"], 0.5))
            d.rounded_rectangle((x0, y0, x1, y1), 34, outline=ACC + (int(255 * g),), width=6)
    al = e.get("alvo")
    if al and al.get("em") is not None and t >= al["em"]:
        a = int(255 * pr(t, al["em"], 0.3)); x0, y0, x1, y1 = al["ret"]; col = ACC + (a,)
        for i in range(x0, x1, 28):
            d.line([(i, y0), (min(i + 14, x1), y0)], fill=col, width=4); d.line([(i, y1), (min(i + 14, x1), y1)], fill=col, width=4)
        for j in range(y0, y1, 28):
            d.line([(x0, j), (x0, min(j + 14, y1))], fill=col, width=4); d.line([(x1, j), (x1, min(j + 14, y1))], fill=col, width=4)
        d.text(((x0 + x1) / 2, y0 - 40), al["titulo"], font=F(38, 900), fill=col, anchor="mm")
    base = e.get("em", 0); passo = e.get("passo", 0.12)
    for i, it in enumerate(e["itens"]):
        t0 = base + i * passo
        if t < t0: continue
        x, y = it["x"], it["y"]; s = 1.0
        if it.get("pulsar_em") and t >= it["pulsar_em"]: s = 1 + 0.18 * (1 - eo(pr(t, it["pulsar_em"], 0.5)))
        if it.get("mover_em") is not None:
            k = eo(pr(t, it["mover_em"], 0.55)); tx, ty = it["para"]; x, y = x + (tx - x) * k, y + (ty - y) * k
        hot = it.get("quente") and (it.get("quente_em") is None or t >= it["quente_em"])
        chip = PILL(it["txt"], 38, ACC if hot else (58, 72, 104), INK if hot else WHITE, 34, 16)
        k0 = pr(t, t0, 0.3); place(c, chip, x, y, (0.6 + 0.4 * pop(k0)) * s, min(1, k0 * 2.5))

def el_linha_tempo(c, t, e, t1):
    d = ImageDraw.Draw(c, "RGBA"); y = e.get("y", 440)
    if e.get("em") is not None and t >= e["em"]:
        L = eo(pr(t, e["em"], 0.8)); x0, x1 = e.get("x0", 110), e.get("x1", 970)
        d.line([(x0, y), (x0 + (x1 - x0) * L, y)], fill=(90, 104, 136), width=8)
    b = e.get("barra")
    if b and t >= b["em"]:
        L = eo(cl((t - b["em"]) / max(0.1, b["ate_em"] - b["em"])))
        d.line([(b["de_x"], y), (b["de_x"] + (b["ate_x"] - b["de_x"]) * L, y)], fill=ACC, width=12)
    for p in e["pontos"]:
        if p.get("em") is None or t < p["em"]: continue
        k = pr(t, p["em"], 0.35); col = cor(p.get("cor", "branco")); r = 22 * (0.6 + 0.4 * pop(k))
        d.ellipse((p["x"] - r, y - r, p["x"] + r, y + r), fill=col)
        place(c, T(p["data"], 50, 900, col), p["x"], y - 80, 0.6 + 0.4 * pop(k), min(1, k * 2.5))
        if p.get("legenda"): enter(c, T(p["legenda"], 28, 600, MUTED, spacing=6), p["x"], y + 100, t, p["em"] + 0.1, 0.3, "up")

def el_dias(c, t, e, t1):
    d = ImageDraw.Draw(c, "RGBA"); x0, y, sz, gap = e.get("x0", 100), e.get("y", 530), e.get("tamanho", 130), e.get("gap", 20)
    marc = {m["i"]: m for m in e.get("marcar", [])}; pre = e.get("preencher")
    for i, day in enumerate(e["dias"]):
        t0 = e["em"] + i * 0.06
        if t < t0: continue
        x = x0 + i * (sz + gap); fill = PANEL
        if i in marc and marc[i].get("em") is not None and t >= marc[i]["em"]: fill = cor(marc[i].get("cor", "acento"))
        if pre and i >= pre["de_i"] and t >= pre["em"] + (i - pre["de_i"]) * pre.get("passo", 0.28): fill = cor(pre.get("cor", "vermelho"))
        a = int(255 * pr(t, t0, 0.25))
        d.rounded_rectangle((x, y, x + sz, y + sz), 22, fill=fill + (a,))
        d.text((x + sz / 2, y + sz / 2), str(day), font=F(58, 900), fill=contraste(fill) + (a,), anchor="mm")
    for m in e.get("marcar", []) + ([e["legenda_final"]] if e.get("legenda_final") else []):
        if m.get("legenda") or m.get("texto"):
            i = m["i"]; col = cor(m.get("cor", "acento"))
            enter(c, T(m.get("legenda") or m.get("texto"), 28, 700, col), x0 + i * (sz + gap) + sz / 2, y + sz + 40, t, m.get("em"), 0.3, "up")

ELS = {"pill": el_pill, "texto": el_texto, "calendario": el_calendario, "seta": el_seta, "numero": el_numero,
       "chips": el_chips, "linha_tempo": el_linha_tempo, "dias": el_dias}

# ================= topo =================
def top(t):
    c = BG.copy()
    for ii, r in enumerate(INS):
        if not (r["_t0"] <= t < r["_t1"]): continue
        t0 = r["_t0"]; t1 = min(r["_t1"], t0 + 30)
        vd = r.get("video")
        if vd:
            fr = video_frame(ii, vd, t, t0)
            if fr: comp(c, fr.convert("RGBA"), 0, 0)
            if vd.get("sombra"): c.alpha_composite(SHADE)
        fo = r.get("foto")
        if fo:
            z = fo.get("zoom", [1.02, 1.14])
            comp(c, kenburns(IMG(fo["imagem"]), t, t0, t1, z[0], z[1], fo.get("pan", [0, 0])), 0, 0)
            c.alpha_composite(SHADE)
        for ci, cd in enumerate(r.get("cards", [])):
            em = cd.get("em", t0)
            if t < em: continue
            q = tuple(int(round(10 * cl((t - m["em"]) / 0.5))) if m.get("em") is not None else 0 for m in cd.get("marcas", []))
            im = CARD(ii, ci, q); x, y = cd.get("x", 540), cd["y"]
            k = pr(t, em, 0.35)
            if k < 1: place(c, im, x, y + 50 * (1 - eo(k)), 1.0, eo(k))
            else: place(c, im, x, y, 1.0 + cd.get("zoom", 0.04) * cl((t - em) / max(0.1, t1 - em)))
        for e in r.get("elementos", []):
            ELS[e["el"]](c, t, e, t1)
        src = r.get("fonte") or (fo and fo.get("credito")) or (vd and vd.get("credito"))
        if src: enter(c, SOURCE(src), 540, 52, t, t0 + 0.05)
        break
    return c

# ================= legenda (na costura) =================
def chunks():
    out, cur = [], []
    for w in WORDS:
        if not w["txt"].strip(".,;:!?"): continue            # correção "" apaga a palavra da legenda
        cur.append(w)
        if len(cur) >= 3 or sum(len(x["txt"]) for x in cur) > 15 or w["txt"][-1] in ".,;:!?":
            out.append(cur); cur = []
    if cur: out.append(cur)
    res = []
    for i, ch in enumerate(out):
        nxt = out[i + 1][0]["s"] if i + 1 < len(out) else ch[-1]["e"] + 0.5
        res.append((ch[0]["s"], nxt if nxt - ch[-1]["e"] < 0.6 else ch[-1]["e"] + 0.3, ch))
    return res
CH = chunks()
LEG = P.get("legenda", {}); CAIXA = cor(LEG.get("caixa", "#000000"))

def caption(frame, t):
    for s, e, ch in CH:
        if s <= t < e: break
    else: return
    f = F(LEG.get("tam", 58), 800); words = [w["txt"].upper().strip(".,;:!?") for w in ch]
    active = max([i for i, w in enumerate(ch) if t >= w["s"]] or [0])
    d = ImageDraw.Draw(frame); sp = 18
    widths = [d.textbbox((0, 0), w, font=f)[2] for w in words]
    x = (W - sum(widths) - sp * (len(words) - 1)) / 2
    for i, w in enumerate(words):
        if i == active:
            d.rounded_rectangle((x - 14, TH - 44, x + widths[i] + 14, TH + 40), 14, fill=CAIXA)
            d.text((x, TH), w, font=f, fill=contraste(CAIXA), anchor="lm")
        else:
            d.text((x, TH), w, font=f, fill=WHITE, anchor="lm", stroke_width=6, stroke_fill=(0, 0, 0))
        x += widths[i] + sp

# ================= base (a pessoa) =================
SRC = path(P.get("base") or P["video"])

def fit_crop(rec, rosto):
    """Ajusta o recorte à proporção da base (W:BH) em volta do rosto, sem distorcer."""
    cw, ch, cx, cy = rec; ar = W / BH
    rx, ry = rosto or (cw / 2, ch / 2)
    if abs(cw / ch - ar) < 0.01: return (cw, ch, cx, cy), (rx, ry)
    if cw / ch > ar:
        nw = int(round(ch * ar)); nx = int(round(min(max(cx + rx - nw / 2, cx), cx + cw - nw)))
        return (nw, ch, nx, cy), (cx + rx - nx, ry)
    nh = int(round(cw / ar)); ny = int(round(min(max(cy + ry - nh / 2, cy), cy + ch - nh)))
    return (cw, nh, cx, ny), (rx, cy + ry - ny)

def _src_size():
    import io
    png = subprocess.run(["ffmpeg", "-v", "error", "-i", SRC, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
                         capture_output=True).stdout
    return Image.open(io.BytesIO(png)).size             # já com a rotação do celular aplicada
SRC_W, SRC_H = _src_size()

# recorte da pessoa: o do perfil/projeto vale desde o início; "layout.recortes" troca ao longo do vídeo
# (vídeo que já vem editado e muda de layout, ex.: vira tela cheia no CTA)
CROPS = [(0.0,) + fit_crop([int(v) for v in LAY["recorte"].split(":")], LAY.get("rosto"))]
for rc in LAY.get("recortes", []):
    CROPS.append((resolve(rc["de"], 0.0),) + fit_crop([int(v) for v in rc["recorte"].split(":")], rc.get("rosto")))
CROPS.sort(key=lambda c: c[0])
for _t, (cw, ch, cx, cy), _r in CROPS:
    if cx + cw > SRC_W or cy + ch > SRC_H:
        raise SystemExit(f"Recorte {cw}:{ch}:{cx}:{cy} não cabe no vídeo {SRC_W}x{SRC_H}.")
def crop_at(t): return [c for c in CROPS if c[0] <= t][-1][1:]
ZM = P.get("zoom")
ENF = [(resolve(z["em"], 0.0), z.get("zoom", 0.12)) for z in (ZM or {}).get("enfase", [])]
def shot_of(t): return max(i for i, s in enumerate(SHOTS) if t >= s) if t >= SHOTS[0] else 0
def zoom(t):
    if not ZM: return 1.0
    k = shot_of(t); s0 = SHOTS[k]; s1 = SHOTS[k + 1] if k + 1 < len(SHOTS) else s0 + 8
    z = (1.0 if k % 2 == 0 else 1.0 + ZM.get("alternar", 0.15)) + ZM.get("empurrao", 0.04) * cl((t - s0) / max(0.1, s1 - s0))
    for te, dz in ENF:
        if te <= t and shot_of(te) == k: z += dz * eo((t - te) / 0.18)
    return z

def vignette():
    y, x = np.mgrid[0:BH, 0:W]
    r = np.sqrt(((x - W / 2) / (W / 2)) ** 2 + ((y - BH * 0.45) / (BH / 2)) ** 2)
    v = np.clip(1 - 0.28 * np.clip(r - 0.55, 0, None) ** 1.4, 0, 1)
    return Image.fromarray((v * 255).astype("uint8")).convert("RGB")
VIG = vignette() if LAY.get("vinheta") else None

def bottom(fr, t):
    (cw, ch, cx, cy), (rx, ry) = crop_at(t)
    z = zoom(t); w, h = cw / z, ch / z
    x0 = cx + min(max(rx - w / 2, 0), cw - w); y0 = cy + min(max(ry - h / 2, 0), ch - h)
    im = fr.resize((W, BH), Image.BICUBIC, box=(x0, y0, x0 + w, y0 + h))
    return ImageChops.multiply(im, VIG) if VIG else im

# ================= gancho de abertura (a frase da capa, digitada, no bloco da cor da capa) =================
GAN = P.get("gancho")
if GAN:
    GAN_ATE = resolve(GAN.get("ate", 3.0), 0.0)
    GAN_COR = cor(GAN.get("cor") or PERFIL.get("capa", {}).get("cor") or "acento")
    _gd = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    def _quebra(words, f, maxw=820, maxl=3):
        """Linhas equilibradas; nunca termina linha em número ou palavra curta; prefere quebrar antes de '('."""
        import itertools
        best = None
        for nl in range(1, maxl + 1):
            for cuts in itertools.combinations(range(1, len(words)), nl - 1):
                idx = (0,) + cuts + (len(words),)
                ls = [" ".join(words[a:b]) for a, b in zip(idx, idx[1:])]
                ws = [_gd.textlength(l, font=f) for l in ls]
                if max(ws) > maxw: continue
                pen = 0
                for c in cuts:
                    if words[c - 1][0].isdigit() or len(words[c - 1]) <= 2: pen += 400
                    if words[c].startswith("("): pen -= 200
                    elif "(" in " ".join(words[:c]) and ")" not in " ".join(words[:c]): pen += 300
                score = max(ws) - min(ws) + pen + 200 * max(0, nl - 2)
                if best is None or score < best[0]: best = (score, ls)
        return best
    _opts = []                                             # fonte maior e menos linhas ganham, sem cortar parêntese
    for _s in (GAN.get("tam", 60), 54, 48):
        _b = _quebra(GAN["texto"].split(), F(_s, 700))
        if _b: _opts.append((_b[0] + (GAN.get("tam", 60) - _s) * 8, _s, _b[1]))
    _, GAN_TAM, GAN_LINHAS = min(_opts) if _opts else (0, 48, [GAN["texto"]])
    _gf = F(GAN_TAM, 700)

def gancho(frame, t):
    if not GAN or t >= GAN_ATE: return False
    size = GAN_TAM; lh = int(size * 1.25); padx, pady = 44, 30
    bw = max(_gd.textlength(l, font=_gf) for l in GAN_LINHAS) + 2 * padx
    bh = lh * len(GAN_LINHAS) + 2 * pady - (lh - size) + 6
    x0, y0 = (W - bw) / 2, TH - bh / 2
    a = 1 - pr(t, GAN_ATE - 0.2, 0.2)
    ov = Image.new("RGBA", frame.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    d.rectangle((x0, y0, x0 + bw, y0 + bh), fill=GAN_COR + (int(255 * a),))
    n = int(len(GAN["texto"]) * cl(t / GAN.get("digitar", 1.4)))      # caracteres já digitados
    for i, l in enumerate(GAN_LINHAS):
        if n <= 0: break
        d.text((x0 + padx, y0 + pady + i * lh + size / 2), l[:n], font=_gf, fill=(255, 255, 255, int(255 * a)), anchor="lm")
        n -= len(l) + 1
    frame.paste(ov, (0, 0), ov)
    return True

def compose(t, fr):
    out = Image.new("RGB", (W, H))
    out.paste(top(t).convert("RGB"), (0, 0)); out.paste(bottom(fr, t), (0, TH))
    if not gancho(out, t): caption(out, t)
    return out

def decoder(ss=None):
    a = ["ffmpeg", "-v", "error"] + (["-ss", str(ss)] if ss is not None else []) + ["-i", SRC,
         "-vf", f"fps={FPS}", "-f", "rawvideo", "-pix_fmt", "rgb24"]
    return a + (["-frames:v", "1", "-"] if ss is not None else ["-"])

def preview():
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", SRC],
                               capture_output=True, text=True).stdout.strip())
    ts = [min(r["_t1"], dur) for r in INS]
    ts = [min(t1 - 0.15, r["_t0"] + 0.75 * (t1 - r["_t0"])) for r, t1 in zip(INS, ts)]
    tiles = []
    for t in ts:
        fr = Image.frombytes("RGB", (SRC_W, SRC_H), subprocess.run(decoder(t), capture_output=True).stdout)
        im = compose(t, fr).resize((W // 4, H // 4)); ImageDraw.Draw(im).text((6, 6), f"{t:.1f}s", fill=(255, 255, 0))
        tiles.append(im)
    cols = 6; rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", ((W // 4) * cols, (H // 4) * rows), (40, 40, 40))
    for i, im in enumerate(tiles): sheet.paste(im, ((i % cols) * (W // 4), (i // cols) * (H // 4)))
    out = os.path.join(PD, "preview_" + os.path.splitext(os.path.basename(PROJ))[0] + ".jpg")
    sheet.save(out, quality=90); print("preview:", out)

def render():
    global SEQ
    SEQ = True
    dst = path(P["saida"])
    dec = subprocess.Popen(decoder(), stdout=subprocess.PIPE)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                            "-r", str(FPS), "-i", "-", "-i", SRC, "-map", "0:v:0", "-map", "1:a:0",
                            "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
                            "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", dst], stdin=subprocess.PIPE)
    n, fs = 0, SRC_W * SRC_H * 3
    while True:
        buf = dec.stdout.read(fs)
        if len(buf) < fs: break
        enc.stdin.write(compose(n / FPS, Image.frombytes("RGB", (SRC_W, SRC_H), buf)).tobytes()); n += 1
        if n % 300 == 0: print(f"{n} frames ({n / FPS:.0f}s)", flush=True)
    enc.stdin.close(); enc.wait(); dec.wait()
    for c in CLIPS.values(): c.close()
    print("OK", n, "frames ->", dst)

if __name__ == "__main__":
    for r in INS: print(f"insert @ {r['_t0']:6.2f}s")
    preview() if len(sys.argv) > 2 and sys.argv[2] == "preview" else render()
