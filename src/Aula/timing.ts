import type { CalculateMetadataFunction } from "remotion";
import type { AulaProps } from "./schema";

export const FPS = 30;
export const DURACAO_ABERTURA = 105;
export const DURACAO_ENCERRAMENTO = 90;
// Cada tópico entra com este intervalo; a cena segura um pouco após o último.
export const INTERVALO_TOPICO = 40;
const MARGEM_TOPICOS = 75;

export const duracaoTopicos = (quantidade: number) =>
  20 + quantidade * INTERVALO_TOPICO + MARGEM_TOPICOS;

export const calcularDuracaoAula: CalculateMetadataFunction<AulaProps> = ({
  props,
}) => ({
  durationInFrames:
    DURACAO_ABERTURA +
    duracaoTopicos(props.topicos.length) +
    DURACAO_ENCERRAMENTO,
});
