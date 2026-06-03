
export interface Product {
  id: string;
  cikkszam: string;
  kategoria: string;
  termek_nev: string;
  keszlet: number;
  mertekegyseg: string;
  netto_ar: number;
  brutto_ar: number;
  afa: number;
}

export function isProduct(p: unknown): p is Product {
  if (p === undefined || p === null) {
    return false;
  }
  const prod = (p as Product)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, sonarjs/different-types-comparison
  return prod.cikkszam !== undefined && prod.keszlet !== undefined;
}