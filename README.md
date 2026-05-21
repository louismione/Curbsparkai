# CurbSpark AI

CurbSpark AI is a small-business marketing app starter. It includes a polished public page, a working client-side generator demo, pricing, FAQ, and launch-ready Vite build scripts.

## Run Locally

```bash
npm install
npm run dev
```

## Build For Launch

```bash
npm run build
```

The production files will be created in `dist/`.

## Launch Checklist

1. Replace `hello@curbsparkai.com` in `src/main.jsx` with your real business contact details.
2. Connect payments with Stripe payment links or a full Stripe Checkout backend.
3. Add real AI generation through an API route or serverless function so your OpenAI API key never appears in browser code.
4. Deploy the app to Vercel, Netlify, Cloudflare Pages, or your preferred host.
5. Point your domain DNS to the host and enable HTTPS.
6. Add analytics, privacy policy, terms, and customer support details before paid launch.

## Simple Payment Setup

The easiest first launch uses Stripe Payment Links. Create one subscription payment link for each paid plan, then paste each URL into `paymentLinks` in `src/main.jsx`.

Recommended first links:

- Starter: `$19/month`
- Pro: `$49/month`
- Business: `$99/month`

Keep the Free plan as an email/contact flow unless you want to build accounts before launch.

## Go Live Steps

1. Create a Stripe account and finish business verification.
2. In Stripe, create products and recurring monthly prices for Starter, Pro, and Business.
3. Create one Payment Link per paid plan.
4. Paste those URLs into `paymentLinks` in `src/main.jsx`.
5. Build the app with `npm run build`.
6. Deploy the project to Vercel or Netlify.
7. Connect your domain in the hosting dashboard.
8. Test every pricing button with Stripe test mode first, then switch to live links.

## Recommended Production Stack

- Frontend: Vite and React
- Hosting: Vercel or Netlify
- Payments: Stripe
- Auth and saved business profiles: Supabase
- AI backend: serverless API route using OpenAI
