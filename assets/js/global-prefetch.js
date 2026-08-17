/**
 * SOULAMORE GLOBAL PRE-FETCH & CACHE SERVICE
 * High-performance eager data loading system.
 * Starts prefetching Firebase data on landing page (index.html)
 * to provide 0ms instant loading experience across Our Peers & Psychologists.
 */

import { db, collection, getDocs, doc, getDoc } from './firebase-config.js';

const CACHE_KEY = 'soulamore_global_cache_v1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

class GlobalPrefetchManager {
    constructor() {
        this.memoryCache = {
            timestamp: 0,
            professionals: []
        };
        this.isFetching = false;
        this.loadFromSessionStorage();
    }

    /**
     * Load cached data from sessionStorage into memory
     */
    loadFromSessionStorage() {
        try {
            const raw = sessionStorage.getItem(CACHE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.professionals)) {
                    this.memoryCache = parsed;
                    console.log(`⚡ SoulamoreCache loaded ${parsed.professionals.length} items from sessionStorage.`);
                }
            }
        } catch (e) {
            console.warn('SoulamoreCache sessionStorage read warning:', e.message);
        }
    }

    /**
     * Save current memory cache to sessionStorage
     */
    saveToSessionStorage() {
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(this.memoryCache));
        } catch (e) {
            console.warn('SoulamoreCache sessionStorage save warning:', e.message);
        }
    }

    /**
     * Check if cache is fresh
     */
    isFresh() {
        return (
            this.memoryCache.professionals &&
            this.memoryCache.professionals.length > 0 &&
            (Date.now() - this.memoryCache.timestamp < CACHE_TTL_MS)
        );
    }

    /**
     * Get cached professionals list (optionally filtered by role: 'peer' or 'psychologist')
     */
    getProfessionals(filterRole = null) {
        if (!this.memoryCache.professionals) return [];

        if (!filterRole) {
            return this.memoryCache.professionals;
        }

        const roleLower = filterRole.toLowerCase();
        return this.memoryCache.professionals.filter(p => {
            const r = (p.role || '').toLowerCase();
            const t = (p.title || '').toLowerCase();
            if (roleLower === 'peer') {
                return r.includes('peer') || t.includes('peer');
            } else if (roleLower === 'psychologist') {
                return r.includes('psych') || t.includes('psych');
            }
            return true;
        });
    }

    /**
     * Get single professional by ID instantly from cache
     */
    getById(id) {
        if (!id || !this.memoryCache.professionals) return null;
        return this.memoryCache.professionals.find(p => String(p.id) === String(id) || String(p.uid) === String(id)) || null;
    }

    /**
     * Prefetch all public professionals and store in cache
     */
    async prefetch(force = false) {
        if (this.isFetching) return;
        if (!force && this.isFresh()) {
            console.log('⚡ SoulamoreCache is fresh. Skipping network request.');
            return;
        }

        this.isFetching = true;
        console.log('🌐 SoulamoreCache background prefetching from Firebase...');

        try {
            const querySnapshot = await getDocs(collection(db, 'professionals'));
            const items = [];

            querySnapshot.forEach(docSnap => {
                const data = docSnap.data();
                items.push({
                    id: docSnap.id,
                    uid: docSnap.id,
                    name: data.name || data.displayName || 'Professional',
                    role: data.role || data.title || 'Peer Listener',
                    title: data.title || data.role || '',
                    quote: data.quote || 'Here to listen.',
                    bio: data.bio || '',
                    tags: data.tags || [],
                    languages: data.languages || 'English',
                    langs: data.languages || 'English',
                    rate: data.rate || 0,
                    ageRange: data.ageRange || '18-24',
                    gender: data.gender || 'Any',
                    onlineStatus: data.onlineStatus || 'offline',
                    avatarColor: data.avatarColor || '#fbbf24',
                    photoURL: data.photoURL || '',
                    image: data.photoURL || '',
                    conversationStyle: data.conversationStyle || '',
                    convo: data.conversationStyle || '',
                    bestMatch: data.bestMatch || '',
                    match: data.bestMatch || '',
                    boundaries: data.boundaries || '',
                    bound: data.boundaries || '',
                    reviews: data.reviews || [],
                    raw: data
                });
            });

            this.memoryCache = {
                timestamp: Date.now(),
                professionals: items
            };
            this.saveToSessionStorage();
            console.log(`✅ SoulamoreCache successfully pre-fetched and cached ${items.length} professionals.`);

            // Dispatch global event so active pages can update seamlessly if needed
            window.dispatchEvent(new CustomEvent('soulamore:cacheUpdated', { detail: this.memoryCache }));
        } catch (err) {
            console.warn('⚠️ SoulamoreCache prefetch warning:', err.message);
        } finally {
            this.isFetching = false;
        }
    }
}

// Global Singleton Instance
const SoulamoreCache = new GlobalPrefetchManager();
window.SoulamoreCache = SoulamoreCache;

// Auto-trigger prefetch in idle background when module loads
if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => SoulamoreCache.prefetch());
    } else {
        setTimeout(() => SoulamoreCache.prefetch(), 300);
    }
}

export { SoulamoreCache };
