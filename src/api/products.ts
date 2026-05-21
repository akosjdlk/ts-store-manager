import type { Product } from "../types/product";

const PRODUCTS_ENDPOINT = "http://localhost:8080/products";

export async function fetchFilteredProducts(filters: Record<string, string>): Promise<Product[]> {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${PRODUCTS_ENDPOINT}?${queryString}`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return response.json() as Promise<Product[]>;
}

export async function fetchProductById(id: string): Promise<Product> {
    const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch product with id ${id}`);
    }
    return response.json() as Promise<Product>;
}

export async function createProduct(product: Product): Promise<Product> {
    const response = await fetch(PRODUCTS_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        throw new Error("Failed to create product");
    }
    return response.json() as Promise<Product>;
}

export async function updateProduct(id: string, product: Product): Promise<Product> {
    const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        throw new Error(`Failed to update product with id ${id}`);
    }
    return response.json() as Promise<Product>;
}

export async function deleteProduct(id: string | Product): Promise<void> {
    const response = await fetch(`${PRODUCTS_ENDPOINT}/${typeof id === "string" ? id : id.id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`Failed to delete product with id ${typeof id === "string" ? id : id.id}`);
    }
}