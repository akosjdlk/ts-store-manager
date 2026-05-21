import type { Sale } from "../types/sale";

const SALES_ENDPOINT = "http://localhost:8080/sales";

export async function fetchFilteredSales(filters: Record<string, string>): Promise<Sale[]> {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${SALES_ENDPOINT}?${queryString}`);
    if (!response.ok) {
        throw new Error("Failed to fetch sales");
    }
    return response.json() as Promise<Sale[]>;
}

export async function fetchSaleById(id: string): Promise<Sale> {
    const response = await fetch(`${SALES_ENDPOINT}/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch sale with id ${id}`);
    }
    return response.json() as Promise<Sale>;
}

export async function createSale(sale: Sale): Promise<Sale> {
    const response = await fetch(SALES_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sale),
    });
    if (!response.ok) {
        throw new Error("Failed to create sale");
    }
    return response.json() as Promise<Sale>;
}

export async function updateSale(id: string, sale: Sale): Promise<Sale> {
    const response = await fetch(`${SALES_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sale),
    });
    if (!response.ok) {
        throw new Error(`Failed to update sale with id ${id}`);
    }
    return response.json() as Promise<Sale>;
}

export async function deleteSale(id: string | Sale): Promise<void> {
    const response = await fetch(`${SALES_ENDPOINT}/${typeof id === "string" ? id : id.id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`Failed to delete sale with id ${typeof id === "string" ? id : id.id}`);
    }
}