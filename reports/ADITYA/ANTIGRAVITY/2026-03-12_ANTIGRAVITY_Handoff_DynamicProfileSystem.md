# Dynamic Profile System Handoff (2026-03-12)

## Objective
Standardize Soulamore psychologist and peer profile pages into data-driven templates so future profiles are created by adding structured data rather than duplicating HTML pages.

## What Has Been Implemented

### 1. Shared Data Catalog
Created:
- `assets/js/profile-catalog.js`

This file now contains:
- standardized psychologist profile data
- standardized peer profile data
- lookup helpers:
  - `resolvePsychologistProfile(key)`
  - `resolvePeerProfile(key)`
- fallback mapper for Firestore psychologist records:
  - `mapPsychologistRecordToProfile(record, key)`

### 2. Shared Renderer Layer
Created:
- `assets/js/profile-renderers.js`

This file now renders profiles from structured data instead of hardcoded DOM.

Renderer entry points:
- `mountPsychologistProfile(...)`
- `mountPeerProfile(...)`

Both support:
- tab-driven section switching
- section-type based rendering
- layout consistency without repeating page markup per profile

### 3. Dynamic Psychologist Profile Page
Refactored:
- `our-psychologists/profile.html`

Current behavior:
- resolves profile by `slug` or legacy `id`
- first tries local structured catalog
- if not found and `id` exists, falls back to Firestore via `getUserProfile(...)`
- maps raw Firestore data into the standardized psychologist profile schema

Current example wired in catalog:
- `bhagyavathi`

Route example:
- `our-psychologists/profile.html?slug=bhagyavathi`

### 4. Dynamic Peer Profile Placeholder
Refactored:
- `our-peers/mental-wellness/profile.html`

Current behavior:
- resolves peer profile by `slug` or legacy `id`
- renders from the structured peer catalog
- supports tabs, standard section stack, CTA block, and audio toggle

Current example wired in catalog:
- `aditya-mental-wellness`

Route example:
- `our-peers/mental-wellness/profile.html?slug=aditya-mental-wellness`

Legacy-compatible key also present:
- `id=aditya`

### 5. Existing Entry Points Updated
Updated:
- `our-psychologists/psychologists.html`
- `index.html`

Changes:
- Bhagyavathi card/fallback routes now point to the dynamic psychologist profile route instead of the old static page.

## Standard Data Contract

### Psychologist Profile Schema
Top-level fields used now:
- `slug`
- `legacyIds`
- `seoTitle`
- `seoDescription`
- `hero`
- `tabs`
- `defaultTab`
- `sections`

Psychologist `hero` shape:
- `name`
- `role`
- `avatarInitial`
- `cta`
- `stats[]`

Psychologist supported section types:
- `rich-text`
- `style-session`
- `focus-list`
- `quotes`
- `info-list`
- `notice`

Psychologist layout model:
- `column: 'main' | 'side'`
- `tab` value maps each section to a specific tab

### Peer Profile Schema
Top-level fields used now:
- `slug`
- `legacyIds`
- `seoTitle`
- `seoDescription`
- `themeClass`
- `hero`
- `tabs`
- `defaultTab`
- `cta`
- `sections`

Peer supported section types:
- `rich-text`
- `check-list`
- `chip-list`
- `reviews`
- `boundary`

## Current Example Profiles

### Psychologist
Implemented example:
- Bhagyavathi

Catalog key:
- `bhagyavathi`

### Peer
Implemented example:
- Aditya mental wellness placeholder

Catalog key:
- `aditya-mental-wellness`

## Important Technical Notes

### 1. This Is Not Fully Rolled Out Yet
The system foundation exists, but not all live profile entry points use it yet.

### 2. Static Legacy Pages Still Exist
Not yet migrated:
- `our-psychologists/bhagyavathi.html`
- `our-psychologists/palak-shori.html`
- `our-peers/zoya.html`
- `our-peers/profile.html`

These should be treated as migration targets, not source of truth going forward.

### 3. Firestore Psychologist Fallback Exists
`our-psychologists/profile.html` can still render unknown psychologist records from Firestore by transforming them through:
- `mapPsychologistRecordToProfile(...)`

