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
import { cenas, zooms } from "./roteiro";
import { TrilhaVideo } from "./TrilhaVideo";

export type ZoomTela = {
  ancora: Ancora;
  duracao: number;
  // Região a destacar, em pixels do quadro de saída: [x, y, largura, altura].
  regiao: [number, number, number, number];
  // Zoom máximo (padrão 1.7) para não estourar a resolução da gravação.
  maximo?: number;
};

// Só dados serializáveis: o Remotion converte as props em JSON, então as cenas
// (que são componentes) vêm direto do roteiro.
export type DadosEdicao = {
  clipes: Clipe[];
  palavras: Palavra[];
  marca: string;
  legendas: boolean;
};

const AVATAR = 230;
const TRANSICAO = 8;

const posicionar = (
  linha: ClipeNaLinha[],
  fps: number,
  ancora: Ancora,
  duracao: number,
) => {
  const de = paraQuadro(linha, fps, ancora);
  if (de === null) {
    throw new Error(
      `Âncora fora dos trechos mantidos: ${ancora.parte} ${ancora.t}s`,
    );
  }
  return { de, quadros: Math.round(duracao * fps) };
};

// Aproxima a câmera de uma região da tela (ex.: indicador no Status Invest).
const useZoomTela = (
  zooms: Array<ZoomTela & { de: number; quadros: number }>,
) => {
  const frame = useCurrentFrame();
  const z = zooms.find((x) => frame >= x.de && frame < x.de + x.quadros);
  if (!z) return undefined;
  const [x, y, w, h] = z.regiao;
  const alvo = Math.min(1920 / w, 1080 / h, z.maximo ?? 1.7);
  const p = interpolate(
    frame - z.de,
    [0, 14, z.quadros - 14, z.quadros],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t * t * (3 - 2 * t),
    },
  );
  const s = 1 + (alvo - 1) * p;
  // Centro da janela visível, preso aos limites para nunca mostrar fora do quadro.
  const prender = (v: number, meio: number, total: number) =>
    Math.min(Math.max(v, meio / s), total - meio / s);
  const cx = prender(960 + (x + w / 2 - 960) * p, 960, 1920);
  const cy = prender(540 + (y + h / 2 - 540) * p, 540, 1080);
  const tx = 960 - cx * s;
  const ty = 540 - cy * s;
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};

type CenaNaLinha = Cena & { de: number; quadros: number };

const RenderCena: React.FC<{ cena: CenaNaLinha }> = ({ cena }) => {
  const Render = cena.render;
  return (
    <Sequence from={cena.de} durationInFrames={cena.quadros} name={cena.id}>
      <Render />
    </Sequence>
  );
};

const Palco: React.FC<{
  linha: ClipeNaLinha[];
  fps: number;
  zooms: Array<ZoomTela & { de: number; quadros: number }>;
  marcacoes: CenaNaLinha[];
}> = ({ linha, fps, zooms, marcacoes }) => {
  const transform = useZoomTela(zooms);
  return (
    <AbsoluteFill style={{ transformOrigin: "0 0", transform }}>
      <TrilhaVideo linha={linha} fps={fps} />
      {marcacoes.map((c) => (
        <RenderCena key={c.id} cena={c} />
      ))}
    </AbsoluteFill>
  );
};

// Entrada/saída das cenas de tela cheia: cortina que sobe e desce.
const TransicaoCheia: React.FC<{
  quadros: number;
  children: React.ReactNode;
}> = ({ quadros, children }) => {
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
    <AbsoluteFill style={{ clipPath: `inset(${entrada}% 0 ${saida}% 0)` }}>
      {children}
    </AbsoluteFill>
  );
};

const Avatar: React.FC<{
  linha: ClipeNaLinha[];
  fps: number;
  de: number;
  quadros: number;
}> = ({ linha, fps, de, quadros }) => {
  const frame = useCurrentFrame();
  const p = interpolate(
    frame,
    [TRANSICAO, TRANSICAO + 10, quadros - 10, quadros - 4],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <div
      style={{
        position: "absolute",
        right: 56,
        top: 48,
        width: AVATAR,
        height: AVATAR,
        borderRadius: 22,
        overflow: "hidden",
        border: `3px solid ${COR.azul}`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        opacity: p,
        scale: String(0.8 + 0.2 * p),
      }}
    >
      <TrilhaVideo
        linha={linha}
        fps={fps}
        avatar={AVATAR}
        intervalo={[de, de + quadros]}
      />
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
  marca,
  legendas,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const linha = useMemo(() => montarLinha(clipes, fps), [clipes, fps]);
  const palavrasLinha = useMemo(
    () => palavrasNaLinha(linha, fps, palavras),
    [linha, fps, palavras],
  );
  const cenasLinha = useMemo(
    () =>
      cenas.map((c) => ({
        ...c,
        ...posicionar(linha, fps, c.ancora, c.duracao),
      })),
    [linha, fps],
  );
  const zoomsLinha = useMemo(
    () =>
      zooms.map((z) => ({
        ...z,
        ...posicionar(linha, fps, z.ancora, z.duracao),
      })),
    [linha, fps],
  );

  const emCenaCheia = cenasLinha.some(
    (c) =>
      c.modo === "cheio" &&
      frame >= c.de + TRANSICAO &&
      frame < c.de + c.quadros - TRANSICAO,
  );
  const clipeAtual = linha.find(
    (c) => frame >= c.de && frame < c.de + c.quadros,
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: COR.fundo, fontFamily: FONTE_TEXTO }}
    >
      {/* Esconde o vídeo (mantendo o áudio) enquanto uma cena cobre a tela toda. */}
      <AbsoluteFill style={{ opacity: emCenaCheia ? 0 : 1 }}>
        <Palco
          linha={linha}
          fps={fps}
          zooms={zoomsLinha}
          marcacoes={cenasLinha.filter((c) => c.modo === "tela")}
        />
      </AbsoluteFill>
      {clipeAtual?.layout === "camera" && !emCenaCheia ? (
        <Marca texto={marca} />
      ) : null}
      {cenasLinha
        .filter((c) => c.modo !== "tela")
        .map((c) => {
          const Render = c.render;
          return (
            <Sequence
              key={c.id}
              from={c.de}
              durationInFrames={c.quadros}
              name={c.id}
            >
              {c.modo === "cheio" ? (
                <TransicaoCheia quadros={c.quadros}>
                  <Render />
                  <Avatar
                    linha={linha}
                    fps={fps}
                    de={c.de}
                    quadros={c.quadros}
                  />
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
