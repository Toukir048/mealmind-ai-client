import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, type FieldPath } from 'react-hook-form';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiEdit3,
  FiRefreshCw,
  FiStar,
  FiThumbsDown,
  FiThumbsUp,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { RecommendationLoading } from '../components/loaders/RecommendationLoading';
import {
  requestRecommendations,
  sendRecommendationFeedback,
} from '../services/recommendation.service';
import type {
  RecommendationFeedback,
  RecommendationRequest,
} from '../types/recommendation';
import { getErrorMessage } from '../utils/api-error';

const formSchema = z.object({
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drink']),
  dietaryPreference: z.string().max(80),
  excludedIngredients: z.string().max(500),
  maximumCookingTime: z.string().regex(/^$|^\d+$/, 'Enter a valid number of minutes'),
  calorieTarget: z.string().regex(/^$|^\d+$/, 'Enter a valid calorie target'),
  preferredCuisine: z.string().max(60),
  numberOfResults: z.string().regex(/^[1-8]$/),
});
type RecommendationFormValues = z.infer<typeof formSchema>;

const stepFields: FieldPath<RecommendationFormValues>[][] = [
  ['mealType', 'dietaryPreference', 'preferredCuisine'],
  ['maximumCookingTime', 'calorieTarget', 'numberOfResults'],
  ['excludedIngredients'],
];

const steps = ['Meal preferences', 'Practical limits', 'Ingredient exclusions'];

