/**
 * Forum Service - Centralized Forum Management
 * Handles posts, replies, reactions, and community features
 */

import { 
    auth, db, 
    collection, addDoc, updateDoc, deleteDoc, 
    doc, getDoc, getDocs, query, where, orderBy, limit, startAfter,
    serverTimestamp, increment, arrayUnion, arrayRemove, runTransaction
} from './firebase-config.js';

// === FORUM POSTS ===

/**
 * Create a new forum post
 * @param {Object} postData - { title, content, category, tags }
 */
export async function createForumPost(postData) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    // Get user role
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    const newPost = {
        ...postData,
        authorId: user.uid,
        authorName: user.displayName || userData?.displayName || 'Anonymous',
        authorRole: userData?.role || 'member',
        authorImage: userData?.photoURL || null,
        views: 0,
        replies: 0,
        likes: 0,
        lastActivity: serverTimestamp(),
        lastActivityBy: user.uid,
        isPinned: false,
        isLocked: false,
        isReported: false,
        reports: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    try {
        const docRef = await addDoc(collection(db, 'forum_posts'), newPost);
        console.log('✅ Forum post created:', docRef.id);
        return { id: docRef.id, ...newPost };
    } catch (error) {
        console.error('❌ Error creating forum post:', error);
        throw error;
    }
}

/**
 * Update a forum post
 * @param {string} postId - Post ID
 * @param {Object} updates - Fields to update
 */
export async function updateForumPost(postId, updates) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const postRef = doc(db, 'forum_posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
        throw new Error('Post not found');
    }

    const postData = postDoc.data();
    
    // Check permissions: author or admin
    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    const isAuthor = postData.authorId === user.uid;

    if (!isAdmin && !isAuthor) {
        throw new Error('Unauthorized: Only author or admin can update');
    }

    const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
    };

    try {
        await updateDoc(postRef, updateData);
        console.log('✅ Forum post updated:', postId);
        return true;
    } catch (error) {
        console.error('❌ Error updating forum post:', error);
        throw error;
    }
}

/**
 * Delete a forum post
 * @param {string} postId - Post ID
 */
export async function deleteForumPost(postId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const postRef = doc(db, 'forum_posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
        throw new Error('Post not found');
    }

    const postData = postDoc.data();
    
    // Check permissions: author or admin
    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    const isAuthor = postData.authorId === user.uid;

    if (!isAdmin && !isAuthor) {
        throw new Error('Unauthorized: Only author or admin can delete');
    }

    try {
        await deleteDoc(postRef);
        console.log('✅ Forum post deleted:', postId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting forum post:', error);
        throw error;
    }
}

/**
 * Get a single forum post by ID
 * @param {string} postId - Post ID
 */
export async function getForumPost(postId) {
    try {
        const postRef = doc(db, 'forum_posts', postId);
        const postDoc = await getDoc(postRef);
        
        if (!postDoc.exists()) {
            return null;
        }

        const postData = postDoc.data();
        return { id: postRef.id, ...postData };
    } catch (error) {
        console.error('❌ Error fetching forum post:', error);
        return null;
    }
}

/**
 * Get forum posts with pagination and filters
 * @param {Object} options - { category, sortBy, limit, lastVisible }
 */
export async function getForumPosts(options = {}) {
    const { 
        category = null, 
        sortBy = 'latest', // 'latest' | 'top' | 'trending'
        limit: maxLimit = 20,
        lastVisible = null
    } = options;

    try {
        let q;
        
        // Build query based on sort option
        if (sortBy === 'latest') {
            if (category) {
                q = query(
                    collection(db, 'forum_posts'),
                    where('category', '==', category),
                    orderBy('createdAt', 'desc'),
                    limit(maxLimit)
                );
            } else {
                q = query(
                    collection(db, 'forum_posts'),
                    orderBy('createdAt', 'desc'),
                    limit(maxLimit)
                );
            }
        } else if (sortBy === 'top') {
            if (category) {
                q = query(
                    collection(db, 'forum_posts'),
                    where('category', '==', category),
                    orderBy('likes', 'desc'),
                    limit(maxLimit)
                );
            } else {
                q = query(
                    collection(db, 'forum_posts'),
                    orderBy('likes', 'desc'),
                    limit(maxLimit)
                );
            }
        } else if (sortBy === 'trending') {
            // Trending = most active (lastActivity)
            if (category) {
                q = query(
                    collection(db, 'forum_posts'),
                    where('category', '==', category),
                    orderBy('lastActivity', 'desc'),
                    limit(maxLimit)
                );
            } else {
                q = query(
                    collection(db, 'forum_posts'),
                    orderBy('lastActivity', 'desc'),
                    limit(maxLimit)
                );
            }
        }

        // Add pagination cursor
        if (lastVisible) {
            q = query(q, startAfter(lastVisible));
        }

        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            posts,
            lastVisible: snapshot.docs[snapshot.docs.length - 1]
        };
    } catch (error) {
        console.error('❌ Error fetching forum posts:', error);
        return { posts: [], lastVisible: null };
    }
}

