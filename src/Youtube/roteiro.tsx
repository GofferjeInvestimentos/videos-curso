import type { ZoomTela } from "./Composicao";
import { Atencao } from "./cenas/Atencao";
import { Barras } from "./cenas/Barras";
import { CartaoAtivo } from "./cenas/CartaoAtivo";
import { Comparacao } from "./cenas/Comparacao";
import { GradeMetricas } from "./cenas/GradeMetricas";
import { ListaNumerada } from "./cenas/ListaNumerada";
import {
  CaixaTexto,
  CartaoLateral,
  MarcaTexto,
  Marcacao,
  NomeApresentador,
  SeloSecao,
} from "./cenas/Sobreposicoes";
import { TituloSecao } from "./cenas/TituloSecao";
import { COR } from "./tema";
import type { Cena, ModoCena, Parte } from "./tipos";

// Roteiro de edição: cada cena é ancorada num instante da gravação original
// (parte + segundo, conferido na transcrição) e dura `duracao` segundos do
// vídeo editado. Números vêm do que aparece na tela da gravação.
//
// Critério: quando a tela do computador ou do celular está aparecendo, ela é a
// protagonista (zoom, círculo, marca-texto e cards laterais). Tela cheia de
// motion só para conceitos, para consolidar informação ou para cobrir telas
// vazias. Trechos importantes ficam só com o Fernando falando.

const cena = (
  id: string,
  parte: Parte,
  t: number,
  duracao: number,
  modo: ModoCena,
  conteudo: React.ReactNode,
): Cena => ({
  id,
  ancora: { parte, t },
  duracao,
  modo,
  render: () => <>{conteudo}</>,
});

const zoom = (
  parte: Parte,
  t: number,
  duracao: number,
  regiao: [number, number, number, number],
  maximo?: number,
): ZoomTela => ({ ancora: { parte, t }, duracao, regiao, maximo });

const P1 = "parte1";
const P2 = "parte2";

