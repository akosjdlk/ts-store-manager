import { DataTable } from "simple-datatables"
import type { Sale } from "../types/sale";
import { isProduct, type Product } from "../types/product";
import { deleteProduct } from "../api/products";
import { deleteSale } from "../api/sales";

type Cell = string | number | boolean;
type CellRow = Array<Cell>;

interface DataTableConfig {
    dataTable: DataTable
    storedData: Array<CellRow>
}

type DropdownData = Map<string, boolean>
 
const dataTables = new Map<string, DataTableConfig>();


function getValues<T extends Product | Sale, K extends keyof T>(input: T, keys: Array<K>, deleteButton: boolean, modifyButton: boolean): CellRow {
    const data: CellRow = [];
    keys.forEach((k) => {
        data.push(input[k] as Cell);
    });

    if (deleteButton || modifyButton) { data.push(getActionButtons(input.id, deleteButton, modifyButton)); }
    
    return data;
}

function readHeaders(configKey: string): DropdownData {
    return JSON.parse(localStorage.getItem(configKey) ?? "{}")
}

function setHeaders(configKey: string, headers: DropdownData): void {
    localStorage.setItem(configKey, JSON.stringify(headers));
}

function getActionButtons(id: string, deleteButton: boolean, modifyButton: boolean) {

    const deleteBtn = `
        <button data-id="${id}" class="delete-button text-red-500 size-8 flex justify-center items-center rounded-xl transition hover:scale-105 duration-300 ease-in-out hover:text-red-700">
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
    `;

    const modifyBtn = `
        <button data-id="${id}" class="modify-button text-yellow-500 size-8 flex justify-center items-center rounded-xl transition hover:scale-105 duration-300 ease-in-out hover:text-yellow-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="size-6 lucide lucide-pencil-icon lucide-pencil">
                <path
                    d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
            </svg>
        </button>
    `;

    return `
    <div class="flex flex-row gap-2">
        ${deleteButton ? deleteBtn : ""}
        ${modifyButton ? modifyBtn : ""}
    </div>    
    `;
}

export function createDataTable<
    T extends Product | Sale, 
    K extends keyof T & string
>(
    configKey: string,
    table: HTMLTableElement,
    data: T[], 
    headers: K[], 
    settingDropdown: HTMLUListElement | null = null,
    searchable: boolean = true,
    sortable: boolean = true,
    paging: boolean = false,
    deleteButton: boolean = true,
    modifyButtonCallback: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null
): void {
    if (dataTables.has(configKey)) {
        throw new Error("This table already exists! Use updateDataTable instead.");
    }
    
    const mappedData = data.map(d => {return getValues(d, headers, deleteButton, modifyButtonCallback !== null)}) as Array<CellRow>;
    const mappedHeadings = headers.map(h => h.replace("_", "-"));

    if (deleteButton || modifyButtonCallback) {
        mappedHeadings.push("");
    }
    
    const dropdownKeys = new Map(headers.map(h => [h, true])); // TODO: read from localstorage

    setHeaders(configKey, dropdownKeys);

    const dt = new DataTable(
        table,
        {
            data: {
                headings: mappedHeadings,
                data: mappedData
            },
            classes: {
                table: "w-full h-fit text-sm text-left rtl:text-right text-body custom-datatable",
                wrapper: "relative overflow-x-auto shadow-xs ms-4 mt-4 me-4"
            },
            searchable: searchable,
            sortable: sortable,
            paging: paging,
        }
    )


    dataTables.set(configKey, {dataTable: dt, storedData: mappedData});

    if (deleteButton) {
        const deleteButtons = table.querySelectorAll(".delete-button") as NodeListOf<HTMLButtonElement>;
        deleteButtons.forEach((btn) => {
            btn.onclick = async () => {
                const id = btn.dataset["id"] ?? null;
                if (!id) {
                    return;
                }

                if (isProduct(data[0])) {
                    await deleteProduct(id)
                } else {
                    await deleteSale(id)
                }

                const i = Number(btn.parentElement?.parentElement?.parentElement?.dataset["index"]);
                if (i === undefined) {
                    throw new Error("NO TR");
                }
                dt.data.data.splice(i, 1);
                dt.update();
            }
        })
    }

    if (modifyButtonCallback !== null) {
        const modifyButtons = table.querySelectorAll(".modify-button") as NodeListOf<HTMLButtonElement>;
        modifyButtons.forEach((btn) => {
            btn.onclick = modifyButtonCallback;
        })
    }

    if (!settingDropdown) {
        return;
    }


    dropdownKeys.forEach((enabled, key) => {
        settingDropdown.innerHTML += `
        <li class="m-1 p-1 odd:bg-gray-100 dark:odd:bg-gray-900 flex flex-row justify-center items-center gap-2 rounded-lg">
            <input type="checkbox" class="rounded-lg product-dd" name="${key}" id="${key}" ${(enabled) ? "checked" : ""}>
            <label class="!w-full" for="${key}">${key.toUpperCase()}</label>
        </li>
        `;

    });
    
    settingDropdown.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
    
        const allBoxes = Array.from(settingDropdown.querySelectorAll('.product-dd') as NodeListOf<HTMLInputElement>)
        const options: Map<string, boolean> = new Map(allBoxes.map(e => [e.id, e.checked]));
        

        if (!Object.values(options).some(c => c)) {
            target.checked = true;
            return;
        }
        const arr = Array.from(options.keys());
        if (deleteButton || modifyButtonCallback) {
            arr.push("")
        }
        dt.options.data.headings = arr;
        setHeaders(configKey, options);        
    });
}