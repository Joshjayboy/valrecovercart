DEPLOY-NETLIFY.md

Steps to deploy on Netlify:

1. Push changes to GitHub (main).
2. Go to Netlify dashboard -> New site -> Import from Git.
3. Select repo 'recover-cart'.
4. Build command: npm run build
   Publish directory: .next
5. In Site settings -> Environment -> Add keys found in .env.example
6. Deploy.
7. After live URL appears, set SHOPIFY_REDIRECT_URI to https://<site>/api/shopify/callback in Netlify env.
8. Add GitHub Actions secret PROD_URL = https://<site>
9. Monitor logs in Netlify (Site -> Functions & Site deploy logs).