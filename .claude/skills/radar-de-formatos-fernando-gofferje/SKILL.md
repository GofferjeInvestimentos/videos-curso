---
name: radar-de-formatos-fernando-gofferje
description: "Analisa reels de criadores de referência para identificar FORMATOS de conteúdo que estão funcionando — não temas, mas a ESTRUTURA do vídeo (como filma, edita, narra, abre e fecha). Carrega references/config-mentorado.md primeiro. 3 modos: RADAR (formatos em alta entre os creators de referência), ANALISAR (deep dive em um creator ou auditoria do próprio perfil) e ADAPTAR (transforma um formato em briefing de produção); pedido misto roda RADAR e fecha com briefing. Inclui decomposição de formato, template de briefing, 6 anti-padrões e 5 formatos validados. Não inventa métricas: pede prints da aba Reels/insights ou links; sem isso, trabalha com frequência observada. Use quando o usuário falar em formato de reel, benchmark de creators, 'o que tá funcionando', 'analisa o @', 'audita meu perfil', 'quero fazer igual a esse reel', briefing de gravação ou radar de formatos."
metadata:
  version: "1.1.0"
---

# RADAR DE FORMATOS — Fernando Gofferje

## 📋 WORKFLOW EXECUTIVO

0. **CARREGAR CONFIG** → PASSO 0 abaixo (obrigatório)
1. **COLETAR DADOS** → PASSO 1: prints/links do usuário ou vitrine pública (ver "Ambiente (app Claude)")
2. **ESCOLHER MODO** → RADAR / ANALISAR (inclui auditar o próprio perfil) / ADAPTAR — ou RADAR + ADAPTAR combinado
3. **EXECUTAR ANÁLISE** → Decomponha o formato em elementos
4. **IDENTIFICAR PADRÕES** → Tendências, anti-padrões, oportunidades
5. **ENTREGAR** → Relatório ou briefing pronto para produção, com a origem de cada dado rotulada

---

## PASSO 0 — Carregar o config do criador (obrigatório)

Leia `references/config-mentorado.md` inteiro. É um Markdown com blocos YAML (não precisa rodar código); leia também comentários e a seção "Notas de conteúdo", se existir.

Campos: nome, instagram, bio, nicho, sub_nicho, tese, inimigos, tom, palavras_alta_voltagem, mitos_do_nicho, creators_referencia, fontes_nicho, podcasts_nicho, perfis (pessoal, negocio, perfil_dominante), conversor, produto, ticket, cta_base, cta_lead.

- Se o arquivo ainda estiver com o exemplo do template (ex.: "Dr. João Silva") ou faltar nome, nicho ou tom, avise que a skill não foi personalizada e peça esses dados antes de seguir. Campos opcionais vazios não bloqueiam.
- Não imponha limite de tamanho aos campos.

Prioridades:
1. O `tom` do config prevalece sobre qualquer regra de estilo desta skill (ex.: tom de gancho, narração e CTA do briefing). Se o tom pede sobriedade/sem alarmismo, "quente" = curiosidade forte, contraste, número surpreendente, tensão — nunca alarmismo, revolta ou medo fabricado.
2. O antagonista vem de `inimigos`. Nunca ataque quem o config trata como parceiro.
3. Todo dado factual precisa de fonte verificável; prazos, datas e números regulatórios devem ser confirmados antes de afirmar.
4. Respeite as regras de publicidade do conselho profissional do criador, quando houver (OAB, CFM, CRO, CRC etc.): sem promessa de resultado, sem sensacionalismo.

**Placeholders desta skill → campos do config:**

| Placeholder | Campo do config |
|---|---|
| {NOME} | `nome` |
| {INSTAGRAM} | `instagram` |
| {NICHO} | `nicho` (use `sub_nicho` quando ajudar a especificar) |
| {TOM} | `tom` |
| {INIMIGOS} | `inimigos` |
| {CREATORS_REFERENCIA} | `creators_referencia` |
| {PERFIL_DOMINANTE} | `perfis.perfil_dominante` |
| {CONVERSOR} | `conversor` |
| {CTA_BASE} | `cta_base` |
| {CTA_LEAD} | `cta_lead` |

