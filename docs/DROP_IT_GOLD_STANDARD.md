# Drop It - Gold Standard Documentation

## Overview
"Drop It" is a web-based, canvas-driven "Mental Space Shooter" designed for Soulamore. It combines arcade-style gameplay with mental health awareness.

**Current State**: Stable, Performance-Optimized, Single-File Architecture.
**Last Updated**: January 8, 2026.

## Core Mechanics
1.  **Movement**: 
    -   **Desktop**: Arrow keys or WASD.
    -   **Mobile**: Touch and drag anywhere on screen. (1.5x Speed Factor).
2.  **Firing**:
    -   **Desktop**: Spacebar.
    -   **Mobile**: Dragging into the bottom 15% "Fire Zone".
    -   **Heat System**: Firing generates heat. Reaching 100 triggers overheat (cooldown period).
3.  **Enemies (Personal Problems)**:
    -   Floating windows containing real-world stressors (e.g., "My ex cheated", "I hate my job").
    -   **Destruction**:
        -   **Body Hit**: Requires ~25 hits (Tanky).
        -   **Weak Point**: Top-right 'X' button destroyed instantly (Technical Skill Reward).
4.  **Obstacles (Dust/Words)**:
    -   Falling words (e.g., "Anxiety", "Doubt").
    -   Attach to player if they get too close (Reduces control/increases danger).
    -   Can be shot to destroy.
5.  **Content Separation**:
    -   **Enemies**: Negative thoughts/problems.
    -   **Guidance (Top Pill)**: Soulamore Feature Awareness (Campus, SoulBot, etc.).
    -   **End Screen**: Positive Affirmations.

## Technical Architecture (The "Gold Standard")
After experimenting with ES6 Modules, we reverted to a **Monolithic HTML Structure** for maximum performance and stability on low-end devices.

### File: `tools/drop-it.html`
-   **Canvas API**: Pure 2D Context. No libraries (except `html2canvas` for sharing).
-   **Game Loop**: `requestAnimationFrame` driving a fixed logic loop.
-   **Performance Optimization**:
    -   *Shadows*: Removed/Reduced during gameplay.
    -   *Object Pooling*: Simple array splicing (optimized for JS engine).
    -   *Input*: Direct event listeners passive where possible.

### Key Variables (Difficulty Tuned 1.25x)
-   `speed`: 5.9 (Base travel speed)
-   `maxSpeed`: Zen Cap (Reduced from original 5 to 3.5, now effectively higher via base)
-   `popupHP`: 25
-   `heatCost`: 2.5 per shot

## Deployment
-   **Hosting**: Firebase Hosting (`firebase deploy`)
-   **Path**: `soulamore.com/tools/drop-it.html`

## Lessons Learned
-   **Modules vs Inline**: While modules are cleaner for dev, the single-file inline structure proved significantly more performant and less prone to loading race conditions for this specific game loop.
-   **Mobile First**: Touch controls must handle "drag to move" AND "fire zones" simultaneously.
-   **User Psychology**: Separating "Things you shoot" (Problems) from "Things that help you" (Soulamore features) is critical for message clarity.
