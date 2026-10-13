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
  camera: [1010, 400],
  celular: [1045, 470],
  tela: [1650, 330],
};

// Raio aproximado do rosto (pixels da fonte) para enquadrar o avatar.
export const ESCALA_ROSTO: Record<Layout, number> = {
  camera: 260,
  celular: 250,
  tela: 105,
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
  const [qx, qy] = foco ?? [s * ROSTO[layout][0] + bx, s * ROSTO[layout][1] + by];
  const k = s * zoom;
  const tx = zoom * bx + qx * (1 - zoom);
  const ty = zoom * by + qy * (1 - zoom);
  return `matrix(${k}, 0, 0, ${k}, ${tx}, ${ty})`;
};

// Matriz para o avatar circular: centraliza o rosto num quadrado de lado `lado`.
export const transformarAvatar = (layout: Layout, lado: number) => {
  const [fx, fy] = ROSTO[layout];
  const k = lado / (2 * ESCALA_ROSTO[layout]);
  return `matrix(${k}, 0, 0, ${k}, ${lado / 2 - k * fx}, ${lado / 2 - k * fy})`;
};
