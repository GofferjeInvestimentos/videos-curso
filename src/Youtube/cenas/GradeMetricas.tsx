import { AbsoluteFill, useVideoConfig } from "remotion";
import { COR, FONTE_TITULO } from "../tema";
import type { Metrica } from "./CartaoAtivo";
import { Cartao, Contador, FundoCena, Rotulo, Sobe, TextoComDestaque, Titulo, useSaida } from "./base";

// Grade de números grandes com título (ex.: "Carteira após 1 mês").
export const GradeMetricas: React.FC<{
  rotulo?: string;
  titulo: string;
  metricas: Metrica[];
  rodape?: string;
}> = ({ rotulo, titulo, metricas, rodape }) => {
  const { fps } = useVideoConfig();
  const saida = useSaida();
  const colunas = metricas.length === 4 ? 2 : Math.min(3, metricas.length);
  return (
    <FundoCena>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", opacity: saida, paddingBottom: 60 }}
      >
        {rotulo ? (
          <Sobe>
            <Rotulo cor={COR.azul} style={{ textAlign: "center", marginBottom: 18 }}>
              {rotulo}
            </Rotulo>
          </Sobe>
        ) : null}
        <Sobe atraso={3}>
          <Titulo tamanho={60} style={{ textAlign: "center", maxWidth: 1400, marginBottom: 50 }}>
            <TextoComDestaque texto={titulo} />
          </Titulo>
        </Sobe>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${colunas}, ${colunas === 2 ? 520 : 440}px)`,
            gap: 28,
          }}
        >
          {metricas.map((m, i) => {
            const atraso = m.quando !== undefined ? Math.round(m.quando * fps) : 12 + i * 10;
            return (
              <Sobe key={m.rotulo} atraso={atraso} distancia={30}>
                <Cartao
                  destaque={m.cor ? `${m.cor}77` : undefined}
                  style={{ padding: "30px 34px", height: "100%", boxSizing: "border-box" }}
                >
                  <Rotulo>{m.rotulo}</Rotulo>
                  <div
                    style={{
                      fontFamily: FONTE_TITULO,
                      fontWeight: 800,
                      fontSize: 72,
                      marginTop: 10,
                      color: m.cor ?? COR.texto,
                      letterSpacing: -1,
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
                    <div style={{ fontSize: 24, color: COR.textoSuave, marginTop: 6 }}>{m.nota}</div>
                  ) : null}
                </Cartao>
              </Sobe>
            );
          })}
        </div>
        {rodape ? (
          <Sobe atraso={20 + metricas.length * 10}>
            <div style={{ marginTop: 36, fontSize: 28, color: COR.textoSuave, textAlign: "center", maxWidth: 1200 }}>
              <TextoComDestaque texto={rodape} cor={COR.verde} />
            </div>
          </Sobe>
        ) : null}
      </AbsoluteFill>
    </FundoCena>
  );
};
