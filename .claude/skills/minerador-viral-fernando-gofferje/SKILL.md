---
name: minerador-viral-fernando-gofferje
description: "Extrai ideias com potencial viral de conteúdos longos (transcrições, podcasts, lives, aulas, artigos, textos colados) e transforma em posts de texto curto na voz do criador definido em references/config-mentorado.md, que é sempre carregado primeiro. Baseado nas 17 estruturas de Dan Koe. Processo em 4 passadas (leitura → scoring → estrutura → rascunho), scoring de 7 critérios (máx 14, corte 8), ranking dos nuggets e até 9 posts com variedade estrutural. Classifica cada post por funil (MToFu/ToFu/MeFu), por perfil (PESSOAL/NEGÓCIO/AMBOS) e indica o CTA. Use quando o usuário pedir: minerar um conteúdo, extrair ideias virais, transformar transcrição/podcast/artigo/live em posts, posts de texto, frases para postar, 'o que dá pra tirar disso', 'vira post'. Não escreve roteiro de reels nem caça notícias."
---

# MINERADOR DE IDEIAS VIRAIS — Fernando Gofferje

Transforma conteúdo longo (transcrição, podcast, live, aula, artigo, texto colado) em até 9 posts de texto curto na voz do criador configurado em `references/config-mentorado.md`. A metodologia (estruturas de Dan Koe, 4 passadas, scoring de 7 critérios) é fixa; voz, público, antagonistas e CTA vêm do config.

---

## Ambiente (app Claude)

- Esta skill roda no app Claude (claude.ai / desktop). A pasta da skill é **somente leitura**: não crie, edite nem salve arquivos nela.
- **Não há memória entre conversas.** Não prometa "salvar", "lembrar" ou "registrar" nada para depois; entregue tudo na própria resposta.
- **Nunca invente métricas** (likes, alcance, engajamento, "viralizou X vezes"). Os números de likes em `estruturas-dan-koe.md` são referência histórica dos posts de Dan Koe, não previsão de desempenho.
- **Insumo por link:** tente abrir/buscar. Se a busca falhar ou vier incompleta (paywall, vídeo sem transcrição), peça ao usuário para colar o texto. Não minere a partir de título ou de resumo presumido.
- **Outras skills do pacote** (`cacador-de-ganchos-fernando-gofferje`, `cacador-de-hype-fernando-gofferje`, `deep-research-fernando-gofferje`, `radar-de-formatos-fernando-gofferje`, `roteirista-reels-fernando-gofferje`) podem não estar instaladas. Sugira quando fizer sentido; nunca dependa delas para concluir esta tarefa.

---

## WORKFLOW EXECUTIVO

0. **CARREGAR CONFIG** → Passo 0 abaixo. Mostre em 1 linha o config carregado e siga, sem perguntar.
1. **RECEBER O INSUMO** → texto colado, arquivo ou link (se o link falhar, peça o texto).
2. **PASSADA 1 — LEITURA** → identifique 8-15 nuggets brutos, cada um com trecho-fonte.
3. **PASSADA 2 — SCORE** → 7 critérios (máx 14), filtro da `tese`, ranking.
4. **PASSADA 3 — ESTRUTURA** → encaixe em uma das 17 estruturas de Dan Koe.
5. **PASSADA 4 — RASCUNHO** → texto final com as regras de escrita, subordinadas ao `tom`.
6. **CLASSIFICAR** → funil, perfil e CTA de cada post.
7. **ENTREGAR** → ranking dos nuggets + até 9 posts agrupados por funil + distribuição final.

---

## PASSO 0 — Carregar o config do criador (obrigatório)

Leia `references/config-mentorado.md` inteiro. É um Markdown com blocos YAML (não precisa rodar código); leia também comentários e a seção "Notas de conteúdo", se existir.

Campos: nome, instagram, bio, nicho, sub_nicho, tese, inimigos, tom, palavras_alta_voltagem, mitos_do_nicho, creators_referencia, fontes_nicho, podcasts_nicho, perfis (pessoal, negocio, perfil_dominante), conversor, produto, ticket, cta_base, cta_lead.

