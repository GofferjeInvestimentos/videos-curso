import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const fontes: Array<[string, string, string]> = [
  ["Montserrat", "montserrat-latin-600-normal.woff2", "600"],
  ["Montserrat", "montserrat-latin-700-normal.woff2", "700"],
  ["Montserrat", "montserrat-latin-800-normal.woff2", "800"],
  ["Montserrat", "montserrat-latin-900-normal.woff2", "900"],
  ["Inter", "inter-latin-400-normal.woff2", "400"],
  ["Inter", "inter-latin-500-normal.woff2", "500"],
  ["Inter", "inter-latin-600-normal.woff2", "600"],
  ["Inter", "inter-latin-700-normal.woff2", "700"],
  ["Inter", "inter-latin-800-normal.woff2", "800"],
];

// Fontes locais (public/fonts) para não depender de rede na renderização.
export const carregarFontes = () =>
  Promise.all(
    fontes.map(([family, arquivo, weight]) =>
      loadFont({ family, url: staticFile(`fonts/${arquivo}`), weight }),
    ),
  );