**Se `creators_referencia` estiver vazio:** peça 3-5 @ ao usuário. Se ele não souber, proponha candidatos do {NICHO} (via busca web, se disponível) rotulados como "sugestão a confirmar" — não rode o radar sem a confirmação dele.

**Perfis de conteúdo:** classifique cada formato recomendado e cada briefing como 🟣 PESSOAL, 🟢 NEGÓCIO ou ⚫ AMBOS (definições em `perfis.pessoal` e `perfis.negocio`). Priorize o que casa com {PERFIL_DOMINANTE}; quando for "ambos", equilibre.

---

## Ambiente (app Claude)

Esta skill roda no app Claude (claude.ai / desktop). Limites que mudam o método:

- **Sem métricas do Instagram.** O Claude não tem acesso a views, duração de visualização, saves, shares, replay nem alcance — e em geral não consegue assistir reels. A vitrine pública via web mostra, no máximo, seguidores, datas, tipo de post e, às vezes, legendas e curtidas (muitas vezes o Instagram bloqueia até isso).
- **Nunca invente métricas.** Número que não veio de print/insight do usuário ou da vitrine pública não entra no relatório. Quando o campo depender de dado ausente, escreva: "não mensurável sem dados — mande prints".
- **Save rate, share rate, replay rate, retenção e alcance de não seguidores** só o dono da conta vê. Para creators de referência, isso é sempre inferência, nunca dado.
- **Pasta somente leitura, sem memória entre conversas.** Não salve arquivos; entregue tudo na conversa. Para comparar radares ao longo do tempo, o usuário precisa colar o relatório anterior.
- **Outras skills podem não estar instaladas** (cacador-de-ganchos-fernando-gofferje, cacador-de-hype-fernando-gofferje, deep-research-fernando-gofferje, minerador-viral-fernando-gofferje, roteirista-reels-fernando-gofferje). Sugira-as quando fizer sentido; nunca dependa delas para concluir a entrega.

**Rótulos de origem (use em todo relatório):**
- **DADO DO USUÁRIO** — veio de print, insight ou link enviado pelo usuário
- **OBSERVADO NA VITRINE** — visível no perfil público (seguidores, datas, tipo de post, legenda)
- **INFERIDO** — dedução a partir de capa, legenda ou descrição; declare que é inferência
- **NÃO MENSURÁVEL SEM DADOS** — o campo exige métrica que não foi fornecida

---

## PASSO 1 — Coleta de dados (antes do RADAR e do ANALISAR)

Antes de analisar, peça em uma mensagem curta:

> "Para o radar ser de performance e não só de frequência, me mande prints da aba Reels dos perfis de referência (com as views visíveis) e/ou links dos reels que chamaram sua atenção. Se não tiver, eu faço pela vitrine pública e rotulo tudo como FREQUÊNCIA OBSERVADA."

- **Com prints/links:** a análise é de PERFORMANCE (views do print = DADO DO USUÁRIO).
- **Sem prints:** faça o radar pela vitrine pública e rotule tudo como **FREQUÊNCIA OBSERVADA, não performance**. "Formato dominante" passa a significar "mais frequente", não "mais visto".
- **Auditar o próprio perfil de {NOME}:** peça prints dos insights (o criador tem acesso): views, tempo médio de visualização/retenção, saves, compartilhamentos e alcance de não seguidores por reel.
- **Se o usuário já mandou o material ou pediu para seguir sem ele**, não pergunte de novo — siga e rotule.
- **Caminho combinado RADAR + ADAPTAR:** junte numa única mensagem o pedido de prints/links e a pergunta de equipamento do ADAPTAR ("Você grava com celular ou câmera? Tem tripé, microfone, luz?"), para não interromper o usuário duas vezes.

