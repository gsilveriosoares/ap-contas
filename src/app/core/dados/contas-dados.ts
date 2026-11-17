import { Injectable, inject } from '@angular/core';
import { SituacaoConta, DIAS_AVISO_VENCIMENTO } from '../../shared/marca/situacao-conta';
import { Supabase } from '../supabase/supabase';
import { DataISO, hojeISO, limitesDoMes, somarDias, somarMeses } from '../util/datas';

/** Uma linha da tabela public.contas (supabase/001_contas.sql). */
export interface Conta {
  id: string;
  descricao: string;
  valor_centavos: number;
  vencimento: DataISO;
  categoria: string;
  paga_em: DataISO | null;
  observacao: string | null;
  serie_id: string | null;
  parcela: number | null;
  total_parcelas: number | null;
}

export type DadosConta = Pick<Conta, 'descricao' | 'valor_centavos' | 'vencimento' | 'categoria' | 'observacao'>;

export type Repeticao = { tipo: 'nenhuma' } | { tipo: 'mensal' } | { tipo: 'parcelas'; vezes: number };

/** Quantos meses à frente uma conta "todo mês" é criada de uma vez. */
export const MESES_RECORRENCIA = 12;

const COLUNAS =
  'id, descricao, valor_centavos, vencimento, categoria, paga_em, observacao, serie_id, parcela, total_parcelas';

/** Situação da conta em relação a hoje. */
export function situacaoDe(conta: Pick<Conta, 'vencimento' | 'paga_em'>, hoje: DataISO = hojeISO()): SituacaoConta {
  if (conta.paga_em) return 'paga';
  if (conta.vencimento < hoje) return 'atrasada';
  if (conta.vencimento <= somarDias(hoje, DIAS_AVISO_VENCIMENTO)) return 'vence-em-breve';
  return 'pendente';
}

/** Monta as linhas a gravar: uma só, uma por mês (12 meses) ou uma por parcela. */
export function linhasParaCriar(
  dados: DadosConta,
  repeticao: Repeticao,
  novoId: () => string = () => crypto.randomUUID(),
): Omit<Conta, 'id' | 'paga_em'>[] {
  const base = { ...dados, serie_id: null, parcela: null, total_parcelas: null };
  if (repeticao.tipo === 'nenhuma') return [base];

  const serie_id = novoId();
  const vezes = repeticao.tipo === 'mensal' ? MESES_RECORRENCIA : repeticao.vezes;
  return Array.from({ length: vezes }, (_, i) => ({
    ...base,
    serie_id,
    vencimento: somarMeses(dados.vencimento, i),
    parcela: repeticao.tipo === 'parcelas' ? i + 1 : null,
    total_parcelas: repeticao.tipo === 'parcelas' ? vezes : null,
  }));
}

/** Leitura e gravação das contas no Supabase. As regras RLS garantem que cada um só vê as suas. */
@Injectable({ providedIn: 'root' })
export class ContasDados {
  private readonly db = inject(Supabase).client;

  /** Contas que vencem no mês (mes de 0 a 11). */
  async doMes(ano: number, mes: number): Promise<Conta[]> {
    const { inicio, fim } = limitesDoMes(ano, mes);
    const { data, error } = await this.db
      .from('contas')
      .select(COLUNAS)
      .gte('vencimento', inicio)
      .lte('vencimento', fim)
      .order('vencimento')
      .order('descricao');
    if (error) throw error;
    return data as Conta[];
  }

  /** Não pagas que venceram antes de uma data (as atrasadas de meses anteriores). */
  async atrasadasAntesDe(data: DataISO): Promise<Conta[]> {
    const { data: linhas, error } = await this.db
      .from('contas')
      .select(COLUNAS)
      .is('paga_em', null)
      .lt('vencimento', data)
      .order('vencimento');
    if (error) throw error;
    return linhas as Conta[];
  }

  async buscar(id: string): Promise<Conta | null> {
    const { data, error } = await this.db.from('contas').select(COLUNAS).eq('id', id).maybeSingle();
    if (error) throw error;
    return data as Conta | null;
  }

  async criar(dados: DadosConta, repeticao: Repeticao): Promise<void> {
    const { error } = await this.db.from('contas').insert(linhasParaCriar(dados, repeticao));
    if (error) throw error;
  }

  /** Altera esta conta ou também as próximas da mesma série (mantendo o vencimento de cada uma). */
  async atualizar(conta: Conta, dados: DadosConta, tambemProximas: boolean): Promise<void> {
    const { error } = await this.db.from('contas').update(dados).eq('id', conta.id);
    if (error) throw error;
    if (tambemProximas && conta.serie_id) {
      const { vencimento: _v, ...semVencimento } = dados;
      const { error: erroSerie } = await this.db
        .from('contas')
        .update(semVencimento)
        .eq('serie_id', conta.serie_id)
        .gt('vencimento', conta.vencimento)
        .is('paga_em', null);
      if (erroSerie) throw erroSerie;
    }
  }

  async marcarPaga(id: string, paga: boolean): Promise<void> {
    const { error } = await this.db
      .from('contas')
      .update({ paga_em: paga ? hojeISO() : null })
      .eq('id', id);
    if (error) throw error;
  }

  /** Exclui só esta ou esta e as próximas da série. */
  async excluir(conta: Conta, tambemProximas: boolean): Promise<void> {
    const consulta = this.db.from('contas').delete();
    const { error } =
      tambemProximas && conta.serie_id
        ? await consulta.eq('serie_id', conta.serie_id).gte('vencimento', conta.vencimento)
        : await consulta.eq('id', conta.id);
    if (error) throw error;
  }
}
