---
name: Quizergo
description: A warm-paper exam desk for JAMB and WAEC practice, handed back marked in orange.
colors:
  marker: "oklch(0.7 0.19 48)"
  marker-deep: "oklch(0.65 0.19 41)"
  marker-ink: "oklch(0.55 0.17 38)"
  marker-wash: "oklch(0.98 0.02 74)"
  marker-tint: "oklch(0.95 0.04 75)"
  marker-line: "oklch(0.9 0.07 71)"
  marker-shade: "oklch(0.27 0.08 36)"
  paper: "oklch(0.99 0.01 75)"
  sheet: "oklch(1 0 0)"
  well: "oklch(0.96 0.015 75)"
  ink: "oklch(0.22 0.03 55)"
  ink-soft: "oklch(0.28 0.04 55)"
  ink-quiet: "oklch(0.52 0.03 55)"
  rule: "oklch(0.91 0.015 75)"
  answer: "#f8fafc"
  exam: "#0f172a"
  exam-deep: "#020617"
  exam-edge: "#1e293b"
  correct: "#059669"
  wrong: "#f43f5e"
  flag: "#f59e0b"
  destructive: "oklch(0.62 0.24 27)"
typography:
  display:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
  body:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  ui:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
  small:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
  eyebrow:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  sm: "9.6px"
  md: "12.8px"
  lg: "16px"
  xl: "22.4px"
  "2xl": "28.8px"
  "3xl": "35.2px"
  full: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
  section: "80–96px"
components:
  button-primary:
    backgroundColor: "{colors.marker}"
    textColor: "{colors.sheet}"
    typography: "{typography.ui}"
    rounded: "{rounded.xl}"
    padding: "0 24px"
    height: "44px"
  button-dark:
    backgroundColor: "{colors.exam}"
    textColor: "{colors.sheet}"
    typography: "{typography.ui}"
    rounded: "{rounded.xl}"
    padding: "0 20px"
    height: "40px"
  button-dark-hover:
    backgroundColor: "{colors.exam-edge}"
    textColor: "{colors.sheet}"
  button-outline:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.ui}"
    rounded: "{rounded.xl}"
    padding: "0 20px"
    height: "40px"
  input-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  input-field-auth:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.3xl}"
    padding: "0 16px"
    height: "48px"
  answer-option:
    backgroundColor: "{colors.answer}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.small}"
    rounded: "{rounded.2xl}"
    padding: "14px 16px"
  answer-option-selected:
    backgroundColor: "{colors.marker-wash}"
    textColor: "{colors.marker-shade}"
  sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  slab:
    backgroundColor: "{colors.exam}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.3xl}"
    padding: "32px"
  subject-chip:
    backgroundColor: "{colors.marker-wash}"
    textColor: "{colors.marker-ink}"
    typography: "{typography.small}"
    rounded: "{rounded.lg}"
    padding: "6px 10px"
  nav-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-quiet}"
    typography: "{typography.ui}"
    padding: "0"
    height: "56px"
---

# Design System: Quizergo

## Overview

**Creative North Star: "The Marked Script"**

Quizergo looks like the paper you get back: warm off-white stock, cool slate printing, and orange pen marks in the margin. The page is quiet so the question is loud. Everything is built to be read on a phone under time pressure — one question in view, four answers within thumb reach, the countdown inside the bar — and the marking is honest: correct in green, wrong in rose, skipped in quiet ink, never softened.

The system lives in two rooms. The **study room** is light: Paper ground, Sheet cards, Ink typography, 1px Rule borders, generous rounding, and grouping by ruled lines rather than by stacked cards. The **exam room** is Exam Slate, used for the moments that carry weight — the auth shell, the setup header band, the returned score slab, the closing CTA, the submit dialog. Orange is the marker, not the paint: it appears in headings' accent words, active states, selected answers, progress fills, and small chips, and it never becomes a large field.

Craft here is calm precision, not decoration. One typeface; hierarchy from size, weight and tracking. Depth is a hairline plus a whisper of contact shadow. The only expressive gestures are large corner radii, blurred orange glows inside dark rooms, a faint printed grid that fades toward the edges, and long ruled lists that read like an index or a mark book.

