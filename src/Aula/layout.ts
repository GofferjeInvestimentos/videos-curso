import { useVideoConfig } from "remotion";

export const FONTE = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";

// Adapta tamanhos ao formato: vertical (Reels/TikTok) ou horizontal (YouTube).
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const base = vertical ? width / 1080 : height / 1080;

  return {
    vertical,
    margem: (vertical ? 90 : 140) * base,
    tituloTamanho: (vertical ? 104 : 112) * base,
    subtituloTamanho: (vertical ? 46 : 44) * base,
    etiquetaTamanho: 30 * base,
    topicoTamanho: (vertical ? 52 : 50) * base,
    escala: base,
  };
};
