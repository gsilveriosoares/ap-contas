import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Logo } from '../../shared/marca/logo';
import { AtualizacaoApp } from '../pwa/atualizacao-app';
import { NAV_INFERIOR_DIREITA, NAV_INFERIOR_ESQUERDA, NAV_PRINCIPAL, NAV_SECUNDARIA } from './navegacao';

/**
 * Estrutura do app.
 * Celular (< 992px): topo com logo + barra inferior com botão de nova conta no centro.
 * Computador (>= 992px, breakpoint `lg`): menu lateral fixo.
 * Estilos em src/styles/_layout.scss.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Logo],
  templateUrl: './shell.html',
})
export class Shell {
  protected readonly navPrincipal = NAV_PRINCIPAL;
  protected readonly navSecundaria = NAV_SECUNDARIA;
  protected readonly navInferiorEsquerda = NAV_INFERIOR_ESQUERDA;
  protected readonly navInferiorDireita = NAV_INFERIOR_DIREITA;
  protected readonly atualizacao = inject(AtualizacaoApp);
}