**AMOSTRA INSUFICIENTE:** se a vitrine/insumo tiver **menos de 3 reels recentes legíveis por creator** (ou 0 em algum), declare **"⚠️ AMOSTRA INSUFICIENTE"** no topo do relatório (dizendo quais creators e quantos reels foram lidos), rebaixe formato dominante, tendências e recomendações a **hipótese** ("hipótese a confirmar com mais reels") e, no fim, peça de novo os prints da aba Reels e/ou links dos reels. Não complete a amostra com reels imaginados.

---

## 🎯 POR QUE FORMATOS IMPORTAM

O que separa os melhores reels dos piores **não é só o tema — é o formato**.

Um tema excelente em formato errado flopa. Um tema médio em formato acertado viraliza.

**O insight principal:** Existem padrões de formato (como filmar, editar, narrar, estruturar) que funcionam consistentemente — e mudam a cada 3-6 meses. Quem monitora e adapta primeiro, ganha.

---

## 📹 OS 5 FORMATOS VALIDADOS

Estes formatos funcionam em qualquer nicho. O segredo é adaptar a ESTRUTURA ao {NICHO} de {NOME} mantendo os princípios de formato. O "Tom" de cada formato é ponto de partida: o {TOM} do config sempre prevalece.

> **Sobre "Sinal de que está funcionando":** save, share, replay, comentários e alcance são métricas que só o dono da conta vê por completo. Use esses sinais apenas se o usuário fornecer os dados (insights do próprio perfil ou prints). Sem dados, escreva "não mensurável sem dados — mande prints".

### Formato 1: Narrativa Cinematográfica

**Como filma:** Câmera parada ou câmera no rosto + elementos visuais com imagens/conceitos do nicho

**Estrutura:** Narrativa linear (origem → obstáculo → virada → resultado)

**Edição:** Cortes rápidos entre fala e elementos visuais, texto overlay com números-chave

**Tom:** Storytelling, como se contasse uma história

**Duração ideal:** 60-120s

**Quando funciona:** Histórias de trajetória, origem do negócio, cases, transformações

**Sinal de que está funcionando (se o usuário fornecer os dados):** Alto save rate (pessoas salvam para referência)

### Formato 2: Opinião Direta

**Como filma:** Câmera no rosto, olhando direto para lente. Sem cenário elaborado.

**Estrutura:** Afirmação provocadora → contexto → dados → virada → lição

**Edição:** Mínima. Cortes de respiração. Texto overlay nos dados-chave.

**Tom:** Direto, confiante, levemente provocativo. "Deixa eu te falar uma coisa que ninguém tá falando." Se o {TOM} pede sobriedade, "provocativo" = contraste e dado surpreendente, nunca indignação. O alvo da crítica vem de {INIMIGOS}.

**Duração ideal:** 45-90s

**Quando funciona:** Mitos do nicho (use `mitos_do_nicho`), conselhos populares errados, verdades incômodas, ideias contraintuitivas

**Sinal de que está funcionando (se o usuário fornecer os dados):** Alto share rate + comentários polarizados

### Formato 3: Confissão + Lição

**Como filma:** Câmera casual (escritório, casa, ambiente real). Tom confessional, como se falasse com amigo.

**Estrutura:** "Eu cometi um erro..." → contexto → erro → custo → aprendizado → lição universal

**Edição:** Poucos cortes. Naturalidade. Pode ter pausa dramática.

**Tom:** Vulnerável mas confiante. Não é coitadismo, é maturidade.

**Duração ideal:** 60-120s

**Quando funciona:** Lições de carreira e gestão, erros caros, momentos de virada, aprendizados pessoais

**Cuidado:** em profissões regulamentadas, não exponha casos identificáveis de clientes/pacientes e respeite o sigilo profissional.

**Sinal de que está funcionando (se o usuário fornecer os dados):** Alto comment rate (pessoas compartilham seus próprios erros)

### Formato 4: Lifestyle com Lente de Nicho

**Como filma:** POV, ação em andamento (ambiente real, atividade). Não parece "conteúdo".

**Estrutura:** Ação/momento → "mas sabe o que isso tem a ver com [nicho]?" → insight → dado → lição

