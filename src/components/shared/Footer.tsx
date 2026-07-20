import { Link } from 'react-router-dom';

export function Footer() {
  return <footer className="border-t border-stone-200 bg-stone-900 text-stone-200">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8"><div><p className="text-lg font-bold text-white">MealMind AI</p><p className="mt-2 max-w-md text-sm text-stone-400">Healthy recipe discovery and grounded meal-planning guidance, built around your preferences.</p></div><nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:justify-end" aria-label="Footer navigation"><Link className="hover:text-amber-400" to="/recipes">Explore Recipes</Link><Link className="hover:text-amber-400" to="/about">About</Link><Link className="hover:text-amber-400" to="/contact">Contact</Link><Link className="hover:text-amber-400" to="/privacy">Privacy</Link><Link className="hover:text-amber-400" to="/login">Login</Link></nav></div>
    <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">© {new Date().getFullYear()} MealMind AI</div>
  </footer>;
}
