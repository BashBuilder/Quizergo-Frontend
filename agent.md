Instructions for AI coding agents (and humans) working in this repository.
Read this fully before changing anything. Follow the structure and principles
below when adding or modifying features.

<!-- BEGIN:nextjs-agent-rules -->

## ⚠️ This is NOT the Next.js you know

This project uses **Next.js 16** and **React 19**. APIs, conventions, and file
structure may differ from your training data. **Before writing any Next.js
code, read the relevant guide in `node_modules/next/dist/docs/`** and heed
deprecation notices (for example, check the docs for how request interception
is named in this version before adding any `middleware`-style file).

<!-- END:nextjs-agent-rules -->

> The repo already contains `AGENTS.md` (the Next.js warning above) and
> `CLAUDE.md` (`@AGENTS.md`). Keep that block intact. If your tooling loads
> `AGENTS.md` only, copy this file's contents under that block or reference
> this file from it.

---

## 1. What this project is

The web client for **Quizergo**, an exam-practice app (JAMB/WAEC-style subjects).
Visitors browse subjects on public marketing pages; users register, verify with
an emailed OTP, log in, configure a timed quiz session, take it, see a graded
breakdown, and view their history on a dashboard.

It is a pure client of the **Quizergo Backend** (Express API, `api/v1`). It has
no database and no server-side business logic. **The backend is the source of
truth** for questions, grading, and results; the frontend must never grade a
quiz or hold correct answers before submission.

## 2. Tech stack

| Concern          | Choice                                                                               |
| ---------------- | ------------------------------------------------------------------------------------ |
| Framework        | Next.js 16 (App Router), React 19, TypeScript (strict)                               |
| Styling          | Tailwind CSS v4 (`@import "tailwindcss"` in `app/globals.css`, no config)            |
| UI primitives    | shadcn (`base-vega` style) on **`@base-ui/react`** (not Radix), `lucide-react` icons |
| Server state     | TanStack Query v5                                                                    |
| HTTP             | axios (single configured instance in `config/axios.ts`)                              |
| Forms/validation | react-hook-form + `@hookform/resolvers/zod` + Zod 4                                  |
| Toasts           | sonner                                                                               |
| Rich content     | react-markdown + remark-math + rehype-katex/raw/sanitize (`LessonContent`)           |
| Theming          | CSS variables (brand orange `#f97316` as `--primary`), Poppins font                  |
| Deploy target    | Cloudflare Pages (`@cloudflare/next-on-pages` is installed)                          |
| Package manager  | pnpm, Node 22 (`.nvmrc`)                                                             |

## 3. Commands

```bash
pnpm install
pnpm dev        # next dev (http://localhost:3000)
pnpm build      # next build
pnpm start      # next start
pnpm lint       # eslint (next core-web-vitals + typescript)
```

There is **no test runner configured** yet. Until one is added, `pnpm lint` and
`pnpm build` (which type-checks) are the verification steps.

Add shadcn components with the shadcn CLI (config in `components.json`,
aliases `@/components`, `@/components/ui`, `@/lib`, `@/hooks`).

## 4. Environment

| Variable              | Purpose                              | Default                        |
| --------------------- | ------------------------------------ | ------------------------------ |
| `NEXT_PUBLIC_API_URL` | Backend base URL including `/api/v1` | `http://localhost:4000/api/v1` |

Put values in `.env.local` (git-ignored via `.env*`). Never read or commit env
files. Anything prefixed `NEXT_PUBLIC_` is exposed to the browser, so **never
put secrets in it**. Read env vars in one place (`config/`), not scattered in components.

## 5. Project structure

