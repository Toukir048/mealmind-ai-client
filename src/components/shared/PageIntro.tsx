import type { ReactNode } from 'react';

export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-neutral sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">{description}</p>
      {children !== undefined && <div className="mt-8">{children}</div>}
    </section>
  );
}
