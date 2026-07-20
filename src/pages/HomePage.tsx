import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiCoffee,
  FiCompass,
  FiHeart,
  FiMessageCircle,
  FiSearch,
  FiShield,
  FiSliders,
  FiStar,
  FiTarget,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { RecipeCard } from '../components/cards/RecipeCard';
import { RecipeCardSkeleton } from '../components/loaders/RecipeCardSkeleton';
import { getFeaturedRecipes } from '../services/recipe.service';

const preferences = ['High protein', 'Vegetarian', 'Under 30 minutes', 'Gluten-free'] as const;

const steps = [
  { icon: FiSliders, number: '01', title: 'Share your preferences', text: 'Save dietary needs, disliked ingredients, favorite cuisines, time limits, and serving goals.' },
  { icon: FiSearch, number: '02', title: 'Explore real recipes', text: 'MealMind searches published recipes and applies your filters before AI ranking begins.' },
  { icon: FiTarget, number: '03', title: 'Choose with confidence', text: 'See short, grounded explanations and teach recommendations through likes and selections.' },
];

const benefits = [
  { icon: FiShield, title: 'Grounded, not invented', text: 'Every recommended recipe ID must already exist in the MealMind recipe library.' },
  { icon: FiZap, title: 'Practical for today', text: 'Balance dietary fit with cooking time, calories, cuisine, and ingredients you want to avoid.' },
  { icon: FiBarChart2, title: 'Improves with feedback', text: 'Likes, dislikes, selections, and ignored suggestions shape future ranking signals.' },
  { icon: FiMessageCircle, title: 'Keeps the conversation', text: 'Follow-up questions retain useful context while recipe searches stay server-controlled.' },
];

const categories = [
  { name: 'Breakfast', icon: FiCoffee, description: 'Start steady and satisfied.' },
  { name: 'Lunch', icon: FiCompass, description: 'Balanced midday meals.' },
  { name: 'Dinner', icon: FiHeart, description: 'Comforting everyday dinners.' },
  { name: 'Snack', icon: FiZap, description: 'Smart bites between meals.' },
  { name: 'Dessert', icon: FiStar, description: 'Thoughtful sweet finishes.' },
  { name: 'Drink', icon: FiUsers, description: 'Refreshing blends and coolers.' },
];

const testimonials = [
  { quote: 'The time and ingredient filters help me decide what is actually possible after work—not just what looks good.', name: 'Maya R.', context: 'Busy home cook' },
  { quote: 'I like seeing why a recipe fits. The explanation makes recommendations feel useful instead of random.', name: 'Daniel K.', context: 'Weekly meal planner' },
  { quote: 'Saving allergies and disliked ingredients once makes every new search feel calmer and more relevant.', name: 'Aisha T.', context: 'Family meal organizer' },
];

const faqs = [
  { question: 'Does MealMind create recipes with AI?', answer: 'No. The recommendation and chat features search recipes stored in MealMind. AI can rank, explain, and arrange those results, but it cannot invent recipe IDs or database records.' },
  { question: 'Can I browse recipes without an account?', answer: 'Yes. Recipe discovery and published recipe details are public. An account is needed to save favorites, add recipes, store preferences, use AI planning, and view personal analytics.' },
  { question: 'How are dietary preferences used?', answer: 'Saved preferences and request-specific filters are merged on the backend. Deterministic recipe filtering happens before candidate data is provided to Gemini.' },
  { question: 'Will recommendations improve over time?', answer: 'Yes. MealMind stores recommendation impressions and your liked, disliked, selected, or ignored feedback so later ranking can account for what worked.' },
  { question: 'Is MealMind medical nutrition advice?', answer: 'No. MealMind supports everyday meal discovery and planning, but it does not provide diagnosis or individualized clinical nutrition guidance.' },
];

