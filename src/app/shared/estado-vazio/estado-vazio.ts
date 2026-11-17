import { Component, input } from '@angular/core';

/**
 * Mensagem para telas sem dados: ícone, título, texto e (opcional) ações via conteúdo projetado.
 * <app-estado-vazio icone="bi-receipt" titulo="..." texto="..."><a class="btn btn-primary">...</a></app-estado-vazio>
 */
@Component({
  selector: 'app-estado-vazio',
  template: `
    <div class="card">
      <div class="card-body text-center py-5 px-4 d-flex flex-column align-items-center gap-2">
        <span class="estado-icone"><i class="bi" [class]="icone()"></i></span>
        <h2 class="h5 mb-0 mt-2">{{ titulo() }}</h2>
        @if (texto()) {
          <p class="text-body-secondary mb-2" style="max-width: 42ch">{{ texto() }}</p>
        }
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .estado-icone {
      width: 3.5rem;
      height: 3.5rem;
      display: grid;
      place-items: center;
      border-radius: 50%;
      font-size: 1.6rem;
      color: var(--bs-primary-text-emphasis);
      background: var(--bs-primary-bg-subtle);
    }
  `,
})
export class EstadoVazio {
  readonly icone = input('bi-inbox');
  readonly titulo = input.required<string>();
  readonly texto = input('');
}
