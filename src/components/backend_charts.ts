import "flowbite";

import { fetchAllProducts } from "../api/products";
import type { Product } from "../types/product";

function formatCurrency(v: number): string { return new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", maximumFractionDigits: 0 }).format(v); }
function formatNumber(v: number): string { return new Intl.NumberFormat("hu-HU").format(v); }

function makeCard(title: string, value: string, desc: string): HTMLDivElement {
    const d = document.createElement("div");
    d.className = "rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70";
    d.innerHTML = `<p class="text-sm font-medium text-slate-500 dark:text-slate-400">${title}</p><h3 class="mt-2 text-3xl font-bold">${value}</h3><p class="mt-2 text-sm text-slate-500">${desc}</p>`;
    return d;
}

function makeBar(label: string, valueLabel: string, pct: number, tone: string): HTMLDivElement {
    const row = document.createElement("div");
    row.innerHTML = `<div class="mb-2 flex items-center justify-between gap-4 text-sm"><span class="font-medium text-slate-700 dark:text-slate-200">${label}</span><span class="text-slate-500 dark:text-slate-400">${valueLabel}</span></div><div class="h-3 rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-3 rounded-full ${tone}" style="width:${pct.toString()}%"></div></div>`;
    return row;
}

function makeLowItem(p: Product): HTMLDivElement {
    const it = document.createElement("div");
    it.className = "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3";
    it.innerHTML = `<div class="flex items-center justify-between gap-4"><div><p class="font-medium text-amber-950">${p.termek_nev}</p><p class="text-sm text-amber-800/80">${p.kategoria} · ${p.cikkszam}</p></div><span class="rounded-full bg-amber-200 px-3 py-1 text-sm font-semibold text-amber-950">${formatNumber(p.keszlet)} ${p.mertekegyseg}</span></div>`;
    return it;
}

interface ByValue { p: Product; v: number }
interface CatEntry { k: string; v: number }
interface Metrics { totalStock: number; stockValue: number; lowStock: Product[]; categoryTotals: Record<string, number>; byValue: ByValue[]; catEntries: CatEntry[] }

function computeMetrics(products: Product[]): Metrics {
    let totalStock = 0;
    let stockValue = 0;
    const lowStock: Product[] = [];
    const categoryTotals: Record<string, number> = {};

    for (const pr of products) {
        totalStock += pr.keszlet;
        stockValue += pr.keszlet * pr.netto_ar;
        if (pr.keszlet <= 10) {
            lowStock.push(pr);
        }
        categoryTotals[pr.kategoria] = (categoryTotals[pr.kategoria] ?? 0) + pr.keszlet;
    }

    const byValue = products.slice().map(function(p){ return { p: p, v: p.keszlet * p.netto_ar }; }).sort(function(a,b){return b.v - a.v;}).slice(0,8);
    const catEntries = Object.keys(categoryTotals).map(function(k){ return { k: k, v: categoryTotals[k] ?? 0 }; }).sort(function(a,b){return b.v - a.v});

    return { totalStock, stockValue, lowStock, categoryTotals, byValue, catEntries };
}

async function main(): Promise<void> {
    const products = await fetchAllProducts();
    const kpiGrid = document.getElementById("kpi-grid");
    const valueBars = document.getElementById("value-bars");
    const categoryBars = document.getElementById("category-bars");
    const lowStockList = document.getElementById("low-stock-list");
    if (!kpiGrid || !valueBars || !categoryBars || !lowStockList) {
        return;
    }
    const totalProducts = products.length;
    const metrics = computeMetrics(products);

    kpiGrid.innerHTML = "";
    kpiGrid.appendChild(makeCard("Összes termék", formatNumber(totalProducts), "Aktív tétel a készletben."));
    kpiGrid.appendChild(makeCard("Összes készlet", formatNumber(metrics.totalStock), "Darabszám összesítve."));
    kpiGrid.appendChild(makeCard("Készletérték", formatCurrency(metrics.stockValue), "Nettó ár alapján számolva."));
    kpiGrid.appendChild(makeCard("Alacsony készlet", formatNumber(metrics.lowStock.length), "10 vagy kevesebb darab."));

    valueBars.innerHTML = "";
    let maxPV = 1;
    for (const item of metrics.byValue) {
        if (item.v > maxPV) {
            maxPV = item.v;
        }
    }
    for (const item of metrics.byValue) {
        const pct = Math.max((item.v / maxPV) * 100, 6);
        valueBars.appendChild(makeBar(item.p.termek_nev, formatCurrency(item.v), Math.round(pct), "bg-gradient-to-r from-cyan-500 to-teal-400"));
    }

    categoryBars.innerHTML = "";
    let maxCat = 1;
    for (const c of metrics.catEntries) {
        if (c.v > maxCat) {
            maxCat = c.v;
        }
    }
    for (const c of metrics.catEntries) {
        const pct = Math.max((c.v / maxCat) * 100, 6);
        categoryBars.appendChild(makeBar(c.k, formatNumber(c.v) + " db", Math.round(pct), "bg-gradient-to-r from-slate-700 to-slate-400"));
    }

    lowStockList.innerHTML = "";
    if (metrics.lowStock.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500";
        emptyState.textContent = "Nincs alacsony készletű termék.";
        lowStockList.appendChild(emptyState);
    } else {
        for (const p of metrics.lowStock.slice(0, 6)) {
            lowStockList.appendChild(makeLowItem(p));
        }
    }
}

main().catch(function(): void { /* ignore */ });