This keeps the dynamic route usable even if a psychologist is not yet manually added to the local catalog.

### 4. Peer Side Is Still Partial
The peer placeholder is standardized only in:
- `our-peers/mental-wellness/profile.html`

But live links elsewhere still point into:
- `our-peers/profile.html?id=...`

That page has not yet been migrated to the new shared renderer.

## Next Steps Required

### P1. Migrate Live Peer Route To Shared Renderer
Target:
- `our-peers/profile.html`

Goal:
- replace current ad-hoc peer renderer with the same shared catalog/renderer approach used in `our-peers/mental-wellness/profile.html`
- preserve any bookmark/review/chat logic that is still needed
- keep existing peer IDs working

Why this matters:
- current live peer links on homepage still use `our-peers/profile.html?id=...`
- without migrating this file, the new peer standard is only a placeholder/demo route

### P1. Decide Route Policy For Static Profile Pages
Targets:
- `our-psychologists/bhagyavathi.html`
- `our-psychologists/palak-shori.html`
- `our-peers/zoya.html`

Decision needed:
- either convert these to lightweight redirect pages
- or update all site links and deprecate them fully

Preferred direction:
- route all active links to the dynamic pages
- keep old static pages only as temporary redirect wrappers if required

### P1. Add More Catalog Entries
Targets:
- psychologist entries beyond Bhagyavathi
- peer entries beyond Aditya placeholder

Implementation model:
- add new objects in `assets/js/profile-catalog.js`
- do not duplicate template HTML

### P2. Normalize All Existing Entry Links
Audit and update all profile links so they route into the standard dynamic pages.

Likely files to check next:
- `index.html`
- `our-peers/index.html`
- `our-peers/about.html`
- `our-psychologists/psychologists.html`
- `community/*`
- `join-us/*`

### P2. Extract Optional Shared CSS If Desired
Current state:
- page-specific CSS still lives inside each dynamic profile page

Possible follow-up:
- move stable shared profile styles into:
  - `assets/css/profile-psychologist.css`
  - `assets/css/profile-peer.css`

This is optional. Not required for functionality.

### P3. Add Admin/Data Entry Path
Future improvement:
- define a single JSON/table/Firestore document shape that editors can fill
- then transform that source into the existing catalog schema automatically

Right now:
- local catalog is the source of truth for handcrafted example profiles
- Firestore fallback exists only for psychologists

## Recommended Agent Tasks

### Agent A
Migrate `our-peers/profile.html` to the shared renderer and preserve live peer functionality.

### Agent B
Convert old static psychologist/peer profile pages into redirects or retire them safely.

### Agent C
Expand `assets/js/profile-catalog.js` with real structured entries for remaining psychologists and peers.

### Agent D
Audit and replace all legacy profile links across the site.

## Guardrails
1. Do not introduce another one-off profile HTML page.
2. Add profiles by data first, layout second.
3. Preserve the two visual languages:
- psychologist = clinical dark glass
- peer = soft supportive light card system
4. Keep route compatibility where possible using `slug` plus legacy `id` support.
5. If touching `our-peers/profile.html`, do not break any current save/bookmark/chat behavior without replacing it.

## Files Changed In This Pass
- `assets/js/profile-catalog.js`
- `assets/js/profile-renderers.js`
- `our-psychologists/profile.html`
- `our-peers/mental-wellness/profile.html`
- `our-psychologists/psychologists.html`
- `index.html`

## Quick Test URLs
- `our-psychologists/profile.html?slug=bhagyavathi`
- `our-peers/mental-wellness/profile.html?slug=aditya-mental-wellness`
- `our-peers/mental-wellness/profile.html?id=aditya`

## Current Status Summary
The profile system foundation is now real and usable.

What is done:
- shared schema
- shared renderers
- dynamic psychologist route
- dynamic peer placeholder route
- Bhagyavathi wired into dynamic flow

What is not done:
- live peer route migration
- full profile inventory migration
- legacy page retirement
- site-wide link normalization
