import { DataTable } from "simple-datatables"

// const table_body = document.getElementById('table-body');
// const table_head = document.getElementById('table-head');


async function render(): Promise<void> {
    // table_body!.innerHTML = '';
    // table_head!.innerHTML = '';
    // const tr = document.createElement('tr');
    // termekek.forEach(t => {
    //     tr.innerHTML = `
    //     <td>${t.id}</td>
    //     <td>${t.cikkszam}</td>
    //     <td>${t.kategoria}</td>
    //     <td>${t.termek_nev}</td>
    //     <td>${t.keszlet.toLocaleString()}</td>
    //     <td>${t.mertekegyseg}</td>
    //     <td>${t.netto_ar.toLocaleString()}</td>
    //     <td>${t.brutto_ar.toLocaleString()}</td>
    //     <td>${t.afa.toLocaleString()}</td>
    //     `
    // });
    const data = {
        "headings": [
            "Name",
            "Company",
            "Date",
        ],
        "data": [
            [
                "Flowbite",
                "Bergside",
                "05/23/2023",
            ],
            [
                "Next.js",
                "Vercel",
                "03/12/2024",
            ]
        ]
    };
    const t = new DataTable('#selection-table', { data: data,
        classes: {
        wrapper: "p-4 bg-white dark:bg-dark_color shadow-md sm:rounded-lg",
        
        top: "flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4",
        
        search: "w-full md:w-1/2 relative",
        input: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
        
        dropdown: "sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400",
        selector: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg",
        
        container: "overflow-x-auto",
        
        bottom: "flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 border-t border-gray-200 dark:border-gray-700",
        info: "text-sm font-normal text-gray-400 text-gray-400",
        
        pagination: "inline-flex items-stretch",
    }
    })
    t.init()
    console.log("asd")
}

render();