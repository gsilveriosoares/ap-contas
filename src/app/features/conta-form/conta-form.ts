import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Conta, ContasDados, DadosConta, MESES_RECORRENCIA, Repeticao } from '../../core/dados/contas-dados';
import { centavosParaEntrada, hojeISO, paraCentavos } from '../../core/util';
import { CATEGORIAS_PADRAO } from '../../shared/marca/categorias';

type TipoRepeticao = Repeticao['tipo'];

/** Cadastro (contas/nova) e edição (contas/:id) de uma conta. */
@Component({
  selector: 'app-conta-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './conta-form.html',
  styles: `
    .ac-categoria {
      display: flex; flex-direction: column; align-items: center; gap: .25rem;
      padding: .5rem .25rem; font-size: .8rem; min-height: 4.25rem;
    }
    .ac-categoria .icone-categoria { width: 2rem; height: 2rem; }
  `,
})
export class ContaForm implements OnInit {
  private readonly dados = inject(ContasDados);
  private readonly router = inject(Router);

  /** Vem da rota contas/:id (ausente em contas/nova). */
  readonly id = input<string>();

  protected readonly categorias = CATEGORIAS_PADRAO;
  protected readonly mesesRecorrencia = MESES_RECORRENCIA;

  protected readonly conta = signal<Conta | null>(null);
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');
  protected readonly confirmandoExclusao = signal(false);

  protected readonly form = new FormGroup({
    descricao: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] }),
    valor: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, (c) => (paraCentavos(c.value) ? null : { valor: true })],
    }),
    vencimento: new FormControl(hojeISO(), { nonNullable: true, validators: Validators.required }),
    categoria: new FormControl('outros', { nonNullable: true }),
    repeticao: new FormControl<TipoRepeticao>('nenhuma', { nonNullable: true }),
    vezes: new FormControl(2, { nonNullable: true, validators: [Validators.min(2), Validators.max(72)] }),
    observacao: new FormControl('', { nonNullable: true, validators: Validators.maxLength(500) }),
    tambemProximas: new FormControl(false, { nonNullable: true }),
  });

  async ngOnInit(): Promise<void> {
    const id = this.id();
    if (!id) return;
    this.carregando.set(true);
    try {
      const conta = await this.dados.buscar(id);
      if (!conta) {
        await this.router.navigateByUrl('/contas');
        return;
      }
      this.conta.set(conta);
      this.form.patchValue({
        descricao: conta.descricao,
        valor: centavosParaEntrada(conta.valor_centavos),
        vencimento: conta.vencimento,
        categoria: conta.categoria,
        observacao: conta.observacao ?? '',
      });
    } catch {
      this.erro.set('Não foi possível carregar a conta.');
    } finally {
      this.carregando.set(false);
    }
  }

  protected async salvar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const dados: DadosConta = {
      descricao: v.descricao.trim(),
      valor_centavos: paraCentavos(v.valor)!,
      vencimento: v.vencimento,
      categoria: v.categoria,
      observacao: v.observacao.trim() || null,
    };
    await this.executar(async () => {
      const conta = this.conta();
      if (conta) {
        await this.dados.atualizar(conta, dados, v.tambemProximas);
      } else {
        const repeticao: Repeticao =
          v.repeticao === 'parcelas' ? { tipo: 'parcelas', vezes: v.vezes } : { tipo: v.repeticao };
        await this.dados.criar(dados, repeticao);
      }
      await this.router.navigateByUrl('/contas');
    });
  }

  protected async excluir(tambemProximas: boolean): Promise<void> {
    const conta = this.conta();
    if (!conta) return;
    await this.executar(async () => {
      await this.dados.excluir(conta, tambemProximas);
      await this.router.navigateByUrl('/contas');
    });
  }

  protected invalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && c.touched;
  }

  private async executar(acao: () => Promise<void>): Promise<void> {
    this.erro.set('');
    this.salvando.set(true);
    try {
      await acao();
    } catch {
      this.erro.set('Não foi possível salvar. Confira a internet e tente de novo.');
    } finally {
      this.salvando.set(false);
    }
  }
}
