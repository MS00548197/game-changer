# Game Changer – Herbalife Health Coach Tracker

Game Changer is a mobile-first data tracking app concept for Herbalife health coaching clients who want to manage both **weight loss** and **weight gain** goals with daily habit consistency.

## Core idea
Clients follow a **Daily Success Score** built from non-negotiable healthy actions:

- Water intake (target: 5L)
- Exercise duration (target: 30 min)
- Herbalife nutrition shake adherence
- Walking / step progress
- Sleep quality and duration
- Optional coach notes + client reflections

The app is designed to keep tracking very simple (quick taps, sliders, and progress bars) while still giving coaches useful trends.

## Features in this prototype

- Mobile-first dashboard card layout
- Goal type selector (Weight Loss / Weight Gain)
- Body metrics inputs for height + weight
- Client profile details (name and mobile number)
- History tab with daily check-ins
- Weekly and monthly report summaries from saved entries
- Automatic BMI calculation
- Ideal weight range display (BMI 18.5–24.9)
- Target weight gain/loss guidance based on selected goal
- Daily tracker inputs:
  - Water (liters)
  - Exercise (minutes)
  - Walking (steps)
  - Sleep (hours)
  - Herbalife shake completed (yes/no)
- Automatic daily score calculation
- Quick status labels (`On Track`, `Almost There`, `Needs Attention`)
- Progress bars for each metric
- Saved locally in browser with `localStorage`

## Suggested roadmap for a production mobile app

1. Authentication for coach + client accounts
2. Role-based views:
   - Client dashboard
   - Coach overview for all clients
3. Push reminders:
   - Water reminders every 2–3 hours
   - Shake reminder windows
   - Sleep wind-down notifications
4. Charts and weekly reports
5. Photo check-ins (meal + progress)
6. AI coaching nudges for missed habits
7. Integration with wearable health data (steps/sleep)

## Run locally

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Files

- `index.html` – app structure
- `styles.css` – mobile-first styling
- `app.js` – tracker logic, scoring, and persistence

