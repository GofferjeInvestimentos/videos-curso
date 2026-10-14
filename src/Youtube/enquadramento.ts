import type { Layout } from "./tipos";
import { ALTURA, LARGURA } from "./tema";

// Área útil (sem bordas pretas) de cada layout da gravação, detectada com
// ffmpeg cropdetect: [x, y, largura, altura] em pixels da fonte 1920x1080.
export const AREA_UTIL: Record<Layout, [number, number, number, number]> = {
  camera: [82, 84, 1716, 964],
  celular: [24, 64, 1876, 1016],
  tela: [8, 0, 1912, 1080],
};

// Rosto do apresentador em pixels da fonte, usado no zoom e no avatar.
export const ROSTO: Record<Layout, [number, number]> = {
  camera: [1010, 430],
  celular: [1045, 500],
  tela: [1655, 355],
};

// Meia largura da área mostrada no quadro do apresentador (pixels da fonte):
// aberto o bastante para pegar cabeça e ombros sem cortar o rosto.
export const ESCALA_ROSTO: Record<Layout, number> = {
  camera: 420,
  celular: 400,
  tela: 160,
};

// Matriz que leva a área útil a preencher o quadro e aplica um zoom extra
// em torno de um foco (pixels do quadro de saída).
export const transformar = (
  layout: Layout,
  zoom: number,
  foco?: [number, number],
) => {
  const [x, y, w, h] = AREA_UTIL[layout];
  const s = Math.max(LARGURA / w, ALTURA / h);
  const bx = LARGURA / 2 - s * (x + w / 2);
  const by = ALTURA / 2 - s * (y + h / 2);
  const [qx, qy] = foco ?? [
    s * ROSTO[layout][0] + bx,
    s * ROSTO[layout][1] + by,
  ];
  const k = s * zoom;
  const tx = zoom * bx + qx * (1 - zoom);
  const ty = zoom * by + qy * (1 - zoom);
  return `matrix(${k}, 0, 0, ${k}, ${tx}, ${ty})`;
};

// Matriz do quadro do apresentador: centraliza o rosto num quadrado de lado `lado`.
export const transformarAvatar = (layout: Layout, lado: number) => {
  const [fx, fy] = ROSTO[layout];
  const k = lado / (2 * ESCALA_ROSTO[layout]);
  return `matrix(${k}, 0, 0, ${k}, ${lado / 2 - k * fx}, ${lado / 2 - k * fy})`;
};
