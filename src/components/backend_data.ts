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



// import { DataTable } from "simple-datatables";
// import type { Product } from "../types/product";
// import { fetchAllProducts, deleteProduct } from "../api/products";
// import type { Sale } from "../types/sale";


// var table_settings: Record<string, boolean> = JSON.parse(localStorage.getItem("backend_data_dropdown_settings") ?? "{}");
// var dataTable: DataTable | null = null;

// function getValues<T extends Product | Sale, K extends keyof T>(input: T, keys: Array<K>): Array<T[K]> {
//     const data: Array<T[K]> = []
//     keys.forEach((k) => {
//         data.push(input[k]);
//     });
//     return data;
// }

// async function index(): Promise<void> {
//     const products = await fetchAllProducts();
//     table_dropdown.innerHTML = "";
//     dropdown(products[0]!);
//     render();
// }

// async function render(): Promise<void> {
//     const products = await fetchAllProducts();
//     const headings = Object.entries(table_settings).filter(k => k[1]).map(e => e[0]);
//     const formattedHeadings = headings.map(v => v.replaceAll("_", "-"));
//     formattedHeadings.push("");

//     const mappedData = products.map(p => {
//         const rowData = getValues(p, headings as Array<keyof Product>);
        
//         const actionButton = `
//             <div class="flex flex-row gap-2">
//                 <button data-id="${p.id}" class="delete-button text-red-500 size-8 flex justify-center items-center rounded-xl transition hover:scale-105 duration-300 ease-in-out hover:text-red-700">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
//                         class="size-6 lucide lucide-trash2-icon lucide-trash-2">
//                         <path d="M10 11v6" />
//                         <path d="M14 11v6" />
//                         <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
//                         <path d="M3 6h18" />
//                         <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                     </svg>
//                 </button>
//                 <button class="text-yellow-500 size-8 flex justify-center items-center rounded-xl transition hover:scale-105 duration-300 ease-in-out hover:text-yellow-700">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
//                         class="size-6 lucide lucide-pencil-icon lucide-pencil">
//                         <path
//                             d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
//                         <path d="m15 5 4 4" />
//                     </svg>
//                 </button>
//             </div>    
//             `;

//         return [...rowData, actionButton];
//     });


//     const data = {
//         "headings": formattedHeadings,
//         "data": mappedData
//     };
//     if (dataTable !== null) {
//         dataTable.destroy();
//     }
//     dataTable = new DataTable('#selection-table', {
//         data: data,
//         paging: false,
//         searchable: true,
//         classes: {
//             wrapper: "p-4 bg-white dark:bg-dark_color shadow-md sm:rounded-lg",
//             top: "flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 pb-4",
//             container: "overflow-x-auto",
//             table: "custom-table",
//         }
//     });

//     const deleteButtons = document.querySelectorAll(".delete-button") as NodeListOf<HTMLButtonElement>;
//     deleteButtons.forEach((btn) => {
//         btn.onclick = async () => {
//             const id = btn.dataset["id"] ?? null;
//             if (!id) {
//                 return;
//             }
//             await deleteProduct(id)
//             render();
//         }
//     })
// }

// const table_dropdown = document.getElementById('backend_data_table_dropdown') as HTMLUListElement;

// async function dropdown(product: Product) {

//     var keys = Object.keys(table_settings);
//     if (keys.length === 0) {
//         keys = Object.keys(product);
//     }

//     keys.forEach(k => {
//         table_dropdown.innerHTML += `
//         <li class="m-1 p-1 odd:bg-gray-100 dark:odd:bg-gray-900 flex flex-row justify-center items-center gap-2 rounded-lg">
//             <input type="checkbox" class="rounded-lg product-dd" name="${k}" id="${k}" ${(table_settings[k] ?? true) ? "checked" : ""}>
//             <label class="!w-full" for="${k}">${k.toUpperCase()}</label>
//         </li>
//         `;

//     });
    
//     table_dropdown.addEventListener('change', (event) => {
//         const target = event.target as HTMLInputElement;
    
//         const allBoxes = Array.from(table_dropdown.querySelectorAll('.product-dd') as NodeListOf<HTMLInputElement>)
//         const options: Record<string, boolean> = Object.fromEntries(allBoxes.map(e => [e.id, e.checked]));
        

//         if (!Object.values(options).some(c => c)) {
//             target.checked = true;
//             return;
//         }
//         table_settings = options;
//         render();
//         localStorage.setItem("backend_data_dropdown_settings", JSON.stringify(table_settings));
        
//     });
// }

// index();


