---
name: reels-b-roll
description: Reels em TELA DIVIDIDA — a pessoa falando embaixo, inserts em cima (prints das fontes com marca-texto, fotos, motion de datas/números/diagramas) sincronizados palavra por palavra com a fala, legenda na costura e capa com o tema em destaque. Pega um vídeo EDITADO ou TOTALMENTE CRU (corta pausas, acelera, estabiliza, trata cor e áudio, faz punch-ins). Guarda o PERFIL de cada pessoa (cor da capa, legenda, ritmo, câmera) e não pergunta de novo. Use quando alguém trouxer um vídeo de si mesmo falando e pedir "b-roll", "inserts", "coloca as fontes no vídeo", "estilo do Ramiro", "tela dividida", "edita esse vídeo cru", "deixa mais cinematográfico" ou "faz a capa do reels". NÃO é o reels do Ser Finito da Jo (esse é /reels-ser-finito).
---

# /reels-b-roll — tela dividida com fontes, do vídeo cru ao reels pronto

**O que é:** a pessoa grava falando; a skill descobre do que ela fala, prova o que ela
diz com fontes reais e monta o reels com os inserts entrando na palavra exata. Quem
grava só grava e aprova; a máquina faz o resto.

**A régua:** o tempo de QUEM GRAVA, não o da máquina. Meta: ~20 min de mão na massa
por vídeo (gravar + aprovar + conferir). A máquina leva ~25–40 min por vídeo de ~50s.

**⚖️ A LEI:** a checagem (Etapa 3) é o valor. Um insert com dado errado queima a
autoridade de quem fala — pior que vídeo sem insert. Nunca apressar a checagem pra
chegar no render.

**🚫 NUNCA DESDIZER QUEM FALA.** Se a fala tem imprecisão, o insert NÃO corrige na
cara da pessoa: mostra algo neutro que não contradiz nem erra (ex.: ela diz
"Congresso", quem decide é o Senado → foto do Congresso com "Divulgação até 15/12",
sem nomear a casa). Erro de verdade vai pro usuário no chat, nunca pro vídeo.

**As etapas são 9.** As com ⛔ GATE terminam em: apresentar, esperar o OK, só então
avançar. O usuário pode entrar em qualquer etapa.

---

## Etapa 0 — Ambiente (uma vez por máquina)
- `ffmpeg` no PATH (build "full": `vidstab`, `afftdn`, `loudnorm`).
- Python 3 + `pip install faster-whisper pillow numpy`.
- Chrome ou Edge (prints de fonte).
- Pasta da casa: `~/reels-b-roll/` com `perfis/` e uma pasta por pessoa.

## Etapa 1 — Perfil (memória da pessoa) ⛔ GATE só na primeira vez
**Onde:** `~/reels-b-roll/perfis/<nome-sobrenome>.json` — FORA da skill, pra atualizar
ou redistribuir a skill nunca apagar nem espalhar o perfil de ninguém. Modelo:
`assets/perfil.modelo.json`.

- **Perfil existe →** ler e seguir. Não perguntar de novo nada que está nele.
  Mais de um perfil na máquina → perguntar só "de quem é esse vídeo?".
- **Perfil não existe →** criar, perguntando SÓ o que não dá pra descobrir:
  1. nome, @ e o que a pessoa faz (uma linha);
  2. **cor da capa** = cor da marca. Tentar achar sozinho antes (site, Instagram);
     sem marca definida, mostrar 3–4 opções sóbrias do setor em capas de teste e
     deixar escolher. É a mesma cor em TODAS as capas (grid reconhecível);
  3. estilo da legenda (padrão: caixa alta, palavra da vez numa caixa preta).
  O resto se mede no primeiro vídeo e se grava sozinho: `camera` (resolução, recorte
  do rosto, centro do rosto, se o vídeo vem com legenda queimada), `ritmo` (padrão
  1,25x; se a pessoa já edita, medir a velocidade que ela usa comparando uma frase do
  bruto com a do editado) e `legenda.correcoes` (palavras que o Whisper erra na fala
  dela — nomes, jargão).