**Edição:** Dinâmica, transições naturais, texto overlay para dados

**Tom:** Casual, autêntico, como stories de amigo que ensina sem perceber

**Duração ideal:** 30-60s

**Quando funciona:** Hábitos de sucesso, bastidores, observações do cotidiano, comportamento

**Sinal de que está funcionando (se o usuário fornecer os dados):** Alto alcance (puxa muito topo de funil por parecer entretenimento)

### Formato 5: Entretenimento + Surpresa

**Como filma:** Interativo, visual, teste, desafio. Pode não ter fala nos primeiros 5s.

**Estrutura:** Hook visual/ação → setup → resultado surpreendente → "e isso significa que..." → insight

**Edição:** Mais elaborada. Gráficos, comparações visuais, text overlay forte

**Tom:** Divertido/curioso primeiro, educativo depois

**Duração ideal:** 30-75s

**Quando funciona:** Comportamento, tendências, dados contraintuitivos (com fonte verificável), testes práticos

**Sinal de que está funcionando (se o usuário fornecer os dados):** Altíssimo alcance + replay rate

---

## ❌ 6 ANTI-PADRÕES DE FORMATO (O que NÃO fazer)

1. **Talking head monótono** — câmera fixa, mesmo plano, mesma expressão. Sem dinâmica visual. Mata o alcance.

2. **Edição lenta com pausas longas** — faz parecer aula chata. O público atual quer velocidade.

3. **Texto overlay que compete com a fala** — se tem muito texto na tela, as pessoas leem em vez de ouvir. Escolha: OU texto OU fala clara, não ambos lutando.

4. **Sem hook visual/auditivo nos primeiros 3s** — se não parou, não vê mais. O gancho é tudo.

5. **Formato genérico que funciona em qualquer nicho** — a maioria dos criadores faz. Não diferencia. Procure formatos específicos que SÓ fazem sentido no {NICHO}.

6. **Narrativa previsível sem virada** — setup óbvio, desenvolvimento óbvio, conclusão óbvia. Nenhuma surpresa. Ninguém compartilha.

---

## 🔄 OS 3 MODOS DE OPERAÇÃO

### MODO 1: RADAR — Monitorar Formatos em Alta

**Quando usar:** {NOME} quer saber quais formatos estão funcionando AGORA no {NICHO}.

**Comando:** "RADAR" ou "o que tá funcionando?", "quais formatos estão em alta?", "benchmark de formatos"

**Processo:**

1. **Selecione creators para monitorar** — use {CREATORS_REFERENCIA} (se vazio, ver PASSO 0)

2. **Colete os dados (PASSO 1)** — peça prints da aba Reels com views e/ou links; sem isso, vitrine pública rotulada como FREQUÊNCIA OBSERVADA

3. **Monte a amostra de 5-10 reels por creator:**
   - **Com prints de views:** os reels recentes de maior view de cada creator (performance = DADO DO USUÁRIO)
   - **Sem prints:** os 5-10 reels mais recentes visíveis, sem ranking de performance

4. **Classifique cada reel por formato:**
   ```
   REEL: [Descrição em 1 linha]
   CREATOR: [@handle]
   FORMATO: [Qual dos 5 validados ou NOVO se não encaixar]
   COMO FILMA: [Câmera parada / POV / Tela verde / Casual / etc — observado ou INFERIDO da capa/legenda]
   EDIÇÃO: [Mínima / Média / Elaborada — observado ou INFERIDO]
   DURAÇÃO: [Xs, se visível no print/link — senão "não informado"]
   PERFORMANCE ESTIMADA: [views, somente se o usuário fornecer print — senão "não mensurável sem dados — mande prints"]
   PERFIL: [🟣 PESSOAL / 🟢 NEGÓCIO / ⚫ AMBOS]
   O QUE FUNCIONOU: [1 frase sobre o diferencial de formato — sem prints, "o que se destaca", não "o que performou"]
   ORIGEM: [DADO DO USUÁRIO / OBSERVADO NA VITRINE / INFERIDO]
   ```

