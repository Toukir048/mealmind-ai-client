import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiClock, FiHeart, FiRefreshCw, FiStar, FiUsers } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { RecipeCard } from '../components/cards/RecipeCard';
import { RecipeCardSkeleton } from '../components/loaders/RecipeCardSkeleton';
import { useAuth } from '../hooks/useAuth';
import {
  addFavorite,
  addRecipeReview,
  checkFavorite,
  getRecipe,
  getRecipeReviews,
  getRelatedRecipes,
  removeFavorite,
} from '../services/recipe.service';
import { getErrorMessage } from '../utils/api-error';

const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Choose a rating').max(5),
  comment: z.string().trim().max(1_000, 'Review cannot exceed 1,000 characters'),
});
type ReviewForm = z.infer<typeof reviewSchema>;

export function RecipeDetailsPage() {
  const { slug = '' } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState('');

  const recipeQuery = useQuery({ queryKey: ['recipe', slug], queryFn: () => getRecipe(slug), enabled: Boolean(slug) });
  const recipe = recipeQuery.data;
  const reviewsQuery = useQuery({ queryKey: ['recipe', slug, 'reviews'], queryFn: () => getRecipeReviews(recipe?._id ?? ''), enabled: recipe !== undefined });
  const relatedQuery = useQuery({ queryKey: ['recipe', slug, 'related'], queryFn: () => getRelatedRecipes(slug), enabled: recipe !== undefined });
  const favoriteQuery = useQuery({ queryKey: ['favorite', recipe?._id], queryFn: () => checkFavorite(recipe?._id ?? ''), enabled: user !== null && recipe !== undefined });

  useEffect(() => { if (recipe !== undefined) setSelectedImage(recipe.image); }, [recipe]);

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (recipe === undefined) return;
      if (favoriteQuery.data) await removeFavorite(recipe._id);
      else await addFavorite(recipe._id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['favorite', recipe?._id] });
      await queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(favoriteQuery.data ? 'Removed from favorites' : 'Saved to favorites');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Favorite could not be updated.')),
  });

  if (recipeQuery.isLoading) return <RecipeDetailsSkeleton />;
  if (recipeQuery.isError || recipe === undefined) {
    return <section className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-bold">Recipe could not be loaded</h1><p className="mt-3 text-stone-600">It may no longer be published, or the request may have failed.</p><div className="mt-7 flex justify-center gap-3"><button className="btn btn-primary" onClick={() => void recipeQuery.refetch()}><FiRefreshCw /> Try again</button><Link className="btn btn-outline" to="/recipes">Back to recipes</Link></div></section>;
  }

  const images = [...new Set([recipe.image, ...recipe.galleryImages])];
  const totalTime = recipe.preparationTime + recipe.cookingTime;
  const handleFavorite = () => {
    if (user === null) { navigate('/login', { state: { from: location.pathname } }); return; }
    favoriteMutation.mutate();
  };

  return (
    <div className="pb-20">
      <section className="border-b border-stone-200 bg-base-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-card bg-stone-100 shadow-soft"><img className="h-full w-full object-cover" src={selectedImage || recipe.image} alt={recipe.title} /></div>
            {images.length > 1 && <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6" aria-label="Recipe image gallery">{images.map((image, index) => <button key={image} className={`aspect-square overflow-hidden rounded-xl border-2 ${selectedImage === image ? 'border-primary' : 'border-transparent'}`} aria-label={`View recipe image ${index + 1}`} aria-pressed={selectedImage === image} onClick={() => setSelectedImage(image)}><img className="h-full w-full object-cover" src={image} alt="" /></button>)}</div>}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2"><span className="badge badge-primary badge-outline">{recipe.category}</span><span className="badge border-amber-300 bg-amber-50 text-amber-800">{recipe.cuisine}</span>{recipe.dietaryTags.slice(0, 3).map((tag) => <span key={tag} className="badge border-stone-200 bg-stone-50 text-stone-600">{tag}</span>)}</div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-neutral sm:text-5xl">{recipe.title}</h1>
            <p className="mt-5 text-lg leading-8 text-stone-600">{recipe.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-stone-600"><span className="flex items-center gap-2"><FiClock className="text-primary" /> {totalTime} minutes total</span><span className="flex items-center gap-2"><FiUsers className="text-primary" /> {recipe.servings} servings</span><span className="flex items-center gap-2"><FiStar className="text-amber-600" fill="currentColor" /> {recipe.averageRating.toFixed(1)} ({recipe.reviewCount})</span></div>
            <button className={`btn mt-8 w-full sm:w-fit ${favoriteQuery.data ? 'border-red-300 bg-red-50 text-red-700' : 'btn-primary'}`} disabled={favoriteMutation.isPending || (user !== null && favoriteQuery.isLoading)} onClick={handleFavorite}>{favoriteMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : <FiHeart fill={favoriteQuery.data ? 'currentColor' : 'none'} />} {favoriteQuery.data ? 'Saved to Favorites' : 'Add to Favorites'}</button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-8">
        <div className="space-y-14">
          <ContentSection title="Overview"><p className="leading-8 text-stone-700">{recipe.fullDescription}</p></ContentSection>
          <ContentSection title="Ingredients"><ul className="grid gap-3 sm:grid-cols-2">{recipe.ingredients.map((ingredient, index) => <li key={`${ingredient.name}-${index}`} className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-base-100 px-4 py-3"><span className="font-medium capitalize">{ingredient.name}</span><span className="text-sm text-stone-500">{ingredient.quantity} {ingredient.unit ?? ''}</span></li>)}</ul></ContentSection>
          <ContentSection title="Step-by-step instructions"><ol className="space-y-5">{recipe.instructions.map((instruction, index) => <li key={`${index}-${instruction.slice(0, 12)}`} className="flex gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-bold text-white">{index + 1}</span><p className="pt-1 leading-7 text-stone-700">{instruction}</p></li>)}</ol></ContentSection>
          <ContentSection title="Reviews and rating"><ReviewsBlock recipeId={recipe._id} slug={slug} userLoggedIn={user !== null} reviewsQuery={reviewsQuery} /></ContentSection>
        </div>

        <aside><div className="sticky top-24 rounded-card border border-stone-200 bg-base-100 p-6 shadow-soft"><h2 className="text-lg font-bold">Nutrition & cooking</h2><dl className="mt-5 divide-y divide-stone-100"><InfoRow label="Calories" value={`${recipe.calories} kcal`} /><InfoRow label="Preparation" value={`${recipe.preparationTime} min`} /><InfoRow label="Cooking" value={`${recipe.cookingTime} min`} /><InfoRow label="Difficulty" value={recipe.difficulty} /><InfoRow label="Servings" value={String(recipe.servings)} /><InfoRow label="Estimated cost" value={`$${recipe.priceEstimate.toFixed(2)}`} /></dl></div></aside>
      </div>

      <section className="border-t border-stone-200 bg-base-200/60 py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Keep exploring</p><h2 className="mt-2 text-3xl font-extrabold">Related recipes</h2></div><Link className="hidden font-bold text-primary hover:underline sm:block" to="/recipes">View all</Link></div>{relatedQuery.isLoading && <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <RecipeCardSkeleton key={index} />)}</div>}{relatedQuery.data && <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{relatedQuery.data.map((related) => <RecipeCard key={related._id} recipe={related} />)}</div>}{relatedQuery.isError && <p className="mt-8 rounded-xl bg-base-100 p-5 text-stone-600">Related recipes could not be loaded.</p>}</div></section>
    </div>
  );
}

function ReviewsBlock({ recipeId, slug, userLoggedIn, reviewsQuery }: { recipeId: string; slug: string; userLoggedIn: boolean; reviewsQuery: ReturnType<typeof useQuery<Awaited<ReturnType<typeof getRecipeReviews>>>> }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReviewForm>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 5, comment: '' } });
  const reviewMutation = useMutation({ mutationFn: (values: ReviewForm) => addRecipeReview(recipeId, { rating: values.rating, ...(values.comment ? { comment: values.comment } : {}) }), onSuccess: async () => { reset(); await Promise.all([queryClient.invalidateQueries({ queryKey: ['recipe', slug, 'reviews'] }), queryClient.invalidateQueries({ queryKey: ['recipe', slug] })]); toast.success('Your review was added'); }, onError: (error) => toast.error(getErrorMessage(error, 'Your review could not be added.')) });
  const submit = async (values: ReviewForm) => reviewMutation.mutateAsync(values);
  return <div>{userLoggedIn ? <form className="mb-8 rounded-card border border-stone-200 bg-base-100 p-5" onSubmit={(event) => void handleSubmit(submit)(event)}><div className="grid gap-4 sm:grid-cols-[9rem_1fr]"><label className="form-control"><span className="label-text mb-2 font-semibold">Rating</span><select className="select select-bordered bg-white" {...register('rating', { valueAsNumber: true })}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating === 1 ? '' : 's'}</option>)}</select>{errors.rating && <span className="mt-1 text-sm text-red-600">{errors.rating.message}</span>}</label><label className="form-control"><span className="label-text mb-2 font-semibold">Review <span className="font-normal text-stone-400">(optional)</span></span><textarea className="textarea textarea-bordered min-h-24 bg-white" placeholder="What made this recipe work for you?" {...register('comment')} />{errors.comment && <span className="mt-1 text-sm text-red-600">{errors.comment.message}</span>}</label></div><button className="btn btn-primary mt-4" disabled={isSubmitting || reviewMutation.isPending}>{reviewMutation.isPending && <span className="loading loading-spinner loading-sm" />} Add review</button></form> : <p className="mb-7 rounded-xl border border-stone-200 bg-base-100 p-5 text-stone-600"><Link className="font-bold text-primary hover:underline" to="/login" state={{ from: `/recipes/${slug}` }}>Sign in</Link> to rate and review this recipe.</p>}{reviewsQuery.isLoading && <div className="space-y-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-xl bg-stone-100" />)}</div>}{reviewsQuery.isError && <p className="rounded-xl bg-red-50 p-5 text-red-700">Reviews could not be loaded.</p>}{reviewsQuery.data?.data.length === 0 && <p className="rounded-xl bg-stone-50 p-5 text-stone-600">No reviews yet. Be the first to share your experience.</p>}<div className="space-y-4">{reviewsQuery.data?.data.map((review) => <article key={review._id} className="rounded-xl border border-stone-200 bg-base-100 p-5"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3">{review.userId.photoURL ? <img className="size-10 rounded-full object-cover" src={review.userId.photoURL} alt="" /> : <span className="grid size-10 place-items-center rounded-full bg-emerald-100 font-bold text-primary">{review.userId.name.charAt(0).toUpperCase()}</span>}<div><p className="font-bold">{review.userId.name}</p><p className="text-xs text-stone-500">{new Date(review.createdAt).toLocaleDateString()}</p></div></div><span className="flex items-center gap-1 font-bold text-amber-700"><FiStar fill="currentColor" /> {review.rating}</span></div>{review.comment && <p className="mt-4 leading-7 text-stone-700">{review.comment}</p>}</article>)}</div></div>;
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="mb-6 text-2xl font-extrabold text-neutral">{title}</h2>{children}</section>; }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-stone-500">{label}</dt><dd className="font-bold text-neutral">{value}</dd></div>; }

function RecipeDetailsSkeleton() { return <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-2"><div className="aspect-[4/3] rounded-card bg-stone-200" /><div className="space-y-5 py-8"><div className="h-5 w-32 rounded bg-stone-200" /><div className="h-12 rounded bg-stone-200" /><div className="h-5 rounded bg-stone-100" /><div className="h-5 w-2/3 rounded bg-stone-100" /></div></div><div className="mt-14 space-y-4"><div className="h-8 w-40 rounded bg-stone-200" /><div className="h-4 rounded bg-stone-100" /><div className="h-4 rounded bg-stone-100" /></div></div>; }
