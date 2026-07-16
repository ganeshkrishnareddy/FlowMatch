import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
}

const BASE_URL = 'https://flowmatch.progvision.in';
const DEFAULT_TITLE = 'FlowMatch — Search 5,000+ n8n Workflow Templates';
const DEFAULT_DESCRIPTION = 'Discover 5,000+ verified n8n workflow templates. Search, compare, visualize, and deploy automation workflows with AI-powered matching, security analysis, and 300+ integrations.';

export default function SEOHead({ title, description, path }: SEOHeadProps) {
  const location = useLocation();
  const currentPath = path || location.pathname;
  const fullTitle = title ? `${title} | FlowMatch` : DEFAULT_TITLE;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = `${BASE_URL}${currentPath}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('name', 'description', fullDescription);
    updateMeta('property', 'og:title', fullTitle);
    updateMeta('property', 'og:description', fullDescription);
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('property', 'twitter:title', fullTitle);
    updateMeta('property', 'twitter:description', fullDescription);
    updateMeta('property', 'twitter:url', canonicalUrl);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [fullTitle, fullDescription, canonicalUrl]);

  return null;
}

export { SEOHead };