- Se o arquivo ainda estiver com o exemplo do template (ex.: "Dr. João Silva") ou faltar nome, nicho ou tom, avise que a skill não foi personalizada e peça esses dados antes de seguir. Campos opcionais vazios não bloqueiam.
- Não imponha limite de tamanho aos campos.

Prioridades:
1. O `tom` do config prevalece sobre qualquer regra de estilo desta skill (temperatura emocional, indignação, "afirmação absoluta"). Se o tom pede sobriedade/sem alarmismo, "quente" = curiosidade forte, contraste, número surpreendente, tensão — nunca alarmismo, revolta ou medo fabricado.
2. O antagonista vem de `inimigos`. Nunca ataque quem o config trata como parceiro.
3. Todo dado factual precisa de fonte verificável; prazos, datas e números regulatórios devem ser confirmados antes de afirmar.
4. Respeite as regras de publicidade do conselho profissional do criador, quando houver (OAB, CFM, CRO, CRC etc.): sem promessa de resultado, sem sensacionalismo.

**Linha de confirmação** — mostre antes de começar, sem perguntar nada, e siga direto para a Passada 1:

`Config carregado: {nome} ({instagram}) · {nicho} / {sub_nicho} · tom: {tom em poucas palavras} · perfil dominante: {perfil_dominante}`

**Como cada campo entra nesta skill:**

| Campo | Onde é usado |
|---|---|
| nicho, sub_nicho | testes de funil (MToFu/ToFu/MeFu) e checagem de relevância |
| tese | filtro de relevância na Passada 2; leitura/opinião do criador na Passada 4 |
| tom | temperatura de todo o texto; prevalece sobre as regras de escrita |
| palavras_alta_voltagem | vocabulário preferencial no rascunho (Passada 4), quando couber com naturalidade |
| mitos_do_nicho | nugget que desmonta um mito pontua em Contraintuitivo; matéria-prima de MeFu |
| inimigos | único antagonista permitido (Harsh Truth, Warning, Commentary etc.) |
| perfis, perfil_dominante | classificação de perfil e distribuição final |
| conversor, produto, ticket | contexto de MeFu (qual decisão o post prepara); não cite preço/ticket no post sem pedido |
| cta_base, cta_lead | fechamento dos posts (ver seção CTA) |
| creators_referencia, fontes_nicho, podcasts_nicho | repertório e checagem de fatos; nunca copie texto de outro criador |
| Notas de conteúdo (se houver) | ângulos preferidos e cuidados; em conflito com o insumo, ver regra 13 |

---

## ESTRUTURAS DE REFERÊNCIA

Leia `references/estruturas-dan-koe.md` — contém as 17 estruturas com fórmulas, exemplos reais, mecanismos psicológicos e tabela de referência rápida. Este arquivo é o cérebro da operação.

---

## CLASSIFICAÇÃO POR NÍVEL DE FUNIL

Cada post recebe um dos três níveis. Essa classificação é tão importante quanto o score viral — ela determina QUEM o post vai atingir. Os testes abaixo são derivados do config: troque {nicho}, {sub_nicho}, `mitos_do_nicho`, `inimigos` e `conversor` pelos valores reais do criador.

Rótulos: **[MToFu] 🔵**, **[ToFu] 🔷**, **[MeFu] 🟡**. O 🟢 **nunca** é usado para funil — ele é exclusivo do perfil NEGÓCIO.

### [MToFu] 🔵 MUITO TOPO DE FUNIL

**Quem atinge:** qualquer pessoa do público amplo do {nicho} — inclusive quem nunca parou para pensar no assunto. Fala da condição humana que o nicho toca (tempo, dinheiro, medo, saúde, segurança, reputação, família — o que fizer sentido para o {nicho}).

**Teste decisivo:** "Qualquer pessoa do público amplo do {nicho} entende isso sem contexto nem jargão — e se identifica?" Se sim = MToFu.

