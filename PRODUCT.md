# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Students in Nigeria preparing for JAMB and WAEC, usually in their final secondary-school years, who study and practise on their own — mostly on a phone, between school, lessons and other commitments. They are the only confirmed audience. School and teacher workflows are not part of the product today.

## Product Purpose

Quizergo is a focused way to prepare for JAMB and WAEC. A student picks subjects, a question count and a time limit; the session runs against a countdown; answers sync while they work; submitting returns a server-graded result with a per-question breakdown and an explanation for every answer; the dashboard keeps the record of past sessions. Success means a candidate can sit a realistic timed paper on a phone in a few minutes and leave knowing exactly what they got wrong and why.

## Positioning

Exam-condition practice rather than casual quizzing: the subject mix, question count and time pressure of the real paper, graded on the server, with a full explanation attached to every question. Access is free today.

## Operating Context

- Nigerian exam preparation (JAMB and WAEC); currency references are in naira.
- Mostly mobile phones and small screens; connectivity can be interrupted, so in-progress answers sync and completed sessions persist in history.
- Browser only — no install, no app store; sign in and start a session.
- An account is required to practise; browsing subjects is public.
- Email is the account channel: OTP verification at registration and password reset by email.

## Capabilities and Constraints

- Public surfaces: landing page, subject browsing, terms, privacy, cookies.
- Account: register, email OTP verification, login, forgot/reset password.
- Practice: configure a session with one or more subjects, questions per subject and a duration; timed session with a countdown and an on-screen calculator; answers auto-sync every 30 seconds; submit for a graded result; dashboard history with aggregate stats.
- The backend (`api/v1`) is the source of truth. The client never receives correct answers before submission and never grades; grading is server-only and submission is rate-limited.
- Subjects are fetched from the backend; the 13-subject marketing list is display data.
- Free for everyone today. No billing exists in the app. The Starter/Pro/School pricing tiers and teacher-dashboard features found in marketing code are placeholders, not a live offer.
- Question-count claims in marketing data (e.g. "1,840 Questions") and the testimonials section are unverified placeholders; do not repeat them as established fact.
- Open: whether a paid model will launch, when, and in what form; whether school or teacher features will exist.

## Brand Commitments

- The product name appears as "Quizergo" and "QuizerGo"; contact addresses are support@quizergo.com and contact@quizergo.online.
- A mobile app is already shipped, and this web client's identity must stay consistent with it, including the brand orange primary inherited from it.
- No committed brand asset library exists in this repo beyond generated icons/favicons; the logo treatment is inherited, not to be invented.

## Evidence on Hand

- A running Next.js web client covering landing, auth, quiz setup/take/result, dashboard and legal pages.
- The backend contract recorded in `agent.md` §10 — routes, payload shapes, rate limits.
- Legal pages (terms, privacy, cookies) with an effective date of December 2024 and a published contact address.
- Absent: no real testimonials, case studies, user numbers, press, school references or verified question-bank metrics. Do not fabricate any.

## Product Principles

1. Exam conditions beat comfort: timing, subject mix and session shape should feel like the paper being prepared for.
2. The server owns truth: no correct answers client-side before submission, no client grading, no client-side score.
3. Every answer teaches: the explanation is part of the result, not a bonus.
4. Free access is the current promise: do not gate core practice behind payment until a model is confirmed.
5. Built for a phone on a patchy connection: a session must survive interruption and loss of view.

## Accessibility & Inclusion

No product-specific standard is confirmed. The codebase already follows baseline label/ARIA practice, but a target standard (for example WCAG 2.2 AA) is undecided.
