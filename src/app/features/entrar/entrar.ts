import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, lerLinkDeAcesso, mensagemErroAuth } from '../../core/auth/auth';

/**
 * Entrar sem senha: e-mail → link ou código de 6 dígitos.
 * Celular: faixa verde da marca no topo e o formulário numa folha branca.
 * Computador: painel da marca à esquerda, formulário à direita.
 */
@Component({
  selector: 'app-entrar',
  imports: [FormsModule],
  templateUrl: './entrar.html',
  styleUrl: './entrar.scss',
})
export class Entrar {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly vantagens = [
    { icone: 'bi-calendar2-check', texto: 'Veja o que vence primeiro' },
    { icone: 'bi-hand-index-thumb', texto: 'Marque como paga com um toque' },
    { icone: 'bi-graph-up-arrow', texto: 'Saiba quanto falta pagar no mês' },
  ];

  protected email = '';
  /** Código de 6 dígitos ou link do e-mail colado. */
  protected readonly codigo = signal('');
  protected readonly pareceCodigo = computed(() => /^\d{1,8}$/.test(this.codigo().trim()));
  protected readonly entradaValida = computed(
    () => /^\d{6,8}$/.test(this.codigo().trim()) || lerLinkDeAcesso(this.codigo()) !== null,
  );
  protected readonly podeColar = typeof navigator !== 'undefined' && !!navigator.clipboard?.readText;
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
      await this.auth.confirmarCodigo(this.email, this.codigo().trim());
      await this.router.navigateByUrl('/inicio');
    });
  }

  protected async colar(): Promise<void> {
    try {
      this.codigo.set((await navigator.clipboard.readText()).trim());
      if (this.entradaValida()) await this.confirmar();
      else this.erro.set('O que foi colado não é o link nem o código do e-mail.');
    } catch {
      this.erro.set('Não deu para colar automaticamente. Segure o dedo no campo e escolha Colar.');
    }
  }

  protected voltar(): void {
    this.codigo.set('');
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
