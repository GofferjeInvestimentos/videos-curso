# Estrutura Narrativa de 8 Blocos — Regras Detalhadas

Esta é a estrutura padrão da skill. Todo roteiro DEVE seguir estes 8 blocos, nesta ordem (as variações Case / Confissão / Entretenimento do SKILL.md mantêm esse esqueleto), com o timing proporcional à duração-alvo.

## Visão Geral do Fluxo

Tempos em proporção da duração; entre parênteses, o exemplo para 60s | 90s.

```
BLOCO 1: GANCHO (~5-10% | 0-4s | 0-6s)
    ↓
BLOCO 2: CONTEXTO MÍNIMO (~5-10% | até ~8s | até ~12s)
    ↓
BLOCO 3: EXPECTATIVA PADRÃO (~10% | até ~14s | até ~21s)
    ↓
BLOCO 4: VIRADA/DECISÃO CONTRAINTUITIVA (~10-15% | até ~20s | até ~30s)
    ↓
BLOCO 5: CONSEQUÊNCIA EM CADEIA (~30-40% | até ~42s | até ~63s) ← MAIOR BLOCO
    ↓
BLOCO 6: RESULTADO (~10% | até ~48s | até ~72s)
    ↓
BLOCO 7: LIÇÃO UNIVERSAL (~10% | até ~54s | até ~81s)
    ↓
BLOCO 8: CTA COERENTE (~5-10% | até 60s | até 90s)
```

**Duração:** a pedida pelo usuário manda; sem pedido, 60-90 segundos. Evitar passar de 2 minutos.

**Régua de tamanho:** fala de reels ≈ 15 caracteres/s (com espaços) ≈ 2,6 palavras/s (≈155 palavras/min). 30s ≈ 75-80 palavras (~450 caracteres); 45s ≈ 115-120 palavras (~675); 60s ≈ 150-160 palavras (~850-900 caracteres); 90s ≈ 225-235 palavras (~1.300-1.350 caracteres); 120s ≈ 300-310 palavras (~1.800). Tolerância ±10%. Distribuição por bloco em caracteres: tabela em "Regras de tamanho" do SKILL.md.

**Princípio:** o problema NÃO é ser longo. É ser longo CEDO DEMAIS. Contexto pesado antes da virada = morte. O texto cresce DEPOIS que a curiosidade está instalada.

---

## Bloco 1: Gancho (primeiros ~3-6s)

**Função:** Travar o scroll com contraste + promessa rara.

A maior parte do abandono acontece nos primeiros segundos (heurística de plataforma). Se não reter aqui, o vídeo morreu.

### Erros Mortais — Nunca Cometa

**Palavras proibidas no gancho:**
- "isso" / "disso"
- "assim"
- "algo"
- "uma coisa"
- "de graça" (linguagem de coach)
- Qualquer pronome demonstrativo abstrato

**Estruturas proibidas:**
- Perguntas ("X é besteira?")
- "Vou te mostrar..."
- "Deixa eu te contar..."
- "Você sabia que..." (sem especificar O QUÊ)

### Palavras de Alta Voltagem (use 1+ no gancho, dentro do `tom`)

Tire as palavras de `palavras_alta_voltagem` do config e organize-as nestas três categorias (se o config tiver poucas, derive outras do nicho e do `tom`, sem sair do registro do criador):

- **Dor:** perda, risco, erro caro, armadilha do nicho
- **Ganho/Status:** proteção, previsibilidade, bastidores, resultado concreto
- **Inimigos:** derivados de `inimigos` (nunca quem o config trata como parceiro)

[exemplo ilustrativo — adapte ao nicho do config]: Dor: "armadilha", "prejuízo", "erro caro"; Ganho: "blindado", "previsível", "bastidores"; Inimigo: o antagonista nomeado em `inimigos`.

Se o `tom` pede sobriedade, a voltagem vem de contraste, número surpreendente e especificidade, não de palavras agressivas.