export const cenas: Cena[] = [
  // ── Abertura (câmera) ───────────────────────────────────
  cena(
    "meta",
    P1,
    2.7,
    5.4,
    "sobreposto",
    <CaixaTexto texto="Carteira pública: meta de *R$ 1.000/mês* de renda passiva" />,
  ),
  cena(
    "rentab-ano",
    P1,
    9.4,
    3.0,
    "sobreposto",
    <CaixaTexto texto="Já rende *+20%* no ano" />,
  ),
  cena(
    "nome",
    P1,
    12.6,
    6.0,
    "sobreposto",
    <NomeApresentador
      nome="Fernando Gofferjé"
      cargo="Gofferjé Investimentos"
    />,
  ),
  cena(
    "video-bolsa",
    P1,
    27.6,
    5.5,
    "sobreposto",
    <CaixaTexto
      texto="Vídeo no canal: *por que a Bolsa está subindo*"
      cor={COR.azul}
    />,
  ),
  cena(
    "carteira-publica",
    P1,
    43.8,
    7.8,
    "cheio",
    <GradeMetricas
      rotulo="Carteira pública"
      titulo="O objetivo: *R$ 1.000 por mês* de renda passiva"
      metricas={[
        {
          rotulo: "Meta de renda passiva",
          valor: 1000,
          prefixo: "R$ ",
          sufixo: "/mês",
          cor: COR.verde,
        },
        { rotulo: "Aporte mensal", valor: 1000, prefixo: "R$ ", quando: 5.4 },
      ]}
      rodape="Por que mil reais? *Porque é exatamente o valor que eu aporto.*"
    />,
  ),
  cena(
    "educativa",
    P1,
    56.4,
    3.6,
    "sobreposto",
    <CaixaTexto
      texto="Carteira *educativa*: não é recomendação de compra ou venda"
      cor={COR.amarelo}
    />,
  ),
  cena(
    "fracionar",
    P1,
    60.0,
    8.5,
    "cheio",
    <Comparacao
      rotulo="Começando com menos"
      titulo="Como acompanhar com *R$ 100*"
      colunas={[
        {
          topo: "Carteira pública",
          titulo: "R$ 1.000/mês",
          linhas: ["Aporte completo", "Compra cheia de cada ativo"],
        },
        {
          topo: "Você",
          titulo: "R$ 100/mês",
          linhas: ["1/10 do aporte", "Divida cada compra por 10"],
          cor: COR.verde,
          quando: 2.6,
        },
      ]}
    />,
  ),
  cena(
    "racional",
    P1,
    86.2,
    3.6,
    "sobreposto",
    <CaixaTexto texto="Entenda o *racional* — não copie às cegas" />,
  ),
  // ── Parte 1: carteira após 1 mês (celular) ──────────────
  cena(
    "titulo-1mes",
    P1,
    90.0,
    6.3,
    "cheio",
    <TituloSecao numero="Parte 1" titulo="Como está a *carteira* após 1 mês" />,
  ),
  cena(
    "total-bruto",
    P1,
    105.4,
    6.0,
    "tela",
    <MarcaTexto regiao={[17, 231, 150, 34]} fundo="escuro" />,
  ),
  cena(
    "resultado-1mes",
    P1,
    106.0,
    9.0,
    "sobreposto",
    <CartaoLateral
      etiqueta="Carteira pública · 1 mês"
      titulo="*+21%* desde a criação"
      topo={600}
      linhas={[
        { rotulo: "Aporte inicial", valor: 1000, prefixo: "R$ " },
        {
          rotulo: "Total bruto hoje",
          valor: 1215.58,
          casas: 2,
          prefixo: "R$ ",
        },
        { rotulo: "Bolsa", texto: "81,7%" },
        { rotulo: "Tesouro Direto", texto: "18,3%" },
      ]}
    />,
  ),
  cena(
    "marcacao-caixa",
    P1,
    126.3,
    6.5,
    "sobreposto",
    <CaixaTexto
      texto="Ganho na *marcação a mercado*"
      apoio="Tesouro Prefixado 2037"
      posicao="direita"
    />,
  ),
  cena(
    "tesouro-valorizacao",
    P1,
    130.6,
    6.0,
    "tela",
    <MarcaTexto regiao={[17, 345, 408, 30]} fundo="escuro" />,
  ),
  cena(
    "por-que-valorizou",
    P1,
    136.9,
    14.2,
    "cheio",
    <ListaNumerada
      rotulo="Marcação a mercado"
      titulo="Por que o título *valorizou 13%* em um mês?"
      itens={[
        { titulo: "Título prefixado *longo* (vence em 2037)", quando: 0.3 },
        { titulo: "*Duration* maior = mais sensível aos juros", quando: 2.7 },
        { titulo: "Juros caem → o título *se valoriza*", quando: 5.3 },
        {
          titulo: "Vendendo antes do prazo, você *embolsa o ganho*",
          quando: 10.0,
        },
      ]}
    />,
  ),
  cena(
    "13-em-1-mes",
    P1,
    155.0,
    7.0,
    "sobreposto",
    <CaixaTexto
      texto="*13% em 1 mês* ≈ o que o título paga em *1 ano*"
      posicao="direita"
    />,
  ),
  cena(
    "bpac11-valorizacao",
    P1,
    180.6,
    5.8,
    "tela",
    <MarcaTexto regiao={[18, 790, 394, 26]} fundo="escuro" />,
  ),
  cena(
    "bpac11",
    P1,
    175.0,
    13.5,
    "sobreposto",
    <CartaoLateral
      etiqueta="Ação · Banco"
      titulo="BPAC11 · *+50,36%*"
      topo={600}
      linhas={[
        { rotulo: "Quantidade", texto: "4 ações" },
        { rotulo: "Preço médio", valor: 53.79, casas: 2, prefixo: "R$ " },
        { rotulo: "Cotação atual", valor: 80.99, casas: 2, prefixo: "R$ " },
        {
          rotulo: "Valorização",
          valor: 50.36,
          casas: 2,
          prefixo: "+",
          sufixo: "%",
          cor: COR.verde,
          quando: 6.5,
        },
      ]}
    />,
  ),
  cena(
    "bpac11-decisao",
    P1,
    207.3,
    8.5,
    "sobreposto",
    <CaixaTexto
      texto="BPAC11: *mantém*, mas sem novas compras"
      apoio="Subiu muito no curto prazo"
      cor={COR.amarelo}
      posicao="direita"
    />,
  ),
  cena(
    "btci11",
    P1,
    217.8,
    6.0,
    "sobreposto",
    <CaixaTexto
      texto="BTCI11 · *+0,45%*"
      apoio="Mantém, sem aporte neste mês"
      posicao="direita"
    />,
  ),
  cena(
    "btlg11",
    P1,
    232.4,
    6.0,
    "sobreposto",
    <CaixaTexto
      texto="BTLG11 · *+4,58%* em um mês"
      apoio="Fundo de logística — mantém"
      posicao="direita"
    />,
  ),
  cena(
    "cmig4",
    P1,
    242.4,
    7.0,
    "sobreposto",
    <CaixaTexto
      texto="CMIG4 · *+13,39%*"
      apoio="Boa empresa, mas não é a maior oportunidade agora"
      posicao="direita"
    />,
  ),
  cena(
    "gare11",
    P1,
    263.6,
    5.5,
    "sobreposto",
    <CaixaTexto
      texto="GARE11 · *+7,64%* em um mês"
      apoio="Comprado barato — mantém"
      posicao="direita"
    />,
  ),
  cena(
    "resumo-1mes",
    P1,
    269.2,
    8.6,
    "cheio",
    <Barras
      rotulo="Carteira após 1 mês"
      titulo="Valorização de cada ativo"
      barras={[
        {
          rotulo: "BPAC11 · BTG Pactual",
          valor: 50.36,
          texto: "+50,36%",
          cor: COR.verde,
        },
        {
          rotulo: "CMIG4 · Cemig",
          valor: 13.39,
          texto: "+13,39%",
          cor: COR.verde,
        },
        {
          rotulo: "Tesouro Prefixado 2037",
          valor: 13.29,
          texto: "+13,29%",
          cor: COR.verde,
        },
        { rotulo: "GARE11 · Guardian", valor: 7.64, texto: "+7,64%" },
        { rotulo: "BTLG11 · BTG Logística", valor: 4.58, texto: "+4,58%" },
        { rotulo: "BTCI11 · BTG Crédito Imob.", valor: 0.45, texto: "+0,45%" },
      ]}
      nota="Neste aporte: *nenhuma recompra* — só ativos novos, com foco em renda variável."
    />,
  ),
  // ── Parte 2: compras do mês — TRXF11 (tela) ─────────────
  cena(
    "titulo-compras",
    P1,
    278.1,
    6.0,
    "cheio",
    <TituloSecao
      numero="Parte 2"
      titulo="Os *novos ativos* do mês"
      subtitulo="Análise e compra ao vivo"
    />,
  ),
  cena(
    "selo-trxf11",
    P1,
    299.5,
    6.0,
    "sobreposto",
    <SeloSecao
      numero="Compra 1 · Fundo imobiliário"
      titulo="TRXF11"
      subtitulo="TRX Real Estate"
    />,
  ),
  cena(
    "trxf11-cotacao",
    P1,
    315.0,
    4.5,
    "tela",
    <Marcacao regiao={[447, 296, 232, 88]} />,
  ),
  cena(
    "trxf11-variacao",
    P1,
    320.3,
    2.8,
    "tela",
    <Marcacao regiao={[1290, 296, 160, 88]} />,
  ),
  cena(
    "trxf11-queda",
    P1,
    323.4,
    5.2,
    "cheio",
    <GradeMetricas
      rotulo="TRXF11"
      titulo="Uma queda *exagerada*"
      metricas={[
        { rotulo: "Máxima em 12 meses", valor: 87, prefixo: "R$ " },
        {
          rotulo: "Cotação hoje",
          valor: 71.88,
          casas: 2,
          prefixo: "R$ ",
          quando: 0.6,
        },
        {
          rotulo: "Variação 12 meses",
          valor: -18.41,
          casas: 2,
          sufixo: "%",
          cor: COR.vermelho,
          quando: 1.4,
        },
      ]}
    />,
  ),
  cena(
    "trxf11-pvp",
    P1,
    329.6,
    2.6,
    "tela",
    <MarcaTexto regiao={[492, 523, 958, 36]} />,
  ),
  cena(
    "trxf11-ficha",
    P1,
    332.2,
    9.0,
    "sobreposto",
    <CartaoLateral
      etiqueta="FII · Compra do mês"
      titulo="TRXF11"
      linhas={[
        { rotulo: "Cotação", valor: 71.88, casas: 2, prefixo: "R$ " },
        {
          rotulo: "Dividend yield (12m)",
          valor: 16.36,
          casas: 2,
          sufixo: "%",
          cor: COR.verde,
        },
        { rotulo: "P/VP", valor: 0.75, casas: 2, cor: COR.verde },
        {
          rotulo: "Aporte",
          valor: 200,
          prefixo: "R$ ",
          cor: COR.azulClaro,
          quando: 4.8,
        },
      ]}
    />,
  ),
  cena(
    "trxf11-tese",
    P1,
    347.9,
    13.4,
    "sobreposto",
    <CartaoLateral
      etiqueta="TRXF11"
      titulo="Por que *continua bom*"
      linhas={[
        { rotulo: "Imóveis", texto: "excelentes", cor: COR.verde, quando: 0.3 },
        {
          rotulo: "Inquilinos",
          texto: "excelentes",
          cor: COR.verde,
          quando: 5.9,
        },
        { rotulo: "Gestão", texto: "sem mudança brusca", quando: 8.5 },
      ]}
      rodape="Tanto desconto que *gera oportunidade*"
    />,
  ),
  cena(
    "trxf11-queda-si",
    P1,
    363.6,
    4.6,
    "tela",
    <Marcacao regiao={[1243, 310, 140, 72]} />,
  ),
  cena(
    "trxf11-oportunidade",
    P1,
    378.0,
    5.9,
    "sobreposto",
    <CaixaTexto texto="Fundo bom + desconto = *oportunidade*" />,
  ),
  cena(
    "relatorio",
    P1,
    386.0,
    7.1,
    "cheio",
    <Atencao
      icone="i"
      titulo="Leia o *relatório gerencial*"
      texto="É nele que você acompanha os grandes números do fundo."
      cor={COR.azul}
    />,
  ),
  cena(
    "trxf11-compra",
    P1,
    409.0,
    6.5,
    "sobreposto",
    <CaixaTexto
      texto="Compra: *2 cotas* de TRXF11"
      apoio="Total de R$ 217,97"
      posicao="direita"
    />,
  ),
  cena(
    "trxf11-ok",
    P1,
    420.0,
    2.0,
    "sobreposto",
    <CaixaTexto texto="*TRXF11 comprado*" posicao="direita" />,
  ),
  // ── TIMS3 (tela) ────────────────────────────────────────
  cena(
    "selo-tims3",
    P1,
    437.3,
    7.0,
    "sobreposto",
    <SeloSecao
      numero="Compra 2 · Ação"
      titulo="TIMS3"
      subtitulo="TIM: a telecom que ficou de lado na alta da Bolsa"
    />,
  ),
  cena(
    "tims3-dy",
    P1,
    454.7,
    3.0,
    "tela",
    <Marcacao regiao={[1092, 322, 120, 66]} />,
  ),
  cena(
    "tims3-guidance",
    P1,
    459.0,
    10.0,
    "sobreposto",
    <CartaoLateral
      etiqueta="TIMS3 · Dividendos"
      titulo="O *guidance*"
      linhas={[
        { rotulo: "Dividend yield hoje", valor: 8.16, casas: 2, sufixo: "%" },
        {
          rotulo: "Expectativa (guidance)",
          valor: 12,
          sufixo: "%",
          cor: COR.verde,
          quando: 7.6,
        },
      ]}
      rodape="Segundo o relatório da empresa"
    />,
  ),
  cena(
    "tims3-divida",
    P1,
    472.6,
    2.8,
    "tela",
    <Marcacao regiao={[466, 602, 130, 46]} />,
  ),
  cena(
    "tims3-roic",
    P1,
    475.4,
    2.6,
    "tela",
    <Marcacao regiao={[798, 746, 112, 46]} />,
  ),
  cena(
    "tims3-pl",
    P1,
    478.0,
    1.6,
    "tela",
    <MarcaTexto regiao={[466, 404, 650, 42]} />,
  ),
  cena(
    "unifique",
    P1,
    482.3,
    9.0,
    "sobreposto",
    <CaixaTexto
      texto="Unifique: fechamento de capital com *OPA a R$ 6* por ação"
      apoio="Posição já vendida em outra carteira"
      cor={COR.azul}
    />,
  ),
  cena(
    "tims3-ficha",
    P1,
    494.6,
    9.5,
    "sobreposto",
    <CartaoLateral
      etiqueta="Ação · Telecom · Compra do mês"
      titulo="TIMS3"
      linhas={[
        { rotulo: "Cotação", valor: 18.03, casas: 2, prefixo: "R$ " },
        { rotulo: "Dividend yield", valor: 8.16, casas: 2, sufixo: "%" },
        { rotulo: "ROIC", valor: 30.27, casas: 2, sufixo: "%", cor: COR.verde },
        { rotulo: "P/L", valor: 21.68, casas: 2, cor: COR.amarelo },
      ]}
      rodape="Barata, com caixa líquido e guidance de *12%* em dividendos"
    />,
  ),
  // ── TIMS3 no Google Finanças (tela) e compra (celular) ──
  cena(
    "tims3-6m",
    P2,
    19.4,
    3.0,
    "tela",
    <Marcacao regiao={[512, 310, 200, 30]} />,
  ),
  cena(
    "tims3-18",
    P2,
    29.6,
    2.0,
    "tela",
    <Marcacao regiao={[406, 308, 104, 32]} />,
  ),
  cena(
    "tims3-oportunidade",
    P2,
    31.2,
    4.6,
    "sobreposto",
    <CaixaTexto texto="TIMS3 ficou para trás enquanto o mercado *subiu*" />,
  ),
  cena(
    "tims3-aporte",
    P2,
    40.6,
    5.2,
    "sobreposto",
    <CaixaTexto
      texto="Aporte: *R$ 300* em TIMS3"
      apoio="Pagadora de dividendos"
    />,
  ),
  cena(
    "tims3-compra",
    P2,
    68.5,
    4.0,
    "sobreposto",
    <CaixaTexto texto="Compra: *17 ações* de TIMS3" posicao="direita" />,
  ),
  cena(
    "tims3-ok",
    P2,
    72.6,
    3.6,
    "sobreposto",
    <CaixaTexto texto="*TIMS3 comprada*" posicao="direita" />,
  ),
  // ── VULC3 ───────────────────────────────────────────────
  cena(
    "titulo-vulc3",
    P2,
    85.1,
    6.2,
    "cheio",
    <TituloSecao
      numero="Compra 3 · Ação"
      titulo="*VULC3*"
      subtitulo="Vulcabras: uma das varejistas mais baratas do país"
      corDestaque={COR.verde}
    />,
  ),
  cena(
    "vulc3-pl",
    P2,
    99.0,
    3.6,
    "tela",
    <Marcacao regiao={[632, 458, 92, 46]} />,
  ),
  cena(
    "peter-lynch",
    P2,
    109.4,
    9.5,
    "cheio",
    <Atencao
      icone="“"
      titulo="Peter Lynch: *conheça o produto*"
      texto="Se você quer entender bem uma empresa, *consuma o produto* dela."
      cor={COR.azul}
    />,
  ),
  cena(
    "vulc3-marcas",
    P2,
    121.0,
    13.0,
    "sobreposto",
    <CartaoLateral
      etiqueta="VULC3 · Vulcabras"
      titulo="Fabrica no *Brasil*"
      linhas={[
        { rotulo: "Olympikus", texto: "corrida", cor: COR.verde, quando: 4.3 },
        { rotulo: "Mizuno", texto: "produção local", quando: 11.2 },
        { rotulo: "Under Armour", texto: "produção local", quando: 12.5 },
      ]}
      rodape="Grande parte da *produção de calçados* do país"
    />,
  ),
  cena(
    "vulc3-juros",
    P2,
    139.0,
    3.0,
    "sobreposto",
    <CaixaTexto texto="Juros caindo → *varejo* tende a subir" />,
  ),
  cena(
    "vulc3-roe",
    P2,
    143.1,
    3.6,
    "tela",
    <Marcacao regiao={[798, 748, 112, 46]} />,
  ),
  cena(
    "vulc3-margem",
    P2,
    147.0,
    2.2,
    "tela",
    <Marcacao regiao={[632, 802, 112, 46]} />,
  ),
  cena(
    "vulc3-divida",
    P2,
    149.3,
    3.6,
    "tela",
    <MarcaTexto regiao={[466, 660, 980, 42]} />,
  ),
  cena(
    "vulc3-max",
    P2,
    159.0,
    1.5,
    "tela",
    <Marcacao regiao={[914, 364, 108, 82]} />,
  ),
  cena(
    "vulc3-min",
    P2,
    160.6,
    1.8,
    "tela",
    <Marcacao regiao={[716, 364, 108, 82]} />,
  ),
  cena(
    "vulc3-hoje",
    P2,
    162.5,
    3.6,
    "tela",
    <Marcacao regiao={[470, 362, 196, 88]} />,
  ),
  cena(
    "vulc3-ficha",
    P2,
    166.2,
    7.6,
    "cheio",
    <CartaoAtivo
      etiqueta="Ação · Varejo"
      ticker="VULC3"
      nome="Vulcabras"
      corDestaque={COR.verde}
      metricas={[
        {
          rotulo: "P/L",
          valor: 5.63,
          casas: 2,
          nota: "barata para uma varejista",
        },
        { rotulo: "ROE", valor: 35.06, casas: 2, sufixo: "%", cor: COR.verde },
        {
          rotulo: "Margem líquida",
          valor: 24.89,
          casas: 2,
          sufixo: "%",
          cor: COR.verde,
        },
        {
          rotulo: "Aporte",
          valor: 300,
          prefixo: "R$ ",
          cor: COR.azulClaro,
          quando: 5.8,
        },
      ]}
    />,
  ),
  cena(
    "vulc3-compra",
    P2,
    185.6,
    5.0,
    "sobreposto",
    <CaixaTexto texto="Compra: *~18 ações* de VULC3" posicao="direita" />,
  ),
  cena(
    "vulc3-ok",
    P2,
    191.0,
    4.4,
    "sobreposto",
    <CaixaTexto texto="*VULC3 comprada*" posicao="direita" />,
  ),
  cena(
    "aporte-parcial",
    P2,
    195.7,
    7.4,
    "sobreposto",
    <CartaoLateral
      etiqueta="Aporte do mês"
      titulo="Até aqui: *R$ 800*"
      topo={170}
      linhas={[
        { rotulo: "TRXF11", valor: 200, prefixo: "R$ ", quando: 0.6 },
        { rotulo: "TIMS3", valor: 300, prefixo: "R$ ", quando: 1.5 },
        { rotulo: "VULC3", valor: 300, prefixo: "R$ ", quando: 2.4 },
        {
          rotulo: "Falta investir",
          valor: 200,
          prefixo: "R$ ",
          cor: COR.azulClaro,
          quando: 4.4,
        },
      ]}
    />,
  ),
  // ── Banco Inter (câmera) ────────────────────────────────
  cena(
    "titulo-inter",
    P2,
    203.4,
    5.7,
    "cheio",
    <TituloSecao
      numero="Compra 4 · BDR"
      titulo="*Banco Inter*"
      subtitulo="Um dos bancos digitais que mais crescem no país"
      corDestaque={COR.verde}
    />,
  ),
  cena(
    "inter-tese",
    P2,
    209.2,
    22.0,
    "sobreposto",
    <CartaoLateral
      etiqueta="Banco Inter"
      titulo="A *tese*"
      topo={150}
      linhas={[
        {
          rotulo: "Inadimplência",
          texto: "pode cair",
          cor: COR.verde,
          quando: 0.3,
        },
        {
          rotulo: "ROE",
          texto: "tende a crescer",
          cor: COR.verde,
          quando: 8.1,
        },
        { rotulo: "Resultados", texto: "tri após tri", quando: 13.8 },
        {
          rotulo: "2º tri/2026",
          texto: "recorde",
          cor: COR.verde,
          quando: 17.4,
        },
      ]}
    />,
  ),
  cena(
    "inter-video",
    P2,
    231.7,
    4.3,
    "sobreposto",
    <CaixaTexto texto="Vídeo no canal: *Banco Inter*" cor={COR.azul} />,
  ),
  cena(
    "inter-codigo",
    P2,
    249.0,
    9.5,
    "cheio",
    <Comparacao
      rotulo="Atenção ao código"
      titulo="O BDR do Inter *vai mudar de código*"
      colunas={[
        {
          topo: "Na compra de hoje",
          titulo: "INBR32",
          linhas: ["BDR atual"],
          cor: COR.amarelo,
        },
        {
          topo: "Depois da mudança",
          titulo: "INBR34",
          linhas: ["Novo BDR não patrocinado"],
          cor: COR.verde,
          quando: 4.1,
        },
      ]}
      conclusao="Se você comprar antes, *peça a troca do código* na sua corretora."
    />,
  ),
  cena(
    "o-que-e-bdr",
    P2,
    263.4,
    15.0,
    "cheio",
    <ListaNumerada
      rotulo="Brazilian Depositary Receipt"
      titulo="O que é um *BDR*?"
      itens={[
        { titulo: "A ação é negociada *nos Estados Unidos*", quando: 3.3 },
        { titulo: "Na B3, você compra um *recibo* dessa ação", quando: 11.1 },
        {
          titulo: "Exposição *indireta* ao Banco Inter, em reais",
          quando: 11.8,
        },
      ]}
    />,
  ),
  cena(
    "inter-busca",
    P2,
    285.2,
    5.6,
    "sobreposto",
    <CaixaTexto texto="Busque o BDR *INBR32*" posicao="direita" />,
  ),
  cena(
    "inter-200",
    P2,
    296.1,
    3.8,
    "sobreposto",
    <CaixaTexto texto="Sobrou *R$ 200* para o Banco Inter" posicao="direita" />,
  ),
  cena(
    "inter-compra",
    P2,
    303.5,
    4.3,
    "sobreposto",
    <CaixaTexto texto="Compra: *5 BDRs* de INBR32" posicao="direita" />,
  ),
  cena(
    "inter-ok",
    P2,
    310.8,
    3.2,
    "sobreposto",
    <CaixaTexto texto="*Banco Inter comprado*" posicao="direita" />,
  ),
  // ── Fechamento (câmera) ─────────────────────────────────
  cena(
    "aporte-final",
    P2,
    314.4,
    10.0,
    "cheio",
    <Barras
      rotulo="Aporte do mês concluído"
      titulo="*R$ 1.000* investidos"
      maximo={300}
      barras={[
        { rotulo: "TIMS3 · TIM", valor: 300, texto: "R$ 300", cor: COR.verde },
        {
          rotulo: "VULC3 · Vulcabras",
          valor: 300,
          texto: "R$ 300",
          cor: COR.verde,
        },
        {
          rotulo: "TRXF11 · fundo imobiliário",
          valor: 200,
          texto: "R$ 200",
          cor: COR.verde,
        },
        {
          rotulo: "INBR32 · Banco Inter (BDR)",
          valor: 200,
          texto: "R$ 200",
          cor: COR.azul,
        },
      ]}
      nota="Todos pagam dividendos — o Inter paga pouco: a aposta é na *valorização*."
    />,
  ),
  cena(
    "sem-renda-fixa",
    P2,
    336.3,
    8.2,
    "cheio",
    <GradeMetricas
      rotulo="E a renda fixa?"
      titulo="Os juros futuros *derreteram*"
      metricas={[
        { rotulo: "DI 2032 · semana passada", valor: 14, sufixo: "%" },
        {
          rotulo: "DI 2032 · hoje",
          valor: 12,
          sufixo: "%",
          cor: COR.amarelo,
          quando: 5.6,
        },
      ]}
      rodape="Por isso, sem renda fixa neste aporte"
    />,
  ),
  cena(
    "momento-ideal",
    P2,
    366.7,
    4.9,
    "sobreposto",
    <CaixaTexto texto="Momento ideal = comprar empresas *baratas*" />,
  ),
  cena(
    "btg-50",
    P2,
    371.7,
    4.6,
    "sobreposto",
    <CaixaTexto texto="BPAC11: *+50%* em um mês" />,
  ),
  cena(
    "value-investing",
    P2,
    376.6,
    8.5,
    "cheio",
    <Comparacao
      rotulo="Value Investing"
      titulo="*Preço* x *valor*"
      colunas={[
        {
          topo: "Preço",
          titulo: "O que você paga",
          linhas: ["Cotação na Bolsa hoje"],
          cor: COR.amarelo,
        },
        {
          topo: "Valor",
          titulo: "O que você leva",
          linhas: ["Lucros, dividendos e crescimento"],
          cor: COR.verde,
          quando: 3.0,
        },
      ]}
      conclusao="Levar *muito valor* pagando *pouco preço*."
    />,
  ),
  cena(
    "anote-value",
    P2,
    413.5,
    8.7,
    "sobreposto",
    <CaixaTexto
      texto="Anote: *Value Investing*"
      apoio="Empresas baratas que o mercado ainda não está olhando"
    />,
  ),
  cena(
    "inscreva",
    P2,
    423.3,
    3.3,
    "sobreposto",
    <CaixaTexto texto="*Inscreva-se* e deixe seu like" cor={COR.vermelho} />,
  ),
  cena(
    "comente",
    P2,
    426.7,
    7.4,
    "sobreposto",
    <CaixaTexto
      texto="Qual ação deveria entrar na *carteira pública*?"
      apoio="Deixe nos comentários"
    />,
  ),
];