export function AIRecommendationsPage() {
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [lastRequest, setLastRequest] = useState<RecommendationRequest | null>(null);
  const [feedback, setFeedback] = useState<Record<string, RecommendationFeedback>>({});
  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<RecommendationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealType: 'Dinner',
      dietaryPreference: '',
      excludedIngredients: '',
      maximumCookingTime: '45',
      calorieTarget: '',
      preferredCuisine: '',
      numberOfResults: '4',
    },
  });
  const watchedValues = watch();

  const recommendationMutation = useMutation({ mutationFn: requestRecommendations });
  const feedbackMutation = useMutation({
    mutationFn: sendRecommendationFeedback,
    onSuccess: (_data, variables) => {
      setFeedback((current) => ({ ...current, [variables.recipeId]: variables.feedback }));
      const messages: Record<RecommendationFeedback, string> = {
        liked: 'Saved as a positive preference',
        disliked: 'We will use this to improve future matches',
        selected: 'Selected for your meal plan',
        ignored: 'Recommendation ignored',
      };
      toast.success(messages[variables.feedback]);
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Feedback could not be saved.')),
  });

  const toRequest = (values: RecommendationFormValues): RecommendationRequest => ({
    mealType: values.mealType,
    excludedIngredients: [
      ...new Set(
        values.excludedIngredients
          .split(',')
          .map((ingredient) => ingredient.trim().toLowerCase())
          .filter(Boolean),
      ),
    ],
    numberOfResults: Number(values.numberOfResults),
    ...(values.dietaryPreference.trim()
      ? { dietaryPreference: values.dietaryPreference.trim().toLowerCase() }
      : {}),
    ...(values.maximumCookingTime ? { maximumCookingTime: Number(values.maximumCookingTime) } : {}),
    ...(values.calorieTarget ? { calorieTarget: Number(values.calorieTarget) } : {}),
    ...(values.preferredCuisine.trim() ? { preferredCuisine: values.preferredCuisine.trim() } : {}),
  });

  const submit = (values: RecommendationFormValues) => {
    const input = toRequest(values);
    setLastRequest(input);
    setFeedback({});
    setShowResults(true);
    recommendationMutation.mutate(input);
  };

  const goNext = async () => {
    const fields = stepFields[step];
    if (fields === undefined || !(await trigger(fields))) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const regenerate = () => {
    if (lastRequest === null) return;
    setFeedback({});
    recommendationMutation.mutate(lastRequest);
  };

  const handleFeedback = (
    recipeId: string,
    value: RecommendationFeedback,
  ) => {
    const recommendationId = recommendationMutation.data?.recommendationId;
    if (recommendationId === undefined) return;
    feedbackMutation.mutate({ recommendationId, recipeId, feedback: value });
  };

  return (
    <section className="min-h-[80vh] bg-gradient-to-b from-emerald-50/70 to-canvas py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Personalized meal agent</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Find meals shaped around you</h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">Set today’s constraints and MealMind will filter existing recipes, consider your saved preferences, and ask Gemini to rank the best matches.</p>
        </div>

        {!showResults && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
            <form className="rounded-card border border-stone-200 bg-base-100 p-6 shadow-soft sm:p-8" onSubmit={(event) => void handleSubmit(submit)(event)} noValidate>
              <ol className="mb-9 grid grid-cols-3 gap-2" aria-label="Recommendation form progress">
                {steps.map((label, index) => <li key={label} className="text-center"><span className={`mx-auto grid size-8 place-items-center rounded-full text-sm font-bold ${index <= step ? 'bg-primary text-white' : 'bg-stone-100 text-stone-400'}`}>{index < step ? <FiCheck /> : index + 1}</span><span className={`mt-2 hidden text-xs font-semibold sm:block ${index === step ? 'text-primary' : 'text-stone-400'}`}>{label}</span></li>)}
              </ol>

              {step === 0 && <div className="grid gap-5 sm:grid-cols-2"><Field label="Meal type" error={errors.mealType?.message}><select className="select select-bordered w-full bg-white" {...register('mealType')}>{['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drink'].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Dietary preference" hint="Optional" error={errors.dietaryPreference?.message}><select className="select select-bordered w-full bg-white" {...register('dietaryPreference')}><option value="">Use saved preferences</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option><option value="gluten-free">Gluten-free</option><option value="dairy-free">Dairy-free</option><option value="high-protein">High-protein</option><option value="high-fiber">High-fiber</option></select></Field><Field label="Preferred cuisine" hint="Optional" error={errors.preferredCuisine?.message}><input className="input input-bordered w-full bg-white" placeholder="e.g. Mediterranean" {...register('preferredCuisine')} /></Field></div>}

              {step === 1 && <div className="grid gap-5 sm:grid-cols-2"><Field label="Maximum cooking time" hint="Minutes" error={errors.maximumCookingTime?.message}><input className="input input-bordered w-full bg-white" type="number" min="0" max="1440" {...register('maximumCookingTime')} /></Field><Field label="Calorie target" hint="Maximum per serving" error={errors.calorieTarget?.message}><input className="input input-bordered w-full bg-white" type="number" min="1" max="20000" placeholder="e.g. 600" {...register('calorieTarget')} /></Field><Field label="Number of results" error={errors.numberOfResults?.message}><select className="select select-bordered w-full bg-white" {...register('numberOfResults')}>{[2, 3, 4, 5, 6, 7, 8].map((value) => <option key={value} value={value}>{value} recommendations</option>)}</select></Field></div>}

              {step === 2 && <div><Field label="Excluded ingredients" hint="Separate ingredients with commas" error={errors.excludedIngredients?.message}><textarea className="textarea textarea-bordered min-h-32 w-full bg-white" placeholder="peanuts, mushrooms, shellfish" {...register('excludedIngredients')} /></Field><div className="mt-6 rounded-xl bg-stone-50 p-5"><p className="text-sm font-bold text-stone-700">Your request</p><dl className="mt-3 grid gap-2 text-sm text-stone-600 sm:grid-cols-2"><div><dt className="inline font-semibold">Meal: </dt><dd className="inline">{watchedValues.mealType}</dd></div><div><dt className="inline font-semibold">Diet: </dt><dd className="inline">{watchedValues.dietaryPreference || 'Saved preferences'}</dd></div><div><dt className="inline font-semibold">Cooking time: </dt><dd className="inline">{watchedValues.maximumCookingTime ? `${watchedValues.maximumCookingTime} minutes` : 'No limit'}</dd></div><div><dt className="inline font-semibold">Results: </dt><dd className="inline">{watchedValues.numberOfResults}</dd></div></dl></div></div>}

              <div className="mt-9 flex items-center justify-between gap-3"><button className="btn btn-ghost" type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>Back</button>{step < steps.length - 1 ? <button className="btn btn-primary" type="button" onClick={() => void goNext()}>Continue <FiArrowRight /></button> : <button className="btn btn-primary" type="submit">Generate recommendations <FiArrowRight /></button>}</div>
            </form>
            <aside className="rounded-card border border-amber-200 bg-amber-50 p-6 lg:self-start"><FiAlertTriangle className="text-amber-700" size={24} /><h2 className="mt-4 font-bold text-amber-950">A note about food safety</h2><p className="mt-2 text-sm leading-6 text-amber-900">AI recommendations are informational. Always inspect ingredients and labels yourself, especially for allergies, cross-contamination, or clinical dietary needs.</p></aside>
          </div>
        )}

        {showResults && (
          <div className="mt-10">
            {recommendationMutation.isPending && <RecommendationLoading />}
            {recommendationMutation.isError && <div className="rounded-card border border-red-200 bg-red-50 p-8 text-center"><h2 className="text-2xl font-bold text-red-800">Recommendations could not be generated</h2><p className="mt-2 text-red-700">{getErrorMessage(recommendationMutation.error, 'The AI service may be temporarily unavailable.')}</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button className="btn border-red-300 bg-white text-red-700" onClick={regenerate}><FiRefreshCw /> Try again</button><button className="btn btn-ghost" onClick={() => setShowResults(false)}><FiEdit3 /> Refine filters</button></div></div>}
            {recommendationMutation.isSuccess && recommendationMutation.data.recommendations.length === 0 && <div className="rounded-card border border-stone-200 bg-base-100 p-10 text-center"><h2 className="text-2xl font-bold">No matching recipes found</h2><p className="mt-2 text-stone-600">Try increasing the cooking-time or calorie limit, or removing an exclusion.</p><button className="btn btn-primary mt-6" onClick={() => setShowResults(false)}><FiEdit3 /> Refine filters</button></div>}
            {recommendationMutation.isSuccess && recommendationMutation.data.recommendations.length > 0 && <><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Ranked for you</p><h2 className="mt-2 text-3xl font-extrabold">Your meal matches</h2><p className="mt-2 text-stone-600">Every result below is an existing published MealMind recipe.</p></div><div className="flex flex-wrap gap-2"><button className="btn btn-outline btn-sm" onClick={() => setShowResults(false)}><FiEdit3 /> Refine filters</button><button className="btn btn-primary btn-sm" onClick={regenerate}><FiRefreshCw /> Regenerate</button></div></div><div className="mt-8 grid gap-6 lg:grid-cols-2">{recommendationMutation.data.recommendations.map((item, index) => <article key={item.recipeId} className="grid overflow-hidden rounded-card border border-stone-200 bg-base-100 shadow-soft sm:grid-cols-[13rem_1fr]"><div className="relative min-h-56 bg-stone-100"><img className="absolute inset-0 h-full w-full object-cover" src={item.recipe.image} alt={item.recipe.title} /><span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-stone-900 font-bold text-white">{index + 1}</span></div><div className="flex flex-col p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">{item.recipe.category} · {item.recipe.cuisine}</p><h3 className="mt-2 text-2xl font-bold">{item.recipe.title}</h3></div><div className="text-right"><p className="text-2xl font-black text-primary">{Math.round(item.matchScore)}%</p><p className="text-xs text-stone-500">match</p></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-primary" style={{ width: `${item.matchScore}%` }} /></div><p className="mt-4 flex-1 leading-7 text-stone-600">{item.explanation}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-stone-500"><span className="flex items-center gap-1"><FiClock /> {item.recipe.preparationTime + item.recipe.cookingTime} min</span><span className="flex items-center gap-1"><FiStar className="text-amber-600" /> {item.recipe.averageRating.toFixed(1)}</span><span>{item.recipe.calories} kcal</span></div><div className="mt-5 flex flex-wrap gap-2"><Link className="btn btn-primary btn-sm" to={`/recipes/${item.recipe.slug}`}>View Recipe</Link><button className={`btn btn-sm ${feedback[item.recipeId] === 'liked' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'btn-ghost'}`} disabled={feedbackMutation.isPending} onClick={() => handleFeedback(item.recipeId, 'liked')}><FiThumbsUp /> Like</button><button className={`btn btn-sm ${feedback[item.recipeId] === 'disliked' ? 'border-red-300 bg-red-50 text-red-700' : 'btn-ghost'}`} disabled={feedbackMutation.isPending} onClick={() => handleFeedback(item.recipeId, 'disliked')}><FiThumbsDown /> Dislike</button><button className={`btn btn-sm ${feedback[item.recipeId] === 'selected' ? 'border-amber-400 bg-amber-50 text-amber-800' : 'btn-outline border-amber-500 text-amber-700'}`} disabled={feedbackMutation.isPending} onClick={() => handleFeedback(item.recipeId, 'selected')}><FiCheck /> {feedback[item.recipeId] === 'selected' ? 'Selected' : 'Select for Meal Plan'}</button></div></div></article>)}</div><div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900"><FiAlertTriangle className="mt-0.5 shrink-0" size={19} /><p>Recommendations are informational. Verify ingredients, product labels, preparation surfaces, and allergy risks before choosing a meal.</p></div></>}
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error: string | undefined; children: React.ReactNode }) {
  return <label className="form-control"><span className="label-text mb-2 font-semibold">{label} {hint && <span className="font-normal text-stone-400">({hint})</span>}</span>{children}{error && <span className="mt-1 text-sm text-red-600">{error}</span>}</label>;
}
