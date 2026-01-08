# AlbumTeller Culling – Professional Photography Culling Cockpit

## What This Software Is

AlbumTeller Culling is a professional-grade photo culling application designed for high-volume photographers (weddings, events, reportage). Its sole purpose is **fast, fatigue-free decision making** when selecting the best images from thousands of photos.

This prototype represents the **frontend-only UI simulation** of the desktop application. There is no backend logic or real image processing implemented.

---

## Core Philosophy

**Human-in-the-Loop AI**

The software does not replace the photographer. It acts as a *co-pilot* that:

* Flags potential issues (soft focus, blinks, composition)
* Suggests best frames within a burst
* Leaves final decisions entirely to the human

Speed and clarity are prioritized over visual noise.

---

## Key Workflows

### 1. The Grid

* Displays hundreds of thumbnails at once
* Optimized for keyboard-driven decisions (Pick / Reject / Star)
* Visual overlays communicate decisions instantly

### 2. The Compare

* Side-by-side comparison of similar images
* Synced zoom for sharpness evaluation

### 3. The Decision

* Minimal UI chrome
* Clear visual feedback
* EXIF data always visible

---

## Visual System

### Industrial Graphite & Glass

* **Graphite panels**: Core, trustworthy, neutral surfaces
* **Glass panels**: AI insights and "smart" features

### Color Strategy

* Dark neutral backgrounds to avoid color perception bias
* Cyber Yellow used only for actions and focus

### Typography

* Inter: UI and readability
* Monospace: Technical precision (EXIF data)

---

## Code Structure Explanation

### index.html

Defines the structural layout:

* Sidebar navigation
* Top action bar
* Grid-based thumbnail area
* Inspector panels (EXIF + AI)

All content is static placeholder data.

### styles.css

Implements:

* Design tokens (colors, radius)
* Responsive layout
* Glassmorphism for AI panels
* Desktop-first with mobile adaptation

No JavaScript is used intentionally to keep this a **pure UI simulation**.

---

## How This Prototype Should Be Used

* UX testing and validation
* Stakeholder demos
* Interaction planning before engineering
* AI-assisted tools can read this file to understand intent and semantics

This is not a marketing site.
This is a **professional tool cockpit**.
