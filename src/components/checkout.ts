
import { DataTable } from "simple-datatables";
import type { Product } from "../types/product";
import { deleteProduct, fetchAllProducts } from "../api/products";
import "flowbite";

// var table_settings: Record<string, boolean> = JSON.parse(localStorage.getItem("backend_data_dropdown_settings") ?? "{}");
// var dataTable: DataTable | null = null;

// function getValues(input: Product, keys: Array<keyof Product>): Array<string | number> {
//     const data: Array<string | number> = []
//     keys.forEach((k) => {
//         data.push(input[k]);
//     });
//     return data;
// }


const products = await fetchAllProducts();
// TODO: checkout table
async function render(): Promise<void> {
    const formattedHeadings = ["Cikkszám", "Kategória", "Termek_Név", "Mértékegyság", "Ár", "Mennyiség", "Összeg", ""];
    const mappedData = products.map(p => {
        const rowData = ["awda", "wada", "awda", "awda", "awdawda", "adwdawa", "awdaw"];
        
        const actionButton = `
            <div class="flex flex-row gap-2">
                <button data-id="${p.id}" class="delete-button text-red-500 size-8 flex justify-center items-center rounded-xl transition hover:scale-105 duration-300 ease-in-out hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="size-6 lucide lucide-trash2-icon lucide-trash-2">
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
                <button class="text-yellow-500 size-8 flex justify-center items-center rounded-xl transition hover:scale-105 duration-300 ease-in-out hover:text-yellow-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="size-6 lucide lucide-pencil-icon lucide-pencil">
                        <path
                            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                        <path d="m15 5 4 4" />
                    </svg>
                </button>
            </div>    
            `;

        return [...rowData, actionButton];
    });
    const data = {
        "headings": formattedHeadings,
        "data": mappedData
    };
    const dt = new DataTable('#default-table', {
        data: data,
        searchable : false,
        perPageSelect: false,
        paging: false,
        classes: {
            wrapper: "p-4 bg-white dark:bg-dark_color shadow-md sm:rounded-lg",
            container: "overflow-x-auto",
        }
    })

    dt.init();
}

async function baked_table(): Promise<void> {
    try {
        const pekProducts = products.filter(p => p.kategoria === "PEK");

        const rows = pekProducts.map(product => [
            product.cikkszam,
            product.termek_nev,
            product.netto_ar,
            product.mertekegyseg
        ])

        const data = {
            "headings": ["Cikkszám", "Termék_Név", "Nettó_Ár", "Mértékegység"],
            "data": rows
        };
        
        const t = new DataTable('#selection-table', { data: data,
            searchable : true,
            perPageSelect: false,
            classes: {
                wrapper: "p-4 bg-white dark:bg-dark_color shadow-md sm:rounded-lg",
        
                top: "flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4",
                
                search: "datatable-search",
                input: "datatable-input",

                dropdown: "sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400",
                selector: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg",
                    
                container: "overflow-x-auto",
                    
                bottom: "flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 border-t border-gray-200 dark:border-gray-700",
                info: "text-sm font-normal text-gray-400 text-gray-400",

                pagination: "datatable-pagination",
            }
        })
        t.init();
    } catch (error) {
        console.error("Hiba történt a táblázat betöltésekor:", error);
    }
}

baked_table();
render();