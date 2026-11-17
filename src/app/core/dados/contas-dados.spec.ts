import { linhasParaCriar, situacaoDe } from './contas-dados';
import { paraCentavos, somarMeses } from '../util';

describe('paraCentavos', () => {
  it('entende os formatos brasileiros', () => {
    expect(paraCentavos('1.234,56')).toBe(123456);
    expect(paraCentavos('89,9')).toBe(8990);
    expect(paraCentavos('R$ 50')).toBe(5000);
    expect(paraCentavos('1.500')).toBe(150000);
    expect(paraCentavos('12.5')).toBe(1250);
  });

  it('recusa valores inválidos', () => {
    expect(paraCentavos('')).toBeNull();
    expect(paraCentavos('0')).toBeNull();
    expect(paraCentavos('abc')).toBeNull();
    expect(paraCentavos('1,234')).toBeNull();
  });
});

describe('somarMeses', () => {
  it('usa o último dia quando o mês é mais curto', () => {
    expect(somarMeses('2026-01-31', 1)).toBe('2026-02-28');
    expect(somarMeses('2026-01-31', 3)).toBe('2026-04-30');
    expect(somarMeses('2026-11-10', 2)).toBe('2027-01-10');
  });
});

describe('situacaoDe', () => {
  const hoje = '2026-11-17';
  it('classifica pela data', () => {
    expect(situacaoDe({ vencimento: '2026-11-10', paga_em: '2026-11-09' }, hoje)).toBe('paga');
    expect(situacaoDe({ vencimento: '2026-11-16', paga_em: null }, hoje)).toBe('atrasada');
    expect(situacaoDe({ vencimento: '2026-11-17', paga_em: null }, hoje)).toBe('vence-em-breve');
    expect(situacaoDe({ vencimento: '2026-11-22', paga_em: null }, hoje)).toBe('vence-em-breve');
    expect(situacaoDe({ vencimento: '2026-11-23', paga_em: null }, hoje)).toBe('pendente');
  });
});

describe('linhasParaCriar', () => {
  const dados = { descricao: 'Internet', valor_centavos: 9990, vencimento: '2026-11-30', categoria: 'servicos', observacao: null };

  it('cria uma linha quando não repete', () => {
    const linhas = linhasParaCriar(dados, { tipo: 'nenhuma' });
    expect(linhas).toHaveLength(1);
    expect(linhas[0].serie_id).toBeNull();
  });

  it('cria 12 meses na mesma série quando é todo mês', () => {
    const linhas = linhasParaCriar(dados, { tipo: 'mensal' }, () => 'serie-1');
    expect(linhas).toHaveLength(12);
    expect(new Set(linhas.map((l) => l.serie_id))).toEqual(new Set(['serie-1']));
    expect(linhas[3].vencimento).toBe('2027-02-28');
    expect(linhas[0].parcela).toBeNull();
  });

  it('numera as parcelas', () => {
    const linhas = linhasParaCriar(dados, { tipo: 'parcelas', vezes: 3 }, () => 's');
    expect(linhas.map((l) => [l.parcela, l.total_parcelas, l.vencimento])).toEqual([
      [1, 3, '2026-11-30'],
      [2, 3, '2026-12-30'],
      [3, 3, '2027-01-30'],
    ]);
  });
});
