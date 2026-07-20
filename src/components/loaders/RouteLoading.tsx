export const RouteLoading = () => (
  <main className="flex min-h-[60vh] items-center justify-center bg-canvas px-4" aria-live="polite" aria-busy="true">
    <div className="flex flex-col items-center gap-3 text-center" role="status">
      <span className="loading loading-spinner loading-lg text-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-stone-600">Loading MealMind page…</p>
      <span className="sr-only">Loading page</span>
    </div>
  </main>
);
