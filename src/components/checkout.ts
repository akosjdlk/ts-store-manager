import { createDataTable, getValues, type CellRow } from "./table";
import { confirmationModal, CustomModal } from "./modal";
import { fetchFilteredProducts } from "../api/products";
import type { Sale } from "../types/sale";
import type { SaleEntry } from "../types/sale_entry";
import { type DataTable } from "simple-datatables";
import { CreateToast } from "./toast";
import { createSale, fetchAllSales } from "../api/sales";

const modalButtons = document.querySelectorAll<HTMLButtonElement>('[data-modal-category]');

const cash = document.getElementById('cash') as HTMLButtonElement;
const card = document.getElementById('card') as HTMLButtonElement;

cash.addEventListener('click', () => {
    confirmationModal(
        "Fizetés Készpénzel", 
        async () => {
            await createSale(await cartManager.GenerateSale());
            CreateToast("Sikeres fizetés", "success");
        },
         
        () => {
            /* empty */
        },
    );
})
  
card.addEventListener('click', () => {
    confirmationModal(
        "Fizetés kártyával", 
        async () => {
            await createSale(await cartManager.GenerateSale());
            CreateToast("Sikeres fizetés", "success");
        },
         
        () => {
            /* empty */
        },
    );
})

class CartManager {
    private readonly configKey = "cartItems";
    public dataTable!: DataTable;

    constructor() {
        this.dataTable = generateCheckoutTable(this);
        
    }

    public LoadFromLocalStorage(): SaleEntry[] {
        return JSON.parse(window.localStorage.getItem(this.configKey) ?? "[]") as SaleEntry[]; 
    }

    public SaveToLocalStorage(items: SaleEntry[]): void {
        const value = JSON.stringify(items);
        window.localStorage.setItem(this.configKey, value);
    }

    public AddProduct(entry: SaleEntry): void {

        const exists = this.dataTable.rows.findRow(0, entry.id)
        if (exists.index !== -1) {
            const data: CellRow = []
            exists.row.cells.forEach((cell) => {
                const d = cell.data as Array<{data: string}>
                if (d.length > 1) {
                    data.push(d as never)
                } else {
                    data.push({data: d[0]!.data})
                }
            })
            
            // mennyiseg
            data[3]!.data = String(Number(data[3]!.data) + entry.mennyiseg)
            // osszeg
            data[5]!.data = String(Number(data[5]!.data) + entry.osszeg)

            this.dataTable.rows.updateRow(exists.index, data)
        } else {
            this.dataTable.rows.add(getValues(entry, ["id", "cikkszam", "termek_nev", "mennyiseg", "mertekegyseg", "osszeg"], true, true));
        }

        const updatedData = this.ReadDataFromTable();

        const totalDisplay = document.getElementById("total-price");
        if (totalDisplay) {
            totalDisplay.textContent = `${this.GetTotal(updatedData)}` + " Ft";
        }

        this.SaveToLocalStorage(updatedData);
    }

    public GetTotal(items?: SaleEntry[]): number {
        items ??= this.ReadDataFromTable();

        let total = 0;
        items.forEach(item => {
            total += item.osszeg
        });

        return total;
    }

    private ReadDataFromTable(): SaleEntry[] {
        const data: SaleEntry[] = [];
        this.dataTable.data.data.forEach((dataRow) => {
            const cells = dataRow.cells.map((cell) => cell.text?.trim() ?? "");

            if (cells.length >= 6 && cells[0] !== "") {
                data.push({
                    id: String(cells[0]),
                    cikkszam: String(cells[1]),
                    termek_nev: String(cells[2]),
                    mennyiseg: Number(cells[3]) || 0,
                    mertekegyseg: String(cells[4]),
                    osszeg: Number(cells[5]) || 0
                });
            }
        })
        return data
    }

    public async GenerateSale(): Promise<Sale> {
        const items = this.ReadDataFromTable();
        if (items.length === 0) {
            CreateToast("Nincs termék a kosárban", "warning");
            throw new Error("Nincs termék a kosárban");
        }
        const sales = await fetchAllSales();
        const totalAmount = this.GetTotal(items);

        const lastSaleId = Array.isArray(sales) ? sales.length : 0;
        const sale: Sale = {
            id: (lastSaleId + 1).toString(),
            date: new Date().toISOString(),
            products: items.map (item => (
                {
                    productId: item.id,
                    bruttoAr: item.osszeg / item.mennyiseg,
                    quantity: item.mennyiseg
                }
            )),
            bruttoOsszeg: totalAmount
        };

        setTimeout(() => {
            this.dataTable.data.data = [];
            this.dataTable.update();

            window.localStorage.removeItem(this.configKey);
            const totalDisplay = document.getElementById("total-price");
            if (totalDisplay) {
                totalDisplay.textContent = "0 Ft";
            }

            const tbody = document.querySelector(".custom-modal-body table tbody") ?? document.querySelector("table tbody");
            if (tbody) {
                tbody.innerHTML = ""; 
            }

            window.localStorage.removeItem(this.configKey);
        }, 50);
        
        return sale;
    }

}

