import type { Product } from "./product";

export type SaleEntry = Pick<Product, "id" | "cikkszam" | "termek_nev" | "mertekegyseg"> & {mennyiseg: number, osszeg: number}