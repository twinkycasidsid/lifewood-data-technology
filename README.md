# Lifewood Website Project

## Env Setup

Use separate environments for frontend local development, Vercel production, and Railway backend.

Frontend local:

1. Copy [.env.example](./.env.example) to `.env`
2. Fill in the real values
3. For local backend development, use:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SCREENING_URL=http://localhost:5173/pre-screening
```

4. For local frontend against deployed Railway backend, use:

```env
VITE_API_BASE_URL=https://your-railway-domain.up.railway.app
VITE_SCREENING_URL=http://localhost:5173/pre-screening
```

Vercel production:

- Do not upload `.env`
- Set these only in Vercel Environment Variables:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_EMAILJS_TEMPLATE_ID_PRESCREENING=...
VITE_EMAILJS_TEMPLATE_ID_FOLLOWUP=...
VITE_API_BASE_URL=https://your-railway-domain.up.railway.app
VITE_SCREENING_URL=https://lifewood-global.vercel.app/pre-screening
VITE_SUPABASE_RESUME_BUCKET=resumes
```

Railway backend:

- Do not use `VITE_` variables
- Set these only in Railway Variables:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
FRONTEND_ORIGIN=https://lifewood-global.vercel.app
PORT=5000
```

## Run Locally

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run server
```
