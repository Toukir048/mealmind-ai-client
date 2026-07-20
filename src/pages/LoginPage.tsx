import { FiChrome } from 'react-icons/fi';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { user, loginWithGoogle } = useAuth();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard';
  if (user !== null) return <Navigate to={destination} replace />;

  const handleGoogleLogin = async () => {
    try { await loginWithGoogle(); toast.success('Welcome to MealMind AI'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Google sign-in failed'); }
  };

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-card border border-stone-200 bg-base-100 p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Welcome back</p>
        <h1 className="mt-3 text-3xl font-extrabold">Sign in to personalize your meals</h1>
        <p className="mt-3 text-stone-600">Continue with Google to save favorites, manage recipes, and use the AI meal-planning assistant.</p>
        <button className="btn btn-primary mt-8 w-full" onClick={() => void handleGoogleLogin()}><FiChrome size={19} /> Continue with Google</button>
        <p className="mt-5 text-center text-xs leading-5 text-stone-500">Your Google identity token is verified by the MealMind backend before an application session is created.</p>
      </div>
    </section>
  );
}
