# Fraternity Housing Maintenance Request System
## Product Requirements Document — v1.2

| Field | Value |
|---|---|
| Project Name | Fraternity Housing Maintenance Request System |
| Version | 1.2 – Revised Draft |
| Author | Housing Manager |
| Status | Ready for Implementation |

---

## 1. Overview

### 1.1 Purpose
This document defines the requirements for a web-based maintenance request system for a fraternity house. The system has two distinct surfaces: a public submission form used by residents (live-ins) to report issues, and an unprotected dashboard used by the housing manager to view, manage, and resolve those issues.

### 1.2 Problem Statement
Currently there is no structured way for house residents to report maintenance issues. This leads to issues going unnoticed, duplicate verbal reports, and no clear record for the housing manager to track and prioritize repairs. The housing manager needs a single source of truth with location-aware visibility into all open issues.

### 1.3 Goals
- Provide residents a fast, frictionless way to submit maintenance requests from any device.
- Prevent duplicate submissions by surfacing active issues to residents during the submission flow.
- Give the housing manager a spatial (floor plan) and list-based view of all open issues.
- Notify the housing manager immediately when a new issue is submitted via iOS push notifications.
- Keep the system free to operate using open-source tools and free-tier hosting.

### 1.4 Out of Scope (V1)
- Native iOS or Android apps.
- User authentication, logins, or access control of any kind.
- Board member dashboard access (V2).
- Email sending or email-based notifications.
- Automated assignment of issues to contractors or maintenance staff.
- Issue priority or severity levels.
- Comment threads or back-and-forth communication on an issue.

---

## 2. Users & Roles

| Role | Access Method | Capabilities |
|---|---|---|
| Resident (Live-in) | Shared slug URL (e.g. `/submit/x7k2p9`) | Submit maintenance requests. View active issues for the selected floor/room before submitting. |
| Housing Manager | Direct dashboard URL (no login) | View, manage, and resolve all active issues. Receive iOS push notifications on new submissions. |

---

## 3. Resident Submission Form

### 3.1 Access
The submission form is accessible via a fixed URL with a long random slug (e.g. `yourdomain.com/submit/x7k2p9`). The slug is hardcoded as an environment variable at deployment time and requires no management UI. It is shared by the housing manager via the house group chat or posted as a QR code. No login is required.

### 3.2 Submission Flow
The submission form is a step-by-step wizard. Each step is a distinct screen. Users may navigate backwards to change prior selections.

#### Step 1 — Enter Name
The first field presented is a required plain text input for the resident's name. This is the only identification mechanism in the system. The name is stored with the submission so the housing manager can follow up directly if needed. No email or other contact info is collected.

#### Step 2 — Select Floor
A screen displays the four floors as selectable cards: **Basement**, **First Floor**, **Second Floor**, **Third Floor**. The resident taps the floor where the issue is located.

#### Step 3 — Select Room
An interactive SVG floor plan for the selected floor is displayed. Clickable room shapes are defined by their `Room-*` prefixed `id` attributes (e.g. `Room-kitchen`, `Room-201`). Each room shape is labeled. The resident taps the room where the issue exists.

> **Active issues:** Before the room selection is confirmed, any existing open issues for that specific floor/room are shown in a non-blocking banner or list below the floor plan. This gives residents visibility into already-reported problems and reduces duplicate submissions.

#### Step 4 — Select Issue Type
A list of issue categories specific to the selected room is presented (see Section 3.3). `Other` is always the final option. The resident selects one issue type.

#### Step 5 — Add Details & Submit
Regardless of the issue type selected, the resident sees:
- A text area for an optional brief description of the issue.
- A photo upload input (optional). Accepts JPEG or PNG. Single photo per submission.
- A Submit button.

On successful submission, a confirmation screen is shown. The form resets if the resident wants to submit another issue.

---

### 3.3 Complete Room & Issue Type Reference

