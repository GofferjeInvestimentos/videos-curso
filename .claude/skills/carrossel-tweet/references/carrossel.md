# Formato do `carrossel.json` e referência visual

Exemplo completo: `exemplos/ramiro-azul/` (recriação do carrossel do Ramiro sobre a Azul,
Instagram Dd2VTcRDzav — o slide 1 renderizado bate linha a linha com o original).

## carrossel.json
```json
{
  "perfil": "C:/Users/<voce>/carrossel-tweet/perfis/<pessoa>.json",
  "saida": "slides",
  "fundo": "preto",                         // opcional: sobrescreve o do perfil SÓ neste carrossel
  "slides": [
    {"texto": "Primeiro parágrafo.\n\nSegundo, com **negrito** ou CAIXA ALTA.",
     "imagem": "assets/print.png",          // obrigatória no slide 1; recomendada na maioria
     "recorte": [0, 0, 1080, 760],          // opcional: pedaço do print (pixels da imagem original)
     "marcas": [{"caixa": [570, 282, 918, 340], "cor": "amarelo"}],   // marca-texto (amarelo|vermelho|verde), relativo ao recorte
     "legenda": "Fonte: Contábeis, 29/09/2026"},                     // opcional, em cinza abaixo da imagem
    {"texto": "Slide só de texto também vale."}
  ]
}
```
- `texto`: parágrafos separados por linha em branco (`\n\n`); `\n` simples quebra a linha.
  `**assim**` vira negrito (na cor do nome).
- Caminhos relativos são relativos ao `carrossel.json` (a foto do perfil, ao arquivo do perfil).

## Perfil (`~/carrossel-tweet/perfis/<pessoa>.json`)
```json
{"nome": "Ramiro Gomes Ferreira", "nome_exibicao": "Ramiro Gomes Ferreira, CFP®",
 "instagram": "@ramirogomesferreira", "foto": "ramiro_foto.png", "foto_recorte": null,
 "fundo": "preto", "verificado": true, "cta_padrao": "Comenta PALAVRA e o time...",
 "fontes_confiaveis": [], "historico": []}
```

## Geometria (medida no carrossel do Ramiro — não mudar sem motivo)
- Slide 1080×1350 (4:5). Margem lateral 64px. Bloco (cabeçalho + texto + imagem)
  centralizado na vertical.
- Cabeçalho: avatar redondo 128px · nome 44px negrito · selo 40px · @ 42px cinza.
- Texto: Inter 52px, entrelinha 1,15, um parágrafo = uma linha em branco. Se não couber,
  a imagem encolhe primeiro (até 260px de altura) e depois a fonte (até 40px).
- Imagem: largura da coluna de texto, cantos 14px, borda sutil.

| | preto | branco |
|---|---|---|
| fundo | #000000 | #FFFFFF |
| nome e negrito | #FFFFFF | #0F1419 |
| texto | #E7E9EA | #0F1419 |
| @ e legenda | #71767B | #536471 |
