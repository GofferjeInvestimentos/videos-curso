# videos-curso

Vídeos do curso da Gofferjé Investimentos, feitos com [Remotion](https://www.remotion.dev).

## Composições

| ID | Formato | Uso |
| --- | --- | --- |
| `AulaVertical` | 1080×1920 | Reels, TikTok, Shorts |
| `AulaHorizontal` | 1920×1080 | YouTube, plataforma do curso |

As duas usam o mesmo componente (`src/Aula`): abertura com módulo/título/subtítulo,
lista de tópicos da aula e encerramento. A duração se ajusta ao número de tópicos.
O conteúdo de exemplo está em `src/Aula/schema.ts` e pode ser editado pelo painel
de props do Studio.

## Comandos

```bash
npm install
npm run dev                                          # Remotion Studio
npx remotion render AulaVertical out/aula-vertical.mp4
npx remotion render AulaHorizontal out/aula-horizontal.mp4
```

Para outra aula sem mexer no código, passe as props por JSON:

```bash
npx remotion render AulaVertical out/aula2.mp4 --props=aula2.json
```
