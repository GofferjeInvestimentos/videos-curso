import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { transformar, transformarAvatar } from "./enquadramento";
import type { ClipeNaLinha } from "./linhaDoTempo";

const RAMPA = 3; // quadros de fade de áudio em cada corte

const ClipeVideo: React.FC<{
  clipe: ClipeNaLinha;
  fps: number;
  avatar?: number;
}> = ({ clipe, fps, avatar }) => {
  const frame = useCurrentFrame();
  // Leve aproximação contínua nos planos de câmera para dar vida aos cortes.
  const respiro =
    clipe.layout === "camera"
      ? interpolate(frame, [0, clipe.quadros], [1, 1.025])
      : 1;
  const transform = avatar
    ? transformarAvatar(clipe.layout, avatar)
    : transformar(clipe.layout, (clipe.zoom ?? 1) * respiro, clipe.foco);

  return (
    <OffthreadVideo
      src={staticFile(`proxy/${clipe.parte}.mp4`)}
      trimBefore={Math.round(clipe.inicio * fps)}
      muted={Boolean(avatar)}
      volume={(f) => Math.min(1, (f + 1) / RAMPA, (clipe.quadros - f) / RAMPA)}
      pauseWhenBuffering
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        transformOrigin: "0 0",
        transform,
      }}
    />
  );
};

// Sequência dos trechos mantidos. Com `avatar`, desenha só o rosto (sem áudio)
// num quadrado de `avatar` pixels, para o círculo do apresentador nas cenas cheias.
export const TrilhaVideo: React.FC<{
  linha: ClipeNaLinha[];
  fps: number;
  avatar?: number;
  intervalo?: [number, number];
}> = ({ linha, fps, avatar, intervalo }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
    {linha
      .filter(
        (c) =>
          !intervalo ||
          (c.de < intervalo[1] && c.de + c.quadros > intervalo[0]),
      )
      .map((c) => (
        <Sequence
          key={`${c.parte}-${c.inicio}`}
          from={c.de - (intervalo?.[0] ?? 0)}
          durationInFrames={c.quadros}
          name={`${c.parte} ${c.inicio.toFixed(1)}s ${c.layout}`}
        >
          <ClipeVideo clipe={c} fps={fps} avatar={avatar} />
        </Sequence>
      ))}
  </AbsoluteFill>
);
