export const siteConfig = {
  siteName: 'FlowMatch',
  siteUrl: import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'),
  siteDescription: 'Search thousands of ready-to-use n8n automation workflows and find the right template for your process.',
};