5. **Identifique TENDÊNCIAS:**
   - Qual formato está aparecendo mais? (sem prints, é frequência, não performance)
   - Algum formato NOVO que não está nos 5 validados?
   - Mudanças de edição (mais rápida? mais lenta? mais gráficos?) — compare posts mais recentes com os mais antigos da amostra
   - Mudanças de tom (mais casual? mais polêmico? mais confessional?)

6. **Entregue relatório:**
   ```
   ═══════════════════════════════════════
   RADAR DE FORMATOS — [Data]
   NICHO: {NICHO}
   BASE DOS DADOS: [PERFORMANCE (prints com views) / FREQUÊNCIA OBSERVADA (vitrine pública)]
   [⚠️ AMOSTRA INSUFICIENTE: @x (N reels legíveis), @y (0) — recomendações abaixo são hipóteses. Omita a linha se a amostra bastou]
   ═══════════════════════════════════════

   📊 FORMATO DOMINANTE: [Com prints: o mais presente entre os reels de maior view. Sem prints: o mais frequente na amostra — FREQUÊNCIA OBSERVADA]
   📈 FORMATO EM ASCENSÃO: [O que aparece mais nos posts recentes do que nos antigos da amostra — rotular se é frequência ou performance]
   📉 FORMATO EM DECLÍNIO: [Somente se o usuário fornecer histórico (prints de períodos diferentes ou um radar anterior colado na conversa) — senão "não mensurável sem dados — mande prints"]
   🆕 FORMATO NOVO: [Se detectado, descrever]

   [Tabela com todos os reels analisados, com a coluna ORIGEM]

   💡 RECOMENDAÇÃO PARA {NOME}:
   - Formato recomendado: [Qual] + por quê
   - Perfil: [🟣 / 🟢 / ⚫] — alinhado a {PERFIL_DOMINANTE}
   - Anti-padrão a evitar: [Qual] + por quê

   ⚠️ LIMITES DESTA LEITURA: [O que ficou sem dado e o que mandar para a próxima rodada — com amostra insuficiente, repita aqui o pedido de prints/links]
   ═══════════════════════════════════════
   ```

7. **Se o pedido também pediu briefing** ("analisa os formatos e me dá um briefing"), não pare aqui: siga o caminho combinado RADAR + ADAPTAR (abaixo).

### MODO 2: ANALISAR — Deep Dive em Creator

**Quando usar:** {NOME} quer entender em profundidade como um creator específico está produzindo.

**Comando:** "ANALISAR @[handle]" ou "como o [creator] faz?", "analisa o formato do [creator]"

**Processo:**

1. **Colete os dados (PASSO 1)** — peça prints da aba Reels do @ com as views visíveis e links dos reels que o usuário quer destrinchar. Sem isso, use a vitrine pública e rotule como FREQUÊNCIA OBSERVADA.

2. **Analise 10-15 reels recentes** (últimos 30 dias, quando as datas estiverem visíveis)

3. **Identifique o padrão de formato** (marque cada item como observado ou INFERIDO):
   - Como filma (câmera, ângulo, cenário)
   - Como edita (cortes, transições, texto overlay, gráficos)
   - Como abre (primeiros 3s — visual, fala, texto?) — só observável com link assistível, transcrição, print ou descrição do usuário
   - Como fecha (CTA, pergunta, cliffhanger?) — idem
   - Duração média — se visível
   - Frequência de postagem — pelas datas da vitrine
   - Proporção entre formatos (qual % de cada formato)

