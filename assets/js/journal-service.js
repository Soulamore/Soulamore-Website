/**
 * Journal Service - Enhanced Journal Management
 * Handles journal entries, history, search, and mood tracking
 */

import { 
    auth, db, 
    collection, addDoc, updateDoc, deleteDoc, 
    doc, getDoc, getDocs, query, where, orderBy, limit, startAfter,
    serverTimestamp, arrayUnion, arrayRemove
} from './firebase-config.js';

// === JOURNAL ENTRIES ===

/**
 * Save or update a journal entry
 * @param {Object} entryData - { content, mood (optional), tags (optional) }
 * @param {string} entryId - Optional entry ID for updates
 */
export async function saveJournalEntry(entryData, entryId = null) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const journalData = {
        userId: user.uid,
        content: entryData.content,
        plainText: entryData.plainText || '',
        mood: entryData.mood || null,
        tags: entryData.tags || [],
        wordCount: entryData.plainText?.split(' ').length || 0,
        updatedAt: serverTimestamp()
    };

    try {
        if (entryId) {
            // Update existing entry
            const entryRef = doc(db, 'journal_entries', entryId);
            const entryDoc = await getDoc(entryRef);
            
            if (!entryDoc.exists()) {
                throw new Error('Journal entry not found');
            }

            // Verify ownership
            if (entryDoc.data().userId !== user.uid) {
                throw new Error('Unauthorized: Not your journal entry');
            }

            await updateDoc(entryRef, journalData);
            console.log('✅ Journal entry updated:', entryId);
            return { id: entryId, ...journalData };
        } else {
            // Create new entry
            journalData.createdAt = serverTimestamp();
            journalData.isDeleted = false;
            
            const docRef = await addDoc(collection(db, 'journal_entries'), journalData);
            console.log('✅ Journal entry created:', docRef.id);
            return { id: docRef.id, ...journalData };
        }
    } catch (error) {
        console.error('❌ Error saving journal entry:', error);
        throw error;
    }
}

/**
 * Get a single journal entry by ID
 * @param {string} entryId - Entry ID
 */
export async function getJournalEntry(entryId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        const entryRef = doc(db, 'journal_entries', entryId);
        const entryDoc = await getDoc(entryRef);
        
        if (!entryDoc.exists()) {
            return null;
        }

        const entryData = entryDoc.data();
        
        // Verify ownership
        if (entryData.userId !== user.uid) {
            throw new Error('Unauthorized: Not your journal entry');
        }

        return { id: entryRef.id, ...entryData };
    } catch (error) {
        console.error('❌ Error fetching journal entry:', error);
        return null;
    }
}

/**
 * Get all journal entries for current user with pagination
 * @param {Object} options - { limit, lastVisible, mood, tag }
 */
export async function getJournalEntries(options = {}) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const { 
        limit: maxLimit = 50, 
        lastVisible = null,
        mood = null,
        tag = null
    } = options;

    try {
        let q;

        // Build query based on filters
        if (mood) {
            q = query(
                collection(db, 'journal_entries'),
                where('userId', '==', user.uid),
                where('isDeleted', '==', false),
                where('mood', '==', mood),
                orderBy('createdAt', 'desc'),
                limit(maxLimit)
            );
        } else if (tag) {
            q = query(
                collection(db, 'journal_entries'),
                where('userId', '==', user.uid),
                where('isDeleted', '==', false),
                where('tags', 'array-contains', tag),
                orderBy('createdAt', 'desc'),
                limit(maxLimit)
            );
        } else {
            q = query(
                collection(db, 'journal_entries'),
                where('userId', '==', user.uid),
                where('isDeleted', '==', false),
                orderBy('createdAt', 'desc'),
                limit(maxLimit)
            );
        }

        // Add pagination cursor
        if (lastVisible) {
            q = query(q, startAfter(lastVisible));
        }

        const snapshot = await getDocs(q);
        const entries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            entries,
            lastVisible: snapshot.docs[snapshot.docs.length - 1]
        };
    } catch (error) {
        console.error('❌ Error fetching journal entries:', error);
        return { entries: [], lastVisible: null };
    }
}

/**
 * Delete a journal entry (soft delete)
 * @param {string} entryId - Entry ID
 */
