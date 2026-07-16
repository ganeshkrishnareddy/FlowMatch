# Cloudflare Pages Production Deployment Guide

Follow these steps to deploy **FlowMatch** statically to Cloudflare Pages.

## Project Setup on Cloudflare Pages Dashboard

1. **Create Project**:
   * Go to **Workers & Pages** in your Cloudflare dashboard.
   * Click **Create application** -> **Pages** -> **Connect to Git**.
   * Authenticate and select your **FlowMatch** repository.

2. **Configure Build Settings**:
   * **Framework preset**: `Vite`
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
   * **Root directory**: `/` (or root)

3. **Configure Build Environment Variables**:
   Add the following variables under **Settings** -> **Environment variables**:
   * `VITE_DATA_PROVIDER`: `supabase`
   * `VITE_SUPABASE_URL`: `<Your Production Supabase URL>`
   * `VITE_SUPABASE_ANON_KEY`: `<Your Production Supabase Anon/Publishable API Key>`
   * `VITE_SITE_URL`: `<Your production site domain (e.g., https://flowmatch.yourdomain.com)>`

## Preview Deployments
* Cloudflare Pages automatically creates unique preview deployment links for each pull request.
* Set custom variables for **Previews** separately if pointing to a staging database environment.

## SPA Routing & Custom Headers
* SPA fallback routing is configured dynamically in `public/_redirects` to route all page requests to the single-page HTML bundle.
* Custom response headers and security configs are defined in `public/_headers` ( nosniff, frame ancestors, and asset caching).
