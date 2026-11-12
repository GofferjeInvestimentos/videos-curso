---
name: cacador-de-hype-fernando-gofferje
description: "Caçador de hype: varre notícias recentes do nicho do criador e entrega temas quentes para reels (newsjacking com ângulo original: a notícia é o gancho, a análise do criador é o conteúdo). Lê primeiro references/config-mentorado.md. Valida a data da publicação original do fato, classifica por urgência (quente < 24h, fresco 24-48h, ainda vivo 2-7 dias com desdobramento; janela padrão de 48h, ajustável quando o usuário pede outra; eventos oficiais previstos para os próximos 7 dias entram como pauta de agenda), aplica filtro de potencial viral de 7 critérios e entrega, por tema: ângulo no tom do criador, gancho sugerido, dados-chave com fonte, funil, perfil, CTA e alertas antes de gravar. Use quando o usuário pedir: notícias do nicho, hype, trending, o que está bombando, tema quente, newsjacking, pauta do momento, algo para gravar hoje ou esta semana."
metadata:
  version: "1.1.0"
---

# CAÇADOR DE HYPE — Fernando Gofferje

Radar de notícias quentes do nicho do criador: encontra o fato, valida a data, filtra por potencial viral e entrega o ângulo original pronto para virar reel — tudo calibrado pelo config do criador.

---

## 🖥️ Ambiente (app Claude)

- Esta skill roda no app Claude (claude.ai / desktop). A pasta da skill é **somente leitura**: não crie nem altere arquivos nela.
- **Não há memória entre conversas.** Não prometa "salvar", "lembrar" ou "acompanhar" temas depois. Se o usuário quiser guardar o radar, ele copia a resposta.
- **Sem acesso ao Instagram** (reels, métricas, alcance) **nem ao Google Trends** pela web. Tudo o que depender disso é opcional: use apenas se tiver acesso de fato ou se o usuário mandar prints/dados. Nunca invente visualizações, tendências ou o que um creator postou.
- **A busca web pode falhar**, voltar vazia ou esbarrar em paywall. Nesse caso, tente fontes alternativas (outro veículo, comunicado oficial, site do órgão ou da empresa) e diga claramente o que não conseguiu verificar.
- **Outras skills podem não estar instaladas** (cacador-de-ganchos-fernando-gofferje, deep-research-fernando-gofferje, minerador-viral-fernando-gofferje, radar-de-formatos-fernando-gofferje, roteirista-reels-fernando-gofferje). Nunca dependa delas: ofereça fazer o próximo passo aqui mesmo e cite a skill só como aprofundamento opcional — ex.: "posso transformar em roteiro aqui mesmo; se tiver a roteirista-reels-fernando-gofferje instalada, ela aprofunda".

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

**Placeholders usados nesta skill** (todos vêm do config): {NOME}, {NICHO}, {SUB_NICHO}, {TESE}, {INIMIGOS}, {TOM}, {PALAVRAS_ALTA_VOLTAGEM} (a lista inteira), {MITOS_DO_NICHO}, {CREATORS_REFERENCIA}, {FONTES_NICHO}, {PODCASTS_NICHO}, {PERFIS}, {CTA_BASE}, {CTA_LEAD}.

---

## 📋 WORKFLOW EXECUTIVO

0. **CARREGAR CONFIG** → PASSO 0 acima
1. **DEFINIR JANELA** → 48h (padrão de "urgente") ou a janela que o usuário pediu; janela ampliada = dobro da janela usada (teto 14 dias)
2. **VARRER WEB** → Buscas em {FONTES_NICHO} + temas de {NICHO}/{SUB_NICHO} + agenda oficial dos próximos 7 dias ({CREATORS_REFERENCIA} e tendências só se houver acesso)
3. **VALIDAR DATA** → Data da publicação ORIGINAL do fato, verificável
4. **FILTRAR POTENCIAL** → Aplique os 7 critérios de viralidade
5. **DESENVOLVER TEMAS** → Ângulo original no {TOM} + gancho + dados-chave + CTA
6. **ENTREGAR RADAR** → Temas classificados por faixa de urgência + recomendações