export async function deleteJournalEntry(entryId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        const entryRef = doc(db, 'journal_entries', entryId);
        const entryDoc = await getDoc(entryRef);
        
        if (!entryDoc.exists()) {
            throw new Error('Journal entry not found');
        }

        // Verify ownership
        if (entryDoc.data().userId !== user.uid) {
            throw new Error('Unauthorized: Not your journal entry');
        }

        // Soft delete
        await updateDoc(entryRef, {
            isDeleted: true,
            deletedAt: serverTimestamp()
        });

        console.log('✅ Journal entry deleted:', entryId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting journal entry:', error);
        throw error;
    }
}

/**
 * Get journal statistics for user
 * @param {string} userId - User ID (defaults to current user)
 */
export async function getJournalStats(userId = null) {
    const user = auth.currentUser;
    if (!user && !userId) throw new Error('User must be authenticated');
    
    const targetUserId = userId || user.uid;

    try {
        const q = query(
            collection(db, 'journal_entries'),
            where('userId', '==', targetUserId),
            where('isDeleted', '==', false)
        );

        const snapshot = await getDocs(q);
        const entries = snapshot.docs.map(doc => doc.data());

        // Calculate stats
        const totalEntries = entries.length;
        const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
        
        // Mood distribution
        const moodCounts = {};
        entries.forEach(e => {
            if (e.mood) {
                moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
            }
        });

        // Get most common mood
        let mostCommonMood = null;
        let maxCount = 0;
        Object.entries(moodCounts).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostCommonMood = mood;
            }
        });

        // Calculate streak
        const sortedEntries = entries.sort((a, b) => {
            const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return bDate - aDate;
        });

        let streak = 0;
        if (sortedEntries.length > 0) {
            streak = 1;
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            for (let i = 0; i < sortedEntries.length - 1; i++) {
                const currentDate = sortedEntries[i].createdAt?.toDate ? sortedEntries[i].createdAt.toDate() : new Date(0);
                const prevDate = sortedEntries[i + 1].createdAt?.toDate ? sortedEntries[i + 1].createdAt.toDate() : new Date(0);
                
                const diffDays = Math.floor((today - currentDate) / (1000 * 60 * 60 * 24));
                const prevDiffDays = Math.floor((today - prevDate) / (1000 * 60 * 60 * 24));
                
                if (prevDiffDays - diffDays === 1) {
                    streak++;
                } else if (prevDiffDays - diffDays > 1) {
                    break;
                }
            }
        }

        // Get latest entry
        const latestEntry = sortedEntries.length > 0 ? {
            id: snapshot.docs[0].id,
            ...sortedEntries[0]
        } : null;

        return {
            totalEntries,
            totalWords,
            streak,
            mostCommonMood,
            moodDistribution: moodCounts,
            latestEntry
        };
    } catch (error) {
        console.error('❌ Error fetching journal stats:', error);
        return {
            totalEntries: 0,
            totalWords: 0,
            streak: 0,
            mostCommonMood: null,
            moodDistribution: {},
            latestEntry: null
        };
    }
}

/**
 * Search journal entries by text
 * @param {string} searchTerm - Search query
 */
export async function searchJournalEntries(searchTerm) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        // Note: Firestore doesn't support full-text search natively
        // This is a basic implementation that fetches all and filters client-side
        // For production, consider using Algolia or ElasticSearch
        
        const q = query(
            collection(db, 'journal_entries'),
            where('userId', '==', user.uid),
            where('isDeleted', '==', false),
            orderBy('createdAt', 'desc'),
            limit(500)
        );

        const snapshot = await getDocs(q);
        const allEntries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Client-side search (case-insensitive)
        const searchLower = searchTerm.toLowerCase();
        const matchingEntries = allEntries.filter(entry => {
            const plainText = entry.plainText?.toLowerCase() || '';
            const tags = entry.tags?.join(' ').toLowerCase() || '';
            return plainText.includes(searchLower) || tags.includes(searchLower);
        });

        return matchingEntries;
    } catch (error) {
        console.error('❌ Error searching journal entries:', error);
        return [];
    }
}

/**
 * Get journal entries by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 */
export async function getJournalEntriesByDateRange(startDate, endDate) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        const q = query(
            collection(db, 'journal_entries'),
            where('userId', '==', user.uid),
            where('isDeleted', '==', false),
            where('createdAt', '>=', startDate),
            where('createdAt', '<=', endDate),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('❌ Error fetching journal entries by date:', error);
        return [];
    }
}

/**
 * Export journal entries to JSON
 * @param {Array} entries - Array of journal entries
 */
