import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-configuracoes',
  template: `
    <h1 class="mb-3">Configurações</h1>
    <div class="list-group mb-3">
      <div class="list-group-item d-flex align-items-center gap-3 py-3">
        <i class="bi bi-person-circle fs-3 text-primary" aria-hidden="true"></i>
        <div class="flex-grow-1 text-truncate">
          <div class="rotulo">Conectado como</div>
          <div class="fw-semibold text-truncate">{{ auth.email() }}</div>
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-outline-danger" (click)="sair()">
      <i class="bi bi-box-arrow-right me-1" aria-hidden="true"></i>Sair
    </button>
  `,
})
export class Configuracoes {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected async sair(): Promise<void> {
    await this.auth.sair();
    await this.router.navigateByUrl('/entrar');
  }
}
