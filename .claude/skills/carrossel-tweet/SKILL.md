---
name: carrossel-tweet
description: Carrossel de Instagram em FORMATO DE TWEET (1080x1350) — cada slide com o cabeçalho de perfil (foto redonda, nome, @, selo só se a conta for verificada), texto em parágrafos curtos e, na maioria dos slides, o print da fonte que embasa o que está sendo dito. Fundo preto ou branco. Guarda o PERFIL de cada pessoa (foto, fundo, nome, @) e não pergunta de novo. Use quando alguém pedir "carrossel tweet", "post estilo tweet", "carrossel estilo Ramiro", "print de tweet", "fio em carrossel" ou trouxer uma notícia/tema pra virar carrossel nesse formato. NÃO é o carrossel do toHook/OPEREX da Jo nem o JO NOTES.
---

# /carrossel-tweet — o tweet que vira carrossel, com a fonte no slide

**O que é:** um fio de tweet quebrado em slides. A voz é de quem posta (1ª pessoa, conversa),
e cada afirmação importante vem com a PROVA na tela: o print da notícia, do documento, do post.
É o formato do Ramiro (Clube do Valor) — referência em `references/carrossel.md`.

**As 4 regras do formato (não mudam):**
1. **A foto do perfil é pedida à pessoa** (arquivo). Não baixar do Instagram.
2. **Fundo branco ou preto** — perguntar; os dois temas estão prontos.
3. **Nome e @ do Instagram** vão no cabeçalho de TODOS os slides — perguntar como a pessoa
   quer que o nome apareça (ex.: "Ramiro Gomes Ferreira, CFP®").
4. **É carrossel, não imagem única.** O **slide 1 SEMPRE tem texto + a imagem da fonte** que
   embasa o conteúdo (o motor recusa sem ela). Os outros podem ter ou não — mas **a maioria
   deve ter** (o motor avisa abaixo de 60%).

**Selo de verificado:** só se a conta for verificada de verdade. Perguntar. Selo em conta
não verificada é fingir uma verificação — não fazer.

**⚖️ A LEI:** o texto afirma, a imagem prova. Dado sem fonte não entra. Número na tela
conferido em duas fontes. Se a fonte diz outra coisa, o texto muda — nunca o contrário.

**As etapas são 6.** As com ⛔ GATE terminam em: apresentar, esperar o OK, só então avançar.

---

## Etapa 0 — Ambiente (uma vez por máquina)
- Python 3 + `pip install pillow`.
- Chrome ou Edge instalado (é ele que "fotografa" cada slide e os prints de fonte).
- Pasta da casa: `~/carrossel-tweet/` com `perfis/` e uma pasta por carrossel.

## Etapa 1 — Perfil ⛔ GATE só na primeira vez
**Onde:** `~/carrossel-tweet/perfis/<nome-sobrenome>.json` + a foto na mesma pasta.
Modelo: `assets/perfil.modelo.json`.
- **Existe →** confirmar em UMA linha ("mesmo perfil: fundo preto, @fulano, sem selo?") e seguir.
- **Não existe →** perguntar, nesta ordem:
  1. **a foto do perfil** (arquivo quadrado de preferência; se vier retangular, o motor
     recorta o centro — ou gravar `foto_recorte` [x0,y0,x1,y1]);
  2. **fundo branco ou preto**;
  3. **o nome como deve aparecer** e **o @ do Instagram**;
  4. **a conta é verificada?** (selo azul só se sim);
  5. o CTA padrão do último slide, se a pessoa tiver um ("Comenta PALAVRA e...").
- Ao fim de cada carrossel (Etapa 6): acrescentar em `historico` (data, tema, pasta) e em
  `fontes_confiaveis` o que funcionou. O histórico evita repetir tema e gancho.

