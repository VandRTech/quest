# How Parameters Work for Each Questionnaire

Each questionnaire is keyed by **service** (internal id or service code). Completion is decided by **coverage policy**: when all **required** parameters for that service have a value, the conversation can complete (or complete when the user confirms a callback).

---

## Parameter IDs (shared across services)

These are the datapoint ids used in conversation and extraction. Meaning is consistent; **required** and **optional** sets vary by service.

| Parameter ID     | Meaning |
|------------------|--------|
| `project_type`   | Type of property: apartment, villa, independent house, office |
| `rooms`          | Room/BHK count (e.g. 2BHK, 3BHK) |
| `size_sqft`      | Approximate area in square feet |
| `style`          | Preferred style: modern, traditional, minimal, japandi, neo-indian, industrial |
| `budget`         | Budget (lakhs/INR) |
| `timeline`       | Project completion timeline (days/weeks/months) |
| `contact_pref`   | How to contact: phone or email |
| `callback_time`  | When to call/contact (e.g. tomorrow 5pm, asap) |
| `notes`          | Special focus areas, notes |
| `must_haves`     | Must-have features, materials, colors |
| `avoid`          | Materials, colors, or items to avoid |
| `site_ready`     | Is site ready for work (yes/no) |
| `storage_needs`  | Wardrobes, lofts, storage |
| `lighting_pref`  | Lighting preference (warm/cool/natural) |
| `preferred_start`| When project/work should start (not callback time) |
| `moodboard_refs` | Moodboard / inspiration links |

---

## By service (service code → internal id)

### 1. Residential Construction — CIRC01 → `residential_construction`

| Required | Optional |
|----------|----------|
| project_type, size_sqft, budget, timeline, contact_pref, callback_time | notes |

- No `rooms`, `style`.
- Completion: 6 required.

---

### 2. Home Interiors — IRRI01 → `residential_interiors`

| Required | Optional |
|----------|----------|
| project_type, rooms, size_sqft, style, budget, timeline, contact_pref, callback_time | must_haves, avoid, site_ready, storage_needs, lighting_pref, preferred_start, notes, moodboard_refs |

- Full set: 8 required, 8 optional.
- Completion: 8 required.

---

### 3. Painting & Waterproofing — IRPW02 → `painting`

| Required | Optional |
|----------|----------|
| project_type, size_sqft, style, budget, timeline, contact_pref, callback_time | notes |

- No `rooms`.
- Completion: 7 required.

---

### 4. Electrical Services — CIEL03 → `electrical_services`

| Required | Optional |
|----------|----------|
| project_type, budget, timeline, contact_pref, callback_time | notes |

- No `rooms`, `size_sqft`, `style`.
- Completion: 5 required.

---

### 5. Plumbing — CIPL02 → `plumbing_services`

| Required | Optional |
|----------|----------|
| project_type, budget, timeline, contact_pref, callback_time | notes |

- Same shape as electrical: 5 required.
- Completion: 5 required.

---

### 6. Solar Rooftop — SESR01 → `solar_services`

| Required | Optional |
|----------|----------|
| project_type, size_sqft, budget, timeline, contact_pref, callback_time | notes |

- No `rooms`, `style`.
- Completion: 6 required.

---

### 7. Event Management — PSEM01 → `event_management`

| Required | Optional |
|----------|----------|
| project_type, size_sqft, budget, timeline, contact_pref, callback_time | notes |

- Completion: 6 required.

---

### 8. Property Development — RPPD01 → `property_development`

| Required | Optional |
|----------|----------|
| project_type, size_sqft, budget, timeline, contact_pref, callback_time | notes |

- Completion: 6 required.

---

### 9. Home Automation — HASH01 → `home_automation`

| Required | Optional |
|----------|----------|
| project_type, rooms, style, budget, timeline, contact_pref, callback_time | notes |

- No `size_sqft` in required.
- Completion: 7 required.

---

