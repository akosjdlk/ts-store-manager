import "flowbite";
import "tailwindcss"

type ToastVariant = "danger" | "success" | "warning";

const Toast_Icons: Record<ToastVariant, string> = {
    danger: `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/><</svg>`, 
    success: `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/></svg>`, 
    warning: `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`
};

export function CreateToast(message: string, variant: ToastVariant): void {
    const toast_div = document.createElement("div");
    toast_div.id = `toast-${variant}`;
    toast_div.setAttribute("role", "alert");
    toast_div.classList.add("z-[9999]", "fixed", "bottom-5", `bg-${variant}-subtle`, "right-5", "flex", "items-center", "w-full", "max-w-sm", "p-4", "rounded-base", "shadow-xs", "border", "border-default");

    const iconSvg = Toast_Icons[variant];

    toast_div.innerHTML = `
        <div class="inline-flex items-center justify-center shrink-0 w-7 h-7 text-fg-${variant} bg-${variant}-soft rounded">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
        </div>
        <div class="toast-text ms-3 text-sm font-normal">${message}</div>
         <button id="close" type="button" class="ms-auto flex items-center justify-center text-body hover:text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded text-sm h-8 w-8 focus:outline-none" data-dismiss-target="#toast-danger" aria-label="Close">
            <span class="sr-only">Close</span>
            ${iconSvg}
        </button>
    `;

    document.body.appendChild(toast_div);
    document.getElementById("close")?.addEventListener('click', () => {
        toast_div.remove();
    });
    
    setTimeout(() => {
        toast_div.classList.remove("flex");
        toast_div.classList.add("hidden");

        setTimeout(() => { toast_div.remove(); }, 500);
    }, 4000);
}