This table is the authoritative source for all rooms, their SVG IDs, display labels, and available issue types. This directly maps to the database seed data and the frontend issue type lists. `Other` is always included as the final option for every room.

| Floor | Room ID (SVG) | Label | Issue Options |
|---|---|---|---|
| Basement | `Room-basement` | Main Basement | Flooring, Window issue, Damaged elevated, Other |
| Basement | `Room-kitchen` | Kitchen | Door/lock issue, Other |
| Basement | `Room-boiler` | Boiler Room | Other |
| Basement | `Room-snack` | Snack Room | Other |
| Basement | `Room-gym` | Gym | Other |
| First Floor | `Room-Hallway-1` | Hallway | Broken smoke detector, Blocked staircase, Other |
| First Floor | `Room-composite` | Composite Room | Wall damage, Window issue, Pool table, Other |
| First Floor | `Room-laundry` | Laundry Room | Washer issue, Dryer issue, Window issue, Other |
| First Floor | `Room-bathroom-1` | Bathroom | Clogged toilet, Window issue, Other |
| First Floor | `Room-poker` | Poker Room | Wall damage, Window issue, Other |
| First Floor | `Room-chapter` | Chapter Room | Wall damage, Window issue, Other |
| Second Floor | `Room-Hallway-2` | Hallway | Broken smoke detector, Blocked staircase, Other |
| Second Floor | `Room-Bathroom-2` | Bathroom | Clogged toilet, Window issue, Other |
| Second Floor | `Room-201` | Room 201 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-202` | Room 202 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-203` | Room 203 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-204` | Room 204 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-205` | Room 205 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-206` | Room 206 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-207` | Room 207 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-208` | Room 208 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-209` | Room 209 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-210` | Room 210 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-211` | Room 211 | Door/lock issue, Window issue, Wall damage, Other |
| Second Floor | `Room-212` | Room 212 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-Hallway-3` | Hallway | Broken smoke detector, Blocked staircase, Other |
| Third Floor | `Room-Bathroom-3` | Bathroom | Clogged toilet, Window issue, Other |
| Third Floor | `Room-301` | Room 301 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-302` | Room 302 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-303` | Room 303 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-304` | Room 304 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-305` | Room 305 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-306` | Room 306 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-307` | Room 307 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-308` | Room 308 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-309` | Room 309 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-310` | Room 310 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-311` | Room 311 | Door/lock issue, Window issue, Wall damage, Other |
| Third Floor | `Room-312` | Room 312 | Door/lock issue, Window issue, Wall damage, Other |

> **SVG Implementation:** Room shapes use the `Room-*` prefixed `id` attribute as the clickable element (e.g. `Room-kitchen`, `Room-201`). The unprefixed ids (e.g. `Kitchen`, `201`, `201_2`) belong to the label text paths and are **not** interactive. The frontend maps each `Room-*` id to the `room_id` field in the database.

---

## 4. Housing Manager Dashboard

### 4.1 Access
The dashboard is accessible via a direct URL with no authentication required. In V1, it is intended solely for the housing manager. The URL is not publicly shared and is distinct from the resident submission form URL. Anyone who knows the URL can access the dashboard — this is an accepted tradeoff for V1 given the small, trusted user base.

### 4.2 Push Notifications
The housing manager receives push notifications on their iOS device when a new issue is submitted. Implementation uses the Web Push API with VAPID keys, delivered via a registered Service Worker on the dashboard domain.

- On first visit to the dashboard, the manager is prompted to allow push notifications.
- Notifications display: room label, floor name, issue type, and submitter name.
- Tapping the notification opens the dashboard directly to the relevant issue.
- If notifications are declined, a persistent Settings option allows re-enabling them.

> **iOS Implementation:** Web Push via Service Workers requires iOS 16.4+ and the manager must add the dashboard to their Home Screen as a PWA (Progressive Web App). The dashboard must display a one-time prompt guiding the manager through the "Add to Home Screen" step on first visit from Safari.

### 4.3 List View (Default Tab)

#### Layout
The default view when opening the dashboard. Issues are grouped by floor (Basement → First → Second → Third), then by room within each floor. Within each room group, issues are sorted by date submitted, newest first.

#### Issue Card (Collapsed)
- Issue type / title (bold)
- Floor name and room label
- Submitter name
- Time since submission (e.g. "2 hours ago")

#### Issue Detail (Expanded)
Clicking an issue card expands it to reveal:
- All collapsed card info above
- Full description text (if provided)
- Photo (if provided), displayed inline with tap-to-enlarge
- A Resolve button

#### Multi-Select Resolve
A checkbox appears on hover (or via a "Select" mode toggle) for each issue card. Selecting multiple issues reveals a "Resolve Selected (N)" button in a sticky footer bar. Confirming resolves all selected issues simultaneously.

#### Resolve Behavior
- Issue is immediately removed from the active list.
- A snapshot is written to the `resolution_log` table with a timestamp.
- A toast appears: "Issue resolved. Undo?" with a 10-second countdown.
- Clicking Undo within the countdown restores the issue to active status.
- Once the toast expires or the page is refreshed, the deletion is permanent.

> **Note:** Resolved issues are permanently deleted from the database. The undo window is session-only and held client-side until the 10-second countdown expires.

### 4.4 Floor View (Second Tab)

#### Overview Screen
Shows all four floor plans at reduced scale. Rooms with at least one active issue are filled with a semi-transparent red overlay. The overlay is applied dynamically via CSS to the `Room-*` prefixed SVG elements that match active issue `room_id`s. Floors with no active issues display normally.

#### Expanded Floor View
Clicking a floor expands it to fill the main content area. The other three floors remain visible as small thumbnails at the top of the screen acting as switcher controls.

#### Room Interaction (Expanded View)
- **Rooms with active issues:** red fill overlay. An issue count badge (e.g. `3`) is displayed on the room in expanded view only.
- **Rooms without active issues:** displayed in their default neutral state and are not clickable.
- Clicking a red room opens a side panel listing all active issues for that room, using the same issue card format as List View, with the ability to expand and resolve individual issues.

#### SVG Implementation
Floor plans are exported from Figma as SVG files with "Include id attribute" enabled. Figma layer names are used directly as SVG `id` attributes. The clickable room shapes use `Room-*` prefixed ids (e.g. `Room-kitchen`, `Room-201`, `Room-Hallway-2`). The frontend applies a CSS class (e.g. `.has-issues`) to matching `Room-*` elements based on live issue data, setting a semi-transparent red fill while keeping room labels readable.

> **Note:** The unprefixed ids (e.g. `Kitchen`, `201`, `201_2`) belong to the vector label paths and must **not** be made interactive. Only `Room-*` prefixed elements should receive click handlers and highlight styles.

---

## 5. Data Model

### 5.1 Issues Table
Stores all active maintenance requests. Resolved issues are permanently deleted from this table.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key, generated on insert |
| `submitter_name` | VARCHAR(100) | Name entered by the resident on the form |
| `floor_id` | CHAR(1) | Floor identifier: `B` (Basement), `1`, `2`, or `3` |
| `floor_label` | VARCHAR(20) | Human-readable floor name (e.g. `Second Floor`) |
| `room_id` | VARCHAR(50) | SVG `Room-*` id (e.g. `Room-kitchen`, `Room-201`, `Room-Hallway-2`) |
| `room_label` | VARCHAR(100) | Human-readable room name (e.g. `Kitchen`, `Room 201`, `Hallway`) |
| `issue_type` | VARCHAR(100) | Selected issue category or `Other` |
| `description` | TEXT (nullable) | Optional free-text description from resident |
| `photo_url` | VARCHAR(500) (nullable) | Signed URL of uploaded photo in Supabase Storage |
| `submitted_at` | TIMESTAMP | UTC timestamp of submission |

### 5.2 Resolution Log Table
Stores a permanent audit trail of all resolution events. This table is never deleted from. Since there is no authentication in V1, only the issue snapshot and timestamp are recorded.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `issue_snapshot` | JSONB | Full copy of the issue record at time of resolution |
| `resolved_at` | TIMESTAMP | UTC timestamp when the issue was resolved |

---

## 6. Tech Stack

> All choices prioritize free or open-source tiers to minimize operating cost.

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React (Vite) | Fast dev server, component-based, large ecosystem |
| Styling | Tailwind CSS | Utility-first, no runtime overhead |
| SVG Interaction | Inline SVG + React | Direct DOM access for `Room-*` id click handling and `.has-issues` class toggling |
| Backend API | Node.js + Express (Railway) | Lightweight REST API; Railway free tier sufficient for this scale |
| Database | PostgreSQL (Supabase) | Free hosted Postgres; integrates directly with Supabase Storage |
| Photo Storage | Supabase Storage | Free 1GB tier; signed URLs keep photos private |
| Push Notifications | Web Push API + `web-push` (npm) | Free, no third-party service; VAPID keys managed on the Express server |
| Frontend Hosting | Vercel | Zero-config React/Vite deployment; free tier |
| PWA Support | Service Worker + Web App Manifest | Required for iOS push notifications; triggers Add to Home Screen prompt |

---

## 7. Feature Requirements

### 7.1 Submission Form

| Feature | Description | Priority |
|---|---|---|
| Slug-based URL access | Form accessible only via hardcoded long random slug env variable. No login required. | P0 – Must Have |
| Name entry (required) | Required text field at start of form. Name stored with submission for housing manager follow-up. | P0 – Must Have |
| Floor selection | Step 2 displays 4 floors: Basement, First Floor, Second Floor, Third Floor. | P0 – Must Have |
| SVG room selection | Interactive SVG per floor; `Room-*` prefixed elements are clickable. All 39 rooms across 4 floors supported. | P0 – Must Have |
| Active issues preview | Open issues for selected room shown before submission to reduce duplicates. | P0 – Must Have |
| Room-specific issue types | Issue list tailored per room per Section 3.3. `Other` always included. | P0 – Must Have |
| Optional description | Free-text field, not required to submit. | P0 – Must Have |
| Optional photo upload | Single JPEG/PNG photo, optional, stored in Supabase Storage as private with signed URL. | P1 – Should Have |
| Submission confirmation | Success screen shown after submit. Form resets for another submission. | P0 – Must Have |
| Back navigation | User can return to any prior step to change their selection. | P1 – Should Have |

### 7.2 Manager Dashboard

| Feature | Description | Priority |
|---|---|---|
| No-auth access | Dashboard at a direct URL. No login or passcode required in V1. | P0 – Must Have |
| iOS push notifications (PWA) | Web Push via Service Worker. Manager adds dashboard to Home Screen for iOS 16.4+ support. | P0 – Must Have |
| Add-to-Home-Screen prompt | First-visit prompt guiding manager through PWA installation on iOS Safari. | P0 – Must Have |
| List View – grouped list | Issues grouped by floor then room, sorted newest-first within each group. | P0 – Must Have |
| List View – issue detail | Expand issue card to see description, photo, submitter name, and timestamp. | P0 – Must Have |
| List View – single resolve | Resolve button on each expanded issue. Permanently deletes after undo window. | P0 – Must Have |
| List View – multi-select resolve | Checkbox mode to select and resolve multiple issues at once. | P1 – Should Have |
| Session-scoped undo | 10-second undo toast after resolve. Expires on timeout or page refresh. | P1 – Should Have |
| Floor View – overview | All 4 floors shown; `Room-*` elements with active issues highlighted red. | P0 – Must Have |
| Floor View – expanded floor | Click floor to expand; other 3 shown as thumbnail switchers at top. | P0 – Must Have |
| Floor View – room issue count | Badge on `Room-*` element showing active issue count in expanded view only. | P1 – Should Have |
| Floor View – room detail panel | Click a highlighted room to open panel listing that room's active issues. | P0 – Must Have |
| Resolution audit log | Server-side log of issue snapshot and timestamp for every resolution event. | P0 – Must Have |
| Notification re-enable | Settings option to re-enable push notifications if previously declined. | P2 – Nice to Have |

---

## 8. API Design (REST)

All endpoints are served by the Express API on Railway. No authentication headers are required in V1. The backend validates the submission form slug on `POST /api/issues` to reject requests from unknown origins.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/issues` | Returns all active issues. Used by the dashboard on load. |
| `GET` | `/api/issues?floor_id=2&room_id=Room-201` | Returns active issues filtered by `floor_id` and `room_id`. Used by the form duplicate check on room selection. |
| `POST` | `/api/issues` | Submit a new issue. Accepts `multipart/form-data` (name, floor_id, floor_label, room_id, room_label, issue_type, description, photo). Validates slug. Triggers push notifications. |
| `DELETE` | `/api/issues/:id` | Resolve (permanently delete) an issue. Writes snapshot to `resolution_log`. |
| `POST` | `/api/push/subscribe` | Save a Web Push subscription object for the manager's device. |
| `DELETE` | `/api/push/subscribe` | Remove the Web Push subscription for the manager's device. |

