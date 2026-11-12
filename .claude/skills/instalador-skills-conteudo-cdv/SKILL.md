---
name: instalador-skills-conteudo-cdv
description: Personaliza e instala, no computador do próprio membro, as 6 skills universais de conteúdo do Clube do Valor (Caçador de Ganchos, Roteirista de Reels, Deep Research, Caçador de Hype, Minerador Viral, Radar de Formatos). Lê o PDF de Definição de Audiência e Referências (gerado no caderno de implementação do CAN) que a pessoa anexar, pergunta só o que faltar, monta o config dela e instala as 6 skills com o nome dela em ~/.claude/skills. Use quando a pessoa pedir "personalize as skills de conteúdo", "instale as skills universais", "instale e personalize com o meu PDF", "atualize minhas skills de conteúdo", ou anexar o zip das skills universais junto com o PDF de Definição de Audiência e Referências.
---

# Instalador das skills de conteúdo do CDV — o membro personaliza sozinho

**O que é:** as 6 skills universais de conteúdo do Clube do Valor vêm "em branco" (com um
exemplo fictício, o "Dr. João Silva"). Esta skill troca o exemplo pelos dados da pessoa e
instala as 6 já com o nome dela. Com elas instaladas, é onde todo o conteúdo começa.

**Quem usa:** o próprio membro, que muitas vezes **nunca usou o Claude Code**. Fale simples,
um passo de cada vez, sem jargão. Diga o que vai fazer antes de fazer. Antes de cada
pedido de permissão, explique em uma frase o que o comando faz.

**Onde ficam as 6 skills universais:** `assets/universais/` desta skill (uma pasta por skill,
cada uma com `SKILL.md` e `references/config-mentorado.md`). **Nunca editar essas pastas** —
elas são o molde. Tudo acontece numa cópia.

**Instalação junto com outras skills:** o guia do CAN manda a pessoa arrastar, num chat só,
este zip + os zips das ferramentas (reels-b-roll, carrossel-tweet, plano-de-acao-conteudo-cdv)
+ o PDF. Nesse caso, **comece por esta skill**: as perguntas acontecem primeiro, enquanto a
pessoa está olhando; a instalação demorada das outras (ffmpeg, Python…) vem depois, e ela
pode sair de perto. Se esta skill acabou de ser copiada e ainda não aparece como skill na
sessão, leia este `SKILL.md` direto do disco e siga.

**As etapas são 6.** As com ⛔ GATE terminam em: mostrar, esperar o OK da pessoa, só então avançar.

---

## Etapa 1 — Juntar o material
O que a pessoa traz (anexado no chat ou na pasta aberta):
- **o PDF de Definição de Audiência e Referências** — a fonte principal. É gerado no caderno
  de implementação do CAN e traz público, oferta, canal de entrada do cliente, tom e perfis
  de referência;
- se quiser: o @ do Instagram e o site.

Sem o PDF: peça antes de seguir (ele sai do caderno de implementação do CAN). Leia **tudo** por completo.
- PDF que o Claude não consegue abrir: peça para a pessoa colar o texto, ou instale o leitor
  (`pip install pypdf`, explicando antes) e extraia o texto.
- O @ e o site: abra para conferir nicho, bio e tom. Instagram às vezes bloqueia leitura
  automática; se bloquear, siga com o PDF e as respostas.

## Etapa 2 — Montar o rascunho do config
Preencha o modelo `references/config-template.md` com os dados da pessoa. De onde vem cada
campo e o que perguntar está em `references/campos.md` — **ler antes**. Regras:
- **Não inventar.** Produto, faixa de preço e números só vêm do material ou da pessoa. Sem
  fonte = perguntar.
- **Confidencialidade.** Nome de cliente da pessoa, fala real de cliente e número interno
  que estiver no PDF NÃO entram no config: use só a direção, com outras palavras.
- **Profissão regulada** (advogado, médico, dentista, contador, psicólogo…): o CTA não pode
  anunciar gratuidade, desconto nem promessa de resultado. Registre a regra no `tom`.
- **CTA próprio:** não repetir a palavra-chave de um creator de referência.
- `creators_referencia` vazio: pesquise na web 4 a 6 perfis reais do nicho que sirvam de
  referência de FORMATO para o público da pessoa. Nunca invente um @.

