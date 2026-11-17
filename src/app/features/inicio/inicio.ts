import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Conta, ContasDados, situacaoDe } from '../../core/dados/contas-dados';
import { emReais, limitesDoMes } from '../../core/util';
import { EstadoVazio } from '../../shared/estado-vazio/estado-vazio';
import { ItemConta } from '../../shared/item-conta/item-conta';

/** Quantas contas aparecem em "Próximos vencimentos". */
const LIMITE_PROXIMAS = 6;

/** Resumo do mês atual e o que vence primeiro. */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CurrencyPipe, DatePipe, TitleCasePipe, EstadoVazio, ItemConta],
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly dados = inject(ContasDados);

  protected readonly hoje = new Date();
  protected readonly saudacao = Inicio.saudacaoPara(this.hoje);

  private readonly doMes = signal<Conta[]>([]);
  private readonly anteriores = signal<Conta[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly ocupadas = signal<ReadonlySet<string>>(new Set());

  protected readonly temContas = computed(() => this.doMes().length + this.anteriores().length > 0);

  protected readonly resumo = computed(() => {
    const centavos = (lista: Conta[]) => lista.reduce((t, c) => t + c.valor_centavos, 0);
    const mes = this.doMes();
    const pendentesMes = mes.filter((c) => !c.paga_em);
    const atrasadas = [...this.anteriores(), ...pendentesMes].filter((c) => situacaoDe(c) === 'atrasada');
    const falta = centavos(pendentesMes) + centavos(this.anteriores());
    return [
      { rotulo: 'Saldo disponível', valor: 0, nota: 'Contas bancárias na fase 2', destaque: true },
      { rotulo: 'Total do mês', valor: emReais(centavos(mes)), nota: `${mes.length} conta(s)`, destaque: false },
      {
        rotulo: 'Falta pagar',
        valor: emReais(falta),
        nota: atrasadas.length ? `${atrasadas.length} atrasada(s)` : `${pendentesMes.length} pendente(s)`,
        destaque: false,
        alerta: atrasadas.length > 0,
      },
      { rotulo: 'Já pago', valor: emReais(centavos(mes.filter((c) => c.paga_em))), nota: 'neste mês', destaque: false },
    ];
  });

  protected readonly proximas = computed(() =>
    [...this.anteriores(), ...this.doMes().filter((c) => !c.paga_em)].slice(0, LIMITE_PROXIMAS),
  );

  constructor() {
    void this.carregar();
  }

  protected async alternarPaga(conta: Conta): Promise<void> {
    this.ocupadas.update((s) => new Set(s).add(conta.id));
    try {
      await this.dados.marcarPaga(conta.id, !conta.paga_em);
      await this.carregar(false);
    } catch {
      this.erro.set('Não foi possível atualizar a conta. Tente de novo.');
    } finally {
      this.ocupadas.update((s) => {
        const novo = new Set(s);
        novo.delete(conta.id);
        return novo;
      });
    }
  }

  protected async carregar(mostrarCarregando = true): Promise<void> {
    if (mostrarCarregando) this.carregando.set(true);
    this.erro.set('');
    const ano = this.hoje.getFullYear();
    const mes = this.hoje.getMonth();
    try {
      const [doMes, anteriores] = await Promise.all([
        this.dados.doMes(ano, mes),
        this.dados.atrasadasAntesDe(limitesDoMes(ano, mes).inicio),
      ]);
      this.doMes.set(doMes);
      this.anteriores.set(anteriores);
    } catch {
      this.erro.set('Não foi possível carregar suas contas. Confira a internet.');
    } finally {
      this.carregando.set(false);
    }
  }

  private static saudacaoPara(data: Date): string {
    const hora = data.getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  }
}
