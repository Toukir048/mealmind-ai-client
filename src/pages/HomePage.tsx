import { FiBarChart2, FiCompass, FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const features = [
  { icon: FiCompass, title: 'Discover with intention', text: 'Search practical recipes by meal, dietary needs, cooking time, and cuisine.' },
  { icon: FiMessageCircle, title: 'Plan with context', text: 'Ask follow-up questions and build meal ideas grounded in recipes from MealMind.' },
  { icon: FiBarChart2, title: 'Learn what works', text: 'Use favorites, feedback, and dashboard insights to make each recommendation more useful.' },
];

export function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-gradient-to-br from-emerald-50 via-canvas to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="badge badge-outline border-primary text-primary">Healthy meals, thoughtfully planned</span>
            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-neutral sm:text-6xl">Make everyday meals feel <span className="text-primary">effortless.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">Explore realistic recipes and get personalized meal guidance that respects your time, tastes, and dietary preferences.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn btn-primary" to="/recipes">Explore recipes</Link>
              <Link className="btn border-amber-600 bg-amber-600 text-white hover:border-amber-700 hover:bg-amber-700" to="/login">Start planning</Link>
            </div>
          </div>
          <div className="rounded-card border border-stone-200 bg-base-100 p-6 shadow-soft sm:p-8">
            <p className="font-semibold text-stone-500">A better dinner decision</p>
            <p className="mt-4 text-2xl font-bold">“Show me a high-protein dinner under 35 minutes without peanuts.”</p>
            <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-emerald-900">
              MealMind searches existing recipes, applies your preferences, and explains why each match fits.
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-card border border-stone-200 bg-base-100 p-6 shadow-soft">
              <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-primary"><Icon size={21} aria-hidden="true" /></span>
              <h2 className="mt-5 text-xl font-bold">{title}</h2>
              <p className="mt-2 leading-7 text-stone-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
