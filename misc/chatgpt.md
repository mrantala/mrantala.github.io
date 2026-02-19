Great project — this is a very clean, well-scoped PWA idea. I’ll answer your three questions in a structured way and then suggest a practical architecture aligned with your requirements (mobile-first, local storage, accessibility, CSV import/export, charting).

1️⃣ Recommended Libraries & Tools

Since this is:

Portable Web App (PWA)

Local storage only

Mobile-first

Accessibility focused

Simple but attractive

I’d recommend keeping the stack lightweight and modern.

🧱 Core Stack
Framework

You have two good paths:

✅ Option A (Simplest + Lightweight)

Vanilla HTML + CSS + TypeScript

No frontend framework

Best if:

You want minimal dependencies

You’re comfortable structuring UI manually

You want maximum control

✅ Option B (Recommended for maintainability)

React (with hooks)

Or Svelte

Why?

Clear separation of views (your 4 screens map nicely to components)

State management is easier

Easier scaling later

For a small but structured app like this, I’d recommend React + Vite.

⚡ Build Tool

Vite

Fast

Simple

Great PWA support

Lightweight

📦 PWA Support

vite-plugin-pwa

Generates manifest

Service worker support

Offline capability

💾 Storage

Since you want local-only:

Option 1: localStorage (Simple)

Easy

Works fine for moderate datasets

Option 2 (Better Long-Term): IndexedDB

More scalable

Better performance with many entries

Use wrapper library:

idb

For a weight tracker, either is fine. I’d recommend IndexedDB via idb for clean structure and future-proofing.

📊 Charting

You want:

Trendlines

Time-based graphs

Averages

Best lightweight option:

✅ Chart.js

Simple

Mobile friendly

Supports trendline plugins

Accessible with customization

Alternative:

D3.js (powerful but overkill here)

Chart.js is the sweet spot.

📁 CSV Import/Export

Use Papa Parse

Very reliable CSV parser

Handles edge cases

Simple API

🎨 Styling

You want simple + attractive + accessible.

Two strong options:

Option A: Hand-written CSS (recommended)

CSS variables

Modern layout (Flexbox + Grid)

Custom design

Maximum control over accessibility

Option B: Utility framework

Tailwind CSS

Fast development

Easy mobile-first design

For a minimal app, I'd lean toward custom CSS with a small design system.

♿ Accessibility Tools

Semantic HTML

ARIA only where necessary

Test with:

Lighthouse

axe DevTools

2️⃣ Recommended Implementation Order

This is important. You want the foundation solid before UI polish.

Phase 1 — Data Model & Storage (No UI Polish Yet)

Define data model:

interface WeightEntry {
  id: number;
  date: string; // ISO format
  weight: number;
  comments?: string;
}


Implement:

Add entry

Edit entry

Delete entry

List entries

Persist to storage

Add unit handling (lbs/kg)

Add goal weight setting

👉 At this stage, no charts, no CSV, just core CRUD working.

Phase 2 — Basic UI Layout

Implement the 4-button layout

Responsive orientation detection (CSS media queries)

Create view routing:

Data

Chart

Settings

Info

Keep UI basic but functional.

Phase 3 — Charting

Daily weight chart

Moving average / trendline

Weekly/monthly/yearly aggregation logic

Goal weight overlay line

Make sure calculations are separate from rendering logic.

Phase 4 — CSV Import/Export

Export:

Convert entries to CSV

Trigger download

Import:

Parse CSV

Validate structure

Merge or overwrite option

Add validation:

Missing required fields

Incorrect date format

Invalid numbers

Phase 5 — PWA Features

Add manifest

Add service worker

Test installability

Offline testing

Phase 6 — Accessibility & Polish

Keyboard navigation

Focus states

Contrast ratio

Screen reader testing

Reduced motion support

3️⃣ Additional Information That Would Help

To give you more precise guidance, I’d want to know:

Technical Context

Are you using plain JS, TypeScript, or a framework?

What’s your experience level with:

PWAs

IndexedDB

Chart libraries

Do you plan to host it publicly?

Functional Decisions

Should entries be editable after creation?

Should deleting entries be allowed?

Should importing merge or overwrite existing data?

Do you want:

Rolling average (e.g., 7-day smoothing)?

BMI calculation?

Multi-user profiles on same device?

Data Volume Expectations

Roughly how many entries do you expect?

1 per day for years?

Multiple per day?

This affects storage decisions.

Architecture Recommendation (Clean & Scalable)

If I were designing this:

/src
  /components
  /views
  /storage
  /utils
  /charts
  /csv
  App.tsx


Keep:

Data logic separate from UI

Chart transformation logic separate from chart rendering

Storage abstracted behind a small API

My Overall Recommendation (Concise)

If you want the best balance of power + simplicity:

React + Vite

IndexedDB via idb

Chart.js

Papa Parse

Custom CSS

PWA plugin

Build:

Data layer first

Then UI skeleton

Then charts

Then CSV

Then polish

If you’d like, next we can:

Design the data storage layer

Sketch the responsive layout structure

Define chart calculation logic

Or choose the stack and scaffold the project step-by-step

What’s your preferred stack?



Excellent. Vanilla JS is a very good choice for this app — especially since you want it lightweight, portable, and long-lived.

Given:

✅ Vanilla JS

✅ Some PWA + IndexedDB experience

✅ 13+ years of historical data

✅ Editable + deletable entries

✅ CSV merge import

✅ Possible rolling averages

❌ No BMI

❌ No multi-user (for now)

Here’s a refined technical plan tailored to that.