### 10. Farm Infrastructure — AAFI01 → `farm_infrastructure`

| Required | Optional |
|----------|----------|
| project_type, size_sqft, budget, timeline, contact_pref, callback_time | notes |

- Completion: 6 required.

---

### 11. Irrigation Automation — AAIA02 → `irrigation_automation`

| Required | Optional |
|----------|----------|
| project_type, size_sqft, budget, timeline, contact_pref, callback_time | notes |

- Completion: 6 required.

---

### 12. Commercial Interiors — (no code in UI) → `commercial_interiors`

| Required | Optional |
|----------|----------|
| project_type, size_sqft, style, budget, timeline, contact_pref, callback_time | must_haves, avoid, notes |

- No `rooms`.
- Completion: 7 required.

---

### 13. Commercial Construction — (no code in UI) → `commercial_construction`

| Required | Optional |
|----------|----------|
| project_type, size_sqft, budget, timeline, contact_pref, callback_time | notes |

- Completion: 6 required.

---

## How it works in code

1. **Coverage policy** (`src/engine/coverage-policy.ts`)  
   - Defines `required` and `optional` parameter ids per service (internal id).  
   - `isCoverageSatisfied(parameters, service)` is true when every **required** id has a value (or `value` inside an object).

2. **Conversation engine** (`src/engine/conversation.ts`)  
   - Uses the **character datapoints** (e.g. from Aadhya) to know what can be collected.  
   - Uses **required** from coverage policy to decide what to ask for and to allow completion when all required are filled.  
   - Asks in order: project_type / rooms / size_sqft / style first, then budget/timeline, then contact_pref / callback_time.

3. **Completion**  
   - **Path 1:** All required parameters collected → `isCoverageSatisfied` → generate closing + summary.  
   - **Path 2:** User confirms callback (e.g. “sure” after “I’ll call you…”) → treat as complete even if some required are missing → set `callback_time` if needed → closing + summary.

4. **Extraction**  
   - User messages are parsed (LLM + regex fallback) into parameter id → `{ value, confidence }`.  
   - Only datapoint ids that exist on the character are extracted; coverage policy only decides **required** vs **optional** for completion.

---

## Summary table (required only)

| Service code | Internal ID               | # Required | Required parameter ids |
|-------------|---------------------------|------------|-------------------------|
| CIRC01      | residential_construction  | 6          | project_type, size_sqft, budget, timeline, contact_pref, callback_time |
| IRRI01      | residential_interiors     | 8          | project_type, rooms, size_sqft, style, budget, timeline, contact_pref, callback_time |
| IRPW02      | painting                  | 7          | project_type, size_sqft, style, budget, timeline, contact_pref, callback_time |
| CIEL03      | electrical_services       | 5          | project_type, budget, timeline, contact_pref, callback_time |
| CIPL02      | plumbing_services         | 5          | project_type, budget, timeline, contact_pref, callback_time |
| SESR01      | solar_services            | 6          | project_type, size_sqft, budget, timeline, contact_pref, callback_time |
| PSEM01      | event_management          | 6          | project_type, size_sqft, budget, timeline, contact_pref, callback_time |
| RPPD01      | property_development      | 6          | project_type, size_sqft, budget, timeline, contact_pref, callback_time |
| HASH01      | home_automation           | 7          | project_type, rooms, style, budget, timeline, contact_pref, callback_time |
| AAFI01      | farm_infrastructure       | 6          | project_type, size_sqft, budget, timeline, contact_pref, callback_time |
| AAIA02      | irrigation_automation     | 6          | project_type, size_sqft, budget, timeline, contact_pref, callback_time |
| —           | commercial_interiors      | 7          | project_type, size_sqft, style, budget, timeline, contact_pref, callback_time |
| —           | commercial_construction   | 6          | project_type, size_sqft, budget, timeline, contact_pref, callback_time |

All services require **contact_pref** and **callback_time** so the “schedule a call → user confirms → complete” flow works.
