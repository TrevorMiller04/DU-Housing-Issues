# DU Housing Issues Tracker

## What This Is

A repair tracking system for a fraternity house. House members submit issues (broken fixtures, spills, damage, etc.) through a simple public web form. The housing manager uses a mobile app to see all open issues as a list and as pins on the house floor plan, and marks them resolved when fixed.

## Core Value

The housing manager always has a clear, up-to-date picture of exactly what needs to be fixed and where in the house.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] House members can submit a repair issue by entering their name, describing the problem, clicking their location on the floor plan, and optionally attaching a photo
- [ ] Housing manager can view all open issues as a list in the mobile app
- [ ] Housing manager can view all open issues as pins on the floor plan in the mobile app
- [ ] Clicking an issue in the list navigates to the floor plan with that pin highlighted
- [ ] Clicking a pin on the floor plan shows the issue details (submitter name, description, photo if any)
- [ ] Housing manager can mark issues as resolved (removed from list and map)
- [ ] Housing manager receives a push notification when a new issue is submitted

### Out of Scope

- User accounts / login for submitters — named but no auth
- Multi-user manager access — single housing manager app
- Issue history / archive after resolution — out for v1
- In-app messaging between submitter and manager — not needed
- Web app for the manager — mobile only via Expo Go

## Context

- Fraternity house repair tracking — internal tool, not a commercial product
- Floor plan image not yet available; location-pinning features depend on receiving it before implementation
- Submitters are house members who will receive the web form URL; no onboarding needed
- Housing manager accesses the app via Expo Go on their phone
- GitHub repo: https://github.com/TrevorMiller04/DU-Housing-Issues

## Constraints

- **Tech Stack**: Next.js (web form + API routes), React Native / Expo (mobile app)
- **Database**: Supabase — Postgres for issue records, Supabase Storage for photos and floor plan image
- **Deployment**: Vercel for web app; Expo Go for mobile (no App Store submission needed)
- **Floor Plan**: Implementation of location-pinning is blocked until floor plan image is provided
- **Notifications**: Expo Push Notification service (requires Expo project setup)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js for web form + API | Single deployment to Vercel, API routes eliminate separate backend service | — Pending |
| Supabase for DB + storage | Free tier covers this scale; handles both Postgres and file storage in one service | — Pending |
| Expo Go (no App Store) | Avoids Apple/Google review process; housing manager just installs Expo Go | — Pending |
| Named submissions (no auth) | Lowest friction for house members; manager knows who reported without requiring accounts | — Pending |
| Pin-on-image location model | Submitter taps exact spot on floor plan image; stored as x/y percentage coordinates | — Pending |

---
*Last updated: 2026-03-03 after initialization*
