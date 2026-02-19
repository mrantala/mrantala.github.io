Copilot:

Libraries (Minimal Set)
1. Charting
- Chart.js
For line charts, averages, and trendlines.
2. CSV (optional)
- No library needed — your schema is simple enough to parse manually.
- If you want a helper: PapaParse (optional).
3. Date utilities (optional)
- Native Date + Intl is enough.
- If you want helpers: date-fns (optional).
4. Accessibility testing
- axe DevTools browser extension
- NVDA for screen reader testing
(No runtime libraries.)
That’s it — everything else is vanilla JS, HTML, and CSS.

🧭 Implementation Steps (Top-Level)
Phase 1 — App Shell
- Build SPA structure: nav bar + 4 views (hidden/shown).
- Add responsive layout (portrait = top nav, landscape = left nav).
- Add icons-only navigation with accessible labels.
Phase 2 — Data & Settings
- Implement storage module (localStorage wrapper).
- Build data entry form + entry list (add/edit/delete).
- Build settings view (units, goal weight, import/export).
Phase 3 — CSV Import/Export- Export entries → CSV.
- Import CSV → merge/replace entries.
Phase 4 — Charting- Integrate Chart.js.
- Add filter button for time ranges (7/12/30/90/custom).
- Add averages + trendline.
Phase 5 — Polish- Accessibility pass (labels, focus, contrast).
- Visual polish (clean, neutral utility style).
- Optional: PWA installability.


Chat GPT
Here is the **very brief, high-level plan** based on your requirements and vanilla JS preference.

---

# 📚 Libraries / Tools

### Core

* **Vanilla HTML + CSS + JavaScript**
* Native **IndexedDB** (no wrapper unless you later want one)

### Charts

* **Chart.js**

### CSV Handling

* **Papa Parse** (for import parsing)
* Native Blob API for export

### PWA

* Web App Manifest
* Service Worker (vanilla, no framework)

### Testing / Accessibility

* **Lighthouse**

That’s it. No frameworks, no build tools required unless you later decide to add them.

---

# 🛠 Implementation Steps (High-Level Order)

### 1️⃣ Data Layer

* IndexedDB setup
* CRUD operations
* Sorting + duplicate detection
* Unit handling (lbs/kg)

### 2️⃣ Basic UI

* 4-button responsive layout
* View switching
* Data entry form
* Edit/delete functionality
* Entry list display

### 3️⃣ CSV Import/Export

* Export to CSV
* Import with merge logic
* Validation handling

### 4️⃣ Statistics Engine

* Rolling averages / median
* Weekly / monthly / yearly aggregation
* Unit conversion logic

### 5️⃣ Charting

* Daily weight chart
* Rolling average overlay
* Average charts
* Goal weight line

### 6️⃣ PWA Features

* Manifest
* Service worker
* Offline testing
* Install testing

### 7️⃣ Accessibility & Polish

* Keyboard navigation
* Focus states
* Contrast review
* Reduced motion support

---

If you’d like, next we can lock in:

* Data model decisions (single vs multiple entries per day)
* CSV format specification
* Or folder structure before writing code.

Google:

Implementation Steps
Data Schema & Storage: Initialize Dexie.js with your 4 fields (ID, Date/Timestamp, Weight, Comments).
Settings Layer: Build the Settings view first to establish your units (Lbs/Kg) and goal weight.
Core Data Entry (CRUD): Create the primary view for entering, viewing, and editing data logs.
Responsive Shell: Implement the navigation bar with CSS Media Queries to toggle between Portrait (top) and Landscape (left).
Averaging Engine: Write the logic to calculate daily means (for multi-entry days) and weekly/monthly trends.
Charting View: Integrate Chart.js to visualize the processed averages and trendlines.
Import/Export: Add CSV functionality to allow for data backup and initial bulk-loading.
Accessibility & Info: Conduct a final audit for screen readers (Aria-labels) and keyboard navigation before adding the Info page.
Should we start by defining the Dexie.js database schema and the CSV export format to ensure your data structure is solid?