**Key Characteristics:**
- Warm Paper ground, cool Slate ink: warm surface, cool text.
- Named tokens (`paper`, `sheet`, `well`, `ink`, `rule`, `marker`, `exam`) rather than raw Tailwind colour steps.
- Two-surface rhythm: light working screens; Exam Slate for the four signature moments.
- Ruled-line composition: `border-t` / `border-b` lists and divided cells replace card grids.
- Generous rounding (12.8px floor, 28.8–35.2px for cards, slabs and auth fields).
- Flat at rest; elevation appears only as state, or on the hero artefact.
- Single typeface (Poppins, weights 400–700 only); hierarchy from size, weight and letter-spacing.
- Numbers are tabular everywhere they change or compare.

## Colors

A warm near-white paper ground carries one orange family, six steps of slate-and-paper neutral, and three grading colours. The orange ramp is fitted to the mobile app's brand colour, so the two clients read as one product.

### Primary
- **Marker** (`oklch(0.7 0.19 48)`): the brand accent and the "Go" in the wordmark. Primary buttons, focus rings, progress fills, active nav underlines, selected answer borders, and one accent word per headline. Small area, high meaning.
- **Marker Deep** (`oklch(0.65 0.19 41)`): the readable orange for a display-size accent word; hover for orange buttons (rendered at 80% opacity, not darkened).
- **Marker Ink** (`oklch(0.55 0.17 38)`): orange text on Paper at small sizes — eyebrows, links, active nav labels, icon accents. This is the workhorse orange for type.
- **Marker Wash / Marker Tint / Marker Line** (`oklch(0.98 0.02 74)` / `oklch(0.95 0.04 75)` / `oklch(0.9 0.07 71)`): the three-step orange backdrop for selected answer rows, subject chips, the dashboard's average cell, and hairlines on orange surfaces. Tinted, never saturated.
- **Marker Shade** (`oklch(0.27 0.08 36)`): deep orange-brown for text sitting on a wash, so orange-on-orange still passes contrast.

### Neutral
- **Paper** (`oklch(0.99 0.01 75)`): the global page ground. Warm, faintly cream; never pure white and never a cool grey.
- **Sheet** (`oklch(1 0 0)`): cards, forms, dialogs, list surfaces — the sheet laid on the paper.
- **Well** (`oklch(0.96 0.015 75)`): inset wells, quiet chips, skeleton blocks, secondary panels inside a sheet.
- **Ink** (`oklch(0.22 0.03 55)`): headings, primary values, question text.
- **Ink Soft** (`oklch(0.28 0.04 55)`): secondary copy, list titles, button labels on light surfaces.
- **Ink Quiet** (`oklch(0.52 0.03 55)`): captions, metadata, helper text, inactive icons — the only muted text tone.
- **Rule** (`oklch(0.91 0.015 75)`): every border, divider, list separator and input stroke on light surfaces.
- **Answer** (`#f8fafc`): the one cool-tinted fill, used only under an unselected answer row.
- **Exam** (`#0f172a`): the dark room — auth shell, setup header band, score slab, CTA band, dark actions.
- **Exam Deep** (`#020617`): the deepest layer, behind scrims and the auth imagery.
- **Exam Edge** (`#1e293b`): hover for dark actions and the lighter end of a dark gradient.

### Semantics
- **Correct Green** (`#059669`; `emerald-50` fills, `emerald-400` on dark): correct answers, verified notices, score bars in the marking.
- **Wrong Rose** (`#f43f5e`; `rose-50` fills): wrong answers, field errors, the urgent countdown, failed submits.
- **Flag Amber** (`#f59e0b`; `amber-50`/`amber-200`): questions flagged for review and unanswered-paper warnings.

### Named Rules
**The Warm Paper Rule.** The ground is warm and the ink is cool. Never a cool grey page background; never a warm grey as body text.

**The Marker Rule.** Orange covers less than roughly a tenth of any screen. It marks — a border, an underline, a chip, a progress fill, one accent word — and never becomes the background of a large panel. When a surface needs weight, use Exam Slate.

**The Grade-Colour Rule.** Green, rose and amber mean correct, wrong and flagged. They are never decorative, and nothing is graded with orange.