### Estruturas Validadas para Gancho

1. **Quebra de Crença:** "Todo mundo acha que [X] é o problema. Não é."
2. **Decisão Extrema:** "[Personagem] [decisão extrema concreta]. Parecia loucura. Hoje explica tudo."
3. **Paradoxo Impossível:** "[Estratégia/coisa concreta] não deveria funcionar. Funcionou."
4. **Erro Oculto:** "O erro de [personagem/público] não está em [X]. Está em [Y]."
5. **Paradoxo do Custo:** "O [RECURSO] que eu [PERDI] [FAZENDO ALGO QUE PARECE CERTO]"
6. **Revelação de Engano:** "Como [MARCA/PRÁTICA] te vende [BARATO] a preço de [CARO] (e você nem percebe)" — só com prova e com alvo coerente com `inimigos`

### Checklist do Gancho

- Quebra expectativa/crença? Causa dissonância cognitiva?
- Contraintuitivo? Desafia o senso comum?
- Específico? Tem números, nomes, produtos, valores concretos?
- Sem abstração? Zero pronomes demonstrativos vagos?
- Gera curiosidade ANTES de informar? Não explica tudo já?
- Até ~150 caracteres (1-2 frases)?
- Cabe em uma respiração única?

### O Gancho Já Vem Pronto da Estrutura?

Se sim, avalie: ele cabe em uma respiração? Se tem mais de 2 frases, reescreva em no máximo 2, mantendo o paradoxo central.

---

## Bloco 2: Contexto Mínimo (~5-10% da duração)

**Função:** Situar criando imagem visceral, não só informando.

### Regras
- Máximo 2 frases (até ~150 caracteres; gancho + contexto juntos até ~20% do roteiro)
- Nunca dê aula aqui
- Uma informação por vez
- A primeira frase DEVE ser a continuação natural do gancho — como se fosse a próxima frase de uma conversa. O espectador não pode sentir a emenda

### Exemplos

[exemplo ilustrativo — adapte ao nicho do config]
- ❌ **Ruim:** "Como eu reconstruiria um negócio se zerassem tudo amanhã."
- ✅ **Bom:** "Você acorda amanhã. Abre o Instagram: zero seguidores. YouTube: canal deletado. Dez anos de trabalho. Sumiu."

### Validação
- Valida imediatamente o que foi prometido no gancho?
- É mínimo o suficiente para não perder ritmo?
- A transição gancho→contexto é fluida?

---

## Bloco 3: Expectativa Padrão (~10% da duração)

**Função:** Alinhar o senso comum do público. Sem estabelecer o "normal", a virada não impacta.

### Regras
- O espectador deve se reconhecer no comportamento descrito
- Mostre a ação CONCRETA que a maioria faz, não descrição genérica
- Os `mitos_do_nicho` do config são a matéria-prima natural deste bloco
- **Regra dos 3:** máximo 3 exemplos em sequência. Do quarto em diante é redundância. O terceiro item deve ser o mais forte e, idealmente, interpretar os dois anteriores

### Exemplos

[exemplo ilustrativo — adapte ao nicho do config]
- ❌ **Ruim:** "Posta todo dia. Copia a trend. Compra curso. Contrata agência. Troca de nicho. Muda a bio. Muda de novo."
- ✅ **Bom:** "Posta todo dia. Copia a trend da semana. E ainda assim ninguém lembra o nome dele."

---

## Bloco 4: Virada/Decisão Contraintuitiva (~10-15% da duração)

**Função:** Momento-chave do roteiro. Coração do conteúdo.

### Regras
- Uma decisão clara com risco real
- Algo que foge do padrão estabelecido no Bloco 3
- Nunca declare a virada diretamente — crie um micro-setup de meio segundo antes do payoff
- **TIMING CRÍTICO:** DEVE aparecer até ~1/3 da duração (60s: até ~20s; 90s: até ~30s). Depois disso é tarde demais

### Exemplos

