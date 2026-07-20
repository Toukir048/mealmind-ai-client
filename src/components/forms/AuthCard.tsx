import type { ReactNode } from 'react';
import { FiHeart } from 'react-icons/fi';

export function AuthCard({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-50 via-canvas to-amber-50 px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-card border border-stone-200 bg-base-100 shadow-soft lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="hidden bg-emerald-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/15"><FiHeart size={24} /></span>
          <div><p className="text-2xl font-bold">Meals that understand your day.</p><p className="mt-3 leading-7 text-emerald-100">Save preferences, revisit favorites, and get grounded guidance from recipes already in MealMind.</p></div>
        </aside>
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 leading-7 text-stone-600">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
