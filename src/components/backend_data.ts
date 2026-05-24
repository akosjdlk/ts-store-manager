import { DataTable } from "simple-datatables";
import type { Product } from "../types/product";
import { fetchAllProducts } from "../api/products";
import "flowbite"

// const table_body = document.getElementById('table-body');
// const table_head = document.getElementById('table-head');
var table_settings: Record<string, boolean> = JSON.parse(localStorage.getItem("backend_data_dropdown_settings") ?? "{}");

async function render(): Promise<void> {

    const products = await fetchAllProducts()
    dropdown(products[0]!)

    const headings = Object.entries(table_settings).filter(k => k[1]).flatMap(e => e[0])

    /**
     * input: Sale || Product, headings: string[]
     * return: Array<Sale || Product value, de csak az adott headingek-re>
     * 
     * const input: Sale | Product = ...
     * const data = []
     * heading foreach k =>  {
     *     data.append(input[k])
     * }
     */

    const data = {
        "headings": headings.flatMap(v => v.replaceAll("_", " ")),
        "data": [
            [
                "Flowbite",
                "Bergside",
                "05/23/2023",
            ],
            [
                "Next.js",
                "Vercel",
                "03/12/2024",
            ]
        ]
    };
    new DataTable('#selection-table', { data: data,
        paging: false, 
        classes: {
        wrapper: "p-4 bg-white dark:bg-dark_color shadow-md sm:rounded-lg",
        
        top: "flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4",
        
        search: "w-full md:w-1/2 relative",
        input: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
        
        dropdown: "sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400",
        selector: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg",
        
        container: "overflow-x-auto",
        
        bottom: "flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 border-t border-gray-200 dark:border-gray-700",
        info: "text-sm font-normal text-gray-400 text-gray-400",
        
        pagination: "inline-flex items-stretch",
    }
    })
    console.log("asd")
}

const table_dropdown = document.getElementById('backend_data_table_dropdown') as HTMLUListElement

async function dropdown(product: Product) {

    var keys = Object.keys(table_settings);
    if (keys.length === 0) {
        keys = Object.keys(product);
    }

    keys.forEach(k => {
        table_dropdown.innerHTML += `
        <li class="m-1 p-1 odd:bg-gray-100 dark:odd:bg-gray-900 flex flex-row justify-center items-center gap-2 rounded-lg">
            <input type="checkbox" class="rounded-lg product-dd" name="${k}" id="${k}" ${(table_settings[k] ?? true) ? "checked" : ""}>
            <label class="!w-full" for="${k}">${k.toUpperCase()}</label>
        </li>
        `;

        table_dropdown.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        
            if (target && target.classList.contains('product-dd')) {
                const allBoxes = Array.from(table_dropdown.querySelectorAll('.product-dd') as NodeListOf<HTMLInputElement>)
                const options: Record<string, boolean> = Object.fromEntries(allBoxes.map(e => [e.id, e.checked]));
                

                if (!Object.values(options).some(c => c)) {
                    target.checked = true;
                }
                table_settings = options;
                localStorage.setItem("backend_data_dropdown_settings", JSON.stringify(table_settings));
            }
        });
    });
}

render();