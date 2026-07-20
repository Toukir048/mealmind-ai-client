import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiChrome, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AuthCard } from '../components/forms/AuthCard';
import { registrationSchema, type RegistrationFormValues } from '../components/forms/auth-schemas';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/api-error';

export function RegisterPage() {
  const { user, register: createAccount, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard';
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { name: '', email: '', password: '', photoURL: '' },
  });

  if (user !== null) return <Navigate to={destination} replace />;

  const submitRegistration = async (values: RegistrationFormValues) => {
    setFormError(null);
    try {
      const credentials = {
        name: values.name,
        email: values.email,
        password: values.password,
        ...(values.photoURL ? { photoURL: values.photoURL } : {}),
      };
      await createAccount(credentials);
      toast.success('Your MealMind account is ready');
      navigate(destination, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, 'We could not create your account. Please try again.'));
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setFormError(null);
    try {
      await loginWithGoogle();
      toast.success('Your MealMind account is ready');
      navigate(destination, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, 'Google sign-up failed. Please try again.'));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthCard eyebrow="Create your account" title="Make MealMind yours" description="Save the meals you love and receive recommendations shaped by your preferences.">
      <button type="button" className="btn w-full border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50" disabled={googleLoading || isSubmitting} onClick={() => void handleGoogleLogin()}>
        {googleLoading ? <span className="loading loading-spinner loading-sm" /> : <FiChrome size={19} />} Continue with Google
      </button>
      <div className="divider my-6 text-xs uppercase tracking-widest text-stone-400">or register with email</div>
      <form className="space-y-4" onSubmit={(event) => void handleSubmit(submitRegistration)(event)} noValidate>
        {formError !== null && <div className="alert border-red-200 bg-red-50 text-red-800" role="alert">{formError}</div>}
        <label className="form-control"><span className="label-text mb-2 font-semibold">Name</span><input className={`input input-bordered bg-white ${errors.name ? 'input-error' : ''}`} autoComplete="name" placeholder="Your name" {...register('name')} />{errors.name && <span className="mt-1 text-sm text-red-600">{errors.name.message}</span>}</label>
        <label className="form-control"><span className="label-text mb-2 font-semibold">Email address</span><input className={`input input-bordered bg-white ${errors.email ? 'input-error' : ''}`} type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />{errors.email && <span className="mt-1 text-sm text-red-600">{errors.email.message}</span>}</label>
        <label className="form-control"><span className="label-text mb-2 font-semibold">Password</span><span className="relative"><input className={`input input-bordered w-full bg-white pr-12 ${errors.password ? 'input-error' : ''}`} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters" {...register('password')} /><button type="button" className="btn btn-ghost btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></span>{errors.password && <span className="mt-1 text-sm text-red-600">{errors.password.message}</span>}</label>
        <label className="form-control"><span className="label-text mb-2 font-semibold">Profile image URL <span className="font-normal text-stone-400">(optional)</span></span><input className={`input input-bordered bg-white ${errors.photoURL ? 'input-error' : ''}`} type="url" placeholder="https://example.com/photo.jpg" {...register('photoURL')} />{errors.photoURL && <span className="mt-1 text-sm text-red-600">{errors.photoURL.message}</span>}</label>
        <button className="btn btn-primary mt-2 w-full" type="submit" disabled={isSubmitting || googleLoading}>{isSubmitting && <span className="loading loading-spinner loading-sm" />} Create account</button>
      </form>
      <p className="mt-7 text-center text-sm text-stone-600">Already have an account? <Link className="font-bold text-primary hover:underline" to="/login" state={location.state}>Sign in</Link></p>
    </AuthCard>
  );
}
