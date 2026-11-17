import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Conta, ContasDados, situacaoDe } from '../../core/dados/contas-dados';
import { emReais, limitesDoMes } from '../../core/util';
import { EstadoVazio } from '../../shared/estado-vazio/estado-vazio';
import { ItemConta } from '../../shared/item-conta/item-conta';

type Filtro = 'todas' | 'pendentes' | 'pagas' | 'atrasadas';

const FILTRAR: Record<Filtro, (c: Conta) => boolean> = {
  todas: () => true,
  pendentes: (c) => !c.paga_em,
  pagas: (c) => !!c.paga_em,
  atrasadas: (c) => situacaoDe(c) === 'atrasada',
};

/** Contas de um mês, com navegação entre meses e filtros. */
@Component({
  selector: 'app-contas',
  imports: [RouterLink, CurrencyPipe, DatePipe, TitleCasePipe, EstadoVazio, ItemConta],
  templateUrl: './contas.html',
})
export class Contas {
  private readonly dados = inject(ContasDados);

  protected readonly filtros: { id: Filtro; rotulo: string }[] = [
    { id: 'pendentes', rotulo: 'Pendentes' },
    { id: 'pagas', rotulo: 'Pagas' },
    { id: 'atrasadas', rotulo: 'Atrasadas' },
    { id: 'todas', rotulo: 'Todas' },
  ];
  protected readonly filtro = signal<Filtro>('pendentes');

  private readonly hoje = new Date();
  protected readonly mes = signal(new Date(this.hoje.getFullYear(), this.hoje.getMonth(), 1));
  protected readonly ehMesAtual = computed(
    () => this.mes().getFullYear() === this.hoje.getFullYear() && this.mes().getMonth() === this.hoje.getMonth(),
  );

  protected readonly doMes = signal<Conta[]>([]);
  /** Só no mês atual: não pagas de meses anteriores. */
  protected readonly anteriores = signal<Conta[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly ocupadas = signal<ReadonlySet<string>>(new Set());

  protected readonly listaMes = computed(() => this.doMes().filter(FILTRAR[this.filtro()]));
  protected readonly listaAnteriores = computed(() =>
    this.filtro() === 'pagas' ? [] : this.anteriores().filter(FILTRAR[this.filtro()]),
  );

  protected readonly totais = computed(() => {
    const contas = this.doMes();
    const soma = (lista: Conta[]) => emReais(lista.reduce((t, c) => t + c.valor_centavos, 0));
    return { total: soma(contas), pago: soma(contas.filter((c) => c.paga_em)), falta: soma(contas.filter((c) => !c.paga_em)) };
  });

  constructor() {
    void this.carregar();
  }

  protected mudarMes(delta: number): void {
    const m = this.mes();
    this.mes.set(new Date(m.getFullYear(), m.getMonth() + delta, 1));
    void this.carregar();
  }

  protected voltarParaHoje(): void {
    this.mes.set(new Date(this.hoje.getFullYear(), this.hoje.getMonth(), 1));
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
    const m = this.mes();
    if (mostrarCarregando) this.carregando.set(true);
    this.erro.set('');
    try {
      const [doMes, anteriores] = await Promise.all([
        this.dados.doMes(m.getFullYear(), m.getMonth()),
        this.ehMesAtual()
          ? this.dados.atrasadasAntesDe(limitesDoMes(m.getFullYear(), m.getMonth()).inicio)
          : Promise.resolve([]),
      ]);
      // ignora a resposta se o mês mudou enquanto carregava
      if (m !== this.mes()) return;
      this.doMes.set(doMes);
      this.anteriores.set(anteriores);
    } catch {
      this.erro.set('Não foi possível carregar as contas. Confira a internet.');
    } finally {
      this.carregando.set(false);
    }
  }
}
