import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COR, FONTE_TEXTO, FONTE_TITULO } from "../tema";

// Entrada com mola, atrasada em quadros.
export const useEntrada = (atraso = 0, amortecimento = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - atraso,
    fps,
    config: { damping: amortecimento },
  });
};

// Saída suave nos últimos quadros da cena.
export const useSaida = (quadros = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(
    frame,
    [durationInFrames - quadros, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

export const Sobe: React.FC<{
  atraso?: number;
  distancia?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ atraso = 0, distancia = 40, style, children }) => {
  const p = useEntrada(atraso);
  return (
    <div
      style={{
        opacity: p,
        translate: `0 ${(1 - p) * distancia}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Fundo grafite com brilho azul sutil, usado nas cenas de tela cheia.
export const FundoCena: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const deriva = interpolate(frame, [0, 600], [0, 40]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1100px 700px at ${30 + deriva / 4}% 20%, rgba(59,130,246,0.13), transparent 70%), radial-gradient(900px 600px at 85% 95%, rgba(52,211,153,0.07), transparent 70%), ${COR.fundo}`,
        fontFamily: FONTE_TEXTO,
        color: COR.texto,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const Cartao: React.FC<{
  style?: React.CSSProperties;
  destaque?: string;
  children: React.ReactNode;
}> = ({ style, destaque, children }) => (
  <div
    style={{
      backgroundColor: COR.cartao,
      border: `1.5px solid ${destaque ?? COR.borda}`,
      borderRadius: 22,
      boxShadow: destaque
        ? `0 0 0 1px ${destaque}22, 0 20px 60px rgba(0,0,0,0.35), 0 0 60px ${destaque}22`
        : "0 20px 60px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Rotulo: React.FC<{
  cor?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ cor = COR.textoFraco, style, children }) => (
  <div
    style={{
      fontFamily: FONTE_TEXTO,
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: cor,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Titulo: React.FC<{
  tamanho?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ tamanho = 64, style, children }) => (
  <div
    style={{
      fontFamily: FONTE_TITULO,
      fontWeight: 800,
      fontSize: tamanho,
      lineHeight: 1.12,
      letterSpacing: -1,
      textWrap: "balance",
      ...style,
    }}
  >
    {children}
  </div>
);

// Destaca trechos entre *asteriscos* com a cor indicada.
export const TextoComDestaque: React.FC<{ texto: string; cor?: string }> = ({
  texto,
  cor = COR.azul,
}) => (
  <>
    {texto.split(/(\*[^*]+\*)/).map((parte, i) =>
      parte.startsWith("*") ? (
        <span key={i} style={{ color: cor }}>
          {parte.slice(1, -1)}
        </span>
      ) : (
        <span key={i}>{parte}</span>
      ),
    )}
  </>
);

// Número que conta até o valor final. Aceita prefixo/sufixo e casas decimais.
export const Contador: React.FC<{
  valor: number;
  casas?: number;
  prefixo?: string;
  sufixo?: string;
  atraso?: number;
  duracao?: number;
}> = ({
  valor,
  casas = 0,
  prefixo = "",
  sufixo = "",
  atraso = 0,
  duracao = 30,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - atraso, [0, duracao], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const n = (valor * p).toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefixo}
      {n}
      {sufixo}
    </span>
  );
};
