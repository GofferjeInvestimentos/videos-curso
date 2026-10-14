import { Composition } from "remotion";
import {
  duracaoEdicao,
  VideoAulaYoutube,
  type DadosEdicao,
} from "./Composicao";
import clipes from "./dados/clipes.json";
import palavras from "./dados/palavras.json";
import { carregarFontes } from "./fontes";
import type { Clipe, Palavra } from "./tipos";

const FPS = 30;

// loadFont segura a renderização até as fontes carregarem.
carregarFontes();

const props: DadosEdicao = {
  clipes: clipes as Clipe[],
  palavras: palavras as Palavra[],
  marca: "Gofferjé Investimentos",
  legendas: false,
};

export const ComposicaoYoutube: React.FC = () => (
  <Composition
    id="AulaYoutube"
    component={VideoAulaYoutube}
    fps={FPS}
    width={1920}
    height={1080}
    durationInFrames={duracaoEdicao(props.clipes, FPS)}
    defaultProps={props}
  />
);
