# Wednesday — Personal AI Assistant

Windows + Android personal workspace with a GPT-powered assistant backend.

## Included in this build
- Dashboard, tasks, projects, manual INR budget, wellbeing journal and personal notes
- Supabase email/password sign-in screen
- Authenticated server-side OpenAI Responses API endpoint
- Locally saved chat history and JSON backup
- Windows Electron and Android Capacitor packaging

## Required setup before online GPT works

Wednesday does not connect to a ChatGPT consumer subscription or use this chat's login. It calls the OpenAI API, which is a separate service and may incur usage charges. Since this app is being configured by a minor, a parent/guardian should review and manage the external developer account, billing and service agreements.

1. Create a Supabase project and enable email/password authentication.
2. Run `supabase/schema.sql` in the Supabase SQL Editor to create the private-memory table with Row Level Security.
3. Import this repository into Vercel and add these server environment variables:
   - `OPENAI_API_KEY` — secret OpenAI API key
   - `OPENAI_MODEL` — optional model override; default is `gpt-5.5`
   - `SUPABASE_URL` — Supabase project URL
   - `SUPABASE_ANON_KEY` — Supabase publishable/anon key
4. Add these frontend build variables in Vercel:
   - `VITE_SUPABASE_URL` — same Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — same publishable/anon key
   - `VITE_API_BASE_URL` — blank when the app and API share one Vercel domain
5. Redeploy after setting variables. The browser app will then show the email sign-in / create-account screen.

For local development, copy the public Supabase URL and publishable key into your local Vite environment file. Never put real secrets into a committed file.

## Security design
- `/api/chat` accepts only POST requests with a valid Supabase Auth access token.
- The server verifies the token with Supabase Auth before calling OpenAI.
- The OpenAI API key is server-only; the request sets `store: false`.
- The endpoint limits recent message count and message size.
- Supabase memory table policies restrict each signed-in user to their own rows.
- Do not place OpenAI keys, Supabase service-role keys, Gmail tokens, payment credentials or any secret in GitHub or a `VITE_*` variable. Vite variables are bundled into public client code.

## Build
Requires Node.js 20+.

    npm install
    npm run build

Windows installer: `npm run desktop:dist`

Android APK: `npm run build`, `npx cap sync android`, then build the debug APK with Android Studio / Gradle.

## Still to build
- Cross-device cloud chat and memory synchronisation (the database schema is a foundation; sync operations and UI are not connected yet)
- Gmail OAuth and read-only email summarisation
- Native secure token storage for Windows and Android
- No bank, UPI or broker connection is included. Never store UPI PINs, one-time codes, card credentials or brokerage passwords.
- No automatic phone screen-time monitoring.

## Privacy limits
No service can honestly guarantee that no provider ever processes information. OpenAI processes prompts sent to its API; Supabase handles sign-in and database hosting; Vercel hosts the backend. Wednesday currently sends the user's latest question and a limited selection of workspace context to OpenAI. Avoid entering passwords, one-time codes, UPI PINs, card details or sensitive account credentials in chat.
