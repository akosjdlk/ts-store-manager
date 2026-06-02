
export interface Sale {
    id?: string;
    date: string;
    products: Array<{
        productId: string;
        bruttoAr: number;
        quantity: number;
    }>;
    bruttoOsszeg: number;
}

export function isSale(s: unknown): s is Sale {
  const sale = (s as Sale)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, sonarjs/different-types-comparison
  return sale.date !== undefined && sale.bruttoOsszeg !== undefined;
}