**The Named-Token Rule.** Style with `paper`, `sheet`, `well`, `ink`, `rule`, `marker`, `exam`, `answer`. Reach for the `primary-*` ramp only inside a tint or glow, never for layout colour.

## Typography

**Display Font:** Poppins (variable `--font-poppins`, with `ui-sans-serif, system-ui`)
**Body Font:** Poppins (same family, lighter weight)
**Label Font:** Poppins, uppercase and tracked

**Character:** One geometric-humanist sans for the whole product: friendly enough for a student, disciplined enough for an exam hall. Personality comes from tight, semibold headings against loose, quiet body copy — never from a second family. Weights loaded: 400, 500, 600, 700.

### Hierarchy
- **Display** (600, 3.5rem at `lg`, 1.04 line-height, `-0.03em`): hero headline. Short declarative sentences, often three lines, the last in Marker Deep.
- **Headline** (600, 2.75rem at `lg` / 2rem mobile, 1.1 line-height, `-0.025em`): marketing section titles, page titles, setup and dashboard headings (2rem–2.5rem). Statement plus full stop.
- **Title** (600, 1.0625rem, `-0.01em`): card and panel headings, list titles, result section headings.
- **Lead** (400, 0.9375rem, 1.75): marketing and legal reading copy; capped around 62–68ch.
- **Body** (400, 1rem, 1.7): question text and explanations, rendered through `.lesson` (max 68ch).
- **UI / Small** (400–600, 0.8125rem then 0.75rem): the default working sizes — nav, buttons, labels, chips, metadata. 600 for emphasis inside them; 700 is reserved for nothing but numerals on a dark slab.
- **Eyebrow** (`.eyebrow`, 600, 0.6875rem, 0.18em tracking, uppercase): section kickers, field labels, micro-metadata, the smallest step in the system. `eyebrow-quiet` adds Ink Quiet.
- **Numerals:** scores, percentages, timers, counts and dates get `tabular-nums` so digits do not jitter. There is no monospace voice in the product; the old mono timer is gone.

### Named Rules
**The One Voice Rule.** One typeface. If a block needs to stand out, change size, weight, colour or tracking — never add a font.

**The Sentence-Case Rule.** Headings are sentence case with a full stop. Only eyebrows, metadata and option letters are uppercase.

**The Eleven-Pixel Floor.** Nothing renders below 0.6875rem. If a label feels too big, reduce weight or colour, not size.

## Layout

One container system: `max-w-7xl` (80rem). Marketing bands use `px-6`; `PageWrapper` uses `px-4 sm:px-6 lg:px-8` with `py-8 sm:py-10`. The fixed header is 56px tall and every page beneath it starts at `pt-14`.

Marketing screens alternate full-width bands — Paper and Sheet — separated by `border-b border-rule`, each `py-20 lg:py-24`. Section headers use a two-column split (`1.1fr / 0.9fr`) with the supporting paragraph aligned to the right edge on `md`, and content below starts at 48px (`mt-12`). The features section is one Sheet panel with internal ruled divisions (`lg:grid-cols-12` with `border-r`/`border-b` splits) rather than separate cards.

App screens are narrower and denser: setup is a `max-w-5xl` two-column grid (`1fr / 27rem`) with the explanation aside hidden below `lg`; the result breakdown is `max-w-3xl`; dashboard and quiz question are `max-w-7xl` and `max-w-5xl` respectively. The dashboard's recent papers is a `1.6fr / 1fr` split on `lg`. Auth is a single `min-h-dvh` screen inside `max-w-7xl`, split `1.05fr / 0.95fr`, with the brand panel hidden below `lg` and the form card capped at `max-w-md`.

Vertical rhythm is a 4px base with a short working set: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48. Cards use 20–24px internal padding; list rows use 14–20px vertically; section gaps run 40–64px. Breakpoints are Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280), mobile-first, with `lg` doing the heaviest work (two-column splits, auth aside, quiz sidebar) and `md` collapsing the nav.

## Elevation & Depth

