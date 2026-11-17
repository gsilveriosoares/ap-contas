import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_MAIS } from '../../core/layout/navegacao';

/** Tela "Mais" do celular: atalhos para o que não coube na barra inferior. */
@Component({
  selector: 'app-mais',
  imports: [RouterLink],
  template: `
    <h1 class="mb-3">Mais</h1>
    <div class="list-group shadow-sm">
      @for (item of itens; track item.rota) {
        <a [routerLink]="item.rota" class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3">
          <span class="icone-categoria"><i class="bi" [class]="item.icone" aria-hidden="true"></i></span>
          <span class="flex-grow-1 fw-medium">{{ item.rotulo }}</span>
          @if (item.fase) {
            <span class="badge bg-secondary-subtle text-secondary-emphasis">fase {{ item.fase }}</span>
          }
          <i class="bi bi-chevron-right text-body-secondary" aria-hidden="true"></i>
        </a>
      }
    </div>
  `,
})
export class Mais {
  protected readonly itens = NAV_MAIS;
}
