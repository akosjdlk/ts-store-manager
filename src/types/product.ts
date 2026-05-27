
export interface Product {
  id: string;
  cikkszam: string;
  kategoria: string;
  termek_nev: string;
  keszlet: number;
  mertekegyseg: string; // todo: enum
  netto_ar: number;
  brutto_ar: number;
  afa: number;
}

export function isProduct(p: any): p is Product {
  return (<Product>p).cikkszam !== undefined;
}