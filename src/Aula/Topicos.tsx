import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTE, useLayout } from "./layout";
import { INTERVALO_TOPICO } from "./timing";

export const Topicos: React.FC<{
  readonly topicos: string[];
  readonly corDestaque: string;
}> = ({ topicos, corDestaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = useLayout();

  const cabecalho = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: l.margem,
        fontFamily: FONTE,
        color: "white",
      }}
    >
      <div
        style={{
          fontSize: l.etiquetaTamanho * 1.2,
          fontWeight: 700,
          letterSpacing: 3 * l.escala,
          textTransform: "uppercase",
          color: corDestaque,
          opacity: cabecalho,
          marginBottom: 50 * l.escala,
        }}
      >
        Nesta aula
      </div>
      {topicos.map((topico, i) => {
        const p = spring({
          frame: frame - 20 - i * INTERVALO_TOPICO,
          fps,
          config: { damping: 200 },
        });
        return (
          <div
            key={`${topico}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32 * l.escala,
              marginBottom: (l.vertical ? 44 : 30) * l.escala,
              opacity: p,
              translate: `${interpolate(p, [0, 1], [-80, 0])}px 0`,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: l.topicoTamanho * 1.6,
                height: l.topicoTamanho * 1.6,
                borderRadius: "50%",
                border: `${4 * l.escala}px solid ${corDestaque}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: l.topicoTamanho * 0.75,
                fontWeight: 800,
                color: corDestaque,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontSize: l.topicoTamanho,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {topico}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