---

## 🎯 FILOSOFIA: NEWSJACKING COM INTELIGÊNCIA

Newsjacking é pegar uma notícia quente e dar um ângulo original que conecte com o território do criador. O erro comum é reportar a notícia. O acerto é usar a notícia como **trampolim para uma lição maior**.

A notícia é o GANCHO. A análise original é o CONTEÚDO. Sem análise = conteúdo genérico que flopa.

---

## ⏰ JANELA TEMPORAL: 48H PADRÃO, AJUSTÁVEL

| Critério | Especificação |
|----------|--------------|
| **Janela padrão** | **48 horas** — é o que conta como "urgente" quando o usuário não especifica |
| **Janela pedida** | Se o usuário pedir outra janela ("algo para esta semana", "últimos 7 dias"), use a janela pedida no lugar das 48h |
| **Janela ampliada** | O **dobro da janela usada, com teto de 14 dias** (48h → até 4 dias; "esta semana"/7 dias → até 14 dias). Serve de reserva quando nada, ou quase nada, passa na janela usada |
| **Por quê** | Newsjacking é sobre frescor. 48h é o ponto de equilíbrio entre "ainda é quente" e "ainda tem análise original a fazer" |
| **Validação obrigatória** | Data (e hora, quando houver) da publicação ORIGINAL do fato, verificada na fonte |

**Faixas de urgência** (usadas em todo o radar):

| Faixa | Idade | Leitura |
|-------|-------|---------|
| 🔥 **Quente** | < 24h | Gravar hoje |
| ⚡ **Fresco** | 24–48h | Gravar hoje ou amanhã |
| ⏰ **Ainda vivo** | 2–7 dias | Só rende se houver desdobramento já ocorrido (fato novo, reação oficial, decisão, prazo alterado) ou um ângulo que ninguém fez ainda |
| 📅 **Pauta de agenda** | idade irrelevante | Evento oficial previsto para os próximos 7 dias (ver abaixo). Gravar a prévia antes e a reação no dia |

Acima da janela ampliada (dobro da janela usada, teto de 14 dias): fora do escopo desta skill — se o tema for bom, sugira tratá-lo como evergreen. Exceção: a pauta de agenda, cuja idade não conta.

**📅 PAUTA DE AGENDA (prazos futuros oficiais):**
- O que é: evento oficial com data marcada — calendário regulatório, votação, julgamento pautado, data de entrega/obrigação junto a órgão, início de vigência, fim de janela de opção/adesão.
- Um evento previsto para os **próximos 7 dias** conta como **desdobramento previsto**: entra no radar mesmo que a notícia original seja antiga. A idade do fato é irrelevante; o que manda é a data do evento.
- A data do evento precisa estar confirmada em fonte oficial (órgão, diário oficial, pauta publicada). Sem confirmação oficial, não entra como pauta de agenda — no máximo como CUIDADO ANTES DE GRAVAR.
- No campo URGÊNCIA, mostre **"📅 agenda: [data do evento]"**. Recomendação padrão: **gravar a prévia antes** (o que vai acontecer, quem é afetado, o que fazer até lá) **e a reação no dia** (o que de fato foi decidido/mudou).
- Evento a mais de 7 dias: não é pauta de agenda desta rodada; cite em "Descartados" ou sugira como evergreen com lembrete da data.

**A idade conta a partir da publicação ORIGINAL do fato:**
- Conta da primeira publicação do fato (anúncio, decisão, divulgação do dado), não da matéria que você encontrou.
- Republicação, repercussão, resumo ou matéria de outro veículo **não renova a idade**.
- Só renova se trouxer **fato novo** (nova decisão, número novo, reação oficial, prazo alterado). Nesse caso, a idade conta a partir do desdobramento **já ocorrido** — e o tema passa a ser o desdobramento.
- Prazo que **ainda vai acontecer** não renova a idade: se cair nos próximos 7 dias, o tema vira **📅 PAUTA DE AGENDA** (acima), com a data do evento no lugar da idade.
- Se só encontrar republicações, procure a origem (comunicado, órgão, veículo que deu primeiro). Se não achar, use a data mais antiga encontrada e sinalize "(origem não localizada)".