4. **Entregue análise:**
   ```
   ═══════════════════════════════════════
   ANÁLISE DE FORMATO — @[handle]
   BASE DOS DADOS: [PERFORMANCE (prints/insights) / FREQUÊNCIA OBSERVADA (vitrine pública)]
   ═══════════════════════════════════════

   👤 CREATOR: [Nome]
   📊 SEGUIDORES: [X — OBSERVADO NA VITRINE]
   📈 MÉDIA DE VIEWS (últimos 30 dias): [Somente se o usuário fornecer prints com views — senão "não mensurável sem dados — mande prints"]

   🎬 PADRÃO DE FORMATO:
   - Formato principal: [X]
   - Formato secundário: [X]
   - Proporção: [X% formato A, Y% formato B]

   📹 COMO FILMA:
   [Detalhes de câmera, cenário, enquadramento]

   ✂️ COMO EDITA:
   [Detalhes de cortes, transições, overlays]

   🗣️ COMO NARRA:
   [Tom, ritmo, vocabulário, peculiaridades]

   ⏱️ TIMING (somente com link assistível, transcrição ou descrição do usuário — senão "não observável"):
   - Duração média: [Xs]
   - Gancho: primeiros [X]s
   - Pico narrativo: [X-Y]s
   - CTA: últimos [X]s

   🔥 TOP 3 REELS (formato):
   [Com prints de views: os 3 mais vistos. Sem prints: "3 reels mais representativos do formato" — não é ranking de performance]
   1. [Reel + o que funcionou/se destaca no FORMATO]
   2. [Reel + o que funcionou/se destaca no FORMATO]
   3. [Reel + o que funcionou/se destaca no FORMATO]

   ❌ BOTTOM 3 REELS (formato):
   [Somente se o usuário fornecer prints com views — senão "não mensurável sem dados — mande prints"]
   1. [Reel + o que falhou no FORMATO]
   2. [Reel + o que falhou no FORMATO]
   3. [Reel + o que falhou no FORMATO]

   💡 O QUE COPIAR:
   [2-3 elementos de formato que {NOME} pode adaptar — com perfil 🟣/🟢/⚫]

   ⚠️ O QUE NÃO COPIAR:
   [1-2 elementos específicos demais do creator — incluindo bordões e CTA idênticos]
   ═══════════════════════════════════════
   ```

#### Variante: AUDITAR o próprio perfil de {NOME}

**Comando:** "audita meu perfil", "ANALISAR {INSTAGRAM}", "o que tá funcionando no meu perfil?"

- Peça prints dos insights (o criador tem acesso): views, tempo médio de visualização/retenção, saves, compartilhamentos e alcance de não seguidores por reel. Sem esses prints, a auditoria fica restrita a formato e frequência (vitrine) e diz isso.
- Com os insights, TOP 3, BOTTOM 3 e os "Sinais de que está funcionando" de cada formato passam a valer como DADO DO USUÁRIO.
- Use o mesmo template da análise, acrescentando:
  ```
  🔍 LACUNA vs REFERÊNCIAS: [Formatos que os {CREATORS_REFERENCIA} usam e {NOME} não usa — e vice-versa]
  🎯 PRÓXIMO FORMATO A TESTAR: [Qual + perfil 🟣/🟢/⚫ + por quê]
  ```

### MODO 3: ADAPTAR — Transformar Formato em Briefing

**Quando usar:** {NOME} viu um formato que gostou e quer um briefing para replicar.

**Comando:** "ADAPTAR [formato/reel]" ou "quero fazer igual a esse", "adapta esse formato"

**Processo:**

1. **Identifique o formato original** (link de reel, print ou descrição). Se não conseguir assistir o link, peça um print ou uma descrição dos primeiros 3s e da estrutura. Sem link nem print, use o conteúdo mais legível que encontrar (legenda, capa, transcrição, descrição do usuário) e declare no briefing em que ele se baseou.

2. **Decomponha o formato em elementos** (use o template de Decomposição de Formato abaixo):
   - Câmera/cenário
   - Estrutura narrativa (blocos)
   - Edição/transições
   - Tom/ritmo
   - Texto overlay
   - Duração

3. **Adapte para {NOME}:**
   - Tom: {TOM} (prevalece sobre o tom do creator original)
   - Equipamento: o config não informa. Pergunte em 1 linha ("Você grava com celular ou câmera? Tem tripé, microfone, luz?") ou, se o usuário quiser seguir direto, assuma o mínimo — **celular + luz natural** — e declare a suposição no briefing
   - Cenários acessíveis
   - {NICHO} como base temática; antagonista vindo de {INIMIGOS}
   - Perfil: 🟣 / 🟢 / ⚫, alinhado a {PERFIL_DOMINANTE}

