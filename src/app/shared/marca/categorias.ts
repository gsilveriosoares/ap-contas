/**
 * Categorias padrão do ApContas.
 * Ícones: Bootstrap Icons (https://icons.getbootstrap.com). Cores: legíveis no tema claro e escuro.
 * Na fase 1 elas viram registros no banco; o usuário poderá criar as próprias.
 */
export interface CategoriaPadrao {
  id: string;
  nome: string;
  icone: string;
  cor: string;
}

export const CATEGORIAS_PADRAO: readonly CategoriaPadrao[] = [
  { id: 'moradia', nome: 'Moradia', icone: 'bi-house-door', cor: '#3b7dd8' },
  { id: 'mercado', nome: 'Mercado', icone: 'bi-cart3', cor: '#2f9e6b' },
  { id: 'servicos', nome: 'Serviços', icone: 'bi-wifi', cor: '#1f9bb5' },
  { id: 'cartao', nome: 'Cartão', icone: 'bi-credit-card', cor: '#7b61d1' },
  { id: 'transporte', nome: 'Transporte', icone: 'bi-bus-front', cor: '#d9822b' },
  { id: 'saude', nome: 'Saúde', icone: 'bi-heart-pulse', cor: '#d64f6a' },
  { id: 'educacao', nome: 'Educação', icone: 'bi-mortarboard', cor: '#4f6bd6' },
  { id: 'lazer', nome: 'Lazer', icone: 'bi-controller', cor: '#c98a12' },
  { id: 'outros', nome: 'Outros', icone: 'bi-three-dots', cor: '#84928d' },
];