**Características:**
- Zero jargão do {nicho} e zero termo técnico
- Toca em emoções universais: medo de errar, desejo de segurança/liberdade, frustração, alívio
- Funciona mesmo se o leitor não sabe nada do {nicho}
- Temas típicos: preço de não agir, adiar decisões, paciência vs imediatismo, o óbvio que ninguém faz

**Teste de linguagem:** "alguém de fora do {nicho} entende na primeira leitura?"

### [ToFu] 🔷 TOPO DE FUNIL

**Quem atinge:** o público do {nicho}/{sub_nicho} — quem se interessa pelo tema, mas ainda não sente a dor com urgência nem está avaliando solução.

**Teste decisivo:** "Quem acompanha {nicho}/{sub_nicho} por interesse compartilharia isso, sem precisar de nenhum termo técnico?" Se sim = ToFu.

**Características:**
- Pode nomear o tema do {nicho} e seus conceitos básicos em linguagem do dia a dia — sem jargão
- Fala de erros comuns, crenças gerais, o que quem faz bem faz diferente
- O leitor não precisa ter o problema agora; precisa ter interesse no tema
- Temas típicos: equívocos comuns do {nicho}, bastidores simples, comparações antes/depois, princípios da `tese`

**Teste de linguagem:** "esse termo aparece numa conversa comum sobre o tema? Se precisa de explicação, troque ou explique na própria frase."

### [MeFu] 🟡 MEIO DE FUNIL

**Quem atinge:** quem já sente a dor que o `produto`/serviço resolve ou já está avaliando solução — comparando opções, com dúvida, com medo de errar.

**Teste decisivo:** "Isso fala com quem já tem o problema e está decidindo o que fazer?" Se sim = MeFu.

**Características:**
- Desmonta `mitos_do_nicho` que travam a decisão
- Nomeia o erro ou o antagonista (sempre de `inimigos`)
- Dá critérios para escolher, sinais de alerta, o que perguntar antes de contratar/comprar
- Pode usar os termos que quem está decidindo já usa, explicados quando necessário
- Prepara o passo seguinte (`conversor`) — pode fechar com `cta_lead`

**Teste de linguagem:** "quem está decidindo entende e se sente compreendido — sem se sentir num manual técnico?"

---

## CLASSIFICAÇÃO POR PERFIL

Cada post também recebe um perfil, conforme `perfis` do config:

- **🟣 PESSOAL** — `perfis.pessoal`: o criador é o protagonista (opinião, história, bastidor, posicionamento, trajetória).
- **🟢 NEGÓCIO** — `perfis.negocio`: o protagonista é o case, a empresa, o método, o processo ou o resultado.
- **⚫ AMBOS** — os dois se sustentam no mesmo post (ex.: lição pessoal tirada de um case do negócio).

**Critério rápido:** "Quem é o protagonista do post?" Criador → 🟣. Case/método/empresa → 🟢. Os dois → ⚫.

**`perfil_dominante`:** a maioria dos posts entregues deve cair no perfil dominante ou em ⚫ AMBOS. Se o dominante for "ambos", equilibre 🟣 e 🟢. Se o insumo não permite, não force — registre em Observações na distribuição final. A fidelidade ao insumo vem antes do perfil.

---

## O PROCESSO DE MINERAÇÃO (4 PASSADAS)

A mineração acontece em 4 passadas sequenciais sobre o conteúdo. Cada passada tem objetivo diferente. Não pule etapas.

### PASSADA 1: Leitura de Caçador

Leia o conteúdo inteiro com um único objetivo: encontrar **NUGGETS** — fragmentos de ideia com potencial viral.

Um nugget é qualquer trecho que contenha pelo menos UM destes sinais:

**Sinais fortes (alta probabilidade de viralização):**
- **Insight contraintuitivo** — contradiz o que a maioria acredita
- **Frase que funciona sozinha** — retira do contexto e ainda faz sentido completo
- **Reframe de conceito conhecido** — mostra de um ângulo que ninguém usou
- **Dado ou número surpreendente** — especialmente se gera dissonância
- **Comparação desproporcional** — "você gasta horas com X, mas não dá 10 minutos para Y"

