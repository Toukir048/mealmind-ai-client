import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiChrome, FiEye, FiEyeOff, FiZap } from 'react-icons/fi';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AuthCard } from '../components/forms/AuthCard';
import { loginSchema, type LoginFormValues } from '../components/forms/auth-schemas';
import { env } from '../config/env';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/api-error';

export function LoginPage() {
  const { user, login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard';
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (user !== null) return <Navigate to={destination} replace />;

  const submitLogin = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login(values);
      toast.success('Welcome back');
      navigate(destination, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, 'We could not sign you in. Check your details and try again.'));
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setFormError(null);
    try {
      await loginWithGoogle();
      toast.success('Welcome to MealMind AI');
      navigate(destination, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, 'Google sign-in failed. Please try again.'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', env.VITE_DEMO_EMAIL, { shouldValidate: true });
    setValue('password', env.VITE_DEMO_PASSWORD, { shouldValidate: true });
    setFormError(null);
    toast.info('Demo credentials are ready');
  };

  return (
    <AuthCard eyebrow="Welcome back" title="Sign in to MealMind" description="Access your recipes, favorites, dashboard, and personal meal-planning assistant.">
      <button type="button" className="btn w-full border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50" disabled={googleLoading || isSubmitting} onClick={() => void handleGoogleLogin()}>
        {googleLoading ? <span className="loading loading-spinner loading-sm" /> : <FiChrome size={19} />}
        Continue with Google
      </button>

      <div className="divider my-6 text-xs uppercase tracking-widest text-stone-400">or use email</div>

      <form className="space-y-5" onSubmit={(event) => void handleSubmit(submitLogin)(event)} noValidate>
        {formError !== null && <div className="alert border-red-200 bg-red-50 text-red-800" role="alert">{formError}</div>}
        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Email address</span>
          <input className={`input input-bordered w-full bg-white ${errors.email ? 'input-error' : ''}`} type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <span className="mt-1 text-sm text-red-600">{errors.email.message}</span>}
        </label>
        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Password</span>
          <span className="relative">
            <input className={`input input-bordered w-full bg-white pr-12 ${errors.password ? 'input-error' : ''}`} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" {...register('password')} />
            <button type="button" className="btn btn-ghost btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
          </span>
          {errors.password && <span className="mt-1 text-sm text-red-600">{errors.password.message}</span>}
        </label>
        <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting || googleLoading}>
          {isSubmitting && <span className="loading loading-spinner loading-sm" />} Sign in
        </button>
        <button className="btn btn-ghost w-full text-amber-700" type="button" onClick={fillDemoCredentials} disabled={isSubmitting || googleLoading}><FiZap /> Use demo account</button>
      </form>

      <p className="mt-7 text-center text-sm text-stone-600">New to MealMind? <Link className="font-bold text-primary hover:underline" to="/register" state={location.state}>Create an account</Link></p>
    </AuthCard>
  );
}
