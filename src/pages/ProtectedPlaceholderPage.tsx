import { PageIntro } from '../components/shared/PageIntro';

export function ProtectedPlaceholderPage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <PageIntro eyebrow={eyebrow} title={title} description={description} />;
}