---

## 9. Non-Functional Requirements

### 9.1 Performance
- Submission form should load in under 2 seconds on a standard mobile connection.
- SVG floor plans should be optimized on Figma export. Target under 150KB per floor.
- Dashboard should load all active issues within 1 second on initial open.

### 9.2 Security
- The submission form slug is stored as an environment variable on both Vercel and Railway. The Express API rejects any `POST /api/issues` request that does not include the correct slug.
- Photo uploads are validated server-side for MIME type (JPEG/PNG only) and maximum size (10MB).
- Supabase Storage bucket for photos is set to private. Photos are accessed via signed URLs generated by the API, never exposed publicly.
- HTTPS is enforced on all domains — Vercel and Railway both provide this automatically.

### 9.3 Browser & Device Support
- Submission form: iOS Safari (primary), Chrome on Android, Chrome on desktop.
- Dashboard / push notifications: iOS Safari via PWA (Add to Home Screen) — requires iOS 16.4+. Desktop Chrome is secondary.
- The dashboard must display a clear notice if the browser does not support Web Push, with step-by-step instructions to use Safari and add to Home Screen.

### 9.4 Accessibility
- SVG `Room-*` elements should include `aria-label` attributes with the human-readable room label (e.g. `aria-label="Room 201"`).
- Color alone should not be the sole indicator of room status — consider a subtle pattern or icon alongside the red fill overlay for colorblind accessibility.
- Submission form step indicators should be screen-reader accessible with appropriate ARIA roles.

---

## 10. Open Questions & Future Considerations

### 10.1 Open Questions for Implementation
- After re-exporting from Figma with "Include id attribute" enabled, the developer must verify that all 39 `Room-*` ids in the SVG files exactly match the `room_id` values in the database seed data. Any mismatch will cause rooms to never highlight on the floor plan.
- The Basement "Main Basement" area (`Room-basement`) appears to cover most of the floor. The developer should confirm whether this is intended as a large open area or whether it overlaps with other rooms visually, and adjust z-ordering of SVG elements accordingly.
- What is "Damaged elevated" in the Basement issue list? This label should be clarified for residents — consider rewording to something more descriptive before launch.
- The submission form slug should be decided before deployment and stored consistently in both the Vercel and Railway environment variable configs.

### 10.2 V2 Feature Backlog
- Board member dashboard access with magic link authentication.
- Resolution audit log "resolved by" field once authentication is added.
- Issue priority levels (Low / Medium / Urgent).
- Commenting or status updates on individual issues.
- Weekly summary digest of open issues.
- Export of resolution log to CSV for end-of-semester reporting.
- Admin panel for managing the submission form slug without redeployment.

---

*Fraternity Housing Maintenance Request System • PRD v1.2 • Confidential*
