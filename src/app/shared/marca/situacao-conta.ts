/** Situação de uma conta a pagar e como ela aparece na tela (texto + cor + ícone, nunca só cor). */
export type SituacaoConta = 'paga' | 'pendente' | 'vence-em-breve' | 'atrasada';

export interface EstiloSituacao {
  rotulo: string;
  icone: string;
  /** Classes do Bootstrap para o badge (funcionam no tema claro e escuro) */
  classeBadge: string;
}

export const SITUACOES: Record<SituacaoConta, EstiloSituacao> = {
  paga: { rotulo: 'Paga', icone: 'bi-check-circle-fill', classeBadge: 'bg-success-subtle text-success-emphasis' },
  pendente: { rotulo: 'Pendente', icone: 'bi-clock', classeBadge: 'bg-secondary-subtle text-secondary-emphasis' },
  'vence-em-breve': {
    rotulo: 'Vence em breve',
    icone: 'bi-hourglass-split',
    classeBadge: 'bg-warning-subtle text-warning-emphasis',
  },
  atrasada: { rotulo: 'Atrasada', icone: 'bi-exclamation-circle-fill', classeBadge: 'bg-danger-subtle text-danger-emphasis' },
};

/** Quantos dias antes do vencimento a conta passa a "vence em breve". */
export const DIAS_AVISO_VENCIMENTO = 5;