export const zooms: ZoomTela[] = [
  // Celular: aproxima a parte de cima ou de baixo da tela do app.
  zoom(P1, 104.0, 8.0, [0, 60, 900, 506], 1.5),
  zoom(P1, 117.0, 9.0, [0, 60, 900, 506], 1.5),
  zoom(P1, 130.0, 6.8, [0, 60, 900, 506], 1.5),
  zoom(P1, 180.0, 7.0, [0, 520, 900, 506], 1.5),
  zoom(P1, 189.5, 17.0, [0, 60, 900, 506], 1.5),
  zoom(P1, 404.0, 5.0, [0, 520, 900, 506], 1.5),
  zoom(P2, 42.6, 12.0, [0, 60, 900, 506], 1.5),
  zoom(P2, 63.0, 8.0, [0, 520, 900, 506], 1.5),
  zoom(P2, 182.0, 8.0, [0, 520, 900, 506], 1.5),
  zoom(P2, 300.5, 9.0, [0, 520, 900, 506], 1.5),
  // Sites: aproxima os números que estão sendo comentados.
  zoom(P1, 313.8, 9.0, [440, 200, 1040, 200], 1.6),
  zoom(P1, 450.8, 6.8, [540, 200, 860, 240], 1.6),
  zoom(P1, 470.0, 10.0, [440, 330, 1040, 480], 1.5),
  zoom(P2, 18.6, 12.4, [400, 230, 820, 420], 1.6),
  zoom(P2, 98.6, 4.2, [440, 400, 1040, 480], 1.5),
  zoom(P2, 102.9, 4.0, [595, 130, 750, 450], 1.6),
  zoom(P2, 142.6, 10.5, [440, 400, 1040, 480], 1.5),
  zoom(P2, 158.6, 7.5, [460, 340, 1000, 120], 1.6),
];
