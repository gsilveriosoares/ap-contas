import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell';

const emBreve = () => import('./shared/pagina-em-breve/pagina-em-breve').then((m) => m.PaginaEmBreve);

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        title: 'ApContas',
        loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'contas',
        title: 'Contas · ApContas',
        loadComponent: () => import('./features/contas/contas').then((m) => m.Contas),
      },
      {
        path: 'contas/nova',
        title: 'Nova conta · ApContas',
        loadComponent: emBreve,
        data: {
          titulo: 'Nova conta',
          icone: 'bi-plus-circle',
          fase: 1,
          descricao: 'Cadastro com valor, vencimento, categoria e repetição todo mês ou em parcelas.',
        },
      },
      {
        path: 'dinheiro',
        title: 'Dinheiro · ApContas',
        loadComponent: emBreve,
        data: {
          titulo: 'Dinheiro',
          icone: 'bi-wallet2',
          fase: 2,
          descricao: 'Suas contas bancárias e carteira, receitas como salário e quanto vai sobrar no fim do mês.',
        },
      },
      {
        path: 'reservas',
        title: 'Reservas · ApContas',
        loadComponent: emBreve,
        data: {
          titulo: 'Reservas',
          icone: 'bi-piggy-bank',
          fase: 3,
          descricao: 'Cofrinhos com meta e data, e quanto guardar por mês para chegar lá.',
        },
      },
      {
        path: 'relatorios',
        title: 'Relatórios · ApContas',
        loadComponent: emBreve,
        data: {
          titulo: 'Relatórios',
          icone: 'bi-bar-chart-line',
          fase: 4,
          descricao: 'Gastos por categoria e comparação entre meses.',
        },
      },
      {
        path: 'configuracoes',
        title: 'Configurações · ApContas',
        loadComponent: emBreve,
        data: {
          titulo: 'Configurações',
          icone: 'bi-gear',
          fase: 1,
          descricao: 'Sua conta de acesso, categorias e preferências.',
        },
      },
      {
        path: 'mais',
        title: 'Mais · ApContas',
        loadComponent: () => import('./features/mais/mais').then((m) => m.Mais),
      },
      {
        path: 'guia-visual',
        title: 'Guia visual · ApContas',
        loadComponent: () => import('./features/guia-visual/guia-visual').then((m) => m.GuiaVisual),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
