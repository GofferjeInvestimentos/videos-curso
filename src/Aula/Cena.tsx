import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const FADE = 12;

// Envolve uma cena com fade de entrada e saída.
export const Cena: React.FC<{
  readonly duracao: number;
  readonly children: React.ReactNode;
}> = ({ duracao, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FADE, duracao - FADE, duracao],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
