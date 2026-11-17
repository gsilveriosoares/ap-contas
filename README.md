# ApContas

Portal de finanças pessoais: contas do mês, vencimentos, quanto falta pagar e quanto sobra.
Funciona no navegador e instala no celular como app (PWA). Plano completo em [docs/plano-apcontas.html](docs/plano-apcontas.html).

## Tecnologias

- Angular 22 (componentes standalone, signals, rotas sob demanda)
- Bootstrap 5.3 + Bootstrap Icons, tema em `src/styles/_variables.scss`
- Fontes Inter e Space Grotesk (embutidas, funcionam offline)
- Service worker do Angular (PWA), ativo só no build de produção

## Rodar no computador

```bash
npm install
npm start
```

Abre em http://localhost:4200. O guia visual da identidade fica em `/guia-visual`.

## Build de produção

```bash
npm run build
```

Gera `dist/ap-contas/browser`, a pasta que é publicada.

## Publicar na Cloudflare

O repositório funciona nos dois fluxos do painel da Cloudflare (**Workers & Pages → Create**):

**Worker (padrão atual do painel)** — usa o `wrangler.jsonc` da raiz:
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

**Pages** (aba "Pages" → Import an existing Git repository):
- Framework preset: nenhum
- Build command: `npm run build`
- Build output directory: `dist/ap-contas/browser`

A versão do Node vem do arquivo `.node-version`. Cada push na branch `main` publica sozinho.
Rotas como `/contas` devolvem o `index.html` (SPA): no Worker pelo `not_found_handling`, no Pages porque não existe `404.html`.

## Instalar no celular

- **Android (Chrome):** abra o endereço → menu ⋮ → **Instalar app**.
- **iPhone (Safari):** abra o endereço → Compartilhar → **Adicionar à Tela de Início**.

## Estrutura

```
src/app/
├─ core/layout/     → shell (menu lateral + barra inferior) e itens de navegação
├─ shared/          → logo, categorias, situações de conta, componentes reutilizáveis
└─ features/        → telas: inicio, contas, mais, guia-visual
```
