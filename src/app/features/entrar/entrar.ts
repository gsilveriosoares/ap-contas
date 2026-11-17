import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, mensagemErroAuth } from '../../core/auth/auth';
import { Logo } from '../../shared/marca/logo';

/** Entrar sem senha: e-mail → link ou código de 6 dígitos. */
@Component({
  selector: 'app-entrar',
  imports: [FormsModule, Logo],
  template: `
    <main class="ac-entrar">
      <div class="card shadow-sm w-100 ac-entrar-cartao">
        <div class="card-body p-4">
          <div class="mb-4"><app-logo [tamanho]="40" /></div>

          @if (etapa() === 'email') {
            <h1 class="h4">Entrar</h1>
            <p class="text-body-secondary">Enviamos um link e um código para o seu e-mail. Sem senha.</p>
            <form (ngSubmit)="enviar()" #fEmail="ngForm">
              <label for="email" class="form-label">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                class="form-control mb-3"
                required
                email
                autocomplete="email"
                inputmode="email"
                [(ngModel)]="email"
                [disabled]="carregando()"
              />
              <button class="btn btn-primary w-100" [disabled]="fEmail.invalid || carregando()">
                @if (carregando()) {
                  <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                }
                Enviar acesso
              </button>
            </form>
          } @else {
            <h1 class="h4">Confira seu e-mail</h1>
            <p class="text-body-secondary">
              Mandamos para <strong>{{ email }}</strong>. Toque no link do e-mail ou digite aqui o código.
            </p>
            <form (ngSubmit)="confirmar()" #fCodigo="ngForm">
              <label for="codigo" class="form-label">Código</label>
              <input
                id="codigo"
                name="codigo"
                class="form-control form-control-lg text-center mb-3 valor"
                required
                minlength="6"
                maxlength="8"
                pattern="[0-9]*"
                inputmode="numeric"
                autocomplete="one-time-code"
                [(ngModel)]="codigo"
                [disabled]="carregando()"
              />
              <button class="btn btn-primary w-100 mb-2" [disabled]="fCodigo.invalid || carregando()">
                @if (carregando()) {
                  <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                }
                Entrar
              </button>
              <button type="button" class="btn btn-link w-100" (click)="voltar()">Usar outro e-mail</button>
            </form>
          }

          @if (erro()) {
            <div class="alert alert-danger mt-3 mb-0 small" role="alert">{{ erro() }}</div>
          }
        </div>
      </div>
    </main>
  `,
})
export class Entrar {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected email = '';
  protected codigo = '';
  protected readonly etapa = signal<'email' | 'codigo'>('email');
  protected readonly carregando = signal(false);
  protected readonly erro = signal('');

  protected enviar(): Promise<void> {
    return this.executar(async () => {
      this.email = this.email.trim().toLowerCase();
      await this.auth.enviarLink(this.email);
      this.etapa.set('codigo');
    });
  }

  protected confirmar(): Promise<void> {
    return this.executar(async () => {
      await this.auth.confirmarCodigo(this.email, this.codigo.trim());
      await this.router.navigateByUrl('/inicio');
    });
  }

  protected voltar(): void {
    this.codigo = '';
    this.erro.set('');
    this.etapa.set('email');
  }

  private async executar(acao: () => Promise<void>): Promise<void> {
    this.erro.set('');
    this.carregando.set(true);
    try {
      await acao();
    } catch (e) {
      this.erro.set(mensagemErroAuth(e));
    } finally {
      this.carregando.set(false);
    }
  }
}
