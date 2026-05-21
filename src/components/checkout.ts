import type { Product } from "../types/product";

let termekek : Product[];
const table_body = document.getElementById('table-body');
const table_head = document.getElementById('table-head');

function render() {
    table_body!.innerHTML = '';
    table_head!.innerHTML = '';
    const tr = document.createElement('tr') as HTMLTableRowElement;
    termekek.forEach(t => {
        tr.innerHTML = `
        <th>${t.id}</th>
        <th>${t.cikkszam}</th>
        <th>${t.kategoria}</th>
        <th>${t.termek_nev}</th>
        <th>${t.keszlet}</th>
        <th>${t.mertekegyseg}</th>
        <th>${t.netto_ar}</th>
        <th>${t.brutto_ar}</th>
        <th>${t.afa}</th>
        `
    });
}

render();