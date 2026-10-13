import { AbsoluteFill } from "remotion";
import { COR } from "../tema";
import {
  FundoCena,
  Rotulo,
  Sobe,
  TextoComDestaque,
  Titulo,
  useEntrada,
  useSaida,
} from "./base";

// Cartão de abertura de capítulo: "Como *montar* a carteira".
export const TituloSecao: React.FC<{
  numero?: string;
  titulo: string;
  subtitulo?: string;
  corDestaque?: string;
}> = ({ numero, titulo, subtitulo, corDestaque = COR.azul }) => {
  const saida = useSaida();
  const linha = useEntrada(14);
  return (
    <FundoCena>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: saida,
        }}
      >
        {numero ? (
          <Sobe>
            <Rotulo
              cor={corDestaque}
              style={{ textAlign: "center", marginBottom: 26 }}
            >
              {numero}
            </Rotulo>
          </Sobe>
        ) : null}
        <Sobe atraso={4}>
          <Titulo tamanho={88} style={{ textAlign: "center", maxWidth: 1400 }}>
            <TextoComDestaque texto={titulo} cor={corDestaque} />
          </Titulo>
        </Sobe>
        <div
          style={{
            marginTop: 36,
            height: 6,
            width: 160 * linha,
            borderRadius: 3,
            backgroundColor: corDestaque,
          }}
        />
        {subtitulo ? (
          <Sobe atraso={16}>
            <div
              style={{
                marginTop: 30,
                fontSize: 32,
                color: COR.textoSuave,
                textAlign: "center",
              }}
            >
              {subtitulo}
            </div>
          </Sobe>
        ) : null}
      </AbsoluteFill>
    </FundoCena>
  );
};
