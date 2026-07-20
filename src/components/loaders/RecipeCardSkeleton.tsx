export function RecipeCardSkeleton() {
  return (
    <div className="min-h-[27rem] animate-pulse overflow-hidden rounded-card border border-stone-200 bg-base-100" aria-hidden="true">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="space-y-4 p-5"><div className="h-3 w-2/3 rounded bg-stone-200" /><div className="h-6 rounded bg-stone-200" /><div className="h-4 rounded bg-stone-100" /><div className="h-4 w-4/5 rounded bg-stone-100" /></div>
    </div>
  );
}
