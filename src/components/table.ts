import { DataTable } from "simple-datatables";
import type { Sale } from "../types/sale";
import { isProduct, type Product } from "../types/product";
import { deleteProduct } from "../api/products";
import { deleteSale } from "../api/sales";

type Cell = string | number | boolean;
type CellRow = Array<Cell>;

interface DataTableConfig {
    dataTable: DataTable;
    storedData: Array<CellRow>;
}

type DropdownData = Record<string, boolean>;

const dataTables = new Map<string, DataTableConfig>();

function getValues<T extends Product | Sale, K extends keyof T>(
    input: T,
    keys: Array<K>,
    deleteButton: boolean,
    modifyButton: boolean
): CellRow {
    const data: CellRow = [];
    keys.forEach((k) => {
        data.push(input[k] as Cell);
    });

    if (deleteButton || modifyButton) {
        data.push(getActionButtons(input.id, deleteButton, modifyButton));
    }

    return data;
}

function readHeaders(configKey: string): DropdownData {
    return JSON.parse(localStorage.getItem(configKey) ?? "{}");
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
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
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

function getDatatable(table: HTMLTableElement, headings: string[], data: Array<CellRow>, searchable: boolean, sortable: boolean, paging: boolean): DataTable {
    return new DataTable(
        table,
        {
            data: {
                headings: headings,
                data: data
            },
            classes: {
                top: "flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4",
                
                search: "datatable-search",
                input: "datatable-input",

                dropdown: "sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400",
                selector: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg",
                    
                container: "overflow-x-auto",
                    
                bottom: "flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 border-t border-gray-200 dark:border-gray-700",
                info: "text-sm font-normal text-gray-400 text-gray-400",

                pagination: "datatable-pagination",
                table: "w-full h-fit text-sm text-left rtl:text-right text-body custom-datatable",

                wrapper: "relative overflow-x-auto shadow-xs ms-4 mt-4 me-4"
            },
            searchable: searchable,
            sortable: sortable,
            paging: paging,
        }
    );
}

export function createDataTable<
    T extends Product | Sale,
    K extends keyof T & string
>(
    configKey: string,
    table: HTMLTableElement,
    data: T[],
    headers: K[],
    settingDropdowns: HTMLUListElement[] | null = null,
    searchable: boolean = true,
    sortable: boolean = true,
    paging: boolean = false,
    deleteButton: boolean = true,
    modifyButtonCallback: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null
): void {
    if (dataTables.has(configKey)) {
        throw new Error("This table already exists! Use updateDataTable instead.");
    }

    const mappedData = data.map(d => getValues(d, headers, deleteButton, modifyButtonCallback !== null)) as Array<CellRow>;
    const mappedHeadings = headers.map(h => h ? String(h).replaceAll("_", "-") : h);

    if (deleteButton || modifyButtonCallback) {
        mappedHeadings.push("");
    }

    const savedHeaders = readHeaders(configKey);
    const dropdownKeys: DropdownData = {};
    headers.forEach(h => {
        dropdownKeys[h] = savedHeaders[h] !== undefined ? savedHeaders[h] : true;
    });

    setHeaders(configKey, dropdownKeys);

    const dt = getDatatable(table, mappedHeadings, mappedData, searchable, sortable, paging);
    dataTables.set(configKey, { dataTable: dt, storedData: mappedData });

    headers.forEach((h, index) => {
        if (!dropdownKeys[h]) {
            dt.columns.hide([index]);
        }
    });

    if (deleteButton) {
        const deleteButtons = table.querySelectorAll(".delete-button") as NodeListOf<HTMLButtonElement>;
        deleteButtons.forEach((btn) => {
            btn.onclick = async () => {
                const id = btn.dataset["id"] ?? null;
                if (!id) return;

                if (isProduct(data[0])) {
                    await deleteProduct(id);
                } else {
                    await deleteSale(id);
                }

                const i = Number(btn.parentElement?.parentElement?.parentElement?.dataset["index"]);
                if (isNaN(i)) {
                    throw new Error("NO TR");
                }
                dt.data.data.splice(i, 1);
                dataTables.get(configKey)?.storedData.splice(i, 1);
                dt.update();
            };
        });
    }

    if (modifyButtonCallback !== null) {
        const modifyButtons = table.querySelectorAll(".modify-button") as NodeListOf<HTMLButtonElement>;
        modifyButtons.forEach((btn) => {
            btn.onclick = modifyButtonCallback;
        });
    }

    if (!settingDropdowns || settingDropdowns.length == 0) {
        return;
    }

    settingDropdowns.forEach((sd, dropdownIndex) => {
        let listHTML = "";
        headers.forEach((key) => {
            const enabled = dropdownKeys[key];
            const uniqueId = `${configKey}-${dropdownIndex}-${key}`;
            listHTML += `
            <li class="m-1 p-1 odd:bg-gray-100 dark:odd:bg-gray-900 flex flex-row justify-center items-center gap-2 rounded-lg">
                <input type="checkbox" class="rounded-lg product-dd" data-key="${key}" name="${key}" id="${uniqueId}" ${enabled ? "checked" : ""}>
                <label class="!w-full cursor-pointer" for="${uniqueId}">${String(key).replaceAll("_", "-").toUpperCase()}</label>
            </li>
            `;
        });
        sd.innerHTML = listHTML;

        sd.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            if (!target || !target.classList.contains('product-dd')) return;

            const currentBoxes = Array.from(sd.querySelectorAll('.product-dd') as NodeListOf<HTMLInputElement>);
            const anyChecked = currentBoxes.some(box => box.checked);

            if (!anyChecked) {
                target.checked = true;
                return;
            }

            const updatedOptions: DropdownData = {};

            currentBoxes.forEach((box) => {
                const keyStr = box.dataset["key"]!;
                updatedOptions[keyStr] = box.checked;

                const colIndex = headers.indexOf(keyStr as K);
                if (colIndex !== -1) {
                    if (box.checked) {
                        dt.columns.show([colIndex]);
                    } else {
                        dt.columns.hide([colIndex]);
                    }
                }
            });

            setHeaders(configKey, updatedOptions);

            settingDropdowns.forEach((otherSd) => {
                if (otherSd === sd) return;
                const otherBoxes = Array.from(otherSd.querySelectorAll('.product-dd') as NodeListOf<HTMLInputElement>);
                otherBoxes.forEach((otherBox) => {
                    const keyStr = otherBox.dataset["key"]!;
                    otherBox.checked = updatedOptions[keyStr]!;
                });
            });
        });
    });
}