Depth is ambient, not structural. Light surfaces are separated by a 1px Rule hairline and, at most, a 1px contact shadow (`shadow-xs` on primitives). Real lift appears in four places only: the hero's paper artefact (`0 2px 4px rgba(15,23,42,0.04), 0 24px 60px -24px rgba(15,23,42,0.28)`), its floating score card (`0 18px 40px -20px rgba(15,23,42,0.35)`), the auth form sheet floating on the dark room (`0 24px 60px -24px rgba(2,6,23,0.85)`), and the calculator (`shadow-xl`). Select popovers use `shadow-md` with a `ring-foreground/10` edge.

Coloured depth is the other half of the language: a blurred orange glow (`bg-primary-500/15`–`/25`, `blur-2xl`/`blur-3xl`) sits inside dark rooms and behind the hero; `.printed-grid` (64px, ink at 5%, masked to fade) and `.printed-grid-dark` (56px, white at 6%, masked to fade) make a surface feel like a printed sheet on a lit desk. Gradients are avoided; the only one is Exam → Exam Edge on dark hover states.

### Shadow Vocabulary
- **Contact** (`box-shadow: 0 1px 2px rgba(15,23,42,0.05)`): shadcn button/input/select primitives at rest.
- **Hero artefact** (`box-shadow: 0 2px 4px rgba(15,23,42,0.04), 0 24px 60px -24px rgba(15,23,42,0.28)`): the landing-page paper preview only.
- **Float** (`box-shadow: 0 18px 40px -20px rgba(15,23,42,0.35)`): the floating "Last paper" card.
- **Auth sheet** (`box-shadow: 0 24px 60px -24px rgba(2,6,23,0.85)`): the light form card in the dark auth room.
- **Popover** (`shadow-md`): select menus, plus a hairline ring.

### Named Rules
**The Flat-At-Rest Rule.** A Sheet card on Paper gets a 1px Rule border and no shadow. If you want `shadow-lg` on a white card, the card is wrong, not the shadow.

**The Hover-Only Lift Rule.** Elevation is a response to state: press a button (`active:scale-[0.98]` or `active:translate-y-px`); hover a list row to a `well/40` fill. Nothing floats permanently except the hero artefact, its card, the auth sheet and the calculator.

## Shapes

Rounded by default, generously. The theme radius is 16px, which yields 12.8px (`rounded-md`, primitives), 16px (`rounded-lg`, chips and option letters), 22.4px (`rounded-xl`, buttons, form fields, panels), 28.8px (`rounded-2xl`, `.sheet`, answer rows, list panels) and 35.2px (`rounded-3xl`, the setup card, auth form, result slab, marketing panels). Auth inputs push to a 35.2px pill; badges and avatars use `rounded-full` or `rounded-md`/`rounded-lg` tiles.

There is no sharp corner in product surfaces. Borders are 1px Rule hairlines (or `white/10`–`white/15` on Exam Slate). The only 2px stroke is the selected answer option's orange edge. Pills are reserved for counts, statuses and counters. Small square tiles of 28–40px (question number, option letter, icon) carry `rounded-lg`/`rounded-xl`; the question navigator uses one square shape in four states.

### Named Rules
**The No-Sharp-Corner Rule.** Every container is rounded; the floor is 12.8px and anything card-sized sits at 28.8–35.2px.

**The One-Shape Rule.** A repeated control keeps its silhouette across states. The question cell, the option letter tile and the chip change fill and border, never their corner.

## Components

### Buttons
- **Shape:** `rounded-md` (12.8px) on the shadcn primitive at 32–40px height; `rounded-xl` (22.4px) for hero CTAs, setup and the quiz's Previous/Next at 44px/40px. The auth submit is 44px with 22.4px radius.
- **Primary:** Marker fill, White label, 0.8125–0.875rem semibold. Hover drops the fill to 80% opacity rather than darkening; press nudges 1px.
- **Dark action:** inside the quiz flow and on app screens the primary action is Exam Slate with white text (`hover:bg-exam-edge`, `active:scale-[0.98]`). While a question is on screen, orange belongs to the selected answer, not the button.
- **Outline:** Sheet fill on a Rule stroke, Ink Soft label; hover fills with Well. On dark rooms it inverts to a `white/20` stroke over `white/5` with a `white/10` hover.
- **Ghost / text:** no chrome; hover fills with Well or shifts the label to Marker Ink. Text links use an underline at 4px offset with `decoration-marker-line`, thickening to Marker on hover.
- **Focus:** a 2px Marker ring at full strength on custom controls (`focus-visible:ring-2 ring-primary-500`), and a 3px ring at 50% on the shadcn primitives. Never remove it; never substitute cyan.
- **Disabled:** 40–50% opacity, pointer events off. Pending states swap the label for a spinner plus a verb ("Submitting…") and set `aria-busy`.

