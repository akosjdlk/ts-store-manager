
export interface Sale {
    id: string;
    date: string;
    products: Array<{
        productId: string;
        quantity: number;
    }>;
    bruttoOsszeg: number;
}