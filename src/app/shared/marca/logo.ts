import { Component, input } from '@angular/core';

/**
 * Logo do ApContas: símbolo (comprovante com check) + nome.
 * Uso: <app-logo />, <app-logo [tamanho]="24" />, <app-logo [comNome]="false" />
 */
@Component({
  selector: 'app-logo',
  template: `
    <span class="d-inline-flex align-items-center gap-2">
      <img src="logo.svg" [width]="tamanho()" [height]="tamanho()" [alt]="comNome() ? '' : 'ApContas'" />
      @if (comNome()) {
        <span class="logo-nome" [style.font-size.px]="tamanho() * 0.62">
          <span class="text-primary">Ap</span>Contas
        </span>
      }
    </span>
  `,
  styles: `
    .logo-nome {
      font-family: 'Space Grotesk Variable', system-ui, sans-serif;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1;
    }
  `,
})
export class Logo {
  readonly tamanho = input(32);
  readonly comNome = input(true);
}