/**
 * Increment view count for a forum post
 * @param {string} postId - Post ID
 */
export async function incrementPostViews(postId) {
    try {
        const postRef = doc(db, 'forum_posts', postId);
        await updateDoc(postRef, {
            views: increment(1)
        });
    } catch (error) {
        console.error('❌ Error incrementing views:', error);
    }
}

/**
 * Like a forum post
 * @param {string} postId - Post ID
 */
export async function likeForumPost(postId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        const postRef = doc(db, 'forum_posts', postId);
        
        // Check if user already liked
        const postDoc = await getDoc(postRef);
        const postData = postDoc.data();
        
        if (postData.likedBy?.includes(user.uid)) {
            // Unlike
            await updateDoc(postRef, {
                likes: increment(-1),
                likedBy: arrayRemove(user.uid)
            });
            return { liked: false };
        } else {
            // Like
            await updateDoc(postRef, {
                likes: increment(1),
                likedBy: arrayUnion(user.uid)
            });
            return { liked: true };
        }
    } catch (error) {
        console.error('❌ Error liking forum post:', error);
        throw error;
    }
}

/**
 * Report a forum post
 * @param {string} postId - Post ID
 * @param {string} reason - Report reason
 */
export async function reportForumPost(postId, reason) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        const postRef = doc(db, 'forum_posts', postId);
        const postDoc = await getDoc(postRef);
        
        if (!postDoc.exists()) {
            throw new Error('Post not found');
        }

        const postData = postDoc.data();
        const existingReports = postData.reports || [];
        
        // Check if user already reported
        const alreadyReported = existingReports.some(r => r.userId === user.uid);
        if (alreadyReported) {
            throw new Error('You have already reported this post');
        }

        // Add report
        const newReport = {
            userId: user.uid,
            reason: reason,
            timestamp: serverTimestamp()
        };

        await updateDoc(postRef, {
            reports: arrayUnion(newReport),
            isReported: true
        });

        console.log('✅ Post reported:', postId);
        return true;
    } catch (error) {
        console.error('❌ Error reporting post:', error);
        throw error;
    }
}

/**
 * Pin a forum post (admin only)
 * @param {string} postId - Post ID
 * @param {boolean} pinned - Pin status
 */
export async function pinForumPost(postId, pinned = true) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    
    if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
    }

    try {
        await updateDoc(doc(db, 'forum_posts', postId), {
            isPinned: pinned
        });
        console.log('✅ Post pinned:', postId);
        return true;
    } catch (error) {
        console.error('❌ Error pinning post:', error);
        throw error;
    }
}

/**
 * Lock a forum post (admin only)
 * @param {string} postId - Post ID
 * @param {boolean} locked - Lock status
 */