4. **Entregue briefing de produção:**
   ```
   ═══════════════════════════════════════
   BRIEFING DE FORMATO — [Nome do formato]
   ═══════════════════════════════════════

   🎬 FORMATO ORIGINAL: [Creator + reel de referência — e em que material o briefing se baseou: link, print, legenda ou descrição]
   🎯 CRIADOR: {NOME}
   📍 NICHO: {NICHO}
   🧭 PERFIL: [🟣 PESSOAL / 🟢 NEGÓCIO / ⚫ AMBOS]
   📌 SUPOSIÇÕES: [Ex.: "equipamento não informado — assumi celular + luz natural"]

   📹 SETUP DE GRAVAÇÃO:
   - Câmera: [Celular / Câmera + tripé / POV — conforme o equipamento informado ou suposto]
   - Cenário: [Escritório / Casa / Rua / Tela verde]
   - Enquadramento: [Close / Médio / Dinâmico]
   - Iluminação: [Natural / Ring light / Estúdio]

   📝 ESTRUTURA DO VÍDEO:
   - [0-3s]: [O que acontece — exatamente]
   - [3-10s]: [Setup/contexto]
   - [10-30s]: [Desenvolvimento]
   - [30-Xs]: [Clímax/virada]
   - [X-final]: [Lição + CTA]

   ✂️ EDIÇÃO:
   - Cortes: [Frequência e estilo]
   - Texto overlay: [Quando e como usar]
   - Transições: [Tipo]
   - Gráficos: [Se aplicável]
   - Música/som: [Se aplicável]

   🗣️ NARRAÇÃO:
   - Tom: [Como falar — use {TOM}]
   - Ritmo: [Velocidade, pausas]
   - Primeira frase: "[Modelo de abertura para gancho]"

   🎯 CTA:
   - Conversão: {CTA_LEAD} (leva ao {CONVERSOR})
   - Alternativa para reel de alcance/topo de funil: {CTA_BASE}
   - ⚠️ Se o CTA de {NOME} for idêntico ao do creator de referência, sinalize o risco de parecer cópia e sugira uma variação mantendo a mesma ação

   📏 SPECS:
   - Duração total: [Xs]
   - Formato saída: [1080x1920 vertical para Reels]
   - FPS: [24 ou 30]

   ⏰ TIMELINE DE PRODUÇÃO:
   - Gravação: [X minutos]
   - Edição: [Y minutos]
   - Review: [Z minutos]
   ═══════════════════════════════════════
   ```

### CAMINHO COMBINADO: RADAR + ADAPTAR

**Quando usar:** o pedido mistura análise e produção — "analisa os formatos e me dá um briefing", "vê o que tá funcionando e me diz o que gravar".

1. Rode o RADAR completo (PASSO 1 incluso), com a base dos dados rotulada. Faça as perguntas das duas etapas (prints/links + equipamento) numa única mensagem, antes de começar.
2. Escolha o formato recomendado no relatório.
3. Feche com um briefing ADAPTAR desse formato. Use como reel de referência o link/print que o usuário mandou; sem link nem print, use o conteúdo mais legível encontrado no radar e declare isso no campo FORMATO ORIGINAL.

---

## 🎨 DECOMPOSIÇÃO DE FORMATO (Template Universal)

Quando analisar qualquer formato, use esta estrutura. Marque a origem de cada elemento, com a mesma condição do ANALISAR: **OBSERVADO** (visto no link, print, legenda ou descrição do usuário), **INFERIDO** (deduzido de capa/legenda — declare) ou **NÃO OBSERVÁVEL** (gancho, pico, CTA e timing sem link assistível, transcrição, print ou descrição). "Não observável" é resposta válida — não preencha por suposição.