[exemplo ilustrativo — adapte ao nicho do config]
- ❌ **Ruim (declaração direta):** "Eu recusei o maior cliente do ano porque ele não respeitava o processo."
- ✅ **Bom (micro-setup + payoff):** "Chegou a proposta que qualquer um aceitaria. O maior contrato do ano. Eu disse não."

### Validação
- Existe risco real nessa decisão?
- Dá pra imaginar o fracasso?
- É genuinamente contraintuitivo?
- Se a virada não tem decisão clara com risco real → sinalize "⚠️ VIRADA FRACA" antes de prosseguir

---

## Bloco 5: Consequência em Cadeia (~30-40% da duração)

**Função:** Coração do roteiro. DEVE ser o bloco mais longo (~30-40% do roteiro total). Em reels de 30s, reduza a 1-2 elos em vez de estourar o tempo.

Este bloco é o que separa roteiros matadores de roteiros medianos. Se a cadeia está curta, o roteiro está fraco.

### Regras Fundamentais

1. **Nunca liste em paralelo.** Sempre encadeie: decisão → efeito 1 → efeito 2 → resultado
2. **Crie cena** com personagens, diálogos, situações concretas. O espectador acompanha uma jornada, não um relatório
3. **Alterne dado → significado** dentro da cadeia. Não apenas descreva — pause e interprete
4. **Inclua pelo menos 1 número concreto** dentro da cadeia (não só no resultado)
5. **Máximo 3 consequências encadeadas**
6. Se a estrutura recebida incluir trechos-chave das fontes, integre-os aqui como fala natural

### Pattern Interrupt (OBRIGATÓRIO)

Por volta da metade do vídeo (≈ 50-60% da duração; ~30s num reel de 60s), insira uma quebra de padrão. Pode ser:
- Frase seca e curta depois de um bloco longo
- Resumo brutal
- Mudança abrupta de tom (dentro do registro do `tom` do config)

Exemplos (adapte ao tom do config):
- "Cinco anos fazendo do jeito que todo mundo manda. Agora olha o outro lado."
- "Isso custa caro. Muito mais caro do que parece."
- "Tá achando bonito? Espera."
- "Agora olha o que ninguém te conta."

### Exemplos

[exemplos ilustrativos — adapte ao nicho do config; personagem pode ser real e verificável ou arquetípico/anônimo, nunca um caso real inventado]
- ❌ **Ruim (só descreve):** "O Paulo chega em casa. Tenta explicar. Esquece os argumentos. A esposa veta."
- ✅ **Bom (descreve e interpreta):** "O Paulo chega em casa. Tenta explicar pra Joana no jantar. Mas pensa comigo. O Paulo não é vendedor. Ele é engenheiro, contador, médico. Qualquer coisa menos vendedor. Você passou 45 minutos construindo valor. Ele vai comprimir tudo em duas frases entre o arroz e a sobremesa."

### Exemplos de cenas específicas vs genéricas

- ❌ **Genérico:** "Os amigos estavam no bar. Reclamando do salário. Sem fazer nada diferente."
- ✅ **Específico:** "No mesmo final de semana, os mesmos caras que riram do blog me chamaram pro churrasco. Tive que escolher. Churrasco ou gravar. Fui gravar."

### Validação
- Cadeia é o maior bloco e tem ~30-40% dos caracteres do roteiro total?
- Tem número concreto?
- Tem alternância dado → significado?
- Não tem trecho genérico que qualquer creator usaria?
- Pattern interrupt está presente?
- Se a cadeia tem material insuficiente → sinalize "⚠️ CADEIA FRACA — preciso de mais material sobre [X]"

---

## Bloco 6: Resultado (~10% da duração)

**Função:** Consequência natural, nunca milagre. Tem que parecer inevitável.

### Regras
- Números concretos obrigatórios (com fonte, ou fornecidos/autorizados pelo criador)
- Conectar claramente à decisão do Bloco 4
- Resultado vem DEPOIS da lógica — nunca como único atrativo
- Não pode parecer "mágica" ou sorte
- É o resultado do caso contado, nunca promessa de resultado ao espectador (regras do conselho profissional, quando houver)

