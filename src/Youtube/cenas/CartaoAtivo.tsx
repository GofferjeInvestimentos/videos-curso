import { AbsoluteFill, useVideoConfig } from "remotion";
import { COR, FONTE_TITULO } from "../tema";
import { Cartao, Contador, FundoCena, Rotulo, Sobe, useSaida } from "./base";

export type Metrica = {
  rotulo: string;
  valor: number;
  casas?: number;
  prefixo?: string;
  sufixo?: string;
  cor?: string;
  nota?: string;
  quando?: number;
};

// Ficha de um ativo: ticker à esquerda, métricas animadas à direita.
export const CartaoAtivo: React.FC<{
  etiqueta: string;
  ticker: string;
  nome: string;
  metricas: Metrica[];
  corDestaque?: string;
}> = ({ etiqueta, ticker, nome, metricas, corDestaque = COR.azul }) => {
  const { fps } = useVideoConfig();
  const saida = useSaida();
  return (
    <FundoCena>
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 110,
          opacity: saida,
          paddingBottom: 60,
        }}
      >
        <div style={{ width: 560 }}>
          <Sobe>
            <div
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: 999,
                backgroundColor: `${corDestaque}22`,
                border: `1.5px solid ${corDestaque}66`,
                color: corDestaque,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {etiqueta}
            </div>
          </Sobe>
          <Sobe atraso={4}>
            <div
              style={{
                fontFamily: FONTE_TITULO,
                fontWeight: 900,
                fontSize: 130,
                letterSpacing: -3,
                lineHeight: 1,
                marginTop: 22,
              }}
            >
              {ticker}
            </div>
          </Sobe>
          <Sobe atraso={8}>
            <div style={{ fontSize: 34, color: COR.textoSuave, marginTop: 14 }}>
              {nome}
            </div>
          </Sobe>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            width: 640,
          }}
        >
          {metricas.map((m, i) => {
            const atraso =
              m.quando !== undefined ? Math.round(m.quando * fps) : 12 + i * 10;
            return (
              <Sobe key={m.rotulo} atraso={atraso} distancia={30}>
                <Cartao style={{ padding: "22px 30px" }}>
                  <Rotulo>{m.rotulo}</Rotulo>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 18,
                      marginTop: 8,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONTE_TITULO,
                        fontWeight: 800,
                        fontSize: 58,
                        whiteSpace: "nowrap",
                        color: m.cor ?? COR.texto,
                      }}
                    >
                      <Contador
                        valor={m.valor}
                        casas={m.casas}
                        prefixo={m.prefixo}
                        sufixo={m.sufixo}
                        atraso={atraso}
                      />
                    </div>
                    {m.nota ? (
                      <div style={{ fontSize: 22, color: COR.textoSuave }}>
                        {m.nota}
                      </div>
                    ) : null}
                  </div>
                </Cartao>
              </Sobe>
            );
          })}
        </div>
      </AbsoluteFill>
    </FundoCena>
  );
};