**Sinais moderados:**
- **Sistema ou checklist pessoal** — "meu processo para X é..."
- **Lista de erros comuns** — "o que a maioria faz errado é..."
- **Definição original** — "para mim, [conceito] é..."
- **Conselho baseado em experiência** — "depois de 10 anos, aprendi que..."
- **Observação de padrão** — "percebi que as pessoas que X sempre fazem Y"

**Sinais fracos (descarte ou combine):**
- Informação puramente técnica sem emoção
- Dados sem interpretação
- Opiniões genéricas
- Conselhos óbvios

**Extraia 8 a 15 nuggets brutos. Copie o trecho exato (literal) do conteúdo-fonte que gerou cada nugget.** Se o insumo é curto, extraia menos — não invente para completar a faixa.

**Ao extrair cada nugget, classifique de forma provisória por nível de funil ([MToFu] 🔵, [ToFu] 🔷, [MeFu] 🟡).** A classificação final é confirmada na Passada 4.

**Regra de autenticidade:** Todo nugget deve ter lastro real no conteúdo-fonte. Não invente insights que não existem. A opinião do criador (vinda da `tese`) só entra na Passada 4, sempre sinalizada como leitura — nunca como se estivesse no insumo.

### PASSADA 2: Scoring de Potencial Viral

Para cada nugget, avalie em 7 critérios. Cada critério: 0, 1, ou 2 pontos. **Total máximo: 14**.

| Critério | 0 | 1 | 2 |
|----------|---|---|---|
| **Contraintuitivo** | Senso comum | Levemente surpreendente | Contradiz crença estabelecida |
| **Ressonância emocional** | Indiferente | Toca uma dor leve | Acerta ferida aberta ou desejo profundo |
| **Universalidade** | Ultra-nichado | Relevante para parte do público | Qualquer pessoa se identifica |
| **Simplicidade** | Precisa de parágrafo | 2-3 frases | 1 frase |
| **Compartilhabilidade** | "Interessante" | "Concordo" | "PRECISO mandar pra alguém" |
| **Acionabilidade** | Pura reflexão | Sugere direção | Dá próximo passo concreto |
| **Novidade de framing** | Ideia velha, ângulo velho | Ideia velha, ângulo novo | Ideia velha, ângulo inédito |

**Corte:** Score mínimo para virar post = **8/14**. Abaixo de 8, descarte ou combine com outro nugget.

Um nugget que desmonta um item de `mitos_do_nicho` com base no insumo tende a pontuar 2 em Contraintuitivo.

**Filtro da tese (depois do score; não soma pontos):** marque a relação de cada nugget com a `tese` e o {nicho} do config:
- **Alinhado** — reforça a tese ou fala direto com o público do nicho → segue.
- **Contraponto** — o insumo diz algo que tensiona a tese ou as Notas de conteúdo → pode seguir, desde que o post trate o fato do insumo como fato e a tese como leitura explícita (regra 13).
- **Fora** — sem ligação com o nicho nem com a tese → descarte, mesmo com score alto (registre no ranking).

Em empate de score, vence o nugget mais alinhado à tese e o que desmonta um `mitos_do_nicho`.

**Apresente o resultado em ranking:** a tabela de nuggets do Formato de Entrega (todos os nuggets, aprovados e descartados, agrupados por funil e ordenados por score), antes dos posts.

### PASSADA 3: Match com Estrutura Dan Koe

Para cada nugget aprovado (score >= 8), consulte `references/estruturas-dan-koe.md` e identifique a melhor estrutura.

A escolha não é arbitrária. Cada tipo de nugget tem estruturas que amplificam seu potencial. Use a tabela como guia, mas julgamento próprio também vale.

**Identifique qual dos 4 motores de engajamento é principal:**
1. **Identificação** — "isso me descreveu perfeitamente"
2. **Sinalização social** — "quero ser associado a isso"
3. **Validação tribal** — "esse é meu estilo"
4. **Utilidade prática** — "preciso lembrar disso"

