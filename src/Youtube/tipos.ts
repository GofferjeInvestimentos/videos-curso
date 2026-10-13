export type Layout = "camera" | "celular" | "tela";

export type Parte = "parte1" | "parte2";

// Trecho mantido de uma gravação, em segundos da gravação original.
export type Clipe = {
  parte: Parte;
  inicio: number;
  fim: number;
  layout: Layout;
  // Zoom extra sobre o enquadramento base (punch-in nos cortes).
  zoom?: number;
  // Ponto de foco do zoom, em pixels do quadro de saída (1920x1080).
  foco?: [number, number];
};

// Palavra transcrita, em segundos da gravação original.
export type Palavra = { parte: Parte; w: string; s: number; e: number };

// Âncora de tempo na gravação original; convertida para o tempo editado.
export type Ancora = { parte: Parte; t: number };

// cheio: cobre a tela; sobreposto: por cima do vídeo; tela: desenhado sobre o
// vídeo e acompanha o zoom (marcações em números da tela).
export type ModoCena = "cheio" | "sobreposto" | "tela";

export type Cena = {
  id: string;
  ancora: Ancora;
  duracao: number;
  modo: ModoCena;
  render: React.FC;
};