- **Ao fim de cada vídeo (Etapa 9):** acrescentar em `historico` (data, tema, título
  da capa, pasta) e em `fontes_confiaveis` o que funcionou. O histórico evita repetir
  tema e título.

## Etapa 2 — Entender o vídeo
Pasta do vídeo: `~/reels-b-roll/<pessoa>/<AAAA-MM-DD>-<tema>/`.
1. `ffprobe`: duração, resolução, rotação. **Vídeo de WhatsApp vem 576×1024, frame
   rate variável e com rotação −90** — o ffmpeg desvira sozinho; avisar que a
   resolução baixa deixa o rosto mais suave (pedir o arquivo original se der).
2. `python scripts/transcrever.py <video> transcricao.json` (modelo `small`).
3. Folha de frames (`ffmpeg ... tile`): enquadramento, legenda JÁ QUEIMADA (a de 2
   linhas sobe mais que a de 1 — medir com um frame de 2 linhas), luz, tremido.
   Diferente do `perfil.camera`? Usar o do vídeo e avisar. **Vídeo já editado:** olhar
   o fim com atenção — é comum virar tela cheia no CTA (vira um `recortes` no projeto).
4. Dizer em 3 linhas do que a pessoa fala. Se for o bruto de algo já feito,
   reaproveitar checagem e roteiro (as âncoras são palavras: o roteiro vale pros dois).

## Etapa 3 — Checar cada afirmação ⛔ GATE
Tabela: tempo · o que a pessoa diz · veredito (✅ / ⚠️ impreciso / ❌ errado) · fonte com
link. Fonte primária sempre que existir (diário oficial, órgão, lei, estudo);
imprensa como apoio. Começar pelas `fontes_confiaveis` do perfil. Número que vai pra
tela = conferido em duas fontes. ⚠️/❌ → insert que não desdiz (regra acima).
Salvar como `checagem.md` na pasta do vídeo.

## Etapa 4 — Inserts complementares (mesmo GATE da Etapa 3)
Nem todo trecho tem documento. Cardápio:
1. **Print da fonte** com marca-texto no trecho que a pessoa fala.
2. **Motion com dado**: calendário (prazo), riscado → novo prazo, contador, "A × B"
   em duas colunas, linha do tempo, diagrama de "o que sai de onde", quadrados de dias.
3. **B-roll em vídeo** (o que dá ritmo de reels): nos trechos de narrativa sem dado
   ("o mercado mudou", "sobrou fábrica querendo vender"). Alternar com os inserts de
   dado — nunca dois trechos seguidos de painel escuro nem de b-roll sem texto longo.
4. **Dado que a pessoa não citou mas reforça** (com fonte).
5. **Foto de arquivo** com licença livre (Wikimedia Commons, agências públicas — CC BY /
   BY-SA: autor e licença na etiqueta). Serve de fundo ou de cartão (produto, carro, prédio).
6. **O fecho de impacto**: a consequência dita de passagem vira o último insert.
Não usar: estimativa que compete com o recado; banco de imagem com texto em outro
idioma. Apresentar o mapa segundo a segundo e pedir OK + **autorização pra baixar
imagens**.

## Etapa 5 — Assets
- Prints: `python scripts/capturar.py <url> <saida.png>` (Chrome headless em perfil
  temporário, com teto de tempo). Recortar e **conferir as coordenadas do marca-texto
  numa grade** antes do render (a quebra de linha do site nunca é a esperada).
- Página branca/preta = site bloqueia robô → outra fonte, ou cartão com o dado e o crédito.
- Botão flutuante (WhatsApp) cobrindo o texto → capturar com janela mais alta.
- Aviso de cookies escurecendo → outra captura; nunca editar o conteúdo do print.
- B-roll em vídeo: Pexels (como baixar em `references/roteiro.md`). Folha de conferência
  de todos os clipes antes de montar; descartar o que destoa.

