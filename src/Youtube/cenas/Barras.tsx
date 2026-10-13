import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COR, FONTE_TITULO } from "../tema";
import {
  Cartao,
  FundoCena,
  Rotulo,
  Sobe,
  TextoComDestaque,
  Titulo,
  useSaida,
} from "./base";

export type Barra = {
  rotulo: string;
  valor: number;
  texto?: string;
  cor?: string;
  quando?: number;
};

// Barras horizontais crescendo (ex.: distribuição da carteira).
export const Barras: React.FC<{
  rotulo?: string;
  titulo: string;
  barras: Barra[];
  maximo?: number;
  nota?: string;
}> = ({ rotulo, titulo, barras, maximo, nota }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const saida = useSaida();
  const max = maximo ?? Math.max(...barras.map((b) => b.valor));
  return (
    <FundoCena>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: saida,
          paddingBottom: 60,
        }}
      >
        {rotulo ? (
          <Sobe>
            <Rotulo
              cor={COR.azul}
              style={{ textAlign: "center", marginBottom: 18 }}
            >
              {rotulo}
            </Rotulo>
          </Sobe>
        ) : null}
        <Sobe atraso={3}>
          <Titulo
            tamanho={58}
            style={{ textAlign: "center", maxWidth: 1400, marginBottom: 46 }}
          >
            <TextoComDestaque texto={titulo} />
          </Titulo>
        </Sobe>
        <Sobe atraso={8}>
          <Cartao style={{ width: 1180, padding: "36px 44px" }}>
            {barras.map((b, i) => {
              const atraso =
                b.quando !== undefined
                  ? Math.round(b.quando * fps)
                  : 14 + i * 8;
              const p = interpolate(frame - atraso, [0, 26], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: (t) => 1 - Math.pow(1 - t, 3),
              });
              const cor = b.cor ?? COR.azul;
              return (
                <div
                  key={b.rotulo}
                  style={{
                    marginTop: i === 0 ? 0 : 28,
                    opacity: Math.min(1, p * 3),
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 28,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{b.rotulo}</span>
                    <span
                      style={{
                        fontFamily: FONTE_TITULO,
                        fontWeight: 800,
                        color: cor,
                      }}
                    >
                      {b.texto ?? `${Math.round(b.valor * p)}%`}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(b.valor / max) * 100 * p}%`,
                        borderRadius: 7,
                        background: `linear-gradient(90deg, ${cor}AA, ${cor})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {nota ? (
              <div
                style={{
                  marginTop: 32,
                  paddingLeft: 18,
                  borderLeft: `4px solid ${COR.amarelo}`,
                  fontSize: 24,
                  color: COR.textoSuave,
                }}
              >
                <TextoComDestaque texto={nota} cor={COR.amarelo} />
              </div>
            ) : null}
          </Cartao>
        </Sobe>
      </AbsoluteFill>
    </FundoCena>
  );
};
