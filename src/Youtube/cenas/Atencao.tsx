import { AbsoluteFill } from "remotion";
import { COR } from "../tema";
import {
  Cartao,
  FundoCena,
  Sobe,
  TextoComDestaque,
  Titulo,
  useEntrada,
  useSaida,
} from "./base";

// Cartão central de alerta/conceito: ícone, frase forte e explicação curta.
export const Atencao: React.FC<{
  icone?: string;
  titulo: string;
  texto?: string;
  cor?: string;
}> = ({ icone = "!", titulo, texto, cor = COR.amarelo }) => {
  const saida = useSaida();
  const pulso = useEntrada(6, 9);
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
        <Sobe>
          <Cartao
            destaque={`${cor}99`}
            style={{ width: 980, padding: "52px 64px", textAlign: "center" }}
          >
            <div
              style={{
                margin: "0 auto 26px",
                width: 84,
                height: 84,
                borderRadius: "50%",
                border: `3px solid ${cor}`,
                color: cor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 46,
                fontWeight: 800,
                scale: String(0.6 + 0.4 * pulso),
              }}
            >
              {icone}
            </div>
            <Titulo tamanho={56}>
              <TextoComDestaque texto={titulo} cor={cor} />
            </Titulo>
            {texto ? (
              <Sobe atraso={10}>
                <div
                  style={{
                    marginTop: 22,
                    fontSize: 30,
                    color: COR.textoSuave,
                    lineHeight: 1.4,
                  }}
                >
                  <TextoComDestaque texto={texto} cor={COR.texto} />
                </div>
              </Sobe>
            ) : null}
          </Cartao>
        </Sobe>
      </AbsoluteFill>
    </FundoCena>
  );
};