## Etapa 3 — Perguntar só o que falta ⛔ GATE
Mostre um resumo do que você entendeu, em linguagem de gente (não em YAML):
"Você é ___, fala com ___, defende que ___, vende ___, e o cliente chega por ___. Seu tom é ___."
Depois faça **no máximo 5 perguntas**, só as que o material não respondeu (lista pronta em
`references/campos.md`). Se o material já respondeu, não pergunte: mostre e peça um "ok".
A faixa de preço fica só no computador da pessoa — diga isso se ela hesitar.

## Etapa 4 — Instalar as 6 skills com o nome da pessoa
1. **Slug** = o nome da pessoa (ou da marca, se ela preferir) sem acento, minúsculo, com
   hífen: "Vitor Thaler" → `vitor-thaler`. Confirme o slug em uma linha.
2. **Config final** em YAML, no formato exato do modelo, sem nenhum campo pendente. Salve
   uma cópia na pasta aberta como `meu-config-de-conteudo.md` (é a "voz" dela; serve para
   atualizar depois).
3. Para cada pasta `assets/universais/<skill>-universal`, crie a cópia
   `~/.claude/skills/<skill>-<slug>` e, **só na cópia**:
   - troque o `name:` do SKILL.md pelo nome da pasta (só letras sem acento, números e hífen,
     até 64 caracteres — acento no `name` faz a skill não carregar);
   - troque as menções entre skills: `roteirista-reels-universal` → `roteirista-reels-<slug>`
     (o mesmo para `cacador-de-ganchos`, `cacador-de-hype`, `deep-research`,
     `minerador-viral`, `radar-de-formatos`);
   - troque os títulos "… Universal" / "… — Versão Universal" por "… — <Nome da pessoa>";
     a palavra "universal" no sentido comum ("lição universal") fica como está;
   - substitua `references/config-mentorado.md` pelo config final.
4. Se já existir uma versão anterior (`<skill>-<slug>` em `~/.claude/skills`), **não apague**:
   mova para `~/.claude/skills-antigas/<skill>-<slug>-<data>` (fora da pasta de skills, senão
   o Claude carrega as duas).
5. Use as ferramentas que existirem na máquina (no Mac, o terminal; no Windows, o PowerShell;
   ou as ferramentas de arquivo do próprio Claude). Não precisa de Python nem de nada extra.

## Etapa 5 — Conferir
- As 6 pastas existem em `~/.claude/skills/`, cada uma com `SKILL.md`.
- Em cada `SKILL.md`, o `name:` é igual ao nome da pasta e não tem acento.
- Nenhum arquivo das cópias ainda cita `-universal` como nome de skill.
- Em cada cópia, `references/config-mentorado.md` tem o nome da pessoa (e não "Dr. João Silva").
Mostre a lista das 6 skills instaladas com ✓.

## Etapa 6 — Entregar e ensinar a usar
1. Diga: **abra um chat novo** (no Code, o **+** ao lado da pasta, na lateral) para as skills
   novas aparecerem. Se não aparecerem, feche o aplicativo e abra de novo.
2. Mostre a tabela de `references/como-usar.md`, com **um pedido pronto para cada skill já no
   assunto da pessoa** (troque os exemplos genéricos pelo nicho dela) e a ordem que funciona.
3. Feche lembrando: para mudar algo depois (tom, CTA, produto), é só pedir "atualize minhas
   skills de conteúdo: ___" — esta skill refaz a partir do `meu-config-de-conteudo.md`.

## Se a pessoa também quiser usar no Chat (opcional, só se ela pedir)
As skills do Code não aparecem automaticamente no Chat do aplicativo. Para o Chat: gere um
.zip por skill (uma pasta raiz com o nome da skill e o `SKILL.md` dentro; barras `/` nos
caminhos do zip), salve na pasta aberta e explique: Configurações → Capacidades → ativar
"Execução de código e criação de arquivos" → Skills → "+" → fazer upload de cada zip.

---

## Armadilhas conhecidas
| Sintoma | Causa | Saída |
|---|---|---|
| Skill não aparece | o `name:` tem acento ou é diferente do nome da pasta | corrigir o `name:`; abrir chat novo |
| Aparecem skills duplicadas | versão antiga ficou dentro de `~/.claude/skills` | mover a antiga para `~/.claude/skills-antigas` |
| A skill responde como "Dr. João Silva" | o config não foi trocado naquela cópia | substituir `references/config-mentorado.md` da cópia |
| PDF não abre | leitor de PDF ausente | pedir o texto colado ou `pip install pypdf` |
| Caminho com acento quebra no Windows | PowerShell 5.1 lendo script como ANSI | rodar o comando direto, não salvar como .ps1 |