---

## 🔍 WORKFLOW PASSO A PASSO

### Etapa 0: Identificar Data/Hora Atual e Janela

- Use a data/hora disponível na conversa (contexto do sistema ou informada pelo usuário).
- Se souber a data mas não a hora: peça a hora ou siga só com a data e trate a janela em dias ("hoje", "ontem", "há 2 dias"), sinalizando no radar "idade calculada em dias".
- Se não souber nem a data, pergunte antes de varrer — sem data atual não dá para validar frescor.

Anote:
- **Data/hora atual:** [data e hora — ou só a data, sinalizado]
- **Janela usada:** [48h padrão | janela pedida pelo usuário: ...]
- **Corte:** publicações originais a partir de [agora − janela]
- **Janela ampliada:** até [agora − (2 × janela usada), no máximo 14 dias]
- **Agenda:** eventos oficiais previstos até [hoje + 7 dias]

### Etapa 1: Varredura em Fontes do Nicho

Execute **pelo menos 8 buscas diferentes**, priorizando:

1. **Fontes do nicho** ({FONTES_NICHO}) — e sites oficiais de órgãos, instituições e empresas do nicho
2. **Buscas temáticas** — termos de {NICHO}/{SUB_NICHO} combinados com {PALAVRAS_ALTA_VOLTAGEM} e {MITOS_DO_NICHO} (notícia que confirma ou derruba um mito rende muito)
3. **Antagonistas** — movimentos recentes ligados a {INIMIGOS}
4. **Podcasts do nicho** ({PODCASTS_NICHO}) — episódios recentes, se aparecerem na busca
5. **Agenda oficial** — calendário regulatório, pautas de votação/julgamento, datas de entrega a órgãos e fins de janelas de opção/adesão previstos para os próximos 7 dias (candidatos a 📅 PAUTA DE AGENDA)
6. **Opcional:** {CREATORS_REFERENCIA} (o que postaram nos últimos 3 dias) e Google Trends — **somente se tiver acesso ou se o usuário mandar prints**. Sem acesso, pule e registre que não verificou.

**Estratégia de busca:**
- Inclua "hoje", a data de hoje ou mês/ano para forçar resultados frescos
- Combine keywords do nicho + "novo", "recente", "anuncia", "divulga", "decisão", "muda"
- Use `site:` com o domínio de uma das {FONTES_NICHO} — ex.: `site:[domínio de uma fonte do config] [termo do nicho]` [exemplo ilustrativo — adapte ao nicho do config]
- Busque em português E inglês se o nicho for internacional
- Se uma busca falhar ou vier vazia, reformule ou troque de fonte; registre no radar o que não foi possível verificar

### Etapa 2: Validação de Data (OBRIGATÓRIA)

Para CADA notícia encontrada:

```
1. Ache a publicação ORIGINAL do fato (não a republicação) e sua data/hora
2. Calcule a IDADE: (agora) − (publicação original)
   → em horas; em dias se a hora não for conhecida
3. Classifique na faixa: 🔥 < 24h | ⚡ 24–48h | ⏰ 2–7 dias | 📅 pauta de agenda
4. Decida:
   - Evento oficial previsto para os próximos 7 dias, com data confirmada em fonte oficial
     → 📅 PAUTA DE AGENDA, independentemente da idade → segue para o filtro
   - Dentro da janela usada → segue para o filtro
   - Fora da janela usada, mas dentro da janela ampliada (dobro da janela usada,
     teto 14 dias) → guarde como candidato de JANELA AMPLIADA (ver Etapa 5)
   - Além da janela ampliada → descarte (sugira como evergreen, se for bom)
   - Data não verificável → DESCARTE (data não verificável)
5. Anote: "⏱️ Xh atrás" (ou "⏱️ X dias atrás — hora não confirmada";
   para pauta de agenda: "📅 agenda: [data do evento]")
```

