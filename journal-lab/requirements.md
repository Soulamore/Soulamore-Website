# Soulbot Journal: Technical Requirements & Processes

## 1. AI & NLP Engine (Local-First)
**Constraint**: All inference MUST run in a Web Worker to prevent main-thread jank.

*   **Libraries**:
    *   `@xenova/transformers`: Local inference.
    *   `tokenizers`: Text processing.

*   **Models (Quantized)**:
    *   **Embeddings**: `Xenova/all-MiniLM-L6-v2` (384 dimensions, ~40MB).
    *   **Sentiment**: `Xenova/distilbert-base-uncased-finetuned-sst-2` (Positive/Negative, ~40-120ms inference).

*   **Performance Strategy**:
    *   **Lazy Loading**: Initialize models only after the first reflection save, not at app boot.
    *   **Web Worker**: Strict separation. Main thread sends text -> Worker returns JSON.
    *   **Caching**: Cache model files to avoid repeated downloads.

## 2. Emotional Memory Engine (Data Structure/Dexie.js)
**Philosophy**: "Neural Web" over "File Cabinet".

*   **Storage**: `Dexie.js` (IndexedDB).
    *   **Scale**: 10k reflections ≈ 15MB. Safe for browser storage.

*   **Schema**:
    *   `reflections`:
        *   `embedding`: `Float32Array` (384 dims).
        *   `sentimentScore`: `float` (-1.0 to 1.0).
        *   `emotionalTag`: `string`.
    *   `clusters` (The "Centroids"):
        *   `centroid`: `Float32Array` (Moving average of members).
        *   `frequency`: `int` (Count of members).
        *   `lastSurfaced`: `timestamp`.

*   **Clustering Logic (O(1) approach)**:
    *   Compare new embedding ONLY against `cluster.centroid`s (not all reflections).
    *   Threshold: Cosine similarity > 0.82.
    *   Update centroid: `(old_centroid * n + new_embedding) / (n + 1)`.

*   **Sentiment Trending**:
    *   Do NOT use raw variance.
    *   Use **Rolling Average** (Last 5 entries).
    *   Trigger "Shift" only if `abs(avg_new - avg_old) > 0.25`.

## 3. Visual System ("Soulbot DNA")
**Directive**: Look like Soulbot, feel like a Sanctuary.

*   **Tokens (Tailwind v4)**:
    *   `--soul-amber`: #F59E0B (Comfort).
    *   `--soul-void`: #0F172A (Deep Space).
    *   `--soul-teal`: #4ECDC4 (Brand).
*   **Performance Guardrails**:
    *   **Blur**: Apply `backdrop-filter: blur(12px)` ONLY to small cards, never full-page backgrounds (FPS risk).
    *   **Animation**: `framer-motion` for `transform` and `opacity` only. No layout thrashing (height/width animation).
    *   **Breathing**: Moderate cycle (4-6s), scale 1.0 -> 1.01.

## 4. Surfacing Logic (The "Whisper")
*   **Frequency**: Max 1 insight per session.
*   **Cooldown**: 7 days per memory type.
*   **Tone**: Observational, not diagnostic. "This feels familiar," not "You are anxious."

## 5. Deployment
*   **Current**: Local-first (Private).
*   **Future**: Encrypted blob sync to Supabase.
