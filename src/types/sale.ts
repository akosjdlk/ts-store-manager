
export interface Sale {
    id: string;
    date: string;
    products: {
        productId: string;
        quantity: number;
    }[];
    bruttoOsszeg: number;
}