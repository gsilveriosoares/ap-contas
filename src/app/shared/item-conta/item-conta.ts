import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Conta, situacaoDe } from '../../core/dados/contas-dados';
import { dataDe, emReais } from '../../core/util';
import { CATEGORIAS_PADRAO } from '../marca/categorias';
import { SITUACOES } from '../marca/situacao-conta';

/** Linha de uma conta: categoria, descrição, vencimento, situação, valor e botão de pagar. */
@Component({
  selector: 'app-item-conta',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  host: { class: 'list-group-item d-flex align-items-center gap-3 py-2' },
  template: `
    <span class="icone-categoria" [style.--cor]="categoria().cor" aria-hidden="true">
      <i class="bi" [class]="categoria().icone"></i>
    </span>

    <a class="flex-grow-1 min-w-0 text-reset text-decoration-none py-1" [routerLink]="['/contas', conta().id]">
      <div class="fw-semibold text-truncate">
        {{ conta().descricao }}
        @if (conta().total_parcelas) {
          <span class="text-body-secondary fw-normal small">{{ conta().parcela }}/{{ conta().total_parcelas }}</span>
        } @else if (conta().serie_id) {
          <i class="bi bi-arrow-repeat text-body-secondary small" title="Todo mês" aria-label="Todo mês"></i>
        }
      </div>
      <div class="small d-flex flex-wrap align-items-center gap-2">
        <span class="text-body-secondary">
          @if (conta().paga_em) {
            Paga em {{ data(conta().paga_em!) | date: 'dd/MM' }}
          } @else {
            Vence {{ data(conta().vencimento) | date: 'dd/MM' }}
          }
        </span>
        @if (situacao() !== 'pendente') {
          <span class="badge rounded-pill" [class]="estilo().classeBadge">
            <i class="bi me-1" [class]="estilo().icone" aria-hidden="true"></i>{{ estilo().rotulo }}
          </span>
        }
      </div>
    </a>

    <div class="valor text-end text-nowrap" [class.text-body-secondary]="conta().paga_em">
      {{ reais(conta().valor_centavos) | currency }}
    </div>

    <button
      type="button"
      class="btn btn-sm rounded-circle ac-btn-pagar"
      [class.btn-success]="conta().paga_em"
      [class.btn-outline-secondary]="!conta().paga_em"
      [disabled]="ocupado()"
      [attr.aria-pressed]="!!conta().paga_em"
      [attr.aria-label]="(conta().paga_em ? 'Desmarcar pagamento de ' : 'Marcar como paga: ') + conta().descricao"
      (click)="alternarPaga.emit(conta())"
    >
      <i class="bi bi-check-lg" aria-hidden="true"></i>
    </button>
  `,
  styles: `
    .min-w-0 { min-width: 0; }
    .ac-btn-pagar { width: 2.5rem; height: 2.5rem; min-height: 2.5rem; padding: 0; flex-shrink: 0; }
  `,
})
export class ItemConta {
  readonly conta = input.required<Conta>();
  readonly ocupado = input(false);
  readonly alternarPaga = output<Conta>();

  protected readonly situacao = computed(() => situacaoDe(this.conta()));
  protected readonly estilo = computed(() => SITUACOES[this.situacao()]);
  protected readonly categoria = computed(
    () => CATEGORIAS_PADRAO.find((c) => c.id === this.conta().categoria) ?? CATEGORIAS_PADRAO.at(-1)!,
  );

  protected readonly data = dataDe;
  protected readonly reais = emReais;
}
