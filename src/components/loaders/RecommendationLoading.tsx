import { FiCpu } from 'react-icons/fi';

export function RecommendationLoading() {
  return (
    <div className="rounded-card border border-emerald-200 bg-emerald-50 p-8 text-center" role="status" aria-live="polite">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-white"><FiCpu size={25} /></span>
      <h2 className="mt-5 text-2xl font-bold text-emerald-950">Finding your best matches</h2>
      <p className="mx-auto mt-2 max-w-lg text-emerald-800">MealMind is applying your filters, checking saved preferences, and ranking existing recipes.</p>
      <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-emerald-200"><div className="h-full w-2/3 animate-pulse rounded-full bg-primary" /></div>
      <span className="sr-only">Generating personalized recommendations</span>
    </div>
  );
}
