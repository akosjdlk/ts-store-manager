import { initFlowbite } from "flowbite";

import { fetchAllSales } from "../api/sales";
import type { Sale } from "../types/sale";
import { createDataTable } from "./table";

initFlowbite();

const SALES_HEADERS: Array<keyof Sale & string> = ["id", "date", "bruttoOsszeg"];

function formatDate(date: string): string {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleString("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatSales(sales: Sale[]): Sale[] {
    return sales.map((sale) => ({
        ...sale,
        date: formatDate(sale.date),
        bruttoOsszeg: Math.round(sale.bruttoOsszeg),
    }));
}

async function renderTable(): Promise<void> {
    const table = document.querySelector("table");
    if (!table) {
        return;
    }

    const dropdown = document.querySelector<HTMLUListElement>("#backend_data_table_dropdown");
    const dropdownMobile = document.querySelector<HTMLUListElement>("#backend_data_table_dropdown_mobile");
    const dropdowns = [dropdown, dropdownMobile].filter((element): element is HTMLUListElement => element !== null);

    const sales = formatSales(await fetchAllSales());

    createDataTable(
        "sales",
        table,
        sales,
        SALES_HEADERS,
        dropdowns,
        true,
        true,
        true,
        false,
    );
}

void renderTable();