```
app/
  layout.tsx            # root: font, <QueryProvider>, <AuthProvider>, <Toaster>
  globals.css           # Tailwind v4 + theme tokens (primary-50..950, shadcn vars)
  not-found.tsx
  (main)/               # PUBLIC marketing: /, /subjects, /terms, /privacy, /cookies  (Header + Footer)
  (auth)/               # PUBLIC auth: /login, /register, /confirm, /forgot-password  (Logo only)
  (app)/                # AUTHENTICATED shell with Header: /dashboard, /study (wrapped in <RequireAuth>)
  (quiz)/               # AUTHENTICATED, no header: /setup, /quiz, /result (wrapped in <RequireAuth>)
components/
  ui/                   # shadcn primitives (button, card, input, select, ...). Generated; edit sparingly
  global/               # app-wide shared components (Header, Footer, Logo, PageWrapper, RequireAuth, InputGroup, LessonContent)
  Homepage/             # landing-page sections
config/                 # axios.ts (instance + interceptors), queryClient.ts
hooks/                  # auth.tsx (AuthProvider/useAuth), queryClientProvider.tsx
services/               # API layer: *.service.tsx (functions + React Query hooks)
lib/                    # utils.ts (cn), token-storage.ts (SSR-safe localStorage)
data/                   # constants (subjects, nav links, auth storage keys)
__types__/              # ambient global types (User, Subject, QuestionType)
public/                 # static assets
```

Route groups (parenthesised folders) decide **layout and auth behavior, not URLs**.
Pick the group by what the page needs:

| Need                                  | Put the page in |
| ------------------------------------- | --------------- |
| Public page with header + footer      | `(main)`        |
| Login/register/OTP style screen       | `(auth)`        |
| Logged-in page with the site header   | `(app)`         |
| Focused logged-in flow without header | `(quiz)`        |

Colocate page-specific pieces next to the page (`app/(quiz)/quiz/timer.tsx`,
`submitModal.tsx`, `constants.ts`). Move something to `components/global/` only
once a second page needs it.

## 6. How the app works today

**Providers (root layout):** `QueryProvider` (singleton `queryClient`) wraps
`AuthProvider` wraps pages, with a global `<Toaster>`.

**Auth.** `AuthProvider` (`hooks/auth.tsx`) exposes `useAuth()` with
`user`, `isLoading`, `isAuthenticated`, `login`, `register`, `verifyOtp`,
`resendOtp`, `forgotPassword`, `resetPassword`, `logout`. Tokens
(`quizergo_token`, `quizergo_refresh_token`; keys in `data/auth.constants.ts`)
are stored in `localStorage` through `lib/token-storage.ts`, which is SSR-safe.
`/auth/me` is fetched through React Query (`["auth","me"]`) only after a token
is detected on the client. `<RequireAuth>` refetches on navigation and
`router.replace("/login")` when unauthenticated.

**HTTP.** `config/axios.ts` configures the global axios instance:

- base URL from `NEXT_PUBLIC_API_URL`;
- request interceptor adds `Authorization: Bearer <token>` except for auth endpoints;
- response interceptor on `401` performs a **single shared refresh**
  (`/auth/refresh`), retries the original request once, otherwise clears the
  session, toasts, and redirects to `/login`.
  Always import axios from `@/config/axios`, never from `"axios"` directly in
  feature code (except for `axios.isAxiosError`, which is re-exported through the same default import).

**Quiz flow.**

1. `/setup` (react-hook-form + Zod) → `POST /quiz` with `{ subjects, questionCount, duration }`.
2. Session JSON is saved to `sessionStorage["quizSession"]` (+ `quizDuration`), stale snapshot keys are cleared, then `router.push("/quiz")`.
3. `/quiz` resolves one deadline from `session.expiresAt` (epoch seconds, epoch ms or ISO; `0`/absent duration = untimed) and persists it as `quizDeadline`. Answers and flags are mirrored to `quizAnswers`/`quizFlags`, so a refresh restores the paper and the clock instead of resetting them. Every 30s `PATCH /quiz/:sessionId/sync` with only changed answers.
4. The clock is derived from the deadline, never from a ticking counter, so background throttling cannot make it drift. At zero the rows lock, a "Time's up" banner appears, and the paper auto-submits. Submit (`POST /quiz/:sessionId/submit` with all answers) is guarded against double-sends; a failure keeps the paper on this device and offers a retry. The response is saved to `sessionStorage["quizResult"]` and `/result` renders the breakdown.
5. `/dashboard` uses `GET /user/history` (`useGetQuizHistory`) and `GET /questions/subjects` (`useGetSubjects`).

