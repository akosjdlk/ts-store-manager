import { initFlowbite } from 'flowbite'

import { fetchProductById, updateProduct } from '../api/products';

import { fetchProductById, updateProduct } from '../api/products';

initFlowbite()

const stockupSubmitBtn = document.getElementById('stockup_submit_btn') as HTMLButtonElement
const add_stockup_form = document.getElementById('add_stockup_form') as HTMLFormElement
stockupSubmitBtn.addEventListener('click', async () => {
        const productBarcode = (document.getElementById('barcode') as HTMLInputElement).value;
        const productQuantity = Number((document.getElementById('quantity') as HTMLInputElement).value);

        const product = await fetchProductById(productBarcode);
        product.keszlet += productQuantity;
        await updateProduct(product.id, product);

        add_stockup_form.reset();
});