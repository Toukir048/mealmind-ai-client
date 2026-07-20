import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { FiActivity, FiBookmark, FiBookOpen, FiHeart, FiStar, FiTarget } from 'react-icons/fi';

import { Loading } from '../components/loaders/Loading';
import { getDashboardSummary } from '../services/dashboard.service';
import { getErrorMessage } from '../utils/api-error';

const activityLabels: Record<string, string> = {
  recipe_created: 'Created a recipe', favorite_added: 'Saved a favorite',
  review_created: 'Reviewed a recipe', recommendation_selected: 'Selected an AI recommendation',
};

function EmptyPanel({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-56 items-center justify-center rounded-card border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">{children}</div>;
}

export function DashboardPage() {
  const query = useQuery({ queryKey: ['dashboard', 'summary'], queryFn: getDashboardSummary });
  if (query.isPending) return <Loading label="Preparing your dashboard" />;
  if (query.isError) return <main className="mx-auto max-w-7xl px-4 py-20"><div className="alert alert-error">{getErrorMessage(query.error, 'Dashboard analytics could not be loaded.')}</div></main>;

  const data = query.data;
  const { totals } = data;
  const selectionRate = totals.aiRecommendationsRequested === 0 ? 0 : Math.round((totals.recommendationSelections / totals.aiRecommendationsRequested) * 100);
  const cards = [
    ['Recipes created', totals.recipesCreated, FiBookOpen], ['Favorites', totals.favorites, FiHeart],
    ['Reviews written', totals.reviews, FiStar], ['Recipe rating', totals.averageRatingOfUserRecipes.toFixed(1), FiActivity],
    ['AI requests', totals.aiRecommendationsRequested, FiBookmark], ['Selections', totals.recommendationSelections, FiTarget],
  ] as const;
  const activity = data.activityLastSevenDays.map((day) => ({ ...day, label: new Date(`${day.date}T00:00:00Z`).toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' }) }));

  return <main className="bg-stone-50 py-10 sm:py-14">
    <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      <header><p className="font-semibold uppercase tracking-widest text-primary">Your dashboard</p><h1 className="mt-2 text-3xl font-bold text-neutral sm:text-4xl">Your MealMind activity</h1><p className="mt-3 text-stone-600">Real totals and recent signals from your recipes, favorites, reviews, and AI recommendations.</p></header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Summary statistics">{cards.map(([label, value, Icon]) => <article key={label} className="rounded-card border border-stone-200 bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-stone-500">{label}</p><p className="mt-2 text-3xl font-bold text-neutral">{value}</p></div><span className="rounded-2xl bg-emerald-50 p-3 text-primary"><Icon size={22} /></span></div></article>)}</section>
      <section className="grid gap-6 lg:grid-cols-5">
        <ChartPanel title="Recipes by category" subtitle="Recipes you have created" className="lg:col-span-3">{data.recipesByCategory.length ? <ResponsiveContainer width="100%" height={280}><BarChart data={data.recipesByCategory}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="category" tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" name="Recipes" radius={[8,8,0,0]} fill="#059669" /></BarChart></ResponsiveContainer> : <EmptyPanel>Create a recipe to see its category represented here.</EmptyPanel>}</ChartPanel>
        <ChartPanel title="Selection rate" subtitle="AI sessions that led to a meal choice" className="lg:col-span-2"><div className="relative"><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'Selected', value: totals.recommendationSelections }, { name: 'Not selected', value: Math.max(0, totals.aiRecommendationsRequested - totals.recommendationSelections) }]} dataKey="value" innerRadius={75} outerRadius={100} startAngle={90} endAngle={-270}>{[0,1].map((item) => <Cell key={item} fill={item === 0 ? '#059669' : '#e7e5e4'} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="text-3xl text-neutral">{selectionRate}%</strong><span className="text-xs text-stone-500">selection rate</span></div></div></ChartPanel>
      </section>
      <ChartPanel title="Last seven days" subtitle="Daily actions recorded by MealMind"><ResponsiveContainer width="100%" height={300}><AreaChart data={activity}><defs><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.35}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="label"/><YAxis allowDecimals={false}/><Tooltip/><Area type="monotone" dataKey="recipesCreated" name="Recipes" stroke="#059669" fill="url(#activityFill)"/><Area type="monotone" dataKey="favoritesAdded" name="Favorites" stroke="#f59e0b" fill="transparent"/><Area type="monotone" dataKey="reviewsCreated" name="Reviews" stroke="#ef6b62" fill="transparent"/><Area type="monotone" dataKey="recommendationRequests" name="AI requests" stroke="#78716c" fill="transparent"/></AreaChart></ResponsiveContainer></ChartPanel>
      <section className="grid gap-6 lg:grid-cols-2"><ChartPanel title="Most favorited recipes" subtitle="Your recipes saved most often">{data.mostFavoritedRecipes.length ? <div className="space-y-3">{data.mostFavoritedRecipes.map((recipe, index) => <Link key={recipe.recipeId} to={`/recipes/${recipe.slug}`} className="flex items-center gap-3 rounded-2xl border border-stone-200 p-3 transition hover:border-primary"><span className="w-5 font-bold text-stone-400">{index + 1}</span><img src={recipe.image} alt="" className="h-12 w-12 rounded-xl object-cover"/><span className="min-w-0 flex-1 truncate font-semibold text-neutral">{recipe.title}</span><span className="flex items-center gap-1 text-sm text-stone-500"><FiHeart/> {recipe.favoriteCount}</span></Link>)}</div> : <EmptyPanel>No one has favorited your recipes yet.</EmptyPanel>}</ChartPanel><ChartPanel title="Recent activity" subtitle="Your latest recorded actions">{data.recentActivity.length ? <ol className="space-y-4">{data.recentActivity.map((item, index) => <li key={`${item.type}-${item.occurredAt}-${index}`} className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary"/><div><p className="font-medium text-neutral">{activityLabels[item.type]}{item.recipeTitle ? `: ${item.recipeTitle}` : ''}</p><time className="text-xs text-stone-500">{new Date(item.occurredAt).toLocaleString()}</time></div></li>)}</ol> : <EmptyPanel>Your recent recipe and recommendation activity will appear here.</EmptyPanel>}</ChartPanel></section>
    </div>
  </main>;
}

function ChartPanel({ title, subtitle, className = '', children }: { title: string; subtitle: string; className?: string; children: React.ReactNode }) {
  return <section className={`rounded-card border border-stone-200 bg-white p-5 shadow-soft sm:p-6 ${className}`}><h2 className="text-xl font-bold text-neutral">{title}</h2><p className="mb-6 mt-1 text-sm text-stone-500">{subtitle}</p>{children}</section>;
}
