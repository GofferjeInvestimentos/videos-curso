import { Composition, Folder } from "remotion";
import { Aula } from "./Aula";
import { aulaExemplo, aulaSchema } from "./Aula/schema";
import { calcularDuracaoAula, FPS } from "./Aula/timing";
import { ComposicaoYoutube } from "./Youtube";

// Cada <Composition> aparece na barra lateral do Remotion Studio.
// Para renderizar: npx remotion render AulaVertical out/aula-vertical.mp4

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Edicao">
        <ComposicaoYoutube />
      </Folder>
      <Folder name="Curso">
        <Composition
          // Reels, TikTok e Shorts
          id="AulaVertical"
          component={Aula}
          schema={aulaSchema}
          defaultProps={aulaExemplo}
          calculateMetadata={calcularDuracaoAula}
          durationInFrames={300}
          fps={FPS}
          width={1080}
          height={1920}
        />
        <Composition
          // YouTube e plataforma do curso
          id="AulaHorizontal"
          component={Aula}
          schema={aulaSchema}
          defaultProps={aulaExemplo}
          calculateMetadata={calcularDuracaoAula}
          durationInFrames={300}
          fps={FPS}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