**Só avance para o filtro com notícias que passaram nesta validação.**

### Etapa 3: Filtro de Potencial Viral (7 Critérios)

| Critério | ✅ Passa | ❌ Falha |
|----------|---------|---------|
| **Frescor** | Dentro da janela usada (🔥 ou ⚡; ⏰ só com desdobramento ou quando a janela pedida cobre), ou 📅 pauta de agenda nos próximos 7 dias | Fora da janela, ou ⏰ sem nada novo |
| **Dissonância** | "Como assim?!" nos primeiros 3s | "Ah, sabia" |
| **Número NOVO** | Dado específico que NÃO circulou | Dado gasto/comum |
| **Ângulo original** | O criador pode dar visão única | Apenas reportagem |
| **Personagem** | Pessoa, empresa ou instituição/autoridade nomeada (ex.: Receita Federal, um tribunal, um órgão regulador, uma empresa específica) | Tema abstrato, sem ninguém nomeado |
| **Gancho-Cena** | Pinta CENA ou PROMESSA | Tese abstrata |
| **Território** | Encaixa em {NICHO}/{SUB_NICHO} | Fora do escopo |

**Corte:** Precisa passar em **pelo menos 5 de 7 critérios**. Se falhar em "Ângulo original" ou "Personagem", descarte — sem protagonista = conteúdo genérico que flopa.

### Etapa 4: Desenvolver Temas Aprovados

Para cada notícia que passou no filtro:

```
═══════════════════════════════════════
TEMA HYPE #[N]
═══════════════════════════════════════

NOTÍCIA: [título + fonte + URL]
PUBLICAÇÃO ORIGINAL: [data/hora + onde saiu primeiro]
  (se o tema for um desdobramento: data/hora do desdobramento)
⏱️ IDADE: [Xh atrás | X dias atrás — hora não confirmada | pauta de agenda: irrelevante]
URGÊNCIA: [🔥 Quente (< 24h) / ⚡ Fresco (24–48h) / ⏰ Ainda vivo (2–7 dias, com desdobramento)
  / 📅 agenda: [data do evento + fonte oficial]]
  [+ "JANELA AMPLIADA" se veio de fora da janela usada]
PRAZO DE VALIDADE: [coerente com a faixa — 🔥 gravar hoje, rende até completar ~48h;
  ⚡ gravar hoje ou amanhã; ⏰ só enquanto o desdobramento estiver em pauta;
  📅 gravar a prévia antes de [data do evento] e a reação no dia.
  Cite a data/evento que encerra o tema, se houver]
FUNIL: [MToFu / ToFu / MeFu]
PERFIL: [🟣 PESSOAL / 🟢 NEGÓCIO / ⚫ AMBOS]

ÂNGULO DO {NOME}:
[2-3 frases, no {TOM}: qual é a análise ORIGINAL? O que ninguém mais vai falar?
 Parta de {TESE}; veja se a notícia confirma ou derruba algum de {MITOS_DO_NICHO};
 use {INIMIGOS} como antagonista e as "Notas de conteúdo" do config, se houver.]

GANCHO SUGERIDO:
"[80-150 caracteres, no {TOM}]"

FECHAMENTO (CTA):
[{CTA_LEAD} se o tema puxa conversão (dor ativa, MeFu) |
 {CTA_BASE} se o objetivo é alcance/seguir (MToFu, ToFu) — adaptado ao tema]

DADOS-CHAVE:
- [dado 1 + fonte + data]
- [dado 2 + fonte + data]
- [dado 3 + fonte + data]

CUIDADO ANTES DE GRAVAR: (inclua só quando se aplica)
[Dado impreciso, número que diverge entre fontes, informação contestada por
 outra fonte, prazo/data regulatória ainda não confirmada em fonte oficial.
 Diga qual fonte afirma o quê e o que confirmar antes de gravar.]

CONEXÃO COM A TESE:
[Como conecta com: "{TESE}"?]

POR QUE AGORA:
[Por que as pessoas estão falando sobre isso NESTE MOMENTO?]
═══════════════════════════════════════
```

