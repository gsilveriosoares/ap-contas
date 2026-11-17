import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoVazio } from '../../shared/estado-vazio/estado-vazio';

/** Resumo do mês. Na fase 1 os números passam a vir do banco. */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CurrencyPipe, DatePipe, TitleCasePipe, EstadoVazio],
  templateUrl: './inicio.html',
})
export class Inicio {
  protected readonly hoje = new Date();
  protected readonly saudacao = Inicio.saudacaoPara(this.hoje);

  protected readonly resumo = [
    { rotulo: 'Saldo disponível', valor: 0, nota: 'Contas bancárias na fase 2', destaque: true },
    { rotulo: 'Total do mês', valor: 0, nota: 'Nenhuma conta ainda', destaque: false },
    { rotulo: 'A pagar', valor: 0, nota: 'Nenhuma pendente', destaque: false },
    { rotulo: 'Sobra prevista', valor: 0, nota: 'Saldo − a pagar', destaque: false },
  ];

  private static saudacaoPara(data: Date): string {
    const hora = data.getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  }
}
