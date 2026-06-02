import { ModifyModal } from "./src/components/modal";
import { fetchAllProducts } from "./src/api/products";

async function main() {

    try {
        const products = await fetchAllProducts();

        if (!products || !Array.isArray(products)) {
            console.error("Nem sikerült beolvasni a termékeket");
            return;
        }

        const uniqueCategories = [...new Set(products.map(p => p.kategoria))];
        
        const categoryOptions = uniqueCategories.map(cat => ({
            value: cat,
            label: cat
        }));

        ModifyModal(
            "Add Product", 
            "Create New Product", 
            [
                { name: "id", label: "Vonalkód", type: "text" },
                { 
                    name: "kategoria", 
                    label: "Kategoria", 
                    type: "select", 
                    options: categoryOptions 
                },
                { name: "termek_nev", label: "Termék Név", type: "text" },
                { name: "keszlet", label: "Készlet", type: "number" },
                { name: "mertekegyseg", label: "Mértékegység", type: "text" },
                { name: "netto_ar", label: "Nettó ár", type: "number" }
            ]
        );
    } catch (error) {
        console.error("Hiba történt a termékek betöltése közben:", error);
    }
}

main();
