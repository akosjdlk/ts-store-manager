import type { DataTable } from "simple-datatables";

// TODO: another modal for modify + add new thing
// TODO: toast add new thing + modify

type ModalInputConfig =
  | {
    id: string;
    type: "table";
    table: DataTable;
  }
  | {
    id: string;
    type: "text" | "number";
    placeholder?: string;
    className?: string;
    attributes?: Record<string, string>;
  };

interface ModalOptions {
  id?: string;
  title: string;
  submitText?: string;
  cancelText?: string;
  inputs: ModalInputConfig[];
  onSubmit: (data: Record<string, object>) => void;
  onCancel?: () => void;
}

export interface TrackingInput {
  id: string;
  type: "table" | "text" | "number";
  element?: HTMLInputElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValue: () => any;
}
export class CustomModal {
  private id: string;
  private title: string;
  private submitText: string;
  private cancelText: string;
  private inputsConfig: ModalInputConfig[];
  private onSubmit: (data: Record<string, object>) => void;
  private onCancel: () => void;

  private modalEl!: HTMLDivElement;
  private trackedInputs: TrackingInput[] = [];
  private selectedTableRow: HTMLTableRowElement | null = null;

  constructor(options: ModalOptions) {
    this.id =
      options.id ?? `modal-${Math.random().toString(36).substring(2, 9)}`;
    this.title = options.title;
    this.submitText = options.submitText ?? "Hozzáadás";
    this.cancelText = options.cancelText ?? "Mégse";
    this.inputsConfig = options.inputs;
    this.onSubmit = options.onSubmit;
    this.onCancel = options.onCancel ?? ((): void => { /* empty */ });

    this.init();
  }

  private init(): void {
    // Top-level modal backdrop (Flowbite layout pattern)
    this.modalEl = document.createElement("div");
    this.modalEl.id = this.id;
    this.modalEl.setAttribute("tabindex", "-1");
    this.modalEl.setAttribute("aria-hidden", "true");
    this.modalEl.className =
      "fixed top-0 right-0 left-0 z-50 hidden w-full h-full overflow-x-hidden overflow-y-auto md:inset-0 justify-center items-center bg-gray-900/50 dark:bg-gray-900/80";

    // Modal inner structure utilizing Flowbite utility tokens
    this.modalEl.innerHTML = `
      <div class="relative p-4 w-full max-w-4xl max-h-full">
        <div class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between border-b border-default pb-4 md:pb-5">
            <h3 class="text-lg font-medium text-heading">
              ${this.title}
            </h3>
            <button type="button" class="js-modal-close text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="js-modal-body py-4 md:py-6 relative overflow-x-auto shadow-xs ms-4 mt-4 me-4">
            </div>
          <div class="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
            <button type="button" class="js-modal-submit inline-flex items-center text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
              <svg class="w-4 h-4 me-1.5 -ms-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
              </svg>
              ${this.submitText}
            </button>
            
            <div class="js-footer-inputs flex items-center space-x-4"></div>

            <button type="button" class="!ml-auto js-modal-close text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
              ${this.cancelText}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.renderInputs();
    this.setupEvents();
  }

  private renderInputs(): void {
    const bodyContainer = this.modalEl.querySelector(".js-modal-body")!;
    const footerInputsContainer =
      this.modalEl.querySelector(".js-footer-inputs")!;

    this.inputsConfig.forEach((config) => {
      if (config.type === "table") {
        const table = config.table.dom;

        table.addEventListener("click", (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          const row = target.closest("tr");

          if (!row || row.parentElement?.tagName === "THEAD") {
            return;
          }

          table.querySelectorAll("tr").forEach((tr) => {
            tr.classList.remove(
              "!bg-brand/10",
              "!dark:bg-brand/20",
              "!font-semibold",
            );
          });

          row.classList.add(
            "!bg-brand/10",
            "!dark:bg-brand/20",
            "!font-semibold",
          );
          this.selectedTableRow = row;

          const numberInput = this.trackedInputs.find(
            (input) => input.type === "text" || input.type === "number"
          );
        
          if (numberInput?.element) {
            numberInput.element.focus();
            numberInput.element.select();
            numberInput.element.classList.add("ring-4", "ring-brand-medium");

            setTimeout(() => {
              numberInput.element?.classList.remove("ring-4", "ring-brand-medium");
            }, 800);
          }
        });

        config.table.on("datatable.update", () => {
          table.querySelectorAll("tr").forEach((tr) => {
            tr.classList.remove(
              "!bg-brand/10",
              "!dark:bg-brand/20",
              "!font-semibold",
            );
          });
        });
        config.table.on("datatable.page", () => {
          table.querySelectorAll("tr").forEach((tr) => {
            tr.classList.remove(
              "!bg-brand/10",
              "!dark:bg-brand/20",
              "!font-semibold",
            );
          });
        });

        bodyContainer.appendChild(config.table.wrapperDOM);
        this.trackedInputs.push({
          id: config.id,
          type: "table",
          getValue: () => this.selectedTableRow,
        });
      } else {
        const input = document.createElement("input");
        input.type = config.type;
        input.className = `rounded-xl dark:bg-gray-500 bg-gray-100 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:ring-brand focus:border-brand ${config.className ?? ""}`;

        if (config.placeholder) {
          input.placeholder = config.placeholder;
        }
        if (config.attributes) {
          Object.entries(config.attributes).forEach(([key, val]) => {
            input.setAttribute(key, val);
          });
        }

        footerInputsContainer.appendChild(input);
        this.trackedInputs.push({
          id: config.id,
          type: config.type,
          element: input,
          getValue: () => input.value,
        });
      }
    });
  }

  private setupEvents(): void {
    // Intercept action elements via helper hooks
    this.modalEl.querySelectorAll(".js-modal-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.destroy(true);
      });
    });

    const submitBtn = this.modalEl.querySelector(".js-modal-submit");
    submitBtn?.addEventListener("click", () => {
      const dataPayload: Record<string, object> = {};

      this.trackedInputs.forEach((input) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        dataPayload[input.id] = input.getValue();
      });

      this.onSubmit(dataPayload);
      this.destroy(false);
    });
  }

  public open(): void {
    this.modalEl.classList.remove("hidden");
    this.modalEl.classList.add("flex");
    document.body.classList.add("overflow-hidden"); // Block layer viewport scrolling
  }

  public close(cancelled = false): void {
    this.modalEl.classList.remove("flex");
    this.modalEl.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    if (cancelled) { this.onCancel(); }
  }

  public destroy(cancelled: boolean): void {
    this.close(cancelled);
    setTimeout(() => {
      this.modalEl.remove();
    }, 10);
  }
}
