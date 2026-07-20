import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loading } from '../components/loaders/Loading';
import { getPreferences, updatePreferences } from '../services/preference.service';
import type { UserPreference } from '../types/preference';
import { getErrorMessage } from '../utils/api-error';

const optionalNumber = (minimum: number, maximum: number) => z.string().refine(
  (value) => value === '' || (Number.isInteger(Number(value)) && Number(value) >= minimum && Number(value) <= maximum),
  `Enter a whole number from ${minimum} to ${maximum}.`,
);
const schema = z.object({
  dietaryPreferences: z.string(), dislikedIngredients: z.string(), allergies: z.string(),
  preferredCuisines: z.string(), maximumCookingTime: optionalNumber(0, 1440),
  calorieGoal: optionalNumber(1, 20000), servings: optionalNumber(1, 100),
  budgetLevel: z.enum(['', 'low', 'medium', 'high']),
});
type Values = z.infer<typeof schema>;
const join = (values: string[]) => values.join(', ');
const split = (value: string) => [...new Set(value.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean))];

export function PreferencesPage() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { dietaryPreferences: '', dislikedIngredients: '', allergies: '', preferredCuisines: '', maximumCookingTime: '', calorieGoal: '', servings: '', budgetLevel: '' },
  });
  useEffect(() => {
    if (query.data) reset({
      dietaryPreferences: join(query.data.dietaryPreferences), dislikedIngredients: join(query.data.dislikedIngredients),
      allergies: join(query.data.allergies), preferredCuisines: join(query.data.preferredCuisines),
      maximumCookingTime: query.data.maximumCookingTime === undefined ? '' : String(query.data.maximumCookingTime),
      calorieGoal: query.data.calorieGoal === undefined ? '' : String(query.data.calorieGoal),
      servings: query.data.servings === undefined ? '' : String(query.data.servings), budgetLevel: query.data.budgetLevel ?? '',
    });
  }, [query.data, reset]);
  const mutation = useMutation({ mutationFn: updatePreferences, onSuccess: async () => {
    await client.invalidateQueries({ queryKey: ['preferences'] }); toast.success('Meal preferences saved');
  }, onError: (error) => toast.error(getErrorMessage(error, 'Preferences could not be saved.')) });
  const submit = (values: Values) => {
    const input: UserPreference = {
      dietaryPreferences: split(values.dietaryPreferences), dislikedIngredients: split(values.dislikedIngredients),
      allergies: split(values.allergies), preferredCuisines: split(values.preferredCuisines),
      ...(values.maximumCookingTime ? { maximumCookingTime: Number(values.maximumCookingTime) } : {}),
      ...(values.calorieGoal ? { calorieGoal: Number(values.calorieGoal) } : {}),
      ...(values.servings ? { servings: Number(values.servings) } : {}),
      ...(values.budgetLevel ? { budgetLevel: values.budgetLevel } : {}),
    };
    mutation.mutate(input);
  };
  if (query.isPending) return <Loading label="Loading your meal preferences" />;
  return <main className="bg-stone-50 py-12"><div className="mx-auto max-w-3xl px-4 sm:px-6"><header><p className="font-semibold uppercase tracking-widest text-primary">Personalization</p><h1 className="mt-2 text-4xl font-bold text-neutral">Meal preferences</h1><p className="mt-3 text-stone-600">These settings guide recipe recommendations. Always verify recipe ingredients for allergies.</p></header>{query.isError && <div className="alert alert-error mt-6">{getErrorMessage(query.error, 'Preferences could not be loaded.')}</div>}<form className="mt-8 space-y-6 rounded-card border border-stone-200 bg-white p-6 shadow-soft sm:p-8" onSubmit={handleSubmit(submit)}><TextField label="Dietary preferences" hint="Comma separated, such as vegetarian, halal" registration={register('dietaryPreferences')} /><TextField label="Allergies" hint="Comma separated" registration={register('allergies')} /><TextField label="Disliked ingredients" hint="Comma separated" registration={register('dislikedIngredients')} /><TextField label="Preferred cuisines" hint="Comma separated" registration={register('preferredCuisines')} /><div className="grid gap-5 sm:grid-cols-2"><Field label="Maximum cooking time" error={errors.maximumCookingTime?.message}><input className="input input-bordered w-full" type="number" min="0" placeholder="Minutes" {...register('maximumCookingTime')} /></Field><Field label="Daily calorie goal" error={errors.calorieGoal?.message}><input className="input input-bordered w-full" type="number" min="1" {...register('calorieGoal')} /></Field><Field label="Usual servings" error={errors.servings?.message}><input className="input input-bordered w-full" type="number" min="1" {...register('servings')} /></Field><label className="form-control"><span className="mb-2 font-semibold">Budget level</span><select className="select select-bordered" {...register('budgetLevel')}><option value="">No preference</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label></div><button className="btn btn-primary" disabled={mutation.isPending}>{mutation.isPending && <span className="loading loading-spinner" />} Save preferences</button></form></div></main>;
}
function Field({ label, error, children }: { label: string; error: string | undefined; children: React.ReactNode }) { return <label className="form-control"><span className="mb-2 font-semibold">{label}</span>{children}{error && <span className="mt-1 text-sm text-red-600">{error}</span>}</label>; }
function TextField({ label, hint, registration }: { label: string; hint: string; registration: UseFormRegisterReturn }) { return <label className="form-control"><span className="mb-2 font-semibold">{label}</span><input className="input input-bordered" placeholder={hint} {...registration} /></label>; }