---

## Bloco 7: Lição Universal (~10% da duração)

**Função:** A lição transcende o caso. Não é sobre aquela empresa ou pessoa. É sobre disciplina, decisão, critério, visão de longo prazo — conectada à `tese` do config.

### Regras
- Nunca apenas declare. Dê uma **ferramenta**, um critério, um teste ou uma pergunta que o espectador possa usar na vida real
- A lição deve ser aplicável à vida do espectador
- Deve ir além do caso específico
- **A lição deve SURPREENDER.** Se o espectador já adivinha qual será a lição antes de você falar, ela está fraca. A melhor lição é aquela que NÃO É a coisa óbvia que está na cabeça da pessoa. Não é "use IA", não é "crie polêmica", não é "invista em marketing". É o ângulo que ninguém pensou.

### Teste da Lição Surpreendente
Antes de finalizar o Bloco 7, faça este teste:
1. **"Se eu perguntasse pro espectador 'qual é a lição aqui?', ele acertaria?"** Se sim → a lição está óbvia demais. Reformule.
2. **"A lição contradiz ou requalifica o que o espectador estava pensando?"** Se sim → está no caminho certo.
3. **"A lição é específica o suficiente pra ser aplicável amanhã?"** Se é genérica ("marketing importa"), está fraca.

### Exemplos de qualidade crescente

[exemplos ilustrativos — adapte ao nicho do config]
- ❌ **Ruim (declaração óbvia):** "Nunca aceite conselhos de quem não construiu o que você quer."
- ❌ **Ruim (lição previsível):** "A lição aqui é: use IA no marketing." (todo mundo já pensou isso)
- ⚠️ **Médio (pergunta filosófica):** "Você vai parar ou continuar?"
- ✅ **Bom (surpreende):** "A lição aqui não é 'use IA'. É outra. Toda marca tem uma história emocional enterrada no passado. Se você encontrar esse momento e recontar com a tecnologia certa, a distribuição vem de graça. Porque as pessoas não compartilham propaganda. Compartilham emoção."
- ✅ **Bom (ferramenta):** "Antes de aceitar qualquer conselho, faz uma pergunta. Essa pessoa construiu a vida que eu quero? Se não, o conselho é sobre os medos dela. Não sobre o seu futuro."
- ✅ **Bom (exercício prático):** "Escreve num papel: o que eu cortaria hoje se precisasse sobreviver mais 6 meses? Essa lista é a sua bússola."

---

## Bloco 8: CTA Coerente (~5-10% da duração)

**Função:** Continuação natural da história. Nunca interromper o raciocínio.

### Regras
- O CTA nasce da lição, não do nada
- Máximo 2 frases: variação temática + CTA do config
- SEMPRE use primeira pessoa na variação temática
- Cada CTA deve ser único — conecte ao tema específico
- **Qual CTA usar:** objetivo lead/conversão → `cta_lead`; objetivo seguir/autoridade → `cta_base`. Pode combinar os dois se couber no tempo (ex.: variação temática + `cta_lead`, com a assinatura do `cta_base` resumida). Adapte a redação sem mudar a mecânica (palavra-chave, link, promessa) e diga na entrega qual usou.

### Estrutura
```
Seguir/autoridade: [Frase curta conectando ao tema, em primeira pessoa] + [cta_base do config]
Lead/conversão:    [Frase curta conectando ao tema, em primeira pessoa] + [cta_lead do config]
```

### O que evitar
- ❌ CTA genérico desconectado do roteiro
- ❌ CTA agressivo ou com promessa de resultado
- ❌ Mais de 2 frases
- ❌ Generalização ("Um processo comercial sério" é fraco. "Eu construí um time comercial que converte 30%" é forte) [exemplo ilustrativo — número só se for real e verificável]