### Chips
- **Style:** subject pills are Marker Wash on a Marker Line border with Marker Ink at 0.75rem semibold, removable with a small ×; neutral chips are Well or Sheet on a Rule border; counts are `rounded-full` with tabular numerals.
- **State:** the flag toggle is the one interactive chip — Well at rest, `amber-50` + `amber-200` ring + Amber text when active, with `aria-pressed`. Selected subject tabs carry an Exam Slate underline and an Exam Slate count pill.

### Cards / Containers
- **Corner Style:** 28.8px (`.sheet`, `rounded-2xl`) for list panels, question panel, navigator and auth-adjacent cards; 35.2px (`rounded-3xl`) for setup, result, marketing panels, empty states and the auth form.
- **Background:** Sheet on Paper. Insets and secondary panels use Well. Entire sections may flip to Sheet to separate one marketing band from the next.
- **Shadow Strategy:** hairline only; see Elevation & Depth.
- **Border:** 1px Rule on light surfaces; `white/10` on dark ones. The shadcn `Card` uses `ring-1 ring-foreground/10` instead.
- **Internal Padding:** 20px for list panels and navigator; 24px for content panels; 24–32px for slabs; 28–40px for marketing panels.
- **Composition:** prefer one panel with internal 1px rules and divided cells over a grid of separate cards. The dashboard record strip is the canonical example: one `rounded-3xl` sheet, `divide-x divide-rule`, the middle cell filled with Marker Wash.

### Inputs / Fields
- **Style:** app selects and fields are 44px tall, `rounded-xl`, Sheet fill, Rule stroke, Ink text at 0.8125rem; the shadcn `Input` primitive is 36px, `rounded-md`, transparent on Rule.
- **Focus:** Marker border plus a 2px ring at 20% on custom fields (`focus-within:border-primary-400 ring-primary-500/20`); the primitive uses a 3px ring at 50%.
- **Error:** rose border plus rose ring or a `rose-50` banner; the message sits under the field at 0.75rem medium with `role="alert"` and `aria-describedby`.
- **Auth variant:** 48px tall, 35.2px pill, Sheet fill on Rule inside the dark room, leading icon in Marker Ink or Ink Quiet, placeholder in Ink Quiet.
- **Disabled:** 50% opacity, no hover.

### Navigation
- **Style:** fixed 56px bar, `bg-paper/90` with `backdrop-blur-xl` and a Rule bottom hairline. Wordmark left, links centred, auth controls right; the signed-in state adds "Mark book".
- **Links:** 0.8125rem medium, no pill. Rest is Ink Quiet; hover is Ink; active is Marker Ink with a 2px Marker underline flush to the bar's bottom edge.
- **Mobile:** below `md`, links collapse into a Sheet sheet under the bar (Rule separators, 0.9375rem rows, chevrons, body scroll locked, Escape to close, focus returned to the toggle, `inert` when closed) over an `exam-deep/30` scrim.

### Question Screen (signature)
A focused flow with no site chrome: a sticky `bg-paper/95` toolbar with the subject eyebrow, question count, timer, calculator and submit; a full-width 2px progress rule under the bar; one Sheet panel at 35.2px for the question; four answer rows.
- **Answer row:** 28.8px radius, 2px border, 16px horizontal / 14px vertical padding, a 28px letter tile. Unselected is Answer fill with a `slate-100` edge; hover lifts to Sheet on a `slate-200` edge. Selected is a `primary-400` edge on Marker Wash, the letter tile filled Marker with white type, the text stepping to `primary-950` at medium weight. `role="radio"` + `aria-checked`.
- **Timer:** a Well chip with a Rule edge at rest; inside the last five minutes it becomes `rose-50` / `rose-600` / `rose-200` with a pulsing alert icon. An untimed paper shows a quiet "Untimed" chip instead. Remaining time is derived from a stored deadline, so it cannot drift.
- **Time's up:** an `amber-50` alert strip (rose when the hand-in failed) above the question panel explains that the paper is locked and, on failure, offers "Try again" and "Mark book".
- **Navigator:** a Sheet panel of square cells. Untouched = Well + Ink Quiet; answered = Marker + white; flagged = Amber + Exam text; current = Exam + white with a 2px Exam ring and offset. One shape, four fills.