## Etapa 6 — Corte e acabamento (só se o vídeo for CRU)
`python scripts/cortar.py <bruto> transcricao.json <pasta> <perfil.json>`
Tira as pausas ≥0,3s, estabiliza, trata cor (contraste, pele quente, sombra fria),
limpa o áudio (ruído, compressão, −14 LUFS) e acelera no `ritmo` do perfil mantendo
o tom. Cortes no limite do frame (áudio e imagem não desencontram).
Gera `base.mkv` + `edl.json`.

## Etapa 7 — Roteiro e render ⛔ GATE no preview
1. `roteiro.json` (formato em `references/roteiro.md`). **Âncoras são FRASES da
   transcrição** ("15 de outubro"), não segundos. Usar a grafia da transcrição.
2. `projeto.json`: `"perfil"` + vídeo + transcrição + roteiro (+ `base`/`edl`/`zoom` se
   passou pela Etapa 6). Cor de destaque, legenda, correções e recorte vêm do perfil;
   só pôr no projeto o que for diferente NESTE vídeo. **Gancho de abertura:** a frase
   da capa, digitada no bloco da cor da capa, até a primeira frase depois do gancho
   falado (`"gancho": {"texto": ..., "ate": ...}`).
   **Layout fixo 50/50:** a legenda fica no centro do quadro, como o título da capa.
3. `python scripts/montar.py projeto.json preview` → 1 frame por insert. Conferir
   marca-texto no lugar, nada cortado, legenda antiga do vídeo não aparecendo.
4. `python scripts/montar.py projeto.json` → render.
5. Conferir: duração, `ebur128` (≈ −14 LUFS), frames nos momentos-chave. **Sincronia de
   boca depois de corte só o olho humano confirma — pedir pra assistir.**

## Etapa 8 — Capa ⛔ GATE
1. Folha de candidatos do rosto (boca fechada, olhando pra câmera).
2. `python scripts/capa.py <perfil.json> <foto_topo> <video_ou_base> <segundo> "<título>" capa.png`
3. **Padrão fixo, não muda por vídeo:** o título fica no CENTRO do grid do perfil
   (corte 3:4, y=960 num quadro de 1920). O rosto é posicionado pra olhos e boca
   caírem dentro do grid. A cor vem do perfil. Mostrar `capa_grid.jpg` (como aparece
   no perfil) junto com a capa.
4. Título: frase curta e provocativa, não o assunto; até 2 linhas, nunca quebra em
   número. Conferir no `historico` pra não repetir.

## Etapa 9 — Entrega e memória
Vídeo + capa na pasta do vídeo. Atualizar o perfil (historico, fontes, correções
novas). Lembrar a regra que protege quem é perfeccionista: **assiste uma vez, pede no
máximo um ajuste, publica.**

---

## Armadilhas conhecidas
| Sintoma | Causa | Saída |
|---|---|---|
| Whisper `mkl_malloc: failed to allocate` | modelo `medium` grande demais | `small` |
| `open() got an unexpected keyword 'metadata_errors'` | PyAV incompatível | o script já decodifica pelo ffmpeg |
| Chrome headless não termina | site com anúncio segura o carregamento | `capturar.py` tem teto de tempo |
| Legenda antiga aparecendo na borda | legenda de 2 linhas sobe | medir com frame de 2 linhas e recortar acima |
| Marca-texto deslocado | coordenada estimada | grade de coordenadas sobre o recorte |
| Palavra errada na legenda | Whisper | `legenda.correcoes` no perfil (vale pra sempre) |
| `ÂNCORA NÃO ENCONTRADA` | frase do roteiro ≠ grafia da transcrição | copiar a grafia; frase repetida → a busca começa no início do insert |
| `Recorte ... não cabe no vídeo` | vídeo com resolução diferente do perfil | medir de novo e passar o recorte no projeto |

## O que ainda NÃO faz
- Não detecta **take repetido** nem gaguejada longa (corta pausa, não frase dita duas
  vezes). Vídeo com vários takes: escolher o take antes.
- Não tem trilha nem efeito sonoro.
