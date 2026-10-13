import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COR, FONTE_TEXTO, FONTE_TITULO } from "../tema";
import { Contador, TextoComDestaque, useEntrada, useSaida } from "./base";

// Círculo vermelho "à mão" sobre um número na tela. Região em pixels do quadro.
export const Marcacao: React.FC<{
  regiao: [number, number, number, number];
  cor?: string;
  atraso?: number;
}> = ({ regiao, cor = "#EF4444", atraso = 0 }) => {
  const frame = useCurrentFrame();
  const saida = useSaida(8);
  const [x, y, w, h] = regiao;
  const p = interpolate(frame - atraso, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });
  const pad = 18;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rx = w / 2 + pad;
  const ry = h / 2 + pad;
  // Elipse levemente aberta e inclinada, como um traço feito à mão.
  const d = `M ${cx + rx * 0.92} ${cy - ry * 0.55}
    C ${cx + rx * 1.1} ${cy + ry * 0.7}, ${cx + rx * 0.2} ${cy + ry * 1.12}, ${cx - rx * 0.55} ${cy + ry * 0.95}
    C ${cx - rx * 1.18} ${cy + ry * 0.75}, ${cx - rx * 1.08} ${cy - ry * 0.85}, ${cx - rx * 0.15} ${cy - ry * 1.02}
    C ${cx + rx * 0.55} ${cy - ry * 1.12}, ${cx + rx * 1.05} ${cy - ry * 0.75}, ${cx + rx * 0.98} ${cy - ry * 0.1}`;
  return (
    <AbsoluteFill style={{ opacity: saida }}>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d={d}
          fill="none"
          stroke={cor}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
        />
      </svg>
    </AbsoluteFill>
  );
};

// Caixa de texto no canto inferior esquerdo (perguntas, chamadas, avisos).
export const CaixaTexto: React.FC<{
  texto: string;
  apoio?: string;
  cor?: string;
  posicao?: "esquerda" | "direita";
}> = ({ texto, apoio, cor = COR.verde, posicao = "esquerda" }) => {
  const p = useEntrada(0);
  const saida = useSaida(10);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: posicao === "esquerda" ? "flex-start" : "flex-end",
        padding: "0 90px 210px",
        fontFamily: FONTE_TEXTO,
      }}
    >
      <div
        style={{
          opacity: Math.min(p, saida),
          translate: `${(1 - p) * (posicao === "esquerda" ? -60 : 60)}px 0`,
          maxWidth: 760,
          padding: "22px 30px",
          borderRadius: 16,
          backgroundColor: "rgba(14,17,19,0.92)",
          borderLeft: `6px solid ${cor}`,
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
          color: COR.texto,
        }}
      >
        <div
          style={{
            fontFamily: FONTE_TITULO,
            fontWeight: 800,
            fontSize: 38,
            lineHeight: 1.2,
          }}
        >
          <TextoComDestaque texto={texto} cor={cor} />
        </div>
        {apoio ? (
          <div style={{ marginTop: 8, fontSize: 24, color: COR.textoSuave }}>
            {apoio}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Identificação do apresentador (lower third).
export const NomeApresentador: React.FC<{ nome: string; cargo: string }> = ({
  nome,
  cargo,
}) => {
  const p = useEntrada(0);
  const linha = useEntrada(6);
  const saida = useSaida(12);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        padding: "0 0 220px 110px",
        fontFamily: FONTE_TEXTO,
      }}
    >
      <div style={{ opacity: saida }}>
        <div
          style={{
            fontFamily: FONTE_TITULO,
            fontWeight: 800,
            fontSize: 48,
            color: COR.texto,
            opacity: p,
            translate: `${(1 - p) * -40}px 0`,
            textShadow: "0 4px 18px rgba(0,0,0,0.6)",
          }}
        >
          {nome}
        </div>
        <div
          style={{
            height: 5,
            width: 120 * linha,
            backgroundColor: COR.azul,
            borderRadius: 3,
            margin: "12px 0",
          }}
        />
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: COR.texto,
            opacity: linha,
            textShadow: "0 3px 14px rgba(0,0,0,0.7)",
          }}
        >
          {cargo}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Marca-texto amarelo varrendo da esquerda para a direita sobre um trecho da tela.
// `fundo` escuro (app do celular) usa transparência; claro (sites) usa multiply.
export const MarcaTexto: React.FC<{
  regiao: [number, number, number, number];
  fundo?: "claro" | "escuro";
  atraso?: number;
}> = ({ regiao, fundo = "claro", atraso = 0 }) => {
  const frame = useCurrentFrame();
  const saida = useSaida(8);
  const [x, y, w, h] = regiao;
  const p = interpolate(frame - atraso, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });
  return (
    <AbsoluteFill style={{ opacity: saida }}>
      <div
        style={{
          position: "absolute",
          left: x - 6,
          top: y - 3,
          width: (w + 12) * p,
          height: h + 6,
          borderRadius: 4,
          backgroundColor:
            fundo === "claro" ? "#FDE047" : "rgba(250,204,21,0.32)",
          mixBlendMode: fundo === "claro" ? "multiply" : "normal",
          boxShadow:
            fundo === "escuro" ? "0 0 0 2px rgba(250,204,21,0.85)" : undefined,
        }}
      />
    </AbsoluteFill>
  );
};

