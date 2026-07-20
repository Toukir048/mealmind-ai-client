import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div><p className="text-7xl font-black text-primary">404</p><h1 className="mt-4 text-3xl font-bold">This page is not on the menu</h1><p className="mt-3 text-stone-600">The link may be outdated, or the page may have moved.</p><Link className="btn btn-primary mt-7" to="/">Return home</Link></div>
    </section>
  );
}
