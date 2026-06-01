import { createDataTable } from "./table";
import { fetchAllProducts } from "../api/products";
import type { Product } from "../types/product";
import {  ModifyModal} from "./modal";
import "flowbite";

async function main(): Promise<void> {
    const desktopBtn = document.getElementById("add-product-btn-desktop");
    const mobileBtn = document.getElementById("add-product-btn-mobile");

    const products = await fetchAllProducts();
    const table = document.querySelector('table')!;
    const p = products[0]!;
    const headers = Object.keys(p) as Array<keyof Product>;
    const dropdown = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown')!;
    const dropdown_mobile = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown_mobile')!;

    createDataTable("checkout", table, products, headers, [dropdown, dropdown_mobile], true, true, true, true, (ev) => {console.log(ev.currentTarget)});

    const uniqueCategories = [...new Set(products.map(p => p.kategoria))];
    const categoryOptions = uniqueCategories.map(cat => ({
        value: cat,
        label: cat
    }));

    const openModalHandler = (): void => {
        ModifyModal(
            "Add Product", 
            "Create New Product", 
            [
                { name: "id", label: "Vonalkód", type: "text" },
                { name: "kategoria", label: "Kategoria", type: "select", options: categoryOptions },
                { name: "termek_nev", label: "Termék Név", type: "text" },
                { name: "keszlet", label: "Készlet", type: "number" },
                { name: "mertekegyseg", label: "Mértékegység", type: "text" },
                { name: "netto_ar", label: "Nettó ár", type: "number" }
            ]
        );
    };

    if (desktopBtn) {
        desktopBtn.addEventListener("click", openModalHandler);
    } else {
        console.error("Nem találom az 'add-product-btn-desktop' id-jú gombot a HTML-ben!");
    }

    if (mobileBtn) {
        console.log("Mobil gomb megtalálva, eseménykezelő regisztrálva.");
        mobileBtn.addEventListener("click", openModalHandler);
    }
}

await main();