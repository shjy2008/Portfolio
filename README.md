# Junyi Shen Portfolio

Personal portfolio website built with Next.js and TypeScript.  
The site showcases software engineering, AI, and game development projects, with live integrations to containerized BERT and Computer Vision services exposed through FastAPI on Modal.

## Live Site

- [https://www.junyishen.com](https://www.junyishen.com)

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- CSS
- FastAPI integrations via Next.js API routes
- Modal (upstream model services)
- Vercel (frontend hosting)

## Features

- Responsive portfolio website with dedicated project sections
- Medical QA project showcase
- Search engine project showcase
- Game project showcase
- API proxy routes for BERT and CV services (keeps upstream endpoints/config on server side)

## Project Structure

- `src/app`: page routes and API route handlers
- `src/features`: feature-level UI (for example, Home)
- `src/components`: shared UI components
- `src/projects`: project showcase modules
- `lib/server`: server-side helpers (Modal base URLs and optional proxy auth headers)

## Routes

### Pages

- `/`: home page
- `/medical-qa`: medical QA project page
- `/search-engine`: search engine project page
- `/games`: games project page

### API Routes (Server-side Proxies)

- `GET /api/bert/health`
- `POST /api/bert/predict/[task]`
- `GET /api/cv/health`
- `POST /api/cv/classify`
- `GET /api/cv/generate`

These routes proxy requests to Modal-hosted backend services and return normalized responses to the frontend.

## Environment Variables

Create a `.env.local` file in the repository root:

```bash
MODAL_BERT_BASE_URL=https://your-bert-modal-endpoint
MODAL_CV_BASE_URL=https://your-cv-modal-endpoint

# Optional (recommended when Modal proxy auth is enabled)
MODAL_PROXY_KEY=your_modal_key
MODAL_PROXY_SECRET=your_modal_secret
```

Notes:
- `MODAL_BERT_BASE_URL` and `MODAL_CV_BASE_URL` are required.
- `MODAL_PROXY_KEY` and `MODAL_PROXY_SECRET` are optional, but recommended when using Modal proxy auth tokens.

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

- `npm run dev`: start local development server
- `npm run build`: production build
- `npm run start`: run production build locally
- `npm run lint`: run ESLint checks

## Deployment

- Frontend: Vercel
- Backend model services: Modal (containerized FastAPI services)

There is a disabled GitHub Actions workflow in `.github/workflows/deploy.yml` kept for future use.
