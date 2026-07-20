import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiMessageSquare } from 'react-icons/fi';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(80),
  email: z.string().trim().email('Enter a valid email address.'),
  subject: z.string().trim().min(4, 'Add a descriptive subject.').max(120),
  message: z.string().trim().min(20, 'Please provide at least 20 characters.').max(2000),
});
type ContactForm = z.infer<typeof contactSchema>;

export function ContactPage() {
  const [confirmation, setConfirmation] = useState<string>();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });
  const submit = async (values: ContactForm) => {
    setConfirmation(`Thanks, ${values.name}. Your message passed validation and is ready for the MealMind team. Contact delivery is not connected in this preview.`);
    reset();
  };
  return <main className="bg-stone-50 py-14 sm:py-20"><div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8"><section className="lg:col-span-2"><p className="font-semibold uppercase tracking-widest text-primary">Contact MealMind</p><h1 className="mt-3 text-4xl font-bold text-neutral">Tell us what would make meal planning easier</h1><p className="mt-5 leading-7 text-stone-600">Share product feedback, report a recipe issue, or ask a question about MealMind’s recommendations and planning tools.</p><div className="mt-8 space-y-4"><div className="flex gap-3"><FiMail className="mt-1 text-primary"/><div><strong className="text-neutral">Product questions</strong><p className="text-sm text-stone-500">Questions about recipes, preferences, or account features.</p></div></div><div className="flex gap-3"><FiMessageSquare className="mt-1 text-primary"/><div><strong className="text-neutral">Recommendation feedback</strong><p className="text-sm text-stone-500">Tell us when guidance was helpful or missed an important need.</p></div></div></div></section><section className="rounded-card border border-stone-200 bg-white p-6 shadow-soft sm:p-8 lg:col-span-3"><h2 className="text-2xl font-bold text-neutral">Send a message</h2>{confirmation && <div role="status" className="alert alert-success mt-5 text-sm">{confirmation}</div>}<form className="mt-6 space-y-5" onSubmit={handleSubmit(submit)} noValidate><div className="grid gap-5 sm:grid-cols-2"><Field label="Name" error={errors.name?.message}><input className="input input-bordered w-full" autoComplete="name" {...register('name')}/></Field><Field label="Email" error={errors.email?.message}><input className="input input-bordered w-full" type="email" autoComplete="email" {...register('email')}/></Field></div><Field label="Subject" error={errors.subject?.message}><input className="input input-bordered w-full" {...register('subject')}/></Field><Field label="Message" error={errors.message?.message}><textarea className="textarea textarea-bordered min-h-36 w-full" placeholder="How can the MealMind team help?" {...register('message')}/></Field><button className="btn btn-primary w-full sm:w-auto" disabled={isSubmitting}>Send message</button></form></section></div></main>;
}

function Field({ label, error, children }: { label: string; error: string | undefined; children: React.ReactNode }) { return <label className="form-control"><span className="mb-2 font-semibold text-neutral">{label}</span>{children}{error && <span className="mt-1 text-sm text-red-600">{error}</span>}</label>; }
