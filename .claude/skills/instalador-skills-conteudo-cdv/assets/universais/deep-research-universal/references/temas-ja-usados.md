# Registro de Temas Usados — Deep Research Universal (modelo)

> Este arquivo é um **modelo de registro**, não uma memória automática.
> No app Claude a pasta da skill é somente leitura e não há memória entre conversas, então a skill não consegue atualizar este arquivo.

## Como funciona

1. Ao final de cada rodada, a skill entrega no chat um bloco **"Registro de temas usados"** já preenchido, no formato abaixo. Nome, instagram e nicho vêm de `references/config-mentorado.md`.
2. O usuário guarda esse bloco (nota, documento, Notion etc.).
3. Numa conversa futura, o usuário cola o registro junto com o pedido. A skill trata tudo o que está nele como histórico e não repete tema, personagem/empresa ou dado central.
4. Se o usuário colar um registro anterior, a skill devolve o registro consolidado (antigo + novo), para ele guardar sempre uma versão só.

Se a seção "Histórico pré-carregado" (no fim deste arquivo) tiver linhas preenchidas, a skill também as considera histórico.

## Formato do registro

```
## Registro de temas usados — [nome] ([instagram])
Nicho: [nicho]
Última rodada: AAAA-MM-DD

### Contraintuitivo do Nicho
Data | Personagem/Empresa/Foco | Mito demolido | Gancho | Fonte principal
---|---|---|---|---

### Case Surpreendente
Data | Personagem/Empresa | Jornada | Gancho | Fonte principal
---|---|---|---|---

### Erro que Custa Caro
Data | Erro comum | Consequência real | Gancho | Fonte principal
---|---|---|---|---

### Notas
- Temas bloqueados (e motivo):
- Personagens/empresas já usados 2+ vezes:
- Fontes muito usadas:
```

---

## Histórico pré-carregado (opcional)

> Espaço para colar, antes de empacotar a skill, temas que o criador já usou (no formato acima). Deixe como está se não houver.

Nenhum tema registrado.

