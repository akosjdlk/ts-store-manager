import { initFlowbite } from 'flowbite';
import type { DataTable } from 'simple-datatables';

import { fetchProductById, updateProduct } from '../api/products';
import type { SaleEntry } from '../types/sale_entry';
import { createDataTable, getValues } from './table';
import { CreateToast } from './toast';

interface StockupRow {
    id: string;
    termek_vonalkod: string;
    jelenlegi_keszlet: number;
    bevetelezett_db: number;
    varhato_keszlet: number;
}

type StockupTableRow = StockupRow & SaleEntry & {
    muveletek: string;
};

const STORAGE_KEY = 'editedProducts';
const HEADERS: Array<keyof StockupTableRow & string> = [
    'termek_vonalkod',
    'jelenlegi_keszlet',
    'bevetelezett_db',
    'varhato_keszlet',
    'muveletek',
];

initFlowbite();

const table = document.querySelector<HTMLTableElement>('table');
const form = document.getElementById('add_stockup_form') as HTMLFormElement;
const submitBtn = document.getElementById('stockup_submit_btn') as HTMLButtonElement;
const confirmBtn = document.getElementById('confirmstockupbtn') as HTMLButtonElement;

let dataTable: DataTable | null = null;

function loadRows(): StockupRow[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as StockupRow[];
}

function saveRows(rows: StockupRow[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function getNumber(inputId: string): number {
    const value = Number((document.getElementById(inputId) as HTMLInputElement).value);
    return Number.isFinite(value) ? value : 0;
}

function getDeleteButton(id: string): string {
    return `
        <button data-id="${id}" class="stockup-delete-button text-red-500 size-8 flex justify-center items-center rounded-xl transition hover:scale-105 duration-300 ease-in-out hover:text-red-700" type="button" aria-label="Sor törlése">
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
}

function toTableRow(row: StockupRow): StockupTableRow {
    return {
        ...row,
        cikkszam: row.termek_vonalkod,
        termek_nev: row.termek_vonalkod,
        mertekegyseg: 'db',
        mennyiseg: row.bevetelezett_db,
        osszeg: row.varhato_keszlet,
        muveletek: getDeleteButton(row.id),
    };
}

function updateTableRow(row: StockupRow): void {
    dataTable?.rows.add(getValues(toTableRow(row), HEADERS, false, false));
    dataTable?.update();
}

function clearTable(): void {
    if (!dataTable) {
        return;
    }

    dataTable.data.data = [];
    dataTable.update();
}

function initTable(): void {
    if (!table) {
        return;
    }

    const dropdown = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown');

    dataTable = createDataTable(
        'stockup',
        table,
        loadRows().map(toTableRow),
        HEADERS,
        dropdown ? [dropdown] : null,
        true,
        true,
        true,
        false,
    );

    table.addEventListener('click', (event) => {
        const deleteBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('.stockup-delete-button');
        if (!deleteBtn?.dataset['id']) {
            return;
        }

        saveRows(loadRows().filter((row) => row.id !== deleteBtn.dataset['id']));

        const rowIndex = Number(deleteBtn.closest('tr')?.dataset['index']);
        if (!Number.isNaN(rowIndex)) {
            dataTable?.rows.remove(rowIndex);
            dataTable?.update();
        }

        CreateToast('Sor törölve', 'success');
    });
}

submitBtn.addEventListener('click', async () => {
    const productBarcode = (document.getElementById('barcode') as HTMLInputElement).value.trim();
    const quantity = getNumber('quantity');

    if (!productBarcode || quantity <= 0) {
        return;
    }

    const product = await fetchProductById(productBarcode);
    const row: StockupRow = {
        id: crypto.randomUUID(),
        termek_vonalkod: productBarcode,
        jelenlegi_keszlet: product.keszlet,
        bevetelezett_db: quantity,
        varhato_keszlet: product.keszlet + quantity,
    };

    saveRows(loadRows().concat(row));
    updateTableRow(row);
    form.reset();
});

confirmBtn.addEventListener('click', async () => {
    const rows = loadRows();
    if (rows.length === 0) {
        return;
    }

    for (const row of rows) {
        const product = await fetchProductById(row.termek_vonalkod);
        product.keszlet += row.bevetelezett_db;
        await updateProduct(row.termek_vonalkod, product);
    }

    saveRows([]);
    clearTable();
    CreateToast('Bevételezés véglegesítve', 'success');
});

initTable();
