const ERROR_POPUP_TEMPLATE = `
<div class="flex items-center absolute bottom-0 w-96 right-0 p-4 mb-4 text-sm text-fg-danger rounded-base bg-danger-soft border border-danger-subtle" role="alert">
  <svg class="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
  <p><span class="font-medium me-1">Error!</span><span class="text-sm">{{error}}</span></p>
</div>
`;

function logError(error: Error | string): void {
  const message = typeof error === "string" ? error : error.message;

  console.error(`[${new Date().toISOString()}] ERROR: ${message}`)  // eslint-disable-line no-console
  const popup = document.createElement("div");
  popup.innerHTML = ERROR_POPUP_TEMPLATE.replace("{{error}}", message);
  const alert = popup.firstElementChild as HTMLElement;
  document.body.appendChild(alert);

  setTimeout(() => {
    document.body.removeChild(alert);
  }, 3000)
}

logError("This is a test error message");