import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COR, FONTE_TITULO } from "../tema";
import { TextoComDestaque, useEntrada, useSaida } from "./base";

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
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
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
        <div style={{ fontFamily: FONTE_TITULO, fontWeight: 800, fontSize: 38, lineHeight: 1.2 }}>
          <TextoComDestaque texto={texto} cor={cor} />
        </div>
        {apoio ? (
          <div style={{ marginTop: 8, fontSize: 24, color: COR.textoSuave }}>{apoio}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Identificação do apresentador (lower third).
export const NomeApresentador: React.FC<{ nome: string; cargo: string }> = ({ nome, cargo }) => {
  const p = useEntrada(0);
  const linha = useEntrada(6);
  const saida = useSaida(12);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 0 220px 110px" }}>
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
        <div style={{ height: 5, width: 120 * linha, backgroundColor: COR.azul, borderRadius: 3, margin: "12px 0" }} />
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