```
ELEMENTO | DESCRIÇÃO | FUNÇÃO | ORIGEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Câmera | [tipo, ângulo] | [por que funciona] | [OBSERVADO / INFERIDO / NÃO OBSERVÁVEL]
Cenário | [onde gravou] | [por que funciona] | [...]
Edição | [cortes, transições] | [cria ritmo/emoção] | [...]
Texto overlay | [quando aparece] | [reforça mensagem] | [...]
Narração | [tom, velocidade] | [cria identificação] | [...]
Gancho | [primeiros 3s] | [para o scroll] | [...]
Pico | [momento mais forte] | [ativa emoção máxima] | [...]
CTA | [fechamento] | [define próximo passo] | [...]
```

---

## 💡 CHECKLIST POR MODO

### Em qualquer modo:
- ✅ Config carregado e validado (PASSO 0)?
- ✅ Nenhuma métrica inventada; todo número tem origem rotulada?
- ✅ Campos sem dado marcados como "não mensurável sem dados — mande prints"?

### Se escolheu RADAR:
- ✅ Pediu prints/links antes (PASSO 1) e rotulou a base: PERFORMANCE ou FREQUÊNCIA OBSERVADA?
- ✅ Analisou 5-10 reels recentes de cada creator de referência — ou declarou AMOSTRA INSUFICIENTE (< 3 por creator), rebaixou as recomendações a hipótese e pediu prints/links de novo?
- ✅ Identificou qual formato aparece mais vezes?
- ✅ Apontou algum formato NOVO que não está nos 5 validados?
- ✅ Recomendou qual formato {NOME} deveria priorizar, com perfil 🟣/🟢/⚫?

### Se escolheu ANALISAR (ou AUDITAR o próprio perfil):
- ✅ Analisou 10-15 reels do creator selecionado?
- ✅ Identificou padrão consistente de formato?
- ✅ Mostrou top 3 (rotulado como ranking ou como "representativos") e bottom 3 só com views fornecidas?
- ✅ Apontou o que copiar e o que NÃO copiar?
- ✅ Na auditoria do próprio perfil, pediu prints dos insights?

### Se escolheu ADAPTAR (ou RADAR + ADAPTAR):
- ✅ Decomposição de formato em 8+ elementos, com a origem de cada elemento marcada (não observável é resposta válida)?
- ✅ No RADAR + ADAPTAR, perguntas (prints/links + equipamento) juntas numa única mensagem?
- ✅ Briefing adaptado para {TOM}, {NICHO} e equipamento (perguntado ou suposição declarada)?
- ✅ CTA vindo de {CTA_LEAD}, checado contra o do creator de referência?
- ✅ Timeline de produção realista?
- ✅ Primeira frase de gancho proposta?

---

## ❌ O QUE ESTA SKILL NÃO FAZ

- **NÃO escreve roteiros completos** — isso é da skill `roteirista-reels-fernando-gofferje`
- **NÃO caça temas na web** — isso é da skill `cacador-de-hype-fernando-gofferje`
- **NÃO gera ganchos em massa** — isso é da skill `cacador-de-ganchos-fernando-gofferje`
- **NÃO extrai posts de texto** — isso é da skill `minerador-viral-fernando-gofferje`
- **NÃO faz pesquisa profunda de dados** — isso é da skill `deep-research-fernando-gofferje`

Essas skills podem não estar instaladas: sugira o próximo passo, mas entregue o que é desta skill sem depender delas.

Esta skill faz UMA coisa: **analisar COMO creators de referência estão produzindo (formato) → identificar padrões → entregar briefings de produção adaptados ao {NOME}.**

---

## 📍 IMPORTANTE

Formatos evoluem. O que funcionava em janeiro pode não funcionar em março. Rode RADAR a cada 2-3 semanas para ficar atualizado com as tendências do {NICHO}. Como a skill não tem memória entre conversas, oriente o usuário a guardar cada relatório e colar o anterior na próxima rodada — é isso que permite apontar FORMATO EM DECLÍNIO com base real.
