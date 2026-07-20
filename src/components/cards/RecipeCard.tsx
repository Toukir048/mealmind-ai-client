import { FiArrowRight, FiClock, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import type { RecipeSummary } from '../../types/recipe';

export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const totalTime = recipe.preparationTime + recipe.cookingTime;
  return (
    <article className="group flex h-full min-h-[27rem] flex-col overflow-hidden rounded-card border border-stone-200 bg-base-100 shadow-soft transition-transform duration-200 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={recipe.image} alt={`${recipe.title} recipe`} loading="lazy" />
        <span className="absolute left-3 top-3 rounded-full bg-base-100/95 px-3 py-1 text-xs font-bold text-primary shadow">{recipe.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-4 text-xs font-semibold text-stone-500">
          <span className="flex items-center gap-1"><FiClock aria-hidden="true" /> {totalTime} min</span>
          <span className="flex items-center gap-1"><FiStar className="text-amber-600" aria-hidden="true" /> {recipe.averageRating.toFixed(1)}</span>
          <span>{recipe.calories} kcal</span>
        </div>
        <h3 className="mt-4 line-clamp-2 text-xl font-bold text-neutral">{recipe.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">{recipe.shortDescription}</p>
        <Link className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary hover:text-emerald-700" to={`/recipes?search=${encodeURIComponent(recipe.title)}`}>
          Find this recipe <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
