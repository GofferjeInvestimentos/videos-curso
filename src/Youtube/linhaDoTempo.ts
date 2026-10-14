import type { Ancora, Clipe, Palavra } from "./tipos";

export type ClipeNaLinha = Clipe & { de: number; quadros: number };

// Posiciona os clipes um após o outro no vídeo editado (em quadros).
export const montarLinha = (clipes: Clipe[], fps: number): ClipeNaLinha[] => {
  let segundos = 0;
  return clipes.map((c) => {
    const de = Math.round(segundos * fps);
    segundos += c.fim - c.inicio;
    return { ...c, de, quadros: Math.round(segundos * fps) - de };
  });
};

export const duracaoTotal = (linha: ClipeNaLinha[]) => {
  const ultimo = linha[linha.length - 1];
  return ultimo ? ultimo.de + ultimo.quadros : 1;
};

// Converte um instante da gravação original para o quadro do vídeo editado.
// Instantes cortados caem no início do próximo trecho mantido.
export const paraQuadro = (
  linha: ClipeNaLinha[],
  fps: number,
  { parte, t }: Ancora,
): number | null => {
  for (const c of linha) {
    if (c.parte !== parte) continue;
    if (t < c.inicio) return c.de;
    if (t < c.fim) return c.de + Math.round((t - c.inicio) * fps);
  }
  return null;
};

export type PalavraNaLinha = { texto: string; de: number; ate: number };

// Mantém só as palavras que caem dentro de trechos mantidos.
export const palavrasNaLinha = (
  linha: ClipeNaLinha[],
  fps: number,
  palavras: Palavra[],
): PalavraNaLinha[] => {
  const out: PalavraNaLinha[] = [];
  for (const p of palavras) {
    const meio = (p.s + p.e) / 2;
    const c = linha.find(
      (x) => x.parte === p.parte && meio >= x.inicio && meio < x.fim,
    );
    if (!c) continue;
    const de = c.de + Math.max(0, Math.round((p.s - c.inicio) * fps));
    const ate = c.de + Math.min(c.quadros, Math.round((p.e - c.inicio) * fps));
    out.push({ texto: p.w, de, ate: Math.max(ate, de + 1) });
  }
  return out;
};
