import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoVazio } from '../../shared/estado-vazio/estado-vazio';

type Filtro = 'todas' | 'pendentes' | 'pagas' | 'atrasadas';

/** Lista de contas do mês. Na fase 1 passa a listar os dados do banco. */
@Component({
  selector: 'app-contas',
  imports: [RouterLink, EstadoVazio],
  template: `
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <h1 class="mb-0">Contas</h1>
      <a routerLink="/contas/nova" class="btn btn-primary d-none d-lg-inline-flex align-items-center">
        <i class="bi bi-plus-lg me-1"></i>Nova conta
      </a>
    </div>

    <div class="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Filtrar contas">
      @for (f of filtros; track f.id) {
        <button
          type="button"
          class="btn btn-sm rounded-pill px-3"
          [class.btn-primary]="filtro() === f.id"
          [class.btn-outline-secondary]="filtro() !== f.id"
          [attr.aria-pressed]="filtro() === f.id"
          (click)="filtro.set(f.id)"
        >
          {{ f.rotulo }}
        </button>
      }
    </div>

    <app-estado-vazio
      icone="bi-receipt"
      titulo="Nenhuma conta por aqui"
      texto="As contas aparecem agrupadas por vencimento, e você marca como paga com um toque."
    >
      <a routerLink="/contas/nova" class="btn btn-primary"><i class="bi bi-plus-lg me-1"></i>Nova conta</a>
    </app-estado-vazio>
  `,
})
export class Contas {
  protected readonly filtros: { id: Filtro; rotulo: string }[] = [
    { id: 'todas', rotulo: 'Todas' },
    { id: 'pendentes', rotulo: 'Pendentes' },
    { id: 'pagas', rotulo: 'Pagas' },
    { id: 'atrasadas', rotulo: 'Atrasadas' },
  ];
  protected readonly filtro = signal<Filtro>('pendentes');
}
