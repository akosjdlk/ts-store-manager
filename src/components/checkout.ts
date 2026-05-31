import { createDataTable } from "./table";
import { CustomModal } from "./modal";
import { fetchFilteredProducts } from "../api/products";

const modalButtons = document.querySelectorAll<HTMLButtonElement>('[data-modal-category]');

async function main(filter: Record<string, string | null>): Promise<void> {

    const products = await fetchFilteredProducts(filter);
    const table = document.createElement("table");
    document.body.appendChild(table);

    const egyediTableId = `table-${Math.random().toString(36).substring(2, 9)}`;

    const dt = createDataTable(egyediTableId, table, products, ["id", "termek_nev", "brutto_ar", "mertekegyseg"], null, true, true, true, false, null);
    const modal = new CustomModal({
        title: "Test Modal",
        inputs: [
            {
                type: "table",
                table: dt,
                id: "table"
            },
            {
                type: "number", id: "number"
            }
        ],
        onSubmit: (data: Record<string, object>): void => {
            if (!data["table"]) {
                alert("Nincs kiválaszott sor")
                return;
            }
            if (!data["number"]) {
                alert("Kérjük, djon meg egy mennyiséget!í")
                return;
            }
            const table = data["table"] as HTMLTableRowElement;
            products.at(Number(table.dataset["index"]))

        },
        onCancel: (): void => {console.log("Modal closed/cancelled.")}
    });

    modal.open();
}

modalButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        const cat = btn.dataset["modalCategory"]!
        await main({"kategoria": cat === "" ? null : cat, "keszlet:gt": "0"});
    })
});