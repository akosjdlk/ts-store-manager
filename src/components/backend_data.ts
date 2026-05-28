import { createDataTable } from "./table";
import { fetchAllProducts } from "../api/products";
import type { Product } from "../types/product";
import "flowbite";

async function main() {
    const products = await fetchAllProducts();
    const table = document.querySelector('table')!;
    const p = products[0]!;
    const headers = Object.keys(p) as Array<keyof Product>;
    const dropdown = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown')!;
    const dropdown_mobile = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown_mobile')!;

    createDataTable("checkout", table, products, headers, [dropdown, dropdown_mobile], true, true, true, true, (ev) => {console.log(ev.currentTarget)});
}

await main();