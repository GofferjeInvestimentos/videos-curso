import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const aulaSchema = z.object({
  marca: z.string(),
  modulo: z.string(),
  titulo: z.string(),
  subtitulo: z.string(),
  topicos: z.array(z.string()).min(1),
  chamadaFinal: z.string(),
  corFundo: zColor(),
  corDestaque: zColor(),
});

export type AulaProps = z.infer<typeof aulaSchema>;

export const aulaExemplo: AulaProps = {
  marca: "Gofferjé Investimentos",
  modulo: "Módulo 1 · Aula 1",
  titulo: "Os primeiros passos para investir",
  subtitulo: "O que você precisa saber antes de aplicar o primeiro real",
  topicos: [
    "Reserva de emergência",
    "Perfil de investidor",
    "Renda fixa x renda variável",
    "Juros compostos na prática",
  ],
  chamadaFinal: "Te vejo na próxima aula!",
  corFundo: "#0B1F3A",
  corDestaque: "#3B82F6",
};
