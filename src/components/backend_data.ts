import { createDataTable, getValues } from "./table";
import { fetchAllProducts, updateProduct, createProduct } from "../api/products";
import type { Product } from "../types/product";
import { CustomModal } from "./modal";
import { CreateToast } from "./toast";
import "flowbite";

async function main(): Promise<void> {
    const desktopBtn = document.getElementById("add-product-btn-desktop");
    const mobileBtn = document.getElementById("add-product-btn-mobile");

    const products = await fetchAllProducts();
    const table = document.querySelector('table')!;
    const p = products[0]!;
    const headers = Object.keys(p) as Array<keyof Product>;
    const dropdown = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown')!;
    const dropdown_mobile = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown_mobile')!;


    const uniqueCategories = [...new Set(products.map((p) => p.kategoria))];
    const categoryOptions = uniqueCategories.map((cat) => ({
        value: cat,
        label: cat,
    }));

    const dt = createDataTable("backend_data", table, products, headers, [dropdown, dropdown_mobile], true, true, true, true, (ev): void => {
        const productIndex = products.findIndex((prod) => prod.id === (ev.currentTarget as HTMLButtonElement).dataset["id"]);
        const product = products[productIndex];

        new CustomModal({
            submitText: "Mentés",
            title: "Termék módosítása",
            inputs: [
                { id: "id", label: "Vonalkód", type: "text", attributes: { readonly: "readonly", value: product?.id ?? "" } },
                { id: "cikkszam", label: "Cikkszám", type: "text", attributes: { value: product?.cikkszam ?? "" } },
                { id: "kategoria", label: "Kategória", type: "select", options: categoryOptions, selectedValue: product?.kategoria },
                { id: "termek_nev", label: "Termék Név", type: "text", attributes: { value: product?.termek_nev ?? "" } },
                { id: "keszlet", label: "Készlet", type: "number", attributes: { value: product?.keszlet.toString() ?? "" } },
                { id: "mertekegyseg", label: "Mértékegység", type: "text", attributes: { value: product?.mertekegyseg ?? "" } },
                { id: "netto_ar", label: "Nettó ár", type: "number", attributes: { value: product?.netto_ar.toString() ?? "" } }
            ],
            footerInput: null,
            onSubmit: async (data): Promise<void> => {
                const validatedProduct = validateProductData(data);

                products[productIndex] = await updateProduct(validatedProduct.id, validatedProduct);
                dt.rows.updateRow(productIndex, getValues(validatedProduct, headers, true, true))

                dt.update();  // TODO: kell?
                CreateToast("Termék módosítva", "success");
            }
        }).open();
    });




    const openModalHandler = (): void => {
        new CustomModal({
            submitText: "Add Product", 
            title: "Create New Product", 
            inputs: [
                { id: "id", label: "Vonalkód", type: "text" },
                { id: "kategoria", label: "Kategoria", type: "select", options: categoryOptions, selectedValue: undefined },
                { id: "termek_nev", label: "Termék Név", type: "text" },
                { id: "keszlet", label: "Készlet", type: "number" },
                { id: "mertekegyseg", label: "Mértékegység", type: "text" },
                { id: "netto_ar", label: "Nettó ár", type: "number" }
            ],
            footerInput: null,
            onSubmit: async (data): Promise<void> => {
                data["cikkszam"] = "CK-" + String(data["id"]).substring(10);
                const newProduct = validateProductData(data);
                await createProduct(newProduct);

                dt.insert({data: [getValues(newProduct, headers, true, true)]});
                dt.update();
                CreateToast("Termék létrehozva", "success");
            }
        }).open();
    };

    if (desktopBtn) {
        desktopBtn.addEventListener("click", openModalHandler);
    }

    if (mobileBtn) {
        mobileBtn.addEventListener("click", openModalHandler);
    }
}

function validateProductData(data: Record<string, unknown>): Product {
    if (typeof data["id"] !== "string" || data["id"].trim() === "") {
        CreateToast("A 'id' mező kötelező és nem lehet üres.", "warning");
        throw new Error("A 'id' mező kötelező és nem lehet üres.");
    }
    if (typeof data["cikkszam"] !== "string" || data["cikkszam"].trim() === "") {
        CreateToast("A 'cikkszam' mező kötelező és nem lehet üres.", "warning");
        throw new Error("A 'cikkszam' mező kötelező és nem lehet üres.");
    }
    if (typeof data["kategoria"] !== "string" || data["kategoria"].trim() === "") {
        CreateToast("A 'kategoria' mező kötelező és nem lehet üres.", "warning");
        throw new Error("A 'kategoria' mező kötelező és nem lehet üres.");
    }
    if (typeof data["termek_nev"] !== "string" || data["termek_nev"].trim() === "") {
        CreateToast("A 'termek_nev' mező kötelező és nem lehet üres.", "warning");
        throw new Error("A 'termek_nev' mező kötelező és nem lehet üres.");
    }
    if (typeof data["keszlet"] !== "string" || isNaN(Number(data["keszlet"]))) {
        CreateToast("A 'keszlet' mező kötelező és számnak kell lennie.", "warning");
        throw new Error("A 'keszlet' mező kötelező és számnak kell lennie.");
    }
    if (typeof data["mertekegyseg"] !== "string" || data["mertekegyseg"].trim() === "") {
        CreateToast("A 'mertekegyseg' mező kötelező és nem lehet üres.", "warning");
        throw new Error("A 'mertekegyseg' mező kötelező és nem lehet üres.");
    }
    if (typeof data["netto_ar"] !== "string" || isNaN(Number(data["netto_ar"]))) {
        CreateToast("A 'netto_ar' mező kötelező és számnak kell lennie.", "warning");
        throw new Error("A 'netto_ar' mező kötelező és számnak kell lennie.");
    }

    return data as unknown as Product;
}

await main();