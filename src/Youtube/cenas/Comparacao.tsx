import { AbsoluteFill, useVideoConfig } from "remotion";
import { COR, FONTE_TITULO } from "../tema";
import { Cartao, FundoCena, Rotulo, Sobe, TextoComDestaque, Titulo, useSaida } from "./base";

export type Coluna = {
  topo: string;
  titulo: string;
  linhas: string[];
  cor?: string;
  quando?: number;
};

// Colunas lado a lado (ex.: renda fixa x ações x FIIs).
export const Comparacao: React.FC<{
  rotulo?: string;
  titulo: string;
  colunas: Coluna[];
  conclusao?: string;
}> = ({ rotulo, titulo, colunas, conclusao }) => {
  const { fps } = useVideoConfig();
  const saida = useSaida();
  const largura = Math.min(480, Math.floor(1500 / colunas.length) - 30);
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
          <Titulo tamanho={58} style={{ textAlign: "center", maxWidth: 1400, marginBottom: 50 }}>
            <TextoComDestaque texto={titulo} />
          </Titulo>
        </Sobe>
        <div style={{ display: "flex", gap: 30, alignItems: "stretch" }}>
          {colunas.map((c, i) => {
            const cor = c.cor ?? COR.azul;
            return (
              <Sobe
                key={c.titulo}
                atraso={c.quando !== undefined ? Math.round(c.quando * fps) : 12 + i * 10}
                style={{ display: "flex" }}
              >
                <Cartao destaque={`${cor}88`} style={{ width: largura, padding: "30px 32px" }}>
                  <Rotulo cor={cor}>{c.topo}</Rotulo>
                  <div
                    style={{
                      fontFamily: FONTE_TITULO,
                      fontWeight: 800,
                      fontSize: 44,
                      marginTop: 10,
                      marginBottom: 22,
                    }}
                  >
                    {c.titulo}
                  </div>
                  {c.linhas.map((l) => (
                    <div
                      key={l}
                      style={{
                        display: "flex",
                        gap: 14,
                        fontSize: 26,
                        color: COR.textoSuave,
                        marginTop: 12,
                        lineHeight: 1.3,
                      }}
                    >
                      <span style={{ color: cor, fontWeight: 800 }}>•</span>
                      <span>{l}</span>
                    </div>
                  ))}
                </Cartao>
              </Sobe>
            );
          })}
        </div>
        {conclusao ? (
          <Sobe atraso={20 + colunas.length * 10}>
            <Cartao style={{ marginTop: 34, padding: "20px 34px", backgroundColor: COR.fundo2 }}>
              <div style={{ fontSize: 28, fontStyle: "italic", color: COR.texto, textAlign: "center" }}>
                <TextoComDestaque texto={conclusao} cor={COR.verde} />
              </div>
            </Cartao>
          </Sobe>
        ) : null}
      </AbsoluteFill>
    </FundoCena>
  );
};