### PASSADA 4: Rascunho do Post

Escreva o post final seguindo a fórmula da estrutura. Aplique TODAS as regras de escrita abaixo, sempre dentro do `tom` do config.

Neste passo:
- Use as `palavras_alta_voltagem` do config onde couberem com naturalidade (não force; em MToFu, só as que não forem jargão).
- Quando o post tiver antagonista, ele vem de `inimigos`.
- A `tese` pode entrar como leitura do criador — sinalizada como opinião, nunca como dado do insumo.
- Defina o funil final, o perfil (🟣/🟢/⚫) e o CTA de cada post (ver seções de classificação e CTA).

---

## REGRAS DE ESCRITA

Valem para todo post, **sempre subordinadas ao `tom` do config** (Passo 0, prioridade 1). Se uma regra abaixo colidir com o tom, o tom vence.

### 1. A primeira frase é tudo

Se não para o scroll, nada depois importa. Leia só a primeira frase isolada. Ela faz você querer ler a próxima?

### 2. Fale direto ("você")

Nunca "as pessoas", "muitos", "a maioria". Sempre "você" — cria conexão imediata. Exceção: quando "a maioria" serve para contraste ("a maioria faz X. Você deveria fazer Y.").

### 3. Convicção sem certeza fabricada

Afirme com convicção o que é fato verificado no insumo. Não enfraqueça o que é sólido com "talvez", "em muitos casos", "na minha opinião".

Mas não fabrique certeza: hipótese, estimativa ou opinião não viram fato só porque soam melhor afirmadas. Quando algo depende de confirmação (data, prazo, número em disputa, regra regulatória), não afirme como certo no texto e sinalize no campo "Checar antes de publicar" do post.

### 4. Frases curtas

**Máximo 15 palavras por frase. Ideal: 8-12.** Ponto final rápido. Sem subordinações complexas, sem vírgulas em cascata. Se tem mais de 15 palavras, quebra em duas.

### 5. Vocabulário de escola

Se um aluno de 15 anos não entende instantaneamente, reescreva. Zero jargão a menos que seja PROPOSITAL e explicado no contexto.

### 6. Termine com força

A última frase deve ser tão forte quanto a primeira. É ela que determina se o leitor compartilha. Força vem de clareza e contraste, não de exagero. Boa última frase: "O problema nunca foi falta de tempo. Foi falta de prioridade." Má última frase: "Pense sobre isso."

### 7. Uma ideia por post

Nunca misture temas. Um post = um insight = uma estrutura. Se percebe que tem duas ideias fortes, separe em dois posts.

### 8. Use listas quando possível

Listas são escaneáveis, salváveis e compartilháveis — por isso posts em lista costumam performar bem.

### 9. Vocabulário emocional dentro do tom

Palavras neutras demais matam o engajamento — mas a intensidade é definida pelo `tom`.
- **Primeiro:** as `palavras_alta_voltagem` do config.
- **Contraste:** "enquanto você [X], [outro grupo] [Y]"; antes/depois; número surpreendente do insumo.
- **Empoderamento:** "clareza", "controle", "segurança", "liberdade", "domínio".
- **Dor/urgência** ("armadilha", "preso", "cego", "prejuízo"): só se o `tom` permitir.

Se o tom pede sobriedade ou proíbe alarmismo, "quente" = curiosidade forte, contraste, número surpreendente, tensão. Nunca alarmismo, revolta ou medo fabricado.

### 10. Escreva em português do Brasil

Tom direto, sem frescura, sem academicismo — calibrado pelo `tom` do config. Como se explicasse para um amigo inteligente. Pode usar "pra" e "tá" quando a naturalidade pedir e o tom permitir.

### 11. Linguagem por nível de funil

