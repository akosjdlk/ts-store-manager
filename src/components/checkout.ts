import { createDataTable } from "./table";
import { CustomModal } from "./modal";
import { fetchFilteredProducts } from "../api/products";

const bake_modal = document.querySelector('[data-modal-toggle="baked-modal"]');
const frui_modal = document.querySelector('[data-modal-toggle="fruit-modal"]');
const drin_modal = document.querySelector('[data-modal-toggle="drink-modal"]');
const searc_modal = document.querySelector('[data-modal-toggle="search-modal"]');

let modal: any = null;


async function main(filter: Record<string, string>) {
    if (modal) {
        modal.destroy(false);
        modal = null;
    }

    const products = await fetchFilteredProducts(filter);
    const table = document.createElement("table") as HTMLTableElement;
    document.body.appendChild(table);

    const egyediTableId = `table-${Math.random().toString(36).substring(2, 9)}`;

    const dt = createDataTable(egyediTableId, table, products, ["id", "termek_nev", "brutto_ar", "mertekegyseg"], null, true, true, true, false, null);
    modal = new CustomModal({
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
                alert("Nincs kiválaszott sor")
                return;
            }
            if (!data["number"]) {
                alert("Kérjük, djon meg egy mennyiséget!í")
                return;
            }
            console.log(data["number"]);
            console.log(products.at(Number(data["table"].dataset["index"])));

            modal = null;
        },
        onCancel: () => {console.log("Modal closed/cancelled."), modal = null}
    });

    modal.open();
}


bake_modal?.addEventListener('click', () => {
    main({"kategoria": "PEK", "keszlet:gt": "0"});
});

frui_modal?.addEventListener('click', () => {
    main({"kategoria": "FRI", "keszlet:gt": "0"});
});

drin_modal?.addEventListener('click', () => {
    main({"kategoria": "ITA", "keszlet:gt": "0"});
});

searc_modal?.addEventListener('click', () => {
    main({"keszlet:gt": "0"});
});