/** Datas no formato do banco: "AAAA-MM-DD", sempre no fuso do aparelho. */
export type DataISO = string;

export function isoDe(data: Date): DataISO {
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${m}-${d}`;
}

export const hojeISO = (): DataISO => isoDe(new Date());

/** "AAAA-MM-DD" → Date local (meia-noite), sem o deslocamento de fuso do new Date(iso). */
export function dataDe(iso: DataISO): Date {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
}

/**
 * Soma meses mantendo o dia; se o mês não tem esse dia (31 em abril), usa o último dia do mês.
 */
export function somarMeses(iso: DataISO, meses: number): DataISO {
  const [a, m, d] = iso.split('-').map(Number);
  const alvo = new Date(a, m - 1 + meses, 1);
  const ultimoDia = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
  alvo.setDate(Math.min(d, ultimoDia));
  return isoDe(alvo);
}

export function somarDias(iso: DataISO, dias: number): DataISO {
  const data = dataDe(iso);
  data.setDate(data.getDate() + dias);
  return isoDe(data);
}

/** Primeiro e último dia do mês (mes de 0 a 11). */
export function limitesDoMes(ano: number, mes: number): { inicio: DataISO; fim: DataISO } {
  return { inicio: isoDe(new Date(ano, mes, 1)), fim: isoDe(new Date(ano, mes + 1, 0)) };
}
