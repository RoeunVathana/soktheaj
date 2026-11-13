import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://soktheajr.com';
const DEFAULT_IMAGE = `${SITE_URL}/site-logo.png`;
const THEME_COLOR = '#0a0a1a';

const Seo = ({
  title,
  description,
  keywords,
  canonicalUrl,
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  author = 'Sothea Chhum',
}) => {
  const fullTitle = title
    ? `${title} | Sothea Chhum`
    : 'Sothea Chhum | Full Stack Developer & Web Application Specialist';

  const fullDescription =
    description ||
    'Portfolio of Sothea Chhum — a passionate Full Stack Developer specializing in React.js, Laravel, Node.js, Express.js, MySQL, MongoDB, Tailwind CSS, Bootstrap, and REST APIs.';

  const canonical = canonicalUrl || SITE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Sokthea portfolio logo" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Sothea Chhum Portfolio" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* Article published time */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Theme Color */}
      <meta name="theme-color" content={THEME_COLOR} />
      <meta name="msapplication-TileColor" content={THEME_COLOR} />
    </Helmet>
  );
};

export default Seo;
