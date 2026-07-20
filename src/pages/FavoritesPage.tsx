import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { RecipeCard } from '../components/cards/RecipeCard';
import { RecipeCardSkeleton } from '../components/loaders/RecipeCardSkeleton';
import { getFavorites } from '../services/recipe.service';
import { getErrorMessage } from '../utils/api-error';

export function FavoritesPage() {
  const [page,setPage] = useState(1);
  const query = useQuery({ queryKey:['favorites',page], queryFn:()=>getFavorites(page) });
  return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><header><p className="font-semibold uppercase tracking-widest text-primary">Saved meals</p><h1 className="mt-2 text-4xl font-bold text-neutral">Your favorite recipes</h1><p className="mt-3 text-stone-600">Return to trusted meals you saved from the MealMind collection.</p></header>{query.isPending ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({length:8},(_,i)=><RecipeCardSkeleton key={i}/>)}</div> : query.isError ? <div className="alert alert-error mt-8">{getErrorMessage(query.error,'Favorites could not be loaded.')}</div> : query.data.data.length === 0 ? <div className="mt-10 rounded-card border border-dashed border-stone-300 p-12 text-center"><FiHeart className="mx-auto text-primary" size={36}/><h2 className="mt-4 text-xl font-bold">No favorites yet</h2><p className="mt-2 text-stone-500">Save recipes from their detail pages to build this collection.</p><Link className="btn btn-primary mt-5" to="/recipes">Explore recipes</Link></div> : <><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{query.data.data.map(recipe=><RecipeCard key={recipe._id} recipe={recipe}/>)}</div><Pagination page={page} total={query.data.meta.totalPages} setPage={setPage}/></>}</main>;
}
function Pagination({page,total,setPage}:{page:number;total:number;setPage:(page:number)=>void}) { if(total<=1)return null; return <div className="mt-8 flex justify-center gap-3"><button className="btn btn-outline" disabled={page===1} onClick={()=>setPage(page-1)}>Previous</button><span className="flex items-center text-sm">Page {page} of {total}</span><button className="btn btn-outline" disabled={page===total} onClick={()=>setPage(page+1)}>Next</button></div>; }