**Como classificar:**
- **Funil**
  - **MToFu** — qualquer pessoa do público amplo do nicho entende sem contexto.
  - **ToFu** — público do nicho, sem jargão.
  - **MeFu** — quem já sente a dor ou está avaliando uma solução.
- **Perfil** (de `perfis` no config): 🟣 PESSOAL = marca pessoal do criador (opinião, história, posicionamento); 🟢 NEGÓCIO = case, empresa, estratégia, resultado; ⚫ AMBOS. Na dúvida, puxe para o `perfil_dominante`. Os emojis de perfil não são usados para funil.
- **Tom:** ângulo e gancho seguem o {TOM} (prioridade 1 do PASSO 0). Frescor e dissonância não autorizam alarmismo: se o tom pede sobriedade, a tensão vem do contraste e do número surpreendente.

### Etapa 5: Ranking + Recomendação

Apresente os temas em ordem de prioridade:

```
RADAR HYPE — [DATA/HORA]
Varredura feita em: [data/hora — ou só data, "idade calculada em dias"]
Janela usada: [48h padrão | pedida pelo usuário: ...] — publicações originais a partir de [corte]
Não verificado: [o que ficou de fora — ex.: Instagram dos creators, Google Trends, fonte X fora do ar]
  (omita a linha se nada ficou de fora)

TEMAS ENCONTRADOS: [N]
APROVADOS APÓS TRIAGEM: [N]

#1 🔥 [TEMA] — ⏱️ Xh atrás — "Gravar hoje"
[Motivo: urgência + potencial viral]

#2 ⚡ [TEMA] — ⏱️ Xh atrás — "Gravar hoje ou amanhã"

#3 ⏰ [TEMA] — ⏱️ X dias atrás — "Ainda vivo: gravar nos próximos dias, ancorado no desdobramento"

#4 📅 [TEMA] — agenda: [data do evento] — "Prévia antes, reação no dia"

QUANDO NADA (OU QUASE NADA) PASSAR NA JANELA USADA, mostre nesta ordem:
1. PAUTAS DE AGENDA:
   - 📅 [TEMA] — agenda: [data do evento + fonte oficial] — [prévia: ... / reação no dia: ...]
2. JANELA AMPLIADA (até [2 × janela usada, teto 14 dias]):
   - ⏰ [TEMA] — ⏱️ X dias atrás — [por que ainda rende / qual desdobramento usar]
3. EVERGREEN SUGERIDO:
   - [TEMA] — [por que vale gravar mesmo sem gancho de data]

DESCARTADOS: [N] temas
[Lista rápida com motivo do descarte]

Quer que eu desenvolva algum desses em roteiro completo?
Posso transformar em roteiro aqui mesmo; se tiver a roteirista-reels-fernando-gofferje instalada, ela aprofunda.
```

**Quando nada passar:** não pare no "não encontrei". Mostre primeiro as **PAUTAS DE AGENDA** (eventos oficiais dos próximos 7 dias), depois a **JANELA AMPLIADA** — os 1–3 melhores temas dentro do dobro da janela usada (teto de 14 dias) que passaram no filtro, cada um com o desdobramento ou ângulo que o mantém vivo — e, por último, **evergreen**. Nunca apresente um tema da janela ampliada como urgente.

---

## 📏 REGRAS INVIOLÁVEIS

### 1. Frescor é Lei (48h padrão, faixas de urgência)

Newsjacking funciona assim:
- O público busca respostas AGORA
- Quanto mais velha a notícia, mais ela já circulou em outros creators
- A idade conta da publicação ORIGINAL do fato; republicação não renova a idade, só fato novo
- 48h é o padrão de "urgente". Se o usuário pediu outra janela, vale a janela pedida
- Fora da janela usada, o tema só aparece marcado como ⏰ / JANELA AMPLIADA (dobro da janela usada, teto 14 dias) — nunca como urgente
- Evento oficial previsto para os próximos 7 dias entra como 📅 PAUTA DE AGENDA, com a data do evento no lugar da idade
- Melhor entregar 1 tema forte e fresco que 5 requentados