- **[MToFu] 🔵:** vocabulário 100% universal. Se aparece qualquer termo que exige conhecimento de {nicho}, reescreva.
- **[ToFu] 🔷:** pode nomear o tema e os conceitos básicos do {nicho}/{sub_nicho} como se fala no dia a dia — sem jargão técnico.
- **[MeFu] 🟡:** pode usar os termos que quem está decidindo já usa (os de `mitos_do_nicho`, do `produto`), explicados na própria frase quando necessário.

### 12. Fidelidade ao insumo

Todo post deve ser fiel ao que o insumo diz.
- Fatos, números, datas e falas atribuídas vêm do insumo (ou de fonte verificável citada). Nada de dado inventado ou "arredondado para cima".
- Inferências e opinião do criador (vindas da `tese`) são permitidas, mas não podem ser apresentadas como dado do insumo. No texto, opinião soa como opinião; na nota do post, registre o que é insumo e o que é leitura.
- Quando o usuário colou o texto, o "Trecho-fonte" é citação literal, entre aspas, sem editar. Se o insumo chegou só como resumo ou link sem texto integral, marque "paráfrase" e peça o texto antes de publicar qualquer dado.
- **Insumo antigo:** se o insumo fala de datas que já passaram em relação à data da conversa, reescreva no tempo verbal correto ("desde 3/08…", "entrou em vigor em…") — nunca como se ainda fosse futuro — e sinalize em "Checar antes de publicar" (confirmar se algo mudou desde então).

### 13. Conflito entre insumo e ângulo do config

Se o insumo afirma X e o config (tese, mitos, Notas de conteúdo) sugere que X é superestimado, errado ou incompleto:
- Priorize o fato do insumo — não o distorça para caber no ângulo.
- Use o ângulo do config como leitura ou contraponto explícito ("o dado diz X; minha leitura é que...").
- Se o conflito for sobre o fato em si (ex.: números diferentes), não escolha lado sozinho: sinalize em "Checar antes de publicar".

---

## CTA

Cada post indica qual CTA usa:
- **[MeFu] 🟡:** pode fechar com `cta_lead` (leva ao `conversor`) — use quando o post termina numa dor ou decisão que o conversor resolve.
- **[MToFu] 🔵 e [ToFu] 🔷:** `cta_base` ou sem CTA. Prefira sem CTA quando o remate é a força do post (Unique Discovery e Personal Definition quase sempre ficam sem CTA); use `cta_base` quando o post apresenta o criador ou convida a acompanhar o tema.
- No máximo um CTA por post, em linha separada depois do remate. Mantenha o sentido do CTA do config (ajuste só concordância).
- Campo de CTA vazio no config → sem CTA, e avise em Observações.
- Nunca associe CTA a promessa de resultado.

---

## FORMATO DE ENTREGA

Ordem da resposta:
1. Linha do config carregado (Passo 0).
2. Ranking dos nuggets.
3. Posts, agrupados por funil ([MToFu] → [ToFu] → [MeFu]) e ordenados por score dentro de cada grupo.
4. Distribuição final.

### 1. Ranking dos nuggets (antes dos posts)

| # | Nugget (resumo em 1 linha) | Funil | Score | Tese | Status |
|---|---|---|---|---|---|
| 1 | [resumo] | [ToFu] 🔷 | 12/14 | Alinhado | Post #4 |
| 2 | [resumo] | [MeFu] 🟡 | 9/14 | Contraponto | Post #7 |
| 3 | [resumo] | [MToFu] 🔵 | 6/14 | Alinhado | Descartado (< 8) |
| 4 | [resumo] | — | 11/14 | Fora | Descartado (fora do nicho) |

### 2. Posts

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[MToFu] 🔵 MUITO TOPO DE FUNIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST #[N] — [Nome da estrutura]
Score: [X/14] | Funil: [MToFu] 🔵 | Perfil: [🟣 PESSOAL | 🟢 NEGÓCIO | ⚫ AMBOS]
Motor: [Um dos 4 motores de engajamento]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[TEXTO DO POST PRONTO PARA PUBLICAR — com o CTA no final, se houver]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CTA: [cta_lead | cta_base | sem CTA]
Trecho-fonte: "[trecho literal do insumo]"
Insumo x leitura: [o que é dado do insumo e o que é opinião/tese do criador — ou "tudo do insumo"]
Por que funciona: [2-3 frases explicando o mecanismo psicológico]
Checar antes de publicar: [datas, prazos, números ou regras a confirmar — ou "nada pendente"]
Melhor plataforma: [Instagram | LinkedIn | Threads | X]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Repita o bloco para os grupos **[ToFu] 🔷 TOPO DE FUNIL** e **[MeFu] 🟡 MEIO DE FUNIL**.

