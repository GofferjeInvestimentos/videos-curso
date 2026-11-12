# deep-research-universal — nota de operação

Este arquivo é só documentação para quem mantém o pacote. A skill não depende dele: todo o funcionamento está em `SKILL.md`.

## O que a skill faz

Pesquisa na web temas com potencial viral para reels, em qualquer nicho, usando 3 ângulos (Contraintuitivo do Nicho, Case Surpreendente, Erro que Custa Caro). Cada tema passa por uma checklist de validação e sai com fontes verificáveis, campo de verificação, gancho e perfil (🟣 PESSOAL / 🟢 NEGÓCIO / ⚫ AMBOS).

## Arquivos

```
deep-research-universal/
├── SKILL.md                      instruções completas da skill
├── README.md                     esta nota (opcional)
└── references/
    ├── config-mentorado.md       config do criador (preenchido por cliente)
    └── temas-ja-usados.md        modelo do registro de temas usados
```

## Personalização por cliente

- Toda a especificidade do cliente fica em `references/config-mentorado.md`. O resto da skill é neutro.
- A skill lê o config no PASSO 0 e para se ele ainda estiver com o exemplo do template ou sem nome, nicho ou tom.
- Opcional: colar em `references/temas-ja-usados.md` (seção "Histórico pré-carregado") temas que o cliente já usou.

## Limites no app Claude

- Pasta da skill somente leitura e sem memória entre conversas: a entrega é no chat e o histórico é mantido pelo usuário via bloco "Registro de temas usados".
- Sem acesso a métricas privadas do Instagram.
- Busca web pode falhar em alguns sites oficiais; a skill usa fontes alternativas e declara o que não verificou.

## Skills do mesmo pacote

cacador-de-ganchos-universal, cacador-de-hype-universal, deep-research-universal, minerador-viral-universal, radar-de-formatos-universal, roteirista-reels-universal. A skill só sugere as outras; não depende de nenhuma estar instalada.