## Etapa 2 — Tema e checagem ⛔ GATE
A pessoa traz o tema, uma notícia, um link ou um caso. Pasta do carrossel:
`~/carrossel-tweet/<pessoa>/<AAAA-MM-DD>-<tema>/`.
Tabela: afirmação que o carrossel vai fazer · fonte (link) · veredito. Fonte primária
sempre que existir; imprensa como apoio. Começar pelas `fontes_confiaveis` do perfil.
Salvar como `checagem.md`.

## Etapa 3 — Roteiro do carrossel ⛔ GATE
Texto slide a slide, com a imagem planejada de cada um. Estrutura que funciona (8–10 slides):
1. **Gancho:** o fato concreto e forte ("80 VOOS cancelados e milhares de passageiros
   FURIOSOS") + a tensão ("quem ajudou? as MAIORES concorrentes") + o laço aberto
   ("e o motivo disso é algo que eu acredito profundamente..."). **Com o print da fonte.**
2–4. **O caso:** o que aconteceu, em ordem, um fato por slide, cada um com sua prova.
5–6. **A virada:** a lógica que pouca gente enxerga.
7–8. **A prova pessoal:** "eu já vivi isso" — a história de quem posta (foto real, se houver).
9. **A lição**, curta.
10. **CTA** (o do perfil, ou perguntar).
Regras de texto:
- 1ª pessoa, frase de conversa. Parágrafos de 1 a 3 linhas.
- Ênfase: CAIXA ALTA em 1–2 palavras por slide OU `**negrito**` — pouco, senão nada se destaca.
- Limite: ~65 palavras com imagem, ~95 sem (o motor avisa). Passou: dividir o slide.
- Sem hashtag, sem emoji, sem numeração de slide.
- **Não inventar a opinião de quem posta.** Conselho, recomendação ou opinião em 1ª pessoa
  ("o que eu recomendo...") só entra se a pessoa disse (no vídeo, no texto que mandou) ou
  aprovou. Se não, o slide vai marcado como SUGESTÃO no roteiro, pra ela validar no gate.

## Etapa 4 — Imagens das fontes
- Print: `python scripts/capturar.py <url> <saida.png>` (Chrome em perfil temporário).
  No carrossel, `recorte` pega só a manchete (e a data/veículo); `marcas` passa marca-texto
  no trecho que o texto do slide cita. Conferir as coordenadas numa grade antes.
- Página branca/preta = site bloqueia robô → outra fonte.
- Post de rede social (LinkedIn, X): print do post, recortado no texto relevante.
- Foto (da pessoa, de evento, de produto): com crédito/licença na `legenda` se não for dela.
- Nunca editar o conteúdo de um print.

## Etapa 5 — Montar ⛔ GATE
`carrossel.json` (formato em `references/carrossel.md`) →
`python scripts/montar_tweet.py carrossel.json` → `slides/01.png…` + `slides/folha.jpg`.
Mostrar a folha. Avisos do motor: slide 1 sem imagem (recusa), poucas imagens, texto
longo demais, conteúdo encostando na borda. Ajuste de um slide só:
`python scripts/montar_tweet.py carrossel.json 3`.

## Etapa 6 — Entrega e memória
PNGs na pasta do carrossel, na ordem (01, 02...). Atualizar o perfil. Regra que protege
quem é perfeccionista: **olha uma vez, pede no máximo um ajuste, publica.**

---

## Armadilhas conhecidas
| Sintoma | Causa | Saída |
|---|---|---|
| Letra diferente/maior que o esperado | fonte não carregou | a Inter vai embutida em `assets/fonts`; não mover a pasta da skill |
| Slide denso, letra pequena | texto demais (o motor encolhe até 40px pra caber) | respeitar o aviso de palavras; dividir |
| Print cortado no lugar errado | coordenada estimada | grade de coordenadas sobre o print antes |
| Marca-texto pegando a palavra vizinha | posição calculada pela contagem de letras (manchete centralizada engana) | medir SEMPRE na grade, nunca estimar; conferir o slide renderizado |
| Foto do perfil cortando a testa | recorte central automático | `foto_recorte` no perfil |
