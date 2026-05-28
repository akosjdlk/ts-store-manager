
export interface Product {
  id: string;
  cikkszam: string;
  kategoria: string;
  termek_nev: string;
  keszlet: number;
  mertekegyseg: string; // TODO: enum
  netto_ar: number;
  brutto_ar: number;
  afa: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isProduct(p: any): p is Product {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, sonarjs/different-types-comparison
  return (p as Product).cikkszam !== undefined;
}