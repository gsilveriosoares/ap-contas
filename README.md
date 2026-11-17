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

## Publicar no Cloudflare Pages

1. No painel da Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** e escolha o repositório `ap-contas`.
2. Configuração do build:
   - Framework preset: **Angular** (ou nenhum)
   - Build command: `npm run build`
   - Build output directory: `dist/ap-contas/browser`
   - A versão do Node vem do arquivo `.node-version`.
3. Cada push na branch `main` publica sozinho.

Como não existe `404.html`, o Cloudflare Pages trata o site como SPA e devolve o `index.html` para qualquer rota (ex.: `/contas`).

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