export async function lockForumPost(postId, locked = true) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    
    if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
    }

    try {
        await updateDoc(doc(db, 'forum_posts', postId), {
            isLocked: locked
        });
        console.log('✅ Post locked:', postId);
        return true;
    } catch (error) {
        console.error('❌ Error locking post:', error);
        throw error;
    }
}

/**
 * Get posts by author ID
 * @param {string} authorId - User ID
 */
export async function getPostsByAuthor(authorId) {
    try {
        const q = query(
            collection(db, 'forum_posts'),
            where('authorId', '==', authorId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('❌ Error fetching author posts:', error);
        return [];
    }
}

/**
 * Get trending posts (most active this week)
 * @param {number} limit - Number of posts to return
 */
export async function getTrendingPosts(maxLimit = 5) {
    try {
        // Get posts with most recent activity
        const q = query(
            collection(db, 'forum_posts'),
            orderBy('lastActivity', 'desc'),
            limit(maxLimit * 2) // Get more to filter
        );

        const snapshot = await getDocs(q);
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Filter posts active in the last week
        const trending = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(post => {
                if (!post.lastActivity) return false;
                const lastActivity = post.lastActivity.toDate();
                return lastActivity >= oneWeekAgo;
            })
            .slice(0, maxLimit);

        return trending;
    } catch (error) {
        console.error('❌ Error fetching trending posts:', error);
        return [];
    }
}

// === FORUM REPLIES ===

/**
 * Add a reply to a forum post
 * @param {string} postId - Post ID
 * @param {Object} replyData - { content, parentId (optional) }
 */
export async function addForumReply(postId, replyData) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    // Check if post is locked
    const postRef = doc(db, 'forum_posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
        throw new Error('Post not found');
    }

    const postData = postDoc.data();
    if (postData.isLocked) {
        throw new Error('This post is locked and cannot receive replies');
    }

    // Get user data
    const userData = await getDoc(doc(db, 'users', user.uid));
    const userDataObj = userData.data();

    const reply = {
        postId: postId,
        userId: user.uid,
        userName: user.displayName || userDataObj?.displayName || 'Anonymous',
        userRole: userDataObj?.role || 'member',
        userImage: userDataObj?.photoURL || null,
        content: replyData.content,
        parentId: replyData.parentId || null,
        likes: 0,
        isAccepted: false, // OP can mark best answer
        createdAt: serverTimestamp()
    };

    try {
        // Use transaction to ensure consistency
        await runTransaction(db, async (transaction) => {
            // Add reply
            const replyRef = await addDoc(collection(db, 'forum_replies'), reply);
            
            // Update post reply count and last activity
            transaction.update(postRef, {
                replies: increment(1),
                lastActivity: serverTimestamp(),
                lastActivityBy: user.uid
            });
            
            return replyRef;
        });

        console.log('✅ Reply added');
        return reply;
    } catch (error) {
        console.error('❌ Error adding reply:', error);
        throw error;
    }
}

/**
 * Get replies for a forum post
 * @param {string} postId - Post ID
 */
export async function getForumReplies(postId) {
    try {
        // Get parent replies first
        const parentQuery = query(
            collection(db, 'forum_replies'),
            where('postId', '==', postId),
            where('parentId', '==', null),
            orderBy('createdAt', 'asc')
        );

        const snapshot = await getDocs(parentQuery);
        const parentReplies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Get nested replies for each parent
        const repliesWithNested = await Promise.all(
            parentReplies.map(async (reply) => {
                const nestedQuery = query(
                    collection(db, 'forum_replies'),
                    where('postId', '==', postId),
                    where('parentId', '==', reply.id),
                    orderBy('createdAt', 'asc')
                );

                const nestedSnapshot = await getDocs(nestedQuery);
                const nestedReplies = nestedSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                return {
                    ...reply,
                    nestedReplies
                };
            })
        );

        return repliesWithNested;
    } catch (error) {
        console.error('❌ Error fetching replies:', error);
        return [];
    }
}

/**
 * Delete a forum reply
 * @param {string} replyId - Reply ID
 */
export async function deleteForumReply(replyId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const replyRef = doc(db, 'forum_replies', replyId);
    const replyDoc = await getDoc(replyRef);
    
    if (!replyDoc.exists()) {
        throw new Error('Reply not found');
    }

    const replyData = replyDoc.data();
    
    // Check permissions: reply author or admin
    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    const isAuthor = replyData.userId === user.uid;

    if (!isAdmin && !isAuthor) {
        throw new Error('Unauthorized: Only reply author or admin can delete');
    }

    try {
        await runTransaction(db, async (transaction) => {
            // Delete reply
            transaction.delete(replyRef);
            
            // Decrement reply count on post
            const postRef = doc(db, 'forum_posts', replyData.postId);
            transaction.update(postRef, {
                replies: increment(-1)
            });
        });

        console.log('✅ Reply deleted:', replyId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting reply:', error);
        throw error;
    }
}

/**
 * Mark a reply as accepted (OP can mark best answer)
 * @param {string} replyId - Reply ID
 * @param {boolean} accepted - Accept status
 */
export async function acceptForumReply(replyId, accepted = true) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const replyRef = doc(db, 'forum_replies', replyId);
    const replyDoc = await getDoc(replyRef);
    
    if (!replyDoc.exists()) {
        throw new Error('Reply not found');
    }

    const replyData = replyDoc.data();
    
    // Only OP (original poster) can accept a reply
    if (replyData.userId !== user.uid) {
        throw new Error('Only the post author can mark a reply as accepted');
    }

    try {
        await updateDoc(replyRef, {
            isAccepted: accepted
        });
        console.log('✅ Reply marked as accepted:', replyId);
        return true;
    } catch (error) {
        console.error('❌ Error accepting reply:', error);
        throw error;
    }
}

/**
 * Like a forum reply
 * @param {string} replyId - Reply ID
 */
export async function likeForumReply(replyId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        const replyRef = doc(db, 'forum_replies', replyId);
        const replyDoc = await getDoc(replyRef);
        
        if (!replyDoc.exists()) {
            throw new Error('Reply not found');
        }

        const replyData = replyDoc.data();
        
        if (replyData.likedBy?.includes(user.uid)) {
            // Unlike
            await updateDoc(replyRef, {
                likes: increment(-1),
                likedBy: arrayRemove(user.uid)
            });
            return { liked: false };
        } else {
            // Like
            await updateDoc(replyRef, {
                likes: increment(1),
                likedBy: arrayUnion(user.uid)
            });
            return { liked: true };
        }
    } catch (error) {
        console.error('❌ Error liking reply:', error);
        throw error;
    }
}

