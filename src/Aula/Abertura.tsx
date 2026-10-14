import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTE, useLayout } from "./layout";

export const Abertura: React.FC<{
  readonly modulo: string;
  readonly titulo: string;
  readonly subtitulo: string;
  readonly corDestaque: string;
}> = ({ modulo, titulo, subtitulo, corDestaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = useLayout();

  const entrada = (atraso: number) =>
    spring({ frame: frame - atraso, fps, config: { damping: 200 } });

  const etiqueta = entrada(5);
  const titulo1 = entrada(15);
  const linha = entrada(30);
  const sub = entrada(40);

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
          alignSelf: "flex-start",
          padding: `${12 * l.escala}px ${28 * l.escala}px`,
          borderRadius: 999,
          backgroundColor: corDestaque,
          fontSize: l.etiquetaTamanho,
          fontWeight: 700,
          letterSpacing: 2 * l.escala,
          textTransform: "uppercase",
          opacity: etiqueta,
          translate: `0 ${interpolate(etiqueta, [0, 1], [30, 0])}px`,
        }}
      >
        {modulo}
      </div>
      <h1
        style={{
          margin: `${40 * l.escala}px 0 0`,
          fontSize: l.tituloTamanho,
          fontWeight: 800,
          lineHeight: 1.08,
          textWrap: "balance",
          letterSpacing: -2 * l.escala,
          maxWidth: l.vertical ? "100%" : "80%",
          opacity: titulo1,
          translate: `0 ${interpolate(titulo1, [0, 1], [60, 0])}px`,
        }}
      >
        {titulo}
      </h1>
      <div
        style={{
          marginTop: 44 * l.escala,
          height: 8 * l.escala,
          width: 180 * l.escala * linha,
          borderRadius: 4 * l.escala,
          backgroundColor: corDestaque,
        }}
      />
      <p
        style={{
          margin: `${40 * l.escala}px 0 0`,
          fontSize: l.subtituloTamanho,
          fontWeight: 400,
          lineHeight: 1.35,
          textWrap: "balance",
          color: "rgba(255,255,255,0.8)",
          maxWidth: l.vertical ? "100%" : "70%",
          opacity: sub,
          translate: `0 ${interpolate(sub, [0, 1], [30, 0])}px`,
        }}
      >
        {subtitulo}
      </p>
    </AbsoluteFill>
  );
};
