import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CATEGORIAS_PADRAO } from '../../shared/marca/categorias';
import { Logo } from '../../shared/marca/logo';
import { NAV_PRINCIPAL, NAV_SECUNDARIA } from '../../core/layout/navegacao';
import { SITUACOES, SituacaoConta } from '../../shared/marca/situacao-conta';

/** Página de referência da identidade visual. Some quando o layout base existir. */
@Component({
  selector: 'app-guia-visual',
  imports: [Logo, CurrencyPipe, DatePipe],
  templateUrl: './guia-visual.html',
  styleUrl: './guia-visual.scss',
})
export class GuiaVisual {
  protected readonly categorias = CATEGORIAS_PADRAO;
  protected readonly navegacao = [...NAV_PRINCIPAL, ...NAV_SECUNDARIA];
  protected readonly situacoes = Object.entries(SITUACOES) as [SituacaoConta, (typeof SITUACOES)[SituacaoConta]][];
  protected readonly estilo = SITUACOES;

  protected readonly cores = [
    { nome: 'Verde Conta', hex: '#0F6E5C', uso: 'Ações, links e destaque' },
    { nome: 'Âmbar', hex: '#E0A526', uso: 'Reservas, metas, vence em breve' },
    { nome: 'Ardósia', hex: '#5B6B66', uso: 'Texto secundário e ícones' },
    { nome: 'Paga', hex: '#1F7A3A', uso: 'Conta paga, saldo positivo' },
    { nome: 'Atrasada', hex: '#C0303A', uso: 'Atraso, saldo negativo' },
    { nome: 'Informação', hex: '#2563A8', uso: 'Dicas e avisos neutros' },
    { nome: 'Fundo', hex: '#F5F7F6', uso: 'Fundo da página' },
    { nome: 'Grafite', hex: '#14211D', uso: 'Texto principal' },
  ];

  // Dados de exemplo (fictícios)
  protected readonly exemploContas = [
    { descricao: 'Conta de luz', vencimento: new Date(2026, 10, 15), valor: 180.1, categoria: 0, situacao: 'atrasada' as SituacaoConta },
    { descricao: 'Aluguel', vencimento: new Date(2026, 10, 20), valor: 1200, categoria: 0, situacao: 'vence-em-breve' as SituacaoConta },
    { descricao: 'Internet', vencimento: new Date(2026, 10, 22), valor: 99.9, categoria: 2, situacao: 'pendente' as SituacaoConta },
    { descricao: 'Mercado do mês', vencimento: new Date(2026, 10, 8), valor: 1184.8, categoria: 1, situacao: 'paga' as SituacaoConta },
  ];
}
