import { initFlowbite } from 'flowbite'

import { fetchProductById, updateProduct } from '../api/products';

initFlowbite()

const stockupSubmitBtn = document.getElementById('stockup_submit_btn') as HTMLButtonElement
const add_stockup_form = document.getElementById('add_stockup_form') as HTMLFormElement

const editedProducts: Array<{ barcode: string, currentQuantity: number, addToQuantity: number }> = []

stockupSubmitBtn.addEventListener('click', async () => {
        const productBarcode = (document.getElementById('barcode') as HTMLInputElement).value;
        const addToProductQuantity = Number((document.getElementById('quantity') as HTMLInputElement).value);

        const product = await fetchProductById(productBarcode);
        
        editedProducts.push({ barcode: productBarcode, currentQuantity: product.keszlet, addToQuantity: addToProductQuantity });
        localStorage.setItem('editedProducts', JSON.stringify(editedProducts));

        add_stockup_form.reset();
});

const confirmStockupBtn = document.getElementById('confirmstockupbtn') as HTMLButtonElement;
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
        }
});    