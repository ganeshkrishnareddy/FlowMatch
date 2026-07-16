# Cloudflare Response Caching Strategy

FlowMatch leverages static response headers to orchestrate edge caching on Cloudflare CDN.

## Cache Configuration Rules

1. **Fingerprinted JS/CSS Assets (`/assets/*`)**:
   * **Directive**: `Cache-Control: public, max-age=31536000, immutable`
   * **Explanation**: Vite appends unique chunk hashes to generated assets. These assets never change; long-lived immutable caching ensures near-instant subsequent loads.

2. **Metadata Chunk Files (`/data/indexed-workflows/*`)**:
   * **Directive**: `Cache-Control: public, max-age=3600, must-revalidate`
   * **Explanation**: Chunks holding workflow lists and indexes are checked for modifications but revalidated dynamically at the edge.

3. **HTML Index Bundle (`/index.html`)**:
   * **Directive**: Edge routing skips caching for `/index.html` (or configures `no-cache`) to ensure users always download the latest compiled asset pointers.

4. **Dynamic API Calls (Supabase)**:
   * Supabase connections pass directly to the API endpoints and bypass Cloudflare Pages static CDN caching entirely.
