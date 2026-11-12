# Formato do roteiro (`roteiro.json`) e do projeto (`projeto.json`)

Exemplo completo: `exemplos/ramiro-carros-chineses/` (113s, 21 inserts, b-roll em
vídeo, gancho, troca de layout no fim). O motor também foi validado renderizando o
MESMO roteiro num vídeo editado e no bruto dele cortado: as âncoras são palavras,
então o roteiro sobrevive ao corte.

## Geometria (padrão fixo: 50/50)
- Quadro 1080×1920. **Topo (inserts): 1080×960. Base (pessoa): 1080×960.** A costura e
  a legenda ficam em y=960, o centro do quadro (igual ao título da capa no grid).
- A legenda cobre ~y 916–1000: **conteúdo do topo entre y 40 e 890.**
- y=52 é reservado pra etiqueta de fonte/crédito.
- Centro horizontal: x=540. Duas colunas: x=290 e x=790.

## Tempo: âncoras, nunca segundos soltos
Todo campo `em` ou terminado em `_em` aceita:
- **frase** (string): o instante em que essa frase começa, buscada a partir do início
  do insert. `"15 de outubro"`. Maiúscula, acento e pontuação não importam; a grafia
  das palavras sim (usar a da transcrição, ou a corrigida em `legenda.correcoes`).
- **número**: segundos depois do início do insert. `0.3`.
- **frase com ajuste**: `{"frase": "prorrogado", "ajuste": 0.3}`.

O início de cada insert (`de`) é uma âncora buscada a partir do insert anterior; o
primeiro usa `0`. O insert dura até o próximo começar.

## Um insert
```json
{"de": "esse prazo inicialmente",
 "fonte": "FONTE · CONTÁBEIS · 29/09/2026",            // etiqueta no topo (opcional)
 "video": {"arquivo": "broll/fabrica.mp4", "inicio": 2, "sombra": false,
           "credito": "..."},                         // b-roll em vídeo no fundo (opcional)
 "foto":  {"imagem": "assets/foto.jpg", "zoom": [1.02, 1.14], "pan": [0.02, -0.01],
           "credito": "FOTO: AGÊNCIA SENADO · CC BY 2.0"},   // fundo com zoom lento (opcional)
 "cards": [ ... ],                                    // prints de fonte / fotos em cartão (opcional)
 "elementos": [ ... ]}                                // motion por cima (opcional)
```
Sem `video` nem `foto`, o fundo é o painel escuro padrão.

## B-roll em vídeo
- `inicio` = segundo do clipe onde começa. O clipe preenche 1080×960 (corta as bordas) e
  **dá a volta** se for mais curto que o trecho — mas loop aparece: escolher clipe ≥ trecho.
- `sombra: true` escurece o fundo quando vai texto/pill por cima.
- Fonte: **Pexels** (licença livre, sem crédito obrigatório). Download direto:
  `https://www.pexels.com/download/video/<ID>/?h=720&w=1280` (paisagem) ou
  `?h=1280&w=720` (retrato) — o que não existir volta vazio: tentar o outro. Baixar um
  por vez (em paralelo o site devolve vazio). Achar IDs: busca web restrita a pexels.com.
- Conferir cada clipe numa folha (2 frames, já no corte 1080×960) antes de usar:
  sem marca/texto que destoe (carro esportivo num vídeo de popular, dólar num vídeo
  de Brasil, placa em inglês). Preferir clipe filmado no país do assunto.

## Cards (prints de fonte)
```json
{"imagem": "assets/print.png", "recorte": [x0,y0,x1,y1], "largura": 940, "x": 540, "y": 470,
 "em": 0, "zoom": 0.04,
 "marcas": [{"caixa": [x0,y0,x1,y1], "em": "15 de outubro"}]}
```
- `recorte` e `caixa` em pixels da imagem original (a caixa é relativa ao recorte).
- O marca-texto varre da esquerda pra direita em 0,5s a partir do `em`.
- Dois cards empilhados (título do documento + trecho) funcionam bem: y 190 e y 540.