### Result Slab (signature)
A 35.2px Exam Slate slab on Paper, carrying `.printed-grid-dark` and one orange glow. It opens with a Marker-tinted eyebrow (`text-primary-300`) and a neutral white score arc — the ring carries no colour verdict. Correct/wrong/skipped counts sit in a three-up divided row, tinted `emerald-400` / `rose-400` / `white/50`. Below, the marking is a stack of Sheet sections divided by rules, with wrong and skipped rows open by default.

### Auth Shell (signature)
A full `min-h-dvh` Exam room: `.printed-grid-dark`, one off-canvas orange glow, the wordmark in `tone="paper"`, and a **light Sheet form card** floating at the right (35.2px radius, 24–32px padding, deep shadow). The left aside is typographic only — Marker-tinted eyebrow, a 2.5rem semibold white statement at `-0.03em`, a `white/50` blurb, then a ruled list of notes with Marker-tinted checks. Below `lg` the aside disappears and the card centres.

### Setup Panel (signature)
A light page with a lecture-style aside on the left (eyebrow, 2.5rem statement, numbered ruled steps) and a Sheet card at right (35.2px). The card opens with an Exam Slate header band (Marker-tinted eyebrow, white 1.25rem title, subject count in `white/50`), then a light form body with subject chips, two side-by-side selects, a live readout in a Well inset, and a full-width dark submit.

## Do's and Don'ts

### Do:
- **Do** start every screen on Paper and place Sheet panels on it with a 1px Rule border.
- **Do** style with the named tokens (`bg-paper`, `bg-sheet`, `text-ink`, `border-rule`, `bg-marker`, `bg-exam`), not raw colour steps.
- **Do** group with rules: `border-t`/`border-b` lists, `divide-rule` cells, and tabs with a 2px underline.
- **Do** keep orange under roughly 10% of the viewport: eyebrow, active underline, selected answer, one progress fill, one accent word.
- **Do** use Exam Slate for weight, reserved for the auth shell, setup header, result slab, CTA band and dark actions.
- **Do** round card-sized containers to 28.8–35.2px and keep a 12.8px floor on controls.
- **Do** set `tabular-nums` on every score, percentage, timer, count and date.
- **Do** keep app UI at 0.8125rem and reading copy at 0.9375–1rem; 600 for emphasis, 700 only for numerals on dark.
- **Do** use the tinted-pair pattern for state — `*-50` fill, `*-200` hairline, `*-700` text on light; `*-400` text with a `white/5` well on dark.
- **Do** show focus with a 2px Marker ring on custom controls and keep it visible everywhere.
- **Do** keep press feedback physical: `active:scale-[0.98]` on full-width CTAs, `active:translate-y-px` on primitives.

### Don't:
- **Don't** fill a large panel with Marker; dark rooms and blurred orange glows carry the weight instead.
- **Don't** use `slate-*`, `stone-*`, `gray-*`, `zinc-*` or arbitrary hex in new work. The remaining `slate-100`/`slate-200` answer edges and the unused Testimonials section are drift, not the system.
- **Don't** grade with orange. The result arc is neutral white; correct is emerald, wrong is rose, flagged is amber.
- **Don't** introduce a second accent hue for focus, hover or links. Marker is the only accent; `cyan-400` was retired.
- **Don't** add a second typeface, or use weights 300/800/900 — they are not loaded.
- **Don't** set a persistent drop shadow on a Sheet card, or stack cards where one ruled panel would do.
- **Don't** use `font-mono`; there is no monospace voice. Use Poppins with `tabular-nums`.
- **Don't** set type below 0.6875rem, or reach for `prose` classes where `.lesson` exists.
- **Don't** use `-500` Marker for small text on white; step to Marker Ink or Marker Deep for contrast.
- **Don't** square a corner, shrink a panel to `rounded-md`, or rely on colour alone to signal correct/wrong/flagged.
