# Livre

Devocional e apoio a hábitos para jovens cristãos brasileiros. Vite + React + TypeScript + Tailwind + react-router-dom.
Dados só no `localStorage` (chave `livre.v1`), sem backend.

```bash
npm install
npm run dev     # desenvolvimento
npm run build   # produção (dist/)
```

## Publicação (Vercel)

- **Produção = branch `main`.** Todo merge na `main` publica sozinho em produção.
- Branches `claude/...` geram apenas *Preview*; não alteram o endereço principal.
- Para saber qual versão está aberta: **Ajustes → Sobre esta versão** mostra o código do deploy (7 primeiros caracteres do commit). Compare com o commit do deploy na Vercel.
- O app avisa sozinho quando há versão mais nova (barra "Há uma versão nova do Livre") e atualiza com um toque.
- `vercel.json` define rotas da SPA e cache: `index.html`, `sw.js` e `version.json` nunca ficam em cache; `/assets` fica em cache longo.

## Bíblia

Texto ACF em `public/data-acf/<livro>.json`. Confirme a licença antes de divulgar em larga escala (ver `public/data-acf/FONTE.txt`).