1️⃣ Architecture Recommendation (Vanilla, Clean, Maintainable)

Even without a framework, structure matters.

Suggested Project Structure
/weight-tracker
  /css
  /js
    app.js
    router.js
    db.js
    storage.js
    charts.js
    csv.js
    stats.js
    ui.js
  index.html
  manifest.json
  service-worker.js


Keep responsibilities separated:

db.js → IndexedDB abstraction

stats.js → rolling averages, aggregation

charts.js → Chart.js setup

csv.js → import/export logic

router.js → view switching

ui.js → DOM rendering helpers

This keeps your vanilla app from becoming spaghetti.

2️⃣ Storage Strategy (Important with 13 Years of Data)

With 13 years of entries, assume:

1 entry per day → ~4,700 entries

2 per day → ~9,500 entries

That’s absolutely fine for IndexedDB.

Recommended: IndexedDB (not localStorage)

Use native IndexedDB or wrap it lightly yourself.

Database Design

Database Name: weightTrackerDB
Object Store: entries
KeyPath: id (autoIncrement: true)

Indexes:

date (non-unique)

Optional: date_weight compound index if needed later

Entry shape:

{
  id: 12345,
  date: "2026-02-18", // ISO yyyy-mm-dd
  weight: 185.4,
  comments: "Felt bloated",
  createdAt: 1708250000000,
  updatedAt: 1708250000000
}

Why ISO Dates?

Easy sorting

Easy filtering

No timezone confusion

Works perfectly in charts

3️⃣ Handling CSV Merge Import (Important Design Decision)

Since you’re merging:

During Import:

Parse CSV

Validate required fields (date, weight)

For each row:

Check if an entry exists with same date AND weight

If yes → skip

If no → insert

You may optionally allow:

"Merge but prefer imported"

"Skip duplicates"

"Replace same-date entries"

For now: merge + skip duplicates is cleanest.

4️⃣ Charting Strategy (Vanilla Friendly)

Use:

✅ Chart.js

Why:

Easy integration without framework

Canvas-based

Good performance with thousands of points

Supports plugins

You can compute rolling averages in stats.js and just pass final arrays to Chart.js.

5️⃣ Rolling Average / Median Strategy

Do not compute inside the chart.

Create pure functions:

function rollingAverage(data, windowSize) {}
function rollingMedian(data, windowSize) {}
function groupByWeek(data) {}
function groupByMonth(data) {}
function groupByYear(data) {}


This makes testing easy and keeps chart code clean.

6️⃣ Responsive Layout Strategy (Your 4 Button Design)

You described:

Portrait → buttons across top

Landscape → buttons along left

Use CSS only. No JS required.

Layout idea:
.app {
  display: flex;
  flex-direction: column;
}

@media (orientation: landscape) {
  .app {
    flex-direction: row;
  }
}


Buttons container:

Fixed size

Main content fills rest

This keeps it elegant and accessible.

7️⃣ Accessibility Strategy (From the Start)

Since you want high accessibility:

Use <button> elements (not divs)

Use <label for=""> properly

Use fieldset and legend

Ensure keyboard navigation works

Focus styles always visible

High contrast color scheme

Respect prefers-reduced-motion

Test with:

Lighthouse

Screen reader pass

Tab-only navigation

8️⃣ Recommended Implementation Order (Adjusted for You)

Because you have 13 years of data, I slightly adjust the order:

Phase 1 – Data Layer First

IndexedDB setup

CRUD operations

Sorting by date

Duplicate detection logic

Test with console before building UI.

Phase 2 – Basic UI Skeleton

4-button responsive layout

View switching (simple state variable)

Data entry form

Entry list with edit/delete

No charts yet.

Phase 3 – Import/Export

CSV export

CSV import (merge logic)

Error reporting

This lets you import your 13 years early and test performance.

Phase 4 – Stats Engine

Rolling average

Weekly/monthly/yearly aggregation

Unit conversion logic (lbs/kg switch)

Keep stats separate from charts.

Phase 5 – Charting

Daily weight

Rolling average overlay

Time range selection (7/30/90/all)

Averages chart

Phase 6 – PWA

Manifest

Service worker

Offline caching

Installability testing

Phase 7 – Polish

Animations

Goal weight line

Empty state screens

Error states

Info page with donation link

9️⃣ Future-Proofing for Multi-User (Without Building It Now)

Since you might support multi-user later:

Instead of:

entries store


Consider:

users store
entries store (with userId)


Even if you default to a single user.

That way, you won’t need a DB migration later.

1️⃣0️⃣ Performance Considerations

With ~5–10k records:

IndexedDB: fine

Chart.js: fine

Rolling average: fine

Weekly/monthly grouping: fine

Just avoid:

Recalculating everything on every keystroke

Rendering thousands of DOM rows (paginate if needed)

1️⃣1️⃣ One Design Decision You Should Make Now

Should the app:

A) Allow multiple entries per day
B) Only allow one entry per date

Since you mentioned “1 or more entries per day,” your structure should allow multiples.

If so:

Do not enforce unique date

Charts should average same-day entries

Summary (Tailored to You)

Use:

Vanilla JS

IndexedDB

Chart.js

Papa Parse (optional but helpful)

Custom CSS

PWA service worker

Build in this order:

DB

CRUD UI

CSV import

Stats engine

Charts

PWA polish

If you'd like, next we can:

Design the IndexedDB wrapper

Design the data entry screen UX

Design the chart logic

Or outline the CSV format spec for your 13-year import

What would you like to tackle first?