export function HomePage() {
  const [selectedPreference, setSelectedPreference] = useState<(typeof preferences)[number]>(
    preferences[0],
  );
  const featuredQuery = useQuery({ queryKey: ['recipes', 'featured'], queryFn: getFeaturedRecipes });
  const publishedTotal = featuredQuery.data?.meta.total;

  return (
    <>
      <section className="relative flex min-h-[65vh] flex-col overflow-hidden bg-gradient-to-br from-emerald-50 via-canvas to-amber-50">
        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div>
            <span className="badge badge-outline h-auto border-primary px-3 py-2 text-primary">Healthy meals, thoughtfully planned</span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-neutral sm:text-6xl lg:text-7xl">Make everyday meals feel <span className="text-primary">effortless.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">Discover realistic recipes and get personalized meal guidance grounded in your time, tastes, and dietary preferences.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn btn-primary" to="/recipes">Explore Recipes <FiArrowRight aria-hidden="true" /></Link>
              <Link className="btn border-amber-600 bg-amber-600 text-white hover:border-amber-700 hover:bg-amber-700" to="/assistant" state={{ preference: selectedPreference }}>Try AI Planner <FiZap aria-hidden="true" /></Link>
            </div>
          </div>

          <div className="rounded-card border border-stone-200 bg-base-100 p-5 shadow-soft sm:p-7">
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-primary">Plan around your day</p><h2 className="mt-1 text-2xl font-extrabold">What matters tonight?</h2></div><span className="grid size-11 place-items-center rounded-xl bg-red-50 text-accent"><FiHeart size={21} /></span></div>
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Choose a meal preference">
              {preferences.map((preference) => (
                <button key={preference} type="button" className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${selectedPreference === preference ? 'border-primary bg-emerald-50 text-emerald-800' : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-300'}`} aria-pressed={selectedPreference === preference} onClick={() => setSelectedPreference(preference)}>{preference}</button>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-stone-900 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Your planner request</p>
              <p className="mt-3 text-lg font-semibold">“Find a {selectedPreference.toLowerCase()} dinner that fits my saved preferences.”</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-stone-300"><FiCheck className="text-emerald-400" /> Searches existing MealMind recipes</div>
            </div>
          </div>
        </div>
        <div className="h-10 rounded-t-[50%] bg-canvas sm:h-14" aria-hidden="true" />
      </section>

      <section className="bg-canvas py-20" aria-labelledby="how-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Simple by design" title="How MealMind works" description="Move from preferences to a practical meal choice in three clear steps." id="how-heading" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, text }) => <article key={number} className="relative rounded-card border border-stone-200 bg-base-100 p-7 shadow-soft"><span className="absolute right-6 top-5 text-4xl font-black text-stone-100">{number}</span><span className="grid size-12 place-items-center rounded-xl bg-emerald-100 text-primary"><Icon size={22} /></span><h3 className="mt-6 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-stone-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-base-200/60 py-20" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="From the kitchen" title="Featured recipes" description="Top-rated published recipes, fetched directly from the MealMind API." id="featured-heading" align="left" /><Link className="btn btn-outline border-primary text-primary hover:bg-primary" to="/recipes">View all recipes</Link></div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredQuery.isLoading && Array.from({ length: 4 }, (_, index) => <RecipeCardSkeleton key={index} />)}
            {featuredQuery.data?.data.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}
          </div>
          {featuredQuery.isError && <div className="mt-10 rounded-card border border-red-200 bg-red-50 p-6 text-center"><p className="font-semibold text-red-800">Featured recipes could not be loaded.</p><button className="btn btn-sm mt-4 border-red-300 bg-white text-red-700" onClick={() => void featuredQuery.refetch()}>Try again</button></div>}
          {!featuredQuery.isLoading && !featuredQuery.isError && featuredQuery.data?.data.length === 0 && <p className="mt-10 rounded-card border border-stone-200 bg-base-100 p-8 text-center text-stone-600">No published recipes are available yet.</p>}
        </div>
      </section>

      <section className="bg-stone-900 py-20 text-white" aria-labelledby="benefits-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Agentic, with guardrails</p><h2 id="benefits-heading" className="mt-3 text-4xl font-extrabold tracking-tight">Recommendations that explain themselves</h2><p className="mt-5 leading-8 text-stone-300">MealMind combines deterministic database filters with Gemini ranking and explanations, keeping recipe facts connected to application data.</p><Link className="btn btn-primary mt-8" to="/assistant">Open AI Assistant</Link></div>
          <div className="grid gap-4 sm:grid-cols-2">{benefits.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-card border border-stone-700 bg-stone-800 p-6"><Icon className="text-amber-400" size={23} /><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 leading-7 text-stone-300">{text}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-canvas py-20" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeading eyebrow="Browse your way" title="Dietary and meal categories" description="Start with the meal you need, then refine results with dietary tags and practical filters." id="categories-heading" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{categories.map(({ name, icon: Icon, description }) => <Link key={name} to={`/recipes?category=${name}`} className="group rounded-card border border-stone-200 bg-base-100 p-5 text-center shadow-soft transition-colors hover:border-emerald-300"><span className="mx-auto grid size-12 place-items-center rounded-xl bg-emerald-50 text-primary group-hover:bg-emerald-100"><Icon size={21} /></span><h3 className="mt-4 font-bold">{name}</h3><p className="mt-2 text-xs leading-5 text-stone-500">{description}</p></Link>)}</div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-base-100 py-14" aria-labelledby="stats-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 id="stats-heading" className="sr-only">Platform statistics</h2><div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          <Stat value={publishedTotal === undefined ? 'Live' : String(publishedTotal)} label={publishedTotal === undefined ? 'Recipe library' : 'Published recipes'} />
          <Stat value="6" label="Meal categories" />
          <Stat value="6" label="Validated AI tools" />
          <Stat value="2" label="Agentic AI experiences" />
        </div></div>
      </section>

      <section className="bg-canvas py-20" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeading eyebrow="Built for real routines" title="User testimonials" description="The planning moments MealMind is designed to make easier." id="testimonials-heading" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">{testimonials.map((testimonial) => <figure key={testimonial.name} className="flex flex-col rounded-card border border-stone-200 bg-base-100 p-7 shadow-soft"><div className="flex gap-1 text-amber-600" aria-label="Five stars">{Array.from({ length: 5 }, (_, index) => <FiStar key={index} fill="currentColor" />)}</div><blockquote className="mt-5 flex-1 text-lg leading-8 text-stone-700">“{testimonial.quote}”</blockquote><figcaption className="mt-6 border-t border-stone-100 pt-5"><p className="font-bold">{testimonial.name}</p><p className="text-sm text-stone-500">{testimonial.context}</p></figcaption></figure>)}</div>
        </div>
      </section>

      <section className="bg-base-200/60 py-20" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl px-4 sm:px-6"><SectionHeading eyebrow="Good to know" title="Frequently asked questions" description="Clear answers about recipes, personalization, and MealMind’s use of AI." id="faq-heading" />
          <div className="mt-10 space-y-3">{faqs.map((faq) => <details key={faq.question} className="group rounded-card border border-stone-200 bg-base-100 p-5 open:shadow-soft"><summary className="cursor-pointer list-none pr-8 font-bold text-neutral marker:hidden">{faq.question}<span className="float-right text-primary group-open:rotate-45">+</span></summary><p className="mt-4 leading-7 text-stone-600">{faq.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="bg-canvas px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-emerald-700 to-emerald-800 px-6 py-14 text-center text-white shadow-soft sm:px-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">Your next meal starts here</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">Spend less time deciding and more time enjoying dinner.</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-emerald-100">Explore the recipe library now, or sign in to make recommendations, favorites, and meal-planning conversations personal.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link className="btn bg-white text-emerald-800 hover:bg-stone-100" to="/recipes">Explore Recipes</Link><Link className="btn border-amber-400 bg-amber-500 text-stone-900 hover:border-amber-500 hover:bg-amber-400" to="/register">Create free account</Link></div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title, description, id, align = 'center' }: { eyebrow: string; title: string; description: string; id: string; align?: 'left' | 'center' }) {
  return <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p><h2 id={id} className="mt-3 text-3xl font-extrabold tracking-tight text-neutral sm:text-4xl">{title}</h2><p className="mt-4 leading-7 text-stone-600">{description}</p></div>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div><p className="text-4xl font-black text-primary sm:text-5xl">{value}</p><p className="mt-2 text-sm font-semibold text-stone-500">{label}</p></div>;
}
