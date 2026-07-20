import { Helmet } from 'react-helmet-async';

import defaultImage from '../../assets/image.png';
import { env } from '../../config/env';

const SITE_NAME = 'MealMind AI';
const DEFAULT_TITLE = 'MealMind AI | Smart Recipes and AI Meal Planning';
const DEFAULT_DESCRIPTION =
  'Discover recipes, save favorites, receive personalized recommendations, and plan meals with an Agentic AI assistant.';
const DEFAULT_KEYWORDS =
  'healthy recipes, personalized recipes, AI meal planning, meal recommendations, MealMind AI';

type PageMetaProps = {
  title?: string | undefined;
  description?: string | undefined;
  keywords?: string | undefined;
  canonicalPath?: string | undefined;
  image?: string | undefined;
  robots?: string | undefined;
};

const toAbsoluteUrl = (value: string, baseUrl: string) => {
  try {
    return new URL(value, `${baseUrl}/`).toString();
  } catch {
    return value;
  }
};

export const PageMeta = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath,
  image = defaultImage,
  robots = 'index,follow',
}: PageMetaProps) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const browserOrigin = typeof window === 'undefined' ? '' : window.location.origin;
  const baseUrl = (env.VITE_SITE_URL ?? browserOrigin).replace(/\/$/, '');
  const currentPath = canonicalPath ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  const canonicalUrl = baseUrl ? toAbsoluteUrl(currentPath, baseUrl) : undefined;
  const imageUrl = baseUrl ? toAbsoluteUrl(image, baseUrl) : image;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};