## 7. Architecture rules

Data flow is always:

```
page / component  ->  hook (useQuery / useMutation) in services/  ->  axios instance (config/axios.ts)  ->  backend
```

1. **Components never call axios directly for new work.** Put the request in
   `services/<feature>.service.tsx` and expose it as a typed function and/or a
   React Query hook. (The setup and quiz pages currently call axios inline;
   that is legacy, so move those calls into `services/quiz.service.tsx` when you touch them.)
2. **Reads use `useQuery`; writes use `useMutation`.** Choose stable,
   hierarchical query keys (`["quiz","history"]`, `["subjects"]`,
   `["questions", params]`) and invalidate related keys after a mutation.
3. **Server vs client components.** Default to Server Components for static
   content (e.g. the legal pages, landing sections). Add `"use client"` only
   to the smallest component that needs state, effects, browser APIs, or
   hooks. Anything using `useAuth`, React Query, `sessionStorage`, or form state is a client component.
4. **Pages that read `useSearchParams` must be wrapped in `<Suspense>`**
   (see `login/page.tsx` → `login-content.tsx`); keep `page.tsx` a thin server wrapper and put the client logic in `*-content.tsx`.
5. **Auth gating** goes through route-group layouts with `<RequireAuth>`. Do
   not hand-roll auth checks inside pages. Remember this is client-side
   gating only; the backend must enforce authorization on every API call.
6. **Shared types.** Backend-shaped types used in many files live in
   `__types__/index.d.ts` (global ambient). Types used by one feature stay in
   that feature's service/page file and **mirror the backend response exactly**.
7. **Constants/static data** go in `data/` (global) or beside the page (local).
   Do not inline large arrays in components.

## 8. How to add a new feature (checklist)

Example: a "Leaderboard" page for logged-in users.

1. **Confirm the backend contract first.** Check the backend routes/models
   (`/api/v1/...`) for the exact path, method, params, and response shape.
   If the endpoint doesn't exist, say so instead of inventing one.
2. **Types** — add/extend the response type next to the service (or in
   `__types__` if shared). Mirror field names and nullability exactly.
3. **Service** — `services/leaderboard.service.tsx`: a typed `useQuery` hook
   (or `useMutation`) using the shared axios instance. Map errors to readable
   messages (the existing `extractMessage` pattern in `auth.service.tsx`).
   Set `enabled` when the query depends on auth (`useAuth().isAuthenticated`).
4. **Page** — create `app/(app)/leaderboard/page.tsx` (authenticated, with
   header) or the right group per §5. Wrap content in `PageWrapper`.
5. **States** — always handle loading (use `Skeleton`/spinner), error (with a
   retry action), and empty states. See `dashboard/page.tsx` for the pattern.
6. **Forms** — react-hook-form + Zod resolver; show field errors with
   `role="alert"`, a server error banner, and a disabled/`aria-busy` submit button while pending.
7. **Navigation** — add the link to `data/constants.ts` (`links`) / `Header.tsx` if it is top-level.
8. **Reuse** — look in `components/ui` and `components/global` before building a new primitive. Use `cn()` for class merging.
9. Run `pnpm lint` and `pnpm build`; fix everything you introduced.

### Conventions

- **Files:** pages are `page.tsx`; extracted client bodies `<name>-content.tsx`;
  components `PascalCase.tsx`; services `<feature>.service.tsx`; hooks `camelCase` under `hooks/`.
- **Imports:** use the `@/` alias (`@/components/ui/button`), not long relative paths (except colocated siblings).
- **Components:** function components, default export for pages/components, named exports for hooks/utilities. Props typed with an interface/inline type.
- **Class names:** Tailwind utilities, merged with `cn()`. Prefer theme tokens (`bg-primary`, `text-primary-600`) over hard-coded hex colors.
- **Icons:** `lucide-react`, decorative icons get `aria-hidden="true"`.
- **Links:** use `next/link` / `useRouter` for internal navigation, not `<a href>`.
- **Images:** `next/image`; remote hosts must be allowed in `next.config.ts` (`images.remotePatterns`) before use.

