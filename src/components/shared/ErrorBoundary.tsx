import { Component, type ErrorInfo, type ReactNode } from 'react';

import { PageMeta } from './PageMeta';

interface State { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State { return { hasError: true }; }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Application render error', error, info.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
        <PageMeta title="Application Error" description="MealMind AI could not load the requested page." keywords="MealMind AI error" robots="noindex,nofollow" />
        <main className="grid min-h-screen place-items-center bg-canvas p-6">
          <section className="max-w-md rounded-card bg-base-100 p-8 text-center shadow-soft">
            <h1 className="text-2xl font-bold text-neutral">Something went wrong</h1>
            <p className="mt-3 text-stone-600">MealMind could not display this page. Refresh to try again.</p>
            <button className="btn btn-primary mt-6" onClick={() => window.location.reload()}>Refresh page</button>
          </section>
        </main>
        </>
      );
    }
    return this.props.children;
  }
}
