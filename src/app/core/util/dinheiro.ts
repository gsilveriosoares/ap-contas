/**
 * Converte o que a pessoa digitou ("1.234,56", "89,9", "R$ 50") em centavos.
 * Devolve null se não for um valor válido maior que zero.
 */
export function paraCentavos(texto: string | null | undefined): number | null {
  if (!texto) return null;
  let limpo = texto.replace(/[R$\s]/g, '');
  if (!limpo) return null;
  if (limpo.includes(',')) {
    limpo = limpo.replace(/\./g, '').replace(',', '.');
  } else if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) {
    limpo = limpo.replace(/\./g, ''); // "1.234" = mil duzentos e trinta e quatro
  }
  if (!/^\d+(\.\d{1,2})?$/.test(limpo)) return null;
  const centavos = Math.round(Number(limpo) * 100);
  return centavos > 0 ? centavos : null;
}

/** Centavos → texto para o campo de valor ("1234,56"). */
export function centavosParaEntrada(centavos: number): string {
  return (centavos / 100).toFixed(2).replace('.', ',');
}

/** Centavos → reais, para usar com o pipe currency. */
export const emReais = (centavos: number): number => centavos / 100;
