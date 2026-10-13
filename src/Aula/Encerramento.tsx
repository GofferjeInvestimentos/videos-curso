import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTE, useLayout } from "./layout";

export const Encerramento: React.FC<{
  readonly chamadaFinal: string;
  readonly marca: string;
  readonly corDestaque: string;
}> = ({ chamadaFinal, marca, corDestaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = useLayout();

  const p = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const p2 = spring({ frame: frame - 20, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: l.margem,
        fontFamily: FONTE,
        color: "white",
      }}
    >
      <div
        style={{
          fontSize: l.tituloTamanho * 0.85,
          fontWeight: 800,
          lineHeight: 1.1,
          scale: interpolate(p, [0, 1], [0.85, 1]),
          opacity: Math.min(1, p),
        }}
      >
        {chamadaFinal}
      </div>
      <div
        style={{
          marginTop: 40 * l.escala,
          fontSize: l.subtituloTamanho,
          fontWeight: 600,
          color: corDestaque,
          opacity: p2,
        }}
      >
        {marca}
      </div>
    </AbsoluteFill>
  );
};