// === FORUM CATEGORIES ===

/**
 * Get all forum categories with post counts
 */
export async function getForumCategories() {
    const categories = [
        { id: 'anxiety', name: 'Anxiety & Stress', icon: '🌊', color: '#4ECDC4' },
        { id: 'relationships', name: 'Relationships', icon: '💙', color: '#F49F75' },
        { id: 'student-life', name: 'Student Life', icon: '📚', color: '#fbbf24' },
        { id: 'depression', name: 'Depression Support', icon: '🌙', color: '#6366f1' },
        { id: 'self-care', name: 'Self Care', icon: '🌿', color: '#10b981' },
        { id: 'family', name: 'Family Dynamics', icon: '🏠', color: '#ec4899' },
        { id: 'career', name: 'Career & Work', icon: '💼', color: '#8b5cf6' },
        { id: 'general', name: 'General Discussion', icon: '💬', color: '#64748b' }
    ];

    try {
        // Get post counts for each category
        const counts = await Promise.all(
            categories.map(async (cat) => {
                const q = query(
                    collection(db, 'forum_posts'),
                    where('category', '==', cat.id)
                );
                const snapshot = await getDocs(q);
                return {
                    ...cat,
                    count: snapshot.size
                };
            })
        );

        return counts;
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        return categories;
    }
}

console.log('✅ Forum Service loaded');