## 9. Frontend principles

**Security**

- Never render raw HTML from the API. All question/solution content goes through
  `LessonContent`, which sanitizes (`rehype-sanitize`) and renders KaTeX. Do not
  bypass it with `dangerouslySetInnerHTML`.
- Never log or display tokens. Bearer tokens currently live in `localStorage`
  (XSS-exposed by design); do not widen that exposure, and do not store any
  other sensitive data client-side.
- Never store or request correct answers client-side before submission; grading is server-only.
- Do not add secrets to `NEXT_PUBLIC_*`.

**Data & state**

- Server data belongs in React Query, **not** `useState`/`useEffect` + fetch.
  Local `useState` is for UI state (open/closed, current question).
- Do not duplicate server state into context. `AuthProvider` is the only global app context; add another only with a strong reason.
- Be deliberate with `staleTime`/`retry`; static data (subjects) can be long-lived, user data (history, me) should stay fresh.
- `sessionStorage` is used to hand the quiz session and result between pages. It is lost
  on refresh/new tab, so read it defensively (`typeof window` checks, `try/catch` on `JSON.parse`) and show a recovery path when empty.

**Errors & UX**

- Surface backend errors via `error.response.data.message` (backend errors are `{ success:false, message, code }`) and show with `toast.error` or an inline banner.
- Every async action: disable the trigger and show progress while pending.
- Never leave a blank screen: loading, error, and empty states are required.

**Accessibility**

- Every input has a `<label htmlFor>`; errors use `role="alert"` and `aria-describedby`/`aria-invalid`;
  icon-only buttons need `aria-label`; toggles use `aria-expanded`; keep visible focus rings; don't rely on color alone.

**Performance**

- Keep client components small; keep large static content (legal pages, landing) as Server Components.
- Memoize only where it measurably helps. Clean up timers/intervals/listeners in `useEffect`.
- Use `next/image` with explicit sizes and `priority` only for above-the-fold images.

**TypeScript**

- `strict` is on. Avoid `any` (existing `catch (error: any)` with an eslint-disable is legacy; prefer
  `unknown` + `axios.isAxiosError`). No `@ts-ignore`; justify any `@ts-expect-error`.

**Styling**

- Tailwind v4: theme tokens are defined in `app/globals.css` under `@theme inline`/`:root`. Add new tokens there, not in a config file.
- Design language: brand orange primary, slate neutrals, large rounded corners (`rounded-2xl/3xl`), light surfaces for app pages, dark slate for auth. Match the surrounding page.
- Mobile first; check small screens (`max-sm:`) for anything you build.

## 10. Backend contract reference

Base: `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api/v1`). Auth header: `Authorization: Bearer <accessToken>`.

| Method | Path                      | Auth | Notes                                                       |
| ------ | ------------------------- | ---- | ----------------------------------------------------------- |
| POST   | `/auth/register`          | no   | body: email, firstName, lastName, password, confirmPassword |
| POST   | `/auth/verify`            | no   | body: email, otp                                            |
| POST   | `/auth/login`             | no   | returns `{ accessToken, refreshToken, user }`               |
| POST   | `/auth/refresh`           | no   | body: `{ refreshToken }` → new tokens                       |
| GET    | `/auth/me`                | yes  | returns `{ user }`                                          |
| POST   | `/auth/logout`            | yes  |                                                             |
| POST   | `/auth/forgot-password`   | no   | body: email                                                 |
| POST   | `/auth/reset-password`    | no   | body: email, otp, newPassword, confirmPassword              |
| GET    | `/questions/subjects`     | no   | list of subjects                                            |
| POST   | `/quiz`                   | yes  | body: subjects[], questionCount, duration → session         |
| PATCH  | `/quiz/:sessionId/sync`   | yes  | body: `{ answers: [{ subject, answers: {id: "a"} }] }`      |
| POST   | `/quiz/:sessionId/submit` | yes  | same body → graded result (rate-limited: 1 per 10s)         |
| GET    | `/user/history`           | yes  | array of past `QuizResult` rows                             |