export type LinhaLateral = {
  rotulo: string;
  valor?: number;
  texto?: string;
  casas?: number;
  prefixo?: string;
  sufixo?: string;
  cor?: string;
  quando?: number;
};

// Card compacto na lateral: resume os números sem esconder a tela gravada.
export const CartaoLateral: React.FC<{
  etiqueta?: string;
  titulo: string;
  linhas: LinhaLateral[];
  rodape?: string;
  lado?: "direita" | "esquerda";
  topo?: number;
}> = ({ etiqueta, titulo, linhas, rodape, lado = "direita", topo = 560 }) => {
  const { fps } = useVideoConfig();
  const p = useEntrada(0);
  const saida = useSaida(10);
  return (
    <AbsoluteFill style={{ fontFamily: FONTE_TEXTO }}>
      <div
        style={{
          position: "absolute",
          top: topo,
          [lado === "direita" ? "right" : "left"]: 36,
          width: 400,
          padding: "22px 26px 20px",
          borderRadius: 18,
          backgroundColor: "rgba(14,17,19,0.94)",
          border: `1.5px solid ${COR.borda}`,
          borderTop: `4px solid ${COR.azul}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          color: COR.texto,
          opacity: Math.min(p, saida),
          translate: `${(1 - p) * (lado === "direita" ? 50 : -50)}px 0`,
        }}
      >
        {etiqueta ? (
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: COR.azulClaro,
            }}
          >
            {etiqueta}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: FONTE_TITULO,
            fontWeight: 800,
            fontSize: 34,
            marginTop: 4,
          }}
        >
          <TextoComDestaque texto={titulo} cor={COR.verde} />
        </div>
        <div style={{ marginTop: 12 }}>
          {linhas.map((l, i) => (
            <LinhaDoCartao
              key={l.rotulo}
              linha={l}
              atraso={
                l.quando !== undefined ? Math.round(l.quando * fps) : 8 + i * 7
              }
            />
          ))}
        </div>
        {rodape ? (
          <div
            style={{
              marginTop: 12,
              fontSize: 19,
              color: COR.textoSuave,
              lineHeight: 1.35,
            }}
          >
            <TextoComDestaque texto={rodape} cor={COR.verde} />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const LinhaDoCartao: React.FC<{ linha: LinhaLateral; atraso: number }> = ({
  linha,
  atraso,
}) => {
  const p = useEntrada(atraso);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 16,
        padding: "9px 0",
        borderTop: `1px solid ${COR.borda}`,
        opacity: p,
        translate: `0 ${(1 - p) * 12}px`,
      }}
    >
      <span style={{ fontSize: 21, color: COR.textoSuave }}>
        {linha.rotulo}
      </span>
      <span
        style={{
          fontFamily: FONTE_TITULO,
          fontWeight: 800,
          fontSize: 27,
          whiteSpace: "nowrap",
          color: linha.cor ?? COR.texto,
        }}
      >
        {linha.valor !== undefined ? (
          <Contador
            valor={linha.valor}
            casas={linha.casas}
            prefixo={linha.prefixo}
            sufixo={linha.sufixo}
            atraso={atraso}
            duracao={20}
          />
        ) : (
          linha.texto
        )}
      </span>
    </div>
  );
};

// Selo de abertura de bloco sobre a tela (no lugar de um título em tela cheia).
export const SeloSecao: React.FC<{
  numero: string;
  titulo: string;
  subtitulo?: string;
}> = ({ numero, titulo, subtitulo }) => {
  const p = useEntrada(0);
  const linha = useEntrada(6);
  const saida = useSaida(10);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        padding: "0 0 90px 70px",
        fontFamily: FONTE_TEXTO,
      }}
    >
      <div
        style={{
          alignSelf: "flex-start",
          padding: "20px 30px 22px",
          borderRadius: 18,
          backgroundColor: "rgba(14,17,19,0.94)",
          borderLeft: `6px solid ${COR.verde}`,
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
          opacity: Math.min(p, saida),
          translate: `${(1 - p) * -60}px 0`,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: COR.verde,
          }}
        >
          {numero}
        </div>
        <div
          style={{
            fontFamily: FONTE_TITULO,
            fontWeight: 900,
            fontSize: 64,
            color: COR.texto,
            lineHeight: 1.05,
            marginTop: 4,
          }}
        >
          {titulo}
        </div>
        <div
          style={{
            height: 4,
            width: 90 * linha,
            backgroundColor: COR.verde,
            borderRadius: 2,
            margin: "10px 0 8px",
          }}
        />
        {subtitulo ? (
          <div style={{ fontSize: 24, color: COR.textoSuave }}>{subtitulo}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