export function exportJournalToJSON(entries) {
    const exportData = {
        exportedAt: new Date().toISOString(),
        totalEntries: entries.length,
        entries: entries.map(e => ({
            id: e.id,
            createdAt: e.createdAt?.toDate ? e.createdAt.toDate().toISOString() : null,
            updatedAt: e.updatedAt?.toDate ? e.updatedAt.toDate().toISOString() : null,
            mood: e.mood,
            tags: e.tags,
            wordCount: e.wordCount,
            content: e.content,
            plainText: e.plainText
        }))
    };

    return JSON.stringify(exportData, null, 2);
}

/**
 * Export journal entries to PDF (client-side)
 * Requires jsPDF library
 */
export async function exportJournalToPDF(entries) {
    // This function requires jsPDF to be loaded
    // Add to HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    
    if (typeof window.jspdf === 'undefined') {
        throw new Error('jsPDF library not loaded. Add the script tag to your HTML.');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('My Journal', 20, 20);
    
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleDateString()}`, 20, 28);
    doc.text(`Total Entries: ${entries.length}`, 20, 34);

    let yPosition = 45;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    entries.forEach((entry, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - margin - 20) {
            doc.addPage();
            yPosition = margin;
        }

        // Entry date
        const entryDate = entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString() : 'Unknown date';
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Entry ${index + 1} - ${entryDate}`, margin, yPosition);
        yPosition += lineHeight;

        // Mood
        if (entry.mood) {
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Mood: ${entry.mood}`, margin, yPosition);
            yPosition += lineHeight;
        }

        // Content (plain text, truncated if too long)
        const content = entry.plainText || '';
        const lines = doc.splitTextToSize(content.substring(0, 500), doc.internal.pageSize.width - margin * 2);
        
        doc.setFontSize(10);
        lines.forEach(line => {
            if (yPosition > pageHeight - margin - 20) {
                doc.addPage();
                yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += 5;
        });

        yPosition += 10; // Space between entries
    });

    return doc;
}

// === MOOD TRACKING ===

/**
 * Log a mood entry
 * @param {string} mood - 'great' | 'good' | 'okay' | 'low' | 'terrible'
 * @param {string} note - Optional note
 */
export async function logMood(mood, note = '') {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const moodData = {
        userId: user.uid,
        mood: mood,
        note: note,
        createdAt: serverTimestamp()
    };

    try {
        await addDoc(collection(db, 'mood_entries'), moodData);
        console.log('✅ Mood logged:', mood);
        return true;
    } catch (error) {
        console.error('❌ Error logging mood:', error);
        throw error;
    }
}

/**
 * Get mood history for current user
 * @param {number} days - Number of days to fetch (default: 30)
 */
export async function getMoodHistory(days = 30) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const q = query(
            collection(db, 'mood_entries'),
            where('userId', '==', user.uid),
            where('createdAt', '>=', startDate),
            orderBy('createdAt', 'asc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('❌ Error fetching mood history:', error);
        return [];
    }
}

/**
 * Get mood statistics
 * @param {number} days - Number of days (default: 30)
 */
export async function getMoodStats(days = 30) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const moodHistory = await getMoodHistory(days);
    
    // Calculate mood distribution
    const moodCounts = {};
    moodHistory.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    // Calculate average mood (numeric mapping)
    const moodValues = {
        'great': 5,
        'good': 4,
        'okay': 3,
        'low': 2,
        'terrible': 1
    };

    let totalValue = 0;
    let totalCount = 0;
    moodHistory.forEach(entry => {
        if (moodValues[entry.mood]) {
            totalValue += moodValues[entry.mood];
            totalCount++;
        }
    });

    const avgMood = totalCount > 0 ? totalValue / totalCount : 0;
    
    // Determine mood trend (compare first half vs second half)
    const midpoint = Math.floor(moodHistory.length / 2);
    const firstHalf = moodHistory.slice(0, midpoint);
    const secondHalf = moodHistory.slice(midpoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, e) => sum + (moodValues[e.mood] || 0), 0) / (firstHalf.length || 1);
    const secondHalfAvg = secondHalf.reduce((sum, e) => sum + (moodValues[e.mood] || 0), 0) / (secondHalf.length || 1);
    
    let trend = 'stable';
    if (secondHalfAvg > firstHalfAvg + 0.3) trend = 'improving';
    if (secondHalfAvg < firstHalfAvg - 0.3) trend = 'declining';

    return {
        totalEntries: moodHistory.length,
        moodDistribution: moodCounts,
        averageMood: avgMood.toFixed(2),
        trend: trend,
        mostCommonMood: Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null
    };
}

console.log('✅ Journal Service loaded');
