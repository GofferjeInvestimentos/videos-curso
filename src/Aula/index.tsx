import { AbsoluteFill, Sequence } from "remotion";
import { Abertura } from "./Abertura";
import { Cena } from "./Cena";
import { Encerramento } from "./Encerramento";
import { Fundo } from "./Fundo";
import { Topicos } from "./Topicos";
import type { AulaProps } from "./schema";
import {
  DURACAO_ABERTURA,
  DURACAO_ENCERRAMENTO,
  duracaoTopicos,
} from "./timing";

export const Aula: React.FC<AulaProps> = (props) => {
  const duracaoLista = duracaoTopicos(props.topicos.length);

  return (
    <AbsoluteFill>
      <Fundo
        corFundo={props.corFundo}
        corDestaque={props.corDestaque}
        marca={props.marca}
      />
      <Sequence durationInFrames={DURACAO_ABERTURA} name="Abertura">
        <Cena duracao={DURACAO_ABERTURA}>
          <Abertura
            modulo={props.modulo}
            titulo={props.titulo}
            subtitulo={props.subtitulo}
            corDestaque={props.corDestaque}
          />
        </Cena>
      </Sequence>
      <Sequence
        from={DURACAO_ABERTURA}
        durationInFrames={duracaoLista}
        name="Tópicos"
      >
        <Cena duracao={duracaoLista}>
          <Topicos topicos={props.topicos} corDestaque={props.corDestaque} />
        </Cena>
      </Sequence>
      <Sequence
        from={DURACAO_ABERTURA + duracaoLista}
        durationInFrames={DURACAO_ENCERRAMENTO}
        name="Encerramento"
      >
        <Cena duracao={DURACAO_ENCERRAMENTO}>
          <Encerramento
            chamadaFinal={props.chamadaFinal}
            marca={props.marca}
            corDestaque={props.corDestaque}
          />
        </Cena>
      </Sequence>
    </AbsoluteFill>
  );
};

