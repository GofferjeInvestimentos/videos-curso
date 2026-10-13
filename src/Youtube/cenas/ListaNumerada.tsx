import { AbsoluteFill, useVideoConfig } from "remotion";
import { COR, FONTE_TITULO } from "../tema";
import { Cartao, FundoCena, Rotulo, Sobe, TextoComDestaque, Titulo, useSaida } from "./base";

export type ItemLista = { titulo: string; detalhe?: string; quando?: number };

// Lista que vai aparecendo item a item. `quando` (segundos desde o início da
// cena) sincroniza cada item com a fala; sem ele, os itens entram em sequência.
export const ListaNumerada: React.FC<{
  rotulo?: string;
  titulo: string;
  itens: ItemLista[];
  rodape?: string;
}> = ({ rotulo, titulo, itens, rodape }) => {
  const { fps } = useVideoConfig();
  const saida = useSaida();
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
          <Titulo tamanho={60} style={{ textAlign: "center", maxWidth: 1300, marginBottom: 48 }}>
            <TextoComDestaque texto={titulo} />
          </Titulo>
        </Sobe>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 1080 }}>
          {itens.map((item, i) => (
            <Sobe
              key={item.titulo}
              atraso={item.quando !== undefined ? Math.round(item.quando * fps) : 14 + i * 12}
              distancia={30}
            >
              <Cartao style={{ display: "flex", alignItems: "center", gap: 30, padding: "24px 34px" }}>
                <div
                  style={{
                    fontFamily: FONTE_TITULO,
                    fontWeight: 800,
                    fontSize: 40,
                    color: COR.azul,
                    width: 64,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ fontSize: 34, fontWeight: 700 }}>
                    <TextoComDestaque texto={item.titulo} cor={COR.verde} />
                  </div>
                  {item.detalhe ? (
                    <div style={{ fontSize: 24, color: COR.textoSuave, marginTop: 6 }}>
                      {item.detalhe}
                    </div>
                  ) : null}
                </div>
              </Cartao>
            </Sobe>
          ))}
        </div>
        {rodape ? (
          <Sobe atraso={14 + itens.length * 12}>
            <div style={{ marginTop: 36, fontSize: 26, color: COR.textoSuave, textAlign: "center" }}>
              <TextoComDestaque texto={rodape} cor={COR.verde} />
            </div>
          </Sobe>
        ) : null}
      </AbsoluteFill>
    </FundoCena>
  );
};
