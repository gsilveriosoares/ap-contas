import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoVazio } from '../estado-vazio/estado-vazio';

/** Tela provisória para seções que ganham conteúdo em fases futuras. Recebe os dados pelo `data` da rota. */
@Component({
  selector: 'app-pagina-em-breve',
  imports: [EstadoVazio, RouterLink],
  template: `
    <h1 class="mb-3">{{ titulo() }}</h1>
    <app-estado-vazio [icone]="icone()" [titulo]="'Chega na fase ' + fase() + ' do plano'" [texto]="descricao()">
      <a routerLink="/inicio" class="btn btn-outline-primary">Voltar para o início</a>
    </app-estado-vazio>
  `,
})
export class PaginaEmBreve {
  readonly titulo = input('');
  readonly icone = input('bi-hourglass');
  readonly fase = input(1);
  readonly descricao = input('');
}