### 3. Distribuição final

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISTRIBUIÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Funil:       [MToFu] 🔵 X · [ToFu] 🔷 X · [MeFu] 🟡 X
Perfil:      🟣 PESSOAL X · 🟢 NEGÓCIO X · ⚫ AMBOS X  (dominante no config: {perfil_dominante})
Estruturas:  [nome (qtd), nome (qtd)...]
CTA:         cta_lead X · cta_base X · sem CTA X
Observações: [nível de funil ou perfil que o insumo não rendeu; pendências de checagem]
```

---

## LIMITES DE ENTREGA

- **Máximo 9 posts finais** — qualidade > quantidade. Menos é aceitável se o insumo não rende 9 nuggets com score ≥ 8; não complete com nugget fraco.
- **Distribuição de funil (padrão ajustável):** idealmente 3 de cada nível; antes de cortar por score, tente manter pelo menos 2 de cada nível. Ajuste ao pedido do usuário (ex.: "só MeFu", "foco em alcance") e ao público do config (ex.: se o `conversor` pede público já qualificado, pese mais MeFu). Se o insumo não rende algum nível com score ≥ 8, não force — registre em Observações.
- **Perfil:** respeite `perfil_dominante` (maioria no perfil dominante ou ⚫ AMBOS).
- **Variedade estrutural:** no máximo 2 posts com a mesma estrutura.
- Se o conteúdo rendeu 10+ nuggets aprovados, escolha os 9 melhores equilibrando score, funil, perfil e variedade estrutural.

---

## CHECKLIST PRÉ-ENTREGA

Para cada post final, valide:

- [ ] A primeira frase para o scroll?
- [ ] Fala direto com o leitor ("você"), em vez de "as pessoas"/"a maioria" (salvo contraste)?
- [ ] Máximo 15 palavras por frase?
- [ ] A última frase é forte — sem exagero que o `tom` não permite?
- [ ] Uma ideia por post?
- [ ] Linguagem adequada ao funil?
- [ ] Fiel ao insumo, com opinião sinalizada como opinião e trecho-fonte literal?
- [ ] Dados com fonte; pendências listadas em "Checar antes de publicar"?
- [ ] Relevante para o {nicho} e coerente com a `tese` (ou contraponto explícito)?
- [ ] `tom` do config respeitado?
- [ ] Antagonista vem de `inimigos`; nenhum parceiro atacado?
- [ ] Regras do conselho profissional respeitadas (sem promessa de resultado, sem sensacionalismo)?
- [ ] Funil, perfil e CTA indicados?

---

## O QUE ESTA SKILL NÃO FAZ

- **NÃO escreve roteiros de reels** — isso é da skill `roteirista-reels-fernando-gofferje`
- **NÃO caça temas e notícias na web** — isso é da skill `cacador-de-hype-fernando-gofferje`
- **NÃO faz pesquisa aprofundada de dados** — isso é da skill `deep-research-fernando-gofferje`
- **NÃO gera ganchos para vídeo** — isso é da skill `cacador-de-ganchos-fernando-gofferje`
- **NÃO mapeia formatos de conteúdo** — isso é da skill `radar-de-formatos-fernando-gofferje`

Essas skills podem não estar instaladas: sugira quando o pedido for delas, sem depender delas.

Esta skill faz UMA coisa: **minerar conteúdo longo → destilar em até 9 posts de texto curto → entregá-los ranqueados e classificados por funil, perfil e estrutura, prontos para revisar e publicar.**