### 2. Ângulo > Notícia

Nunca sugira "reportar" a notícia. Sempre exija um ângulo analítico original que conecte com {TESE}.

[exemplo ilustrativo — adapte ao nicho do config]
**Exemplo ruim:** "Empresa X faz aquisição de Y"
**Exemplo bom:** "Empresa X faz aquisição de Y — e aqui está por que isso muda a estratégia do setor inteiro"

### 3. Dados Obrigatórios e Verificáveis

Todo tema precisa de pelo menos 2 dados numéricos verificáveis, com fonte. Sem números = sem tema. Prazos, datas e números regulatórios precisam ser confirmados (de preferência na fonte oficial) antes de afirmar. Se uma fonte contradiz outra, ou o dado está impreciso, preencha o campo **CUIDADO ANTES DE GRAVAR**.

### 4. Não Force Hype

Se nada passar no filtro na janela usada, mostre primeiro as PAUTAS DE AGENDA e depois a JANELA AMPLIADA (dobro da janela usada, teto de 14 dias), marcadas como tal. Se nem assim houver tema forte, diga honestamente: "Não encontrei hype forte na janela [X]." e sugira um tema evergreen — posso levantar aqui mesmo; se tiver a deep-research-fernando-gofferje instalada, ela aprofunda.

### 5. Data de Publicação é Obrigatória

Todo tema precisa ter a data verificada da publicação original e o campo **⏱️ IDADE** preenchido — ou, na PAUTA DE AGENDA, a data do evento confirmada em fonte oficial. Se não conseguir encontrar a data, o tema NÃO entra no radar.

### 6. Validação por Nicho

O tema DEVE:
- Conectar com {TESE} do criador
- Ser relevante para o público de {NICHO}/{SUB_NICHO}
- Ter potencial de análise original que apenas {NOME} pode dar
- Tocar em {PALAVRAS_ALTA_VOLTAGEM} (considere a lista inteira) quando for natural

### 7. Tom e Ética do Criador

- Ângulo e gancho sempre no {TOM} — ele prevalece sobre qualquer regra de estilo desta skill
- O antagonista vem de {INIMIGOS}; nunca ataque quem o config trata como parceiro
- Respeite as regras de publicidade do conselho profissional do criador, quando houver (sem promessa de resultado, sem sensacionalismo)

---

## ❌ O QUE ESTA SKILL NÃO FAZ

- **NÃO escreve roteiros completos** — posso esboçar um aqui se o usuário pedir; a skill `roteirista-reels-fernando-gofferje`, se instalada, aprofunda
- **NÃO pesquisa temas evergreen** — papel da `deep-research-fernando-gofferje`, se instalada
- **NÃO gera ganchos em massa** — papel da `cacador-de-ganchos-fernando-gofferje`, se instalada
- **NÃO gera posts de texto** — papel da `minerador-viral-fernando-gofferje`, se instalada

Esta skill faz UMA coisa: **varrer a web → validar a data da publicação original → filtrar por potencial viral (48h padrão, faixas de urgência) → entregar temas quentes prontos para roteirização.**

---

## 💡 DICAS DE OURO

- **Velocidade > Perfeição:** Os dados precisam estar corretos, mas a análise pode ser aprofundada depois, no roteiro
- **Priorize as fontes do config:** As {FONTES_NICHO} foram escolhidas por serem confiáveis — comece por elas, mas ainda confirme a data original e os números
- **Observe padrões:** Se vários veículos do nicho (ou creators, quando o usuário mandar prints) cobriram o mesmo tema em 24h, a probabilidade de viralizar é muito maior
- **Dia 2 pode valer mais:** Nem toda notícia quente precisa ser gravada no dia 0. Uma notícia boa no dia 2 — ou um desdobramento forte no dia 5 — bate uma notícia fraca no dia 0
