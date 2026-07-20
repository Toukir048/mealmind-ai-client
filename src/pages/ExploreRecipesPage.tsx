import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiFilter, FiRefreshCw, FiSearch, FiX } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';

import { RecipeCard } from '../components/cards/RecipeCard';
import { RecipeCardSkeleton } from '../components/loaders/RecipeCardSkeleton';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { getRecipes, type RecipeQueryParams } from '../services/recipe.service';

const categories = ['', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drink'];
const difficulties = ['', 'Easy', 'Medium', 'Hard'];
const dietaryTags = ['', 'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'high-protein', 'high-fiber'];
const cookingTimes = ['', '15', '30', '45', '60', '90', '120'];

const positiveNumber = (value: string | null, fallback: number): number => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

export function ExploreRecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(urlSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  useEffect(() => setSearch(urlSearch), [urlSearch]);
  useEffect(() => {
    if (debouncedSearch === urlSearch) return;
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (debouncedSearch) next.set('search', debouncedSearch);
      else next.delete('search');
      next.set('page', '1');
      return next;
    }, { replace: true });
  }, [debouncedSearch, setSearchParams, urlSearch]);

  const page = positiveNumber(searchParams.get('page'), 1);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const dietaryTag = searchParams.get('dietaryTag');
  const queryParams: RecipeQueryParams = {
    page,
    limit: 8,
    sort: searchParams.get('sort') ?? 'newest',
    ...(urlSearch ? { search: urlSearch } : {}),
    ...(category ? { category } : {}),
    ...(difficulty ? { difficulty } : {}),
    ...(dietaryTag ? { dietaryTag } : {}),
    ...(searchParams.get('maxCookingTime')
      ? { maxCookingTime: positiveNumber(searchParams.get('maxCookingTime'), 30) }
      : {}),
  };
  const recipesQuery = useQuery({
    queryKey: ['recipes', 'explore', queryParams],
    queryFn: () => getRecipes(queryParams),
    placeholderData: keepPreviousData,
  });

  const setFilter = (key: string, value: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== 'page') next.set('page', '1');
      return next;
    });
  };
  const resetFilters = () => {
    setSearch('');
    setSearchParams({});
    setFiltersOpen(false);
  };
  const hasFilters = [...searchParams.keys()].some((key) => key !== 'page');
  const totalPages = recipesQuery.data?.meta.totalPages ?? 0;
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === totalPages || Math.abs(number - page) <= 1,
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Recipe library</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Find a meal that fits today</h1><p className="mt-4 text-lg leading-8 text-stone-600">Search published MealMind recipes and narrow the library by the choices that matter right now.</p></div>

      <div className="mt-9 flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative block flex-1"><span className="sr-only">Search recipes</span><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" /><input className="input input-bordered w-full bg-base-100 pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, description, cuisine, or ingredient" /></label>
        <div className="flex gap-3"><select className="select select-bordered min-w-44 flex-1 bg-base-100" aria-label="Sort recipes" value={searchParams.get('sort') ?? 'newest'} onChange={(event) => setFilter('sort', event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="rating">Highest rated</option><option value="preparationTime">Fastest preparation</option><option value="calories">Lowest calories</option></select><button className="btn btn-outline lg:hidden" onClick={() => setFiltersOpen(true)}><FiFilter /> Filters</button></div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24 rounded-card border border-stone-200 bg-base-100 p-5 shadow-soft"><FilterPanel params={searchParams} setFilter={setFilter} resetFilters={resetFilters} hasFilters={hasFilters} /></div></aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4"><p className="text-sm font-semibold text-stone-600">{recipesQuery.data ? `${recipesQuery.data.meta.total} recipe${recipesQuery.data.meta.total === 1 ? '' : 's'} found` : 'Searching recipes'}</p>{recipesQuery.isFetching && !recipesQuery.isLoading && <span className="loading loading-spinner loading-sm text-primary" aria-label="Updating recipes" />}</div>

          {recipesQuery.isLoading && <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <RecipeCardSkeleton key={index} />)}</div>}
          {recipesQuery.isError && <div className="rounded-card border border-red-200 bg-red-50 p-8 text-center"><h2 className="text-xl font-bold text-red-800">Recipes could not be loaded</h2><p className="mt-2 text-red-700">Check your connection and try the request again.</p><button className="btn mt-5 border-red-300 bg-white text-red-700" onClick={() => void recipesQuery.refetch()}><FiRefreshCw /> Try again</button></div>}
          {recipesQuery.data?.data.length === 0 && <div className="rounded-card border border-stone-200 bg-base-100 p-10 text-center"><FiSearch className="mx-auto text-stone-300" size={42} /><h2 className="mt-4 text-2xl font-bold">No recipes match these filters</h2><p className="mt-2 text-stone-600">Try a broader search or clear a filter to see more meals.</p><button className="btn btn-primary mt-6" onClick={resetFilters}>Reset filters</button></div>}
          {recipesQuery.data && recipesQuery.data.data.length > 0 && <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">{recipesQuery.data.data.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}</div>}

          {totalPages > 1 && <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Recipe pagination"><button className="btn btn-sm" disabled={page <= 1} onClick={() => setFilter('page', String(page - 1))}>Previous</button>{visiblePages.map((number, index) => <span key={number} className="contents">{index > 0 && visiblePages[index - 1] !== number - 1 && <span className="px-1 text-stone-400">…</span>}<button className={`btn btn-sm ${number === page ? 'btn-primary' : 'btn-ghost'}`} aria-current={number === page ? 'page' : undefined} onClick={() => setFilter('page', String(number))}>{number}</button></span>)}<button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setFilter('page', String(page + 1))}>Next</button></nav>}
        </div>
      </div>

      {filtersOpen && <div className="fixed inset-0 z-[60] bg-stone-900/50 lg:hidden" role="dialog" aria-modal="true" aria-label="Recipe filters"><div className="absolute inset-y-0 right-0 w-[min(22rem,90vw)] overflow-y-auto bg-base-100 p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Filter recipes</h2><button className="btn btn-ghost btn-circle" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><FiX size={21} /></button></div><div className="mt-6"><FilterPanel params={searchParams} setFilter={setFilter} resetFilters={resetFilters} hasFilters={hasFilters} /><button className="btn btn-primary mt-6 w-full" onClick={() => setFiltersOpen(false)}>Show results</button></div></div></div>}
    </section>
  );
}

function FilterPanel({ params, setFilter, resetFilters, hasFilters }: { params: URLSearchParams; setFilter: (key: string, value: string) => void; resetFilters: () => void; hasFilters: boolean }) {
  return <div className="space-y-5"><div className="flex items-center justify-between"><h2 className="font-bold">Filters</h2>{hasFilters && <button className="text-sm font-bold text-red-600 hover:underline" onClick={resetFilters}>Reset</button>}</div><FilterSelect label="Category" value={params.get('category') ?? ''} options={categories} onChange={(value) => setFilter('category', value)} /><FilterSelect label="Difficulty" value={params.get('difficulty') ?? ''} options={difficulties} onChange={(value) => setFilter('difficulty', value)} /><FilterSelect label="Dietary tag" value={params.get('dietaryTag') ?? ''} options={dietaryTags} onChange={(value) => setFilter('dietaryTag', value)} format={(value) => value ? value.replace(/(^|-)(\w)/g, (match) => match.toUpperCase()) : 'All diets'} /><FilterSelect label="Maximum cooking time" value={params.get('maxCookingTime') ?? ''} options={cookingTimes} onChange={(value) => setFilter('maxCookingTime', value)} format={(value) => value ? `${value} minutes` : 'Any cooking time'} /></div>;
}

function FilterSelect({ label, value, options, onChange, format = (option) => option || 'All' }: { label: string; value: string; options: string[]; onChange: (value: string) => void; format?: (value: string) => string }) {
  return <label className="form-control"><span className="label-text mb-2 font-semibold">{label}</span><select className="select select-bordered bg-white" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option || 'all'} value={option}>{format(option)}</option>)}</select></label>;
}
