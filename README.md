# Wednesday — Personal AI Assistant

Windows + Android personal workspace with a GPT-powered assistant backend.

## Included in this build
- Dashboard, tasks, projects, manual INR budget, wellbeing journal and personal notes
- Supabase email/password sign-in screen
- Authenticated server-side OpenAI Responses API endpoint
- Locally saved chat history and JSON backup
- Windows Electron and Android Capacitor packaging

## Free local mode and optional online GPT

Wednesday opens in **free local mode** without an API key, Supabase account, or paid subscription. Tasks, projects, manual money entries, wellbeing notes, saved notes and chat history are stored in this device's browser/app storage. The built-in local assistant is limited and is not a GPT model.

Online GPT is optional. Wednesday does not connect to a ChatGPT consumer subscription or use this chat's login. OpenAI API billing is separate, and ChatGPT Free does not automatically include API credits. Free API credits are only available when the API organization is specifically eligible and has an active credit grant; otherwise API calls can cost money. Do not add an API key or enable billing just to use local mode. Since this app is being configured by a minor, a parent/guardian must review and manage any external developer account, billing and service agreements.

To enable optional online GPT later:
1. Have a parent/guardian review and create/manage the required service accounts.
2. Create a Supabase project and enable email/password authentication.
3. Import this repository into Vercel and add server variables `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and (only if intentionally enabling paid/credited GPT) `OPENAI_API_KEY`. `OPENAI_MODEL` is optional; the backend default is `gpt-5.5`.
4. Add frontend build variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_BASE_URL` (leave the API base blank when the app and API share one Vercel domain).
5. Redeploy after setting variables. The sign-in screen is enabled only when Supabase is configured.

The Supabase schema in `supabase/schema.sql` prepares a private-memory table with Row Level Security; cloud memory synchronisation is not yet connected. For local development, never commit real secrets or place secret keys in `VITE_*` variables.

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