Rate-limited endpoints return `429`; surface the message instead of retrying in a loop.
Keep this table in sync when the backend changes.

## 11. Working principles for agents

- **Read before you write.** Find the closest existing page (`setup`, `dashboard`,
  `login` are good references) and mirror its structure.
- **Smallest correct change.** Don't reformat or refactor unrelated files. Mention
  nearby problems rather than silently fixing them.
- **Don't touch:** `components/ui/*` internals without need, `pnpm-lock.yaml`
  (except through pnpm), `.env*`, generated files (`.next/`, `next-env.d.ts`).
- **Check the contract.** Never invent endpoints or response fields; verify against the backend.
- **Ask first** before: changing the auth/token storage approach, adding a new
  global provider or state library, adding dependencies, or changing the route-group structure.
- **Verify.** Run `pnpm lint` and `pnpm build` before declaring work done; say so if you couldn't.
- Keep the UI consistent with the existing design language and accessibility patterns above.

## 12. Known issues in the current codebase

Be aware of these; don't copy them into new code, and flag them when relevant.

1. **Dead/incorrect `useGetQuestions`** (`services/question.service.tsx`) calls
   `/questions/questions` (the backend route is `GET /questions`), force-appends `"english"`
   to the subjects, and the real quiz flow doesn't use it. Remove it or fix it before reuse.
2. **`resendOtp` targets `/auth/resend-otp`**, which the backend does not
   currently expose (the service comment says it is an assumption). The backend
   re-sends OTPs implicitly (e.g. login while unverified).
3. **Mock/placeholder data still in the tree:** `app/(app)/study/page.tsx` (hard-coded CS subjects),
   `app/(quiz)/quiz/constants.ts` (sample questions/meta), `app/(quiz)/setup/constant.ts` (`SUBJECTS`, `years`, `MODES`),
   `app/(quiz)/quiz/result.tsx` (empty file), and `data/constants.ts` `pricing`/`subjects` used by landing sections.
4. **Duplicate type definitions:** `result/page.tsx` redefines the backend result
   types locally, and `QuestionType` in `__types__` references an `Option` type
   that is not declared in this repo. Centralize the quiz types.
5. **Inline axios + `any` in pages** (`setup/page.tsx`, `quiz/page.tsx`) instead
   of service hooks; `sessionStorage` JSON is parsed without `try/catch`.
6. **Auth hardening gaps:** tokens in `localStorage`; auth gating is client-only
   (no server-side redirect), so protected pages flash a "Loading..." state; `RequireAuth` calls `refetch()` on
   every navigation. Don't make this worse; discuss before changing.
7. **Plain `<a href>`** is used for internal links on the login page (full reload); use `next/link`.
8. **Small bugs/leftovers:** `app/(quiz)/layout.tsx` renders a stray `;` after
   `<RequireAuth>`; `(main)/layout.tsx` nests `<main>` inside `<main>`; `InputGroup`
   ignores its `autoComplete` prop; `tsconfig.json` includes a stray `"app/(auth)/confirm"` entry; the
   login field is labelled "Email or Username" but the schema is email-only; `bash.exe.stackdump`
   and unused `public/*.svg` Next boilerplate are committed.
9. `config/axios.ts` decides "unprotected route" with `window.location.pathname.startsWith`
   (so `/` is special-cased), and accesses `window` inside the interceptor. Keep that
   code browser-only; never import it into Server Components.
10. **No tests.** Add a runner (Vitest + Testing Library, Playwright for the quiz flow)
    before relying on automated verification, and update this file when you do.
11. `opencode.json` is empty here; the backend repo's `opencode.json` points at
    `backend/agent.md` and `frontend/agent.md`. Place this file at the path your tooling expects.

---

_Keep this file current: when you introduce a new pattern, dependency, env var,
route group, or convention, update the relevant section in the same change._

End