## Elementos
Cores aceitas: `acento` (padrão do projeto), `vermelho`, `branco`, `escuro`, `suave`,
`cinza`, `painel` ou `#hex`. Animação `anim`: `pop` (padrão) ou `up`.

| `el` | campos | uso |
|---|---|---|
| `pill` | texto, y, x, tam(30), cor, cor_texto | rótulo, carimbo ("PRAZO ANTECIPADO") |
| `texto` | texto (\n quebra), y, x, tam(40), peso(800), cor, contorno, pulsar | título, frase, "?" |
| `calendario` | dia, mes, y, x, largura(320), cor, pulsar_em, riscar_em, legenda | prazo; riscado → apaga |
| `seta` | de [x,y], ate [x,y], cor | "virou" |
| `numero` | valor, y, tam(150), duracao(1.5), prefixo, sufixo | contador com milhar |
| `chips` | caixa{titulo,ret,em,brilho_em}, alvo{titulo,ret,em}, itens[{txt,x,y,quente,quente_em,pulsar_em,mover_em,para}], em, passo | "o que sai de onde" |
| `linha_tempo` | y, x0, x1, pontos[{x,data,legenda,cor,em}], barra{de_x,ate_x,em,ate_em} | calendário da decisão |
| `dias` | dias[..], y, x0, tamanho, gap, marcar[{i,cor,em,legenda}], preencher{de_i,em,passo,cor}, legenda_final{i,texto,cor,em} | contagem de dias |

Tamanhos que funcionaram: título de foto 100 peso 900 com contorno 3; número 150;
fecho ("5 DIAS") 190; legendas de apoio 28–40.

## Projeto
```json
{
  "perfil": "C:/Users/<voce>/reels-b-roll/perfis/<pessoa>.json",   // dá cor, legenda, correções, recorte
  "video": "C:/.../bruto_ou_editado.mp4",
  "transcricao": "transcricao.json",
  "saida": "reels_final.mp4",
  "inserts": "roteiro.json",                        // ou a lista direto aqui
  "layout": {"vinheta": true,                       // recorte/rosto só se diferente do perfil:
                                                    //   "recorte": "w:h:x:y", "rosto": [x, y] (o motor ajusta a proporção)
             "recortes": [{"de": "são muitas perguntas", "recorte": "720:640:0:40", "rosto": [360, 290]}]},
                                                    // troca o recorte a partir de uma frase (vídeo editado que muda de layout)
  "gancho": {"texto": "a frase da capa", "ate": "e tem motivo"},   // bloco na cor da capa, digitado, no centro;
                                                    // a legenda some enquanto ele está na tela
  "legenda": {"correcoes": {"palavra_so_deste_video": "certa"}},   // soma às do perfil
  // só se passou pelo cortar.py:
  "base": "base.mkv", "edl": "edl.json",
  "zoom": {"alternar": 0.15, "empurrao": 0.04,
           "enfase": [{"em": "cbs", "zoom": 0.10}, {"em": "pouco tempo", "zoom": 0.18}]}
}
```
- **Recorte:** qualquer proporção — o motor ajusta pra 1080:960 em volta do `rosto` e
  arredonda pra número par. Terminar ACIMA da legenda queimada do vídeo (medir com um
  frame de legenda em 2 linhas). Vídeo editado que muda de layout (ex.: vira tela
  cheia no CTA): achar o segundo da troca numa tira de frames e declarar em `recortes`.
- **Correção que apaga palavra:** `"ID": ""` tira a palavra da legenda (ex.: "Bio ID" →
  "BYD") sem mexer nas âncoras.
- **Zoom:** a cada plano do corte alterna aberto/fechado (disfarça o jump cut) +
  empurrão lento; `enfase` dá um zoom rápido numa palavra e segura até o próximo corte.
  Máximo 2 ênfases por vídeo, senão perde o efeito.
