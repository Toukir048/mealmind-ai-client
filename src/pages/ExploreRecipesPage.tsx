import { PageIntro } from '../components/shared/PageIntro';

export function ExploreRecipesPage() {
  return (
    <PageIntro eyebrow="Recipe library" title="Find a meal that fits today" description="Search, filters, sorting, pagination, and responsive recipe cards will live here as the recipe discovery experience is implemented.">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Recipe loading preview">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-card border border-stone-200 bg-base-100 p-4">
            <div className="aspect-[4/3] rounded-xl bg-stone-200" /><div className="mt-4 h-5 rounded bg-stone-200" /><div className="mt-3 h-4 w-2/3 rounded bg-stone-100" />
          </div>
        ))}
      </div>
    </PageIntro>
  );
}
