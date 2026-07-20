export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
      <span className="loading loading-spinner loading-lg text-primary" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
