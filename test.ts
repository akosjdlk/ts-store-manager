import { createDataTable } from "./src/components/table";
import { CustomModal } from "./src/components/modal";
import type { Product } from "./src/types/product";
import { fetchFilteredProducts } from "./src/api/products";

async function main() {
    const products = await fetchFilteredProducts({"kategoria": "PEK", "keszlet:gt": "0"});
    const table = document.createElement("table") as HTMLTableElement;
    document.body.appendChild(table)
    const dt = createDataTable("test", table, products, ["id", "termek_nev", "keszlet"], null, true, true, true, false, null);
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
        onSubmit: (data: Record<string, any>) => {
            if (!data["table"]) {
                alert("table")
                return;
            }
            if (!data["number"]) {
                alert("number")
                return;
            }
            console.log(data["number"]);
            console.log(products.at(Number(data["table"].dataset["index"])))
        },
        onCancel: () => {console.log("Modal closed/cancelled.")}
    });
    modal.open()
}

main();