import { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Legendas } from "./Legendas";
import {
  duracaoTotal,
  montarLinha,
  palavrasNaLinha,
  paraQuadro,
  type ClipeNaLinha,
} from "./linhaDoTempo";
import { COR, FONTE_TEXTO } from "./tema";
import type { Ancora, Cena, Clipe, Palavra } from "./tipos";
import { TrilhaVideo } from "./TrilhaVideo";

export type ZoomTela = {
  ancora: Ancora;
  duracao: number;
  // Região a destacar, em pixels do quadro de saída: [x, y, largura, altura].
  regiao: [number, number, number, number];
};

export type DadosEdicao = {
  clipes: Clipe[];
  palavras: Palavra[];
  cenas: Cena[];
  zooms: ZoomTela[];
  marca: string;
  legendas: boolean;
};

const AVATAR = 150;
const TRANSICAO = 8;

const posicionar = (linha: ClipeNaLinha[], fps: number, ancora: Ancora, duracao: number) => {
  const de = paraQuadro(linha, fps, ancora);
  if (de === null) {
    throw new Error(`Âncora fora dos trechos mantidos: ${ancora.parte} ${ancora.t}s`);
  }
  return { de, quadros: Math.round(duracao * fps) };
};

// Aproxima a câmera de uma região da tela (ex.: indicador no Status Invest).
const useZoomTela = (zooms: Array<ZoomTela & { de: number; quadros: number }>) => {
  const frame = useCurrentFrame();
  const z = zooms.find((x) => frame >= x.de && frame < x.de + x.quadros);
  if (!z) return undefined;
  const [x, y, w, h] = z.regiao;
  const alvo = Math.min(1920 / w, 1080 / h);
  const p = interpolate(
    frame - z.de,
    [0, 14, z.quadros - 14, z.quadros],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) },
  );
  const s = 1 + (alvo - 1) * p;
  // Mantém a região centralizada sem mostrar fora do quadro.
  const cx = Math.min(Math.max(x + w / 2, 960 / alvo), 1920 - 960 / alvo);
  const cy = Math.min(Math.max(y + h / 2, 540 / alvo), 1080 - 540 / alvo);
  const tx = (960 - cx * s) * p + 0 * (1 - p);
  const ty = (540 - cy * s) * p;
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};

const Palco: React.FC<{
  linha: ClipeNaLinha[];
  fps: number;
  zooms: Array<ZoomTela & { de: number; quadros: number }>;
}> = ({ linha, fps, zooms }) => {
  const transform = useZoomTela(zooms);
  return (
    <AbsoluteFill style={{ transformOrigin: "0 0", transform }}>
      <TrilhaVideo linha={linha} fps={fps} />
    </AbsoluteFill>
  );
};

// Entrada/saída das cenas de tela cheia: cortina que sobe e desce.
const TransicaoCheia: React.FC<{ quadros: number; children: React.ReactNode }> = ({
  quadros,
  children,
}) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame, [0, TRANSICAO], [100, 0], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const saida = interpolate(frame, [quadros - TRANSICAO, quadros], [0, 100], {
    extrapolateLeft: "clamp",
    easing: (t) => t * t * t,
  });
  return (
    <AbsoluteFill style={{ clipPath: `inset(${entrada}% 0 ${saida}% 0)` }}>{children}</AbsoluteFill>
  );
};

const Avatar: React.FC<{ linha: ClipeNaLinha[]; fps: number; de: number; quadros: number }> = ({
  linha,
  fps,
  de,
  quadros,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [TRANSICAO, TRANSICAO + 10, quadros - 10, quadros - 4], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        right: 56,
        top: 48,
        width: AVATAR,
        height: AVATAR,
        borderRadius: "50%",
        overflow: "hidden",
        border: `4px solid ${COR.azul}`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        opacity: p,
        scale: String(0.8 + 0.2 * p),
      }}
    >
      <TrilhaVideo linha={linha} fps={fps} avatar={AVATAR} intervalo={[de, de + quadros]} />
    </div>
  );
};

const Marca: React.FC<{ texto: string }> = ({ texto }) => (
  <div
    style={{
      position: "absolute",
      right: 56,
      top: 40,
      fontFamily: FONTE_TEXTO,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: 1,
      color: "rgba(255,255,255,0.9)",
      textShadow: "0 2px 10px rgba(0,0,0,0.6)",
    }}
  >
    {texto}
  </div>
);

export const VideoAulaYoutube: React.FC<DadosEdicao> = ({
  clipes,
  palavras,
  cenas,
  zooms,
  marca,
  legendas,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const linha = useMemo(() => montarLinha(clipes, fps), [clipes, fps]);
  const palavrasLinha = useMemo(() => palavrasNaLinha(linha, fps, palavras), [linha, fps, palavras]);
  const cenasLinha = useMemo(
    () => cenas.map((c) => ({ ...c, ...posicionar(linha, fps, c.ancora, c.duracao) })),
    [cenas, linha, fps],
  );
  const zoomsLinha = useMemo(
    () => zooms.map((z) => ({ ...z, ...posicionar(linha, fps, z.ancora, z.duracao) })),
    [zooms, linha, fps],
  );

  const emCenaCheia = cenasLinha.some(
    (c) => c.modo === "cheio" && frame >= c.de + TRANSICAO && frame < c.de + c.quadros - TRANSICAO,
  );
  const clipeAtual = linha.find((c) => frame >= c.de && frame < c.de + c.quadros);

  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      {/* Esconde o vídeo (mantendo o áudio) enquanto uma cena cobre a tela toda. */}
      <AbsoluteFill style={{ opacity: emCenaCheia ? 0 : 1 }}>
        <Palco linha={linha} fps={fps} zooms={zoomsLinha} />
      </AbsoluteFill>
      {clipeAtual?.layout === "camera" && !emCenaCheia ? <Marca texto={marca} /> : null}
      {cenasLinha.map((c) => {
        const Render = c.render;
        return (
          <Sequence key={c.id} from={c.de} durationInFrames={c.quadros} name={c.id}>
            {c.modo === "cheio" ? (
              <TransicaoCheia quadros={c.quadros}>
                <Render />
                <Avatar linha={linha} fps={fps} de={c.de} quadros={c.quadros} />
              </TransicaoCheia>
            ) : (
              <Render />
            )}
          </Sequence>
        );
      })}
      {legendas ? <Legendas palavras={palavrasLinha} fps={fps} /> : null}
    </AbsoluteFill>
  );
};

export const duracaoEdicao = (clipes: Clipe[], fps: number) =>
  duracaoTotal(montarLinha(clipes, fps));
