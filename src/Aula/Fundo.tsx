import { AbsoluteFill } from "remotion";
import { FONTE, useLayout } from "./layout";

export const Fundo: React.FC<{
  readonly corFundo: string;
  readonly corDestaque: string;
  readonly marca: string;
}> = ({ corFundo, corDestaque, marca }) => {
  const { margem, escala } = useLayout();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 85% 10%, ${corDestaque}33 0%, transparent 45%), ${corFundo}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 14 * escala,
          backgroundColor: corDestaque,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: margem,
          right: margem,
          bottom: margem * 0.7,
          fontFamily: FONTE,
          fontSize: 26 * escala,
          fontWeight: 600,
          letterSpacing: 4 * escala,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {marca}
      </div>
    </AbsoluteFill>
  );
};
