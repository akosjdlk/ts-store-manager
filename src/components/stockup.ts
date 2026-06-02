import { initFlowbite } from 'flowbite'

import { fetchProductById, updateProduct } from '../api/products';

import { createDataTable } from "./table";


initFlowbite()

const stockupSubmitBtn = document.getElementById('stockup_submit_btn') as HTMLButtonElement
const add_stockup_form = document.getElementById('add_stockup_form') as HTMLFormElement
const confirmStockupBtn = document.getElementById('confirmstockupbtn') as HTMLButtonElement;

interface StockupRow {
    id: string,
    termek_vonalkod: string,
    jelenlegi_keszlet: number,
    bevetelezett_db: number,
    varhato_keszlet: number
}

const STOCKUP_STORAGE_KEY = 'editedProducts';
const STOCKUP_HEADERS: Array<keyof StockupRow> = ['termek_vonalkod', 'jelenlegi_keszlet', 'bevetelezett_db', 'varhato_keszlet'];

function createRowId(): string {
    return crypto.randomUUID();
}

function toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function getStoredRows(): StockupRow[] {
    const rawRows = localStorage.getItem(STOCKUP_STORAGE_KEY);
    if (!rawRows) {
        return [];
    }

    return JSON.parse(rawRows) as StockupRow[];
}

function saveRows(rows: StockupRow[]): void {
    localStorage.setItem(STOCKUP_STORAGE_KEY, JSON.stringify(rows));
}

function renderTable(): void {
    const rows = getStoredRows();
    const table = document.querySelector('table')!;
    const dropdown = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown')!;
    const dropdownMobile = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown_mobile')!;

    createDataTable("stockup", table, rows, STOCKUP_HEADERS, [dropdown, dropdownMobile], true, true, true, true, null, (id) => {
        const filteredRows = rows.filter((row) => row.id !== id);
        saveRows(filteredRows);
    });
}

stockupSubmitBtn.addEventListener('click', async () => {
    const productBarcode = (document.getElementById('barcode') as HTMLInputElement).value.trim();
    const addToProductQuantity = toNumber((document.getElementById('quantity') as HTMLInputElement).value);

    if (!productBarcode || addToProductQuantity <= 0) {
        return;
    }

    const product = await fetchProductById(productBarcode);

    const storedRows = getStoredRows();
    const nextRows = [
        ...storedRows,
        {
            id: createRowId(),
            termek_vonalkod: productBarcode,
            jelenlegi_keszlet: product.keszlet,
            bevetelezett_db: addToProductQuantity,
            varhato_keszlet: product.keszlet + addToProductQuantity
        }
    ];

    saveRows(nextRows);

    add_stockup_form.reset();
    renderTable();
});

confirmStockupBtn.addEventListener('click', async () => {
    const productsToUpdate = getStoredRows();
    if (productsToUpdate.length === 0) {
        return;
    }

    for (const product of productsToUpdate) {
        const productDetails = await fetchProductById(product.termek_vonalkod);
        productDetails.keszlet += product.bevetelezett_db;

        await updateProduct(product.termek_vonalkod, productDetails);
    }

    saveRows([]);
    renderTable();
});

renderTable();