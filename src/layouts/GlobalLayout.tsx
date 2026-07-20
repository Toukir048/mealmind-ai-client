import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Footer } from '../components/shared/Footer';
import { Navbar } from '../components/shared/Navbar';

export function GlobalLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-neutral">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
