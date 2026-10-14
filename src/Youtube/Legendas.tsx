import { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { PalavraNaLinha } from "./linhaDoTempo";
import { COR, FONTE_TITULO } from "./tema";

type Pagina = { de: number; ate: number; palavras: PalavraNaLinha[] };

const MAX_CARACTERES = 34;
const MAX_PALAVRAS = 7;

// Agrupa palavras em blocos curtos, quebrando em pausas e pontuação.
const paginar = (palavras: PalavraNaLinha[], fps: number): Pagina[] => {
  const paginas: Pagina[] = [];
  let atual: PalavraNaLinha[] = [];
  const fechar = () => {
    if (atual.length === 0) return;
    paginas.push({
      de: atual[0].de,
      ate: atual[atual.length - 1].ate,
      palavras: atual,
    });
    atual = [];
  };
  for (const p of palavras) {
    const anterior = atual[atual.length - 1];
    const texto = [...atual, p].map((x) => x.texto).join(" ");
    if (
      anterior &&
      (p.de - anterior.ate > 0.35 * fps ||
        /[.!?]$/.test(anterior.texto) ||
        (/[,;:]$/.test(anterior.texto) && atual.length >= 3) ||
        texto.length > MAX_CARACTERES ||
        atual.length >= MAX_PALAVRAS)
    ) {
      fechar();
    }
    atual.push(p);
  }
  fechar();
  // Segura cada bloco na tela até o próximo, se a pausa for curta.
  return paginas.map((pg, i) => {
    const prox = paginas[i + 1];
    const ate = prox && prox.de - pg.ate < 0.6 * fps ? prox.de : pg.ate + 6;
    return { ...pg, ate };
  });
};

export const Legendas: React.FC<{
  palavras: PalavraNaLinha[];
  fps: number;
}> = ({ palavras, fps }) => {
  const frame = useCurrentFrame();
  const paginas = useMemo(() => paginar(palavras, fps), [palavras, fps]);
  const pagina = paginas.find((p) => frame >= p.de && frame < p.ate);
  if (!pagina) return null;

  const entrada = interpolate(frame - pagina.de, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 64,
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          padding: "14px 30px 16px",
          borderRadius: 18,
          backgroundColor: "rgba(10,12,14,0.72)",
          fontFamily: FONTE_TITULO,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.18,
          textAlign: "center",
          color: COR.texto,
          opacity: entrada,
          translate: `0 ${(1 - entrada) * 12}px`,
        }}
      >
        {pagina.palavras.map((p, i) => {
          const ativa = frame >= p.de && frame < p.ate;
          const dita = frame >= p.de;
          return (
            <span
              key={`${p.de}-${i}`}
              style={{
                color: ativa
                  ? COR.verde
                  : dita
                    ? COR.texto
                    : "rgba(245,247,250,0.78)",
              }}
            >
              {i > 0 ? " " : ""}
              {p.texto}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