const cartManager = new CartManager();


async function generateFilterModal(filter: Record<string, string | null>): Promise<void> {

    const products = await fetchFilteredProducts(filter);
    const table = document.createElement("table");
    document.body.appendChild(table);

    const egyediTableId = `table-${Math.random().toString(36).substring(2, 9)}`;

    const dt = createDataTable(egyediTableId, table, products, ["id", "termek_nev", "brutto_ar", "mertekegyseg"], null, true, true, true, false, null);
    dt.wrapperDOM.classList.add("!h-158")
    const modal = new CustomModal({
        title: "Test Modal",
        inputs: [
            {
                type: "table",
                table: dt,
                id: "table"
            }
        ],
        footerInput: {
            id: "number",
            type: "number"
        },
        onSubmit: (data: Record<string, unknown>): void => {
            if (!data["table"]) {
                alert("Nincs kiválaszott sor")
                return;
            }
            if (!data["number"]) {
                alert("Kérjük, adjon meg egy mennyiséget!")
                return;
            }
            const table = data["table"] as HTMLTableRowElement;
            const selectedProduct = products.at(Number(table.dataset["index"]));

            if (selectedProduct) {
                cartManager.AddProduct({
                    id: selectedProduct.id,
                    cikkszam: selectedProduct.cikkszam,
                    termek_nev: selectedProduct.termek_nev,
                    mertekegyseg: selectedProduct.mertekegyseg,
                    mennyiseg: Number(data["number"]),
                    osszeg: Number(data["number"]) * selectedProduct.brutto_ar
                })
            }

            CreateToast("Termék hozzáadva a kosárhoz", "success");
        },
        onCancel: (): void => { /** empty */ }
    });

    modal.open();
}

function generateCheckoutTable(manager: CartManager): DataTable {
    
    const checkoutTable = document.querySelector("table")!;
    
    const dataTable = createDataTable(
        "checkout", 
        checkoutTable, 
        manager.LoadFromLocalStorage(), 
        ["id", "cikkszam", "termek_nev", "mennyiseg", "mertekegyseg", "osszeg"], 
        null, false, false, false, true, 
        (ev) => {
            const trElement = (ev.target as HTMLElement).closest("tr"); 
            if (!trElement) {
                return;
            }

            const firstCell = trElement.querySelector("td");
            const productId = firstCell?.textContent.trim();

            const items = manager.LoadFromLocalStorage();
            const selectedItem = items.find(item => item.id === productId)!;

            new CustomModal({
                submitText: "Mentés",
                title: selectedItem.termek_nev,
                inputs: [
                    { 
                        id: "mennyiseg", 
                        label: "Mennyiség", 
                        type: "number", 
                        attributes: { value: String(selectedItem.mennyiseg) } 
                    }
                ],
                footerInput: null,
                onSubmit: (data): void => {
                    const validatedData = validateEntryData(data);
                    const ujMennyiseg = Number(validatedData["mennyiseg"]);
    
                    if (isNaN(ujMennyiseg) || ujMennyiseg <= 0) {
                        CreateToast("Kérjük, adjon meg egy érvényes mennyiséget!", "warning");
                        return;
                    }

                    const items = manager.LoadFromLocalStorage();
            
                    const itemIndex = items.findIndex(item => item.id === productId);
                    if (itemIndex !== -1) {
                        const item = items[itemIndex]!;
                        const egysegAr = item.osszeg / item.mennyiseg;

                        item.mennyiseg = ujMennyiseg;
                        item.osszeg = Math.round(ujMennyiseg * egysegAr); 

                        manager.SaveToLocalStorage(items);
                        
                        const rowToUpdate = manager.dataTable.rows.findRow(0, item.id);
        
                        if (rowToUpdate.index !== -1) {
                            const updatedRowData = getValues(item, ["id", "cikkszam", "termek_nev", "mennyiseg", "mertekegyseg", "osszeg"], true, true);

                            manager.dataTable.rows.updateRow(rowToUpdate.index, updatedRowData);
                        }

                        CreateToast("Termék sikeresen módosítva", "success");
                    }
                }
            }).open();
        }
    )
    return dataTable
}
    
function validateEntryData(data: Record<string, unknown>): Record<string, unknown> {
    if (typeof data["mennyiseg"] !== "string" || data["mennyiseg"].trim() === "") {
        CreateToast("A 'mennyiseg' mező kötelező és nem lehet üres.", "danger");
        throw new Error("A 'mennyiseg' mező kötelező és nem lehet üres.");
    }

    return data;
}

modalButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        const cat = btn.dataset["modalCategory"]!
        await generateFilterModal({"kategoria": cat === "" ? null : cat, "keszlet:gt": "0"});
    })
});

