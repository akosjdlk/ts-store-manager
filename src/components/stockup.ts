import { initFlowbite } from 'flowbite'

import { fetchProductById, updateProduct } from '../api/products';

import { createDataTable } from "./table";


initFlowbite()

const stockupSubmitBtn = document.getElementById('stockup_submit_btn') as HTMLButtonElement
const add_stockup_form = document.getElementById('add_stockup_form') as HTMLFormElement
const confirmStockupBtn = document.getElementById('confirmstockupbtn') as HTMLButtonElement;

const editedProducts: Array<{ barcode: string, currentQuantity: number, addToQuantity: number }> = []

function renderTable(): void {
        let productsToUpdate: Array<{ barcode: string, currentQuantity: number, addToQuantity: number }> = [];
        const editedProductsFromStorage = localStorage.getItem('editedProducts');
        if (editedProductsFromStorage) {
                productsToUpdate = JSON.parse(editedProductsFromStorage) as Array<{ barcode: string, currentQuantity: number, addToQuantity: number }>;
        } else if (editedProducts.length > 0) {
                productsToUpdate = editedProducts.slice();
        }
        const table = document.querySelector('table')!;
        const p = productsToUpdate[0];
        const headers = p ? Object.keys(p) as Array<keyof typeof p> : [];
        const dropdown = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown')!;
        const dropdown_mobile = document.querySelector<HTMLUListElement>('#backend_data_table_dropdown_mobile')!;

        createDataTable("stockup", table, productsToUpdate as unknown as any[], headers, [dropdown, dropdown_mobile], true, true, true, true, (ev) => {console.log(ev.currentTarget)});
}

stockupSubmitBtn.addEventListener('click', async () => {
        const productBarcode = (document.getElementById('barcode') as HTMLInputElement).value;
        const addToProductQuantity = Number((document.getElementById('quantity') as HTMLInputElement).value);

        const product = await fetchProductById(productBarcode);
        
        editedProducts.push({ barcode: productBarcode, currentQuantity: product.keszlet, addToQuantity: addToProductQuantity });
        localStorage.setItem('editedProducts', JSON.stringify(editedProducts));

        add_stockup_form.reset();
        renderTable();
});

confirmStockupBtn.addEventListener('click', async () => {
        const editedProductsFromStorage = localStorage.getItem('editedProducts');
        if (editedProductsFromStorage) {
                const productsToUpdate = JSON.parse(editedProductsFromStorage) as Array<{ barcode: string, currentQuantity: number, addToQuantity: number }>;
                for (const product of productsToUpdate) {
                        const productDetails = await fetchProductById(product.barcode);
                        productDetails.keszlet += product.addToQuantity;

                        await updateProduct( product.barcode, productDetails );
                }
                localStorage.removeItem('editedProducts');
                renderTable();
        }
});    