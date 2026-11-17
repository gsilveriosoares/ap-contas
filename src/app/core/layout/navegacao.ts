/** Itens de navegação do ApContas. `fase` indica em qual fase do plano a tela ganha conteúdo. */
export interface ItemNavegacao {
  rota: string;
  rotulo: string;
  icone: string;
  iconeAtivo: string;
  fase?: number;
}

/** Menu lateral (computador). */
export const NAV_PRINCIPAL: readonly ItemNavegacao[] = [
  { rota: '/inicio', rotulo: 'Início', icone: 'bi-house', iconeAtivo: 'bi-house-fill' },
  { rota: '/contas', rotulo: 'Contas', icone: 'bi-receipt', iconeAtivo: 'bi-receipt-cutoff' },
  { rota: '/dinheiro', rotulo: 'Dinheiro', icone: 'bi-wallet2', iconeAtivo: 'bi-wallet-fill', fase: 2 },
  { rota: '/reservas', rotulo: 'Reservas', icone: 'bi-piggy-bank', iconeAtivo: 'bi-piggy-bank-fill', fase: 3 },
  { rota: '/relatorios', rotulo: 'Relatórios', icone: 'bi-bar-chart-line', iconeAtivo: 'bi-bar-chart-line-fill', fase: 4 },
];

export const NAV_SECUNDARIA: readonly ItemNavegacao[] = [
  { rota: '/configuracoes', rotulo: 'Configurações', icone: 'bi-gear', iconeAtivo: 'bi-gear-fill' },
  { rota: '/guia-visual', rotulo: 'Guia visual', icone: 'bi-palette', iconeAtivo: 'bi-palette-fill' },
];

/** Barra inferior (celular): 2 itens, botão de nova conta no centro, 2 itens. */
export const NAV_INFERIOR_ESQUERDA: readonly ItemNavegacao[] = [NAV_PRINCIPAL[0], NAV_PRINCIPAL[1]];
export const NAV_INFERIOR_DIREITA: readonly ItemNavegacao[] = [
  NAV_PRINCIPAL[3],
  { rota: '/mais', rotulo: 'Mais', icone: 'bi-grid', iconeAtivo: 'bi-grid-fill' },
];

/** O que aparece na tela "Mais" do celular (o que não coube na barra inferior). */
export const NAV_MAIS: readonly ItemNavegacao[] = [NAV_PRINCIPAL[2], NAV_PRINCIPAL[4], ...NAV_SECUNDARIA];
