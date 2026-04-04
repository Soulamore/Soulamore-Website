/**
 * Blog Service - Centralized Blog Management
 * Handles CRUD operations, admin approval workflow, and engagement features
 */

import { 
    auth, db, 
    collection, addDoc, updateDoc, deleteDoc, 
    doc, getDoc, getDocs, query, where, orderBy, limit,
    serverTimestamp, increment, arrayUnion, arrayRemove 
} from './firebase-config.js';

// === BLOG POSTS ===

/**
 * Create a new blog post
 * @param {Object} blogData - { title, content, category, tags, featuredImage }
 * @param {string} status - 'draft' | 'pending_approval' | 'published'
 */
export async function createBlogPost(blogData, status = 'draft') {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    // Get user role
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    const userRole = userData?.role || 'member';

    const newBlog = {
        ...blogData,
        authorId: user.uid,
        authorName: user.displayName || userData?.displayName || 'Anonymous',
        authorRole: userRole,
        authorImage: userData?.photoURL || null,
        status: status, // Auto-draft or pending approval
        views: 0,
        likes: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: status === 'published' ? serverTimestamp() : null
    };

    try {
        const docRef = await addDoc(collection(db, 'blog_posts'), newBlog);
        console.log('✅ Blog created:', docRef.id);
        return { id: docRef.id, ...newBlog };
    } catch (error) {
        console.error('❌ Error creating blog:', error);
        throw error;
    }
}

/**
 * Update an existing blog post
 * @param {string} blogId - Blog post ID
 * @param {Object} updates - Fields to update
 */
export async function updateBlogPost(blogId, updates) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const blogRef = doc(db, 'blog_posts', blogId);
    const blogDoc = await getDoc(blogRef);
    
    if (!blogDoc.exists()) {
        throw new Error('Blog post not found');
    }

    const blogData = blogDoc.data();
    
    // Check permissions: author or admin
    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    const isAuthor = blogData.authorId === user.uid;

    if (!isAdmin && !isAuthor) {
        throw new Error('Unauthorized: Only author or admin can update');
    }

    const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
    };

    try {
        await updateDoc(blogRef, updateData);
        console.log('✅ Blog updated:', blogId);
        return true;
    } catch (error) {
        console.error('❌ Error updating blog:', error);
        throw error;
    }
}

/**
 * Delete a blog post
 * @param {string} blogId - Blog post ID
 */
export async function deleteBlogPost(blogId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const blogRef = doc(db, 'blog_posts', blogId);
    const blogDoc = await getDoc(blogRef);
    
    if (!blogDoc.exists()) {
        throw new Error('Blog post not found');
    }

    const blogData = blogDoc.data();
    
    // Check permissions: author or admin
    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    const isAuthor = blogData.authorId === user.uid;

    if (!isAdmin && !isAuthor) {
        throw new Error('Unauthorized: Only author or admin can delete');
    }

    try {
        await deleteDoc(blogRef);
        console.log('✅ Blog deleted:', blogId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting blog:', error);
        throw error;
    }
}

/**
 * Get a single blog post by ID
 * @param {string} blogId - Blog post ID
 */
export async function getBlogPost(blogId) {
    try {
        const blogRef = doc(db, 'blog_posts', blogId);
        const blogDoc = await getDoc(blogRef);
        
        if (!blogDoc.exists()) {
            return null;
        }

        const blogData = blogDoc.data();
        return { id: blogRef.id, ...blogData };
    } catch (error) {
        console.error('❌ Error fetching blog:', error);
        return null;
    }
}

/**
 * Get all published blog posts with filters
 * @param {Object} options - { category, tag, limit, orderBy, order }
 */
export async function getBlogPosts(options = {}) {
    const {
        category = null,
        tag = null,
        limit: maxLimit = 20,
        orderByField = 'publishedAt',
        order = 'desc'
    } = options;

    try {
        let q;
        if (category) {
            q = query(
                collection(db, 'blog_posts'),
                where('status', '==', 'published'),
                where('category', '==', category),
                orderBy(orderByField, order),
                limit(maxLimit)
            );
        } else if (tag) {
            q = query(
                collection(db, 'blog_posts'),
                where('status', '==', 'published'),
                where('tags', 'array-contains', tag),
                orderBy(orderByField, order),
                limit(maxLimit)
            );
        } else {
            q = query(
                collection(db, 'blog_posts'),
                where('status', '==', 'published'),
                orderBy(orderByField, order),
                limit(maxLimit)
            );
        }

        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log('📝 Loaded', posts.length, 'published blog posts');
        return posts;
    } catch (error) {
        console.error('❌ Error fetching blogs:', error);
        return [];
    }
}

/**
 * Get all blog posts (including drafts/pending) - For admin use only
 * @param {Object} options - { status, limit }
 */
export async function getAllBlogsForAdmin(options = {}) {
    const { status = null, limit: maxLimit = 50 } = options;

    const user = auth.currentUser;
    if (!user) {
        console.warn('⚠️ User not authenticated');
        return [];
    }

    // Check if admin
    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;

    if (!isAdmin) {
        console.warn('⚠️ Non-admin user tried to access all blogs');
        return [];
    }

    try {
        let q;
        if (status) {
            q = query(
                collection(db, 'blog_posts'),
                where('status', '==', status),
                orderBy('createdAt', 'desc'),
                limit(maxLimit)
            );
        } else {
            q = query(
                collection(db, 'blog_posts'),
                orderBy('createdAt', 'desc'),
                limit(maxLimit)
            );
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('❌ Error fetching all blogs:', error);
        return [];
    }
}

/**
 * Get pending blog posts for admin approval
 */
export async function getPendingBlogs() {
    const user = auth.currentUser;
    if (!user) return [];

    // Check if admin
    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    
    if (!isAdmin) {
        console.warn('⚠️ Non-admin user tried to fetch pending blogs');
        return [];
    }

    try {
        const q = query(
            collection(db, 'blog_posts'),
            where('status', '==', 'pending_approval'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('❌ Error fetching pending blogs:', error);
        return [];
    }
}

/**
 * Approve a blog post (admin only)
 * @param {string} blogId - Blog post ID
 */
export async function approveBlogPost(blogId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    // Check if admin
    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    
    if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
    }

    try {
        await updateDoc(doc(db, 'blog_posts', blogId), {
            status: 'published',
            publishedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log('✅ Blog approved:', blogId);
        return true;
    } catch (error) {
        console.error('❌ Error approving blog:', error);
        throw error;
    }
}

/**
 * Reject a blog post (admin only)
 * @param {string} blogId - Blog post ID
 * @param {string} reason - Rejection reason
 */
export async function rejectBlogPost(blogId, reason = '') {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    
    if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
    }

    try {
        await updateDoc(doc(db, 'blog_posts', blogId), {
            status: 'rejected',
            rejectionReason: reason,
            rejectedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log('✅ Blog rejected:', blogId);
        return true;
    } catch (error) {
        console.error('❌ Error rejecting blog:', error);
        throw error;
    }
}

/**
 * Increment view count for a blog post
 * @param {string} blogId - Blog post ID
 */
export async function incrementBlogViews(blogId) {
    try {
        const blogRef = doc(db, 'blog_posts', blogId);
        await updateDoc(blogRef, {
            views: increment(1)
        });
    } catch (error) {
        console.error('❌ Error incrementing views:', error);
    }
}

/**
 * Like a blog post
 * @param {string} blogId - Blog post ID
 */
export async function likeBlogPost(blogId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        const blogRef = doc(db, 'blog_posts', blogId);
        
        // Check if user already liked
        const blogDoc = await getDoc(blogRef);
        const blogData = blogDoc.data();
        
        if (blogData.likedBy?.includes(user.uid)) {
            // Unlike
            await updateDoc(blogRef, {
                likes: increment(-1),
                likedBy: arrayRemove(user.uid)
            });
            return { liked: false };
        } else {
            // Like
            await updateDoc(blogRef, {
                likes: increment(1),
                likedBy: arrayUnion(user.uid)
            });
            return { liked: true };
        }
    } catch (error) {
        console.error('❌ Error liking blog:', error);
        throw error;
    }
}

/**
 * Get blogs by author ID
 * @param {string} authorId - User ID
 * @param {string} status - Filter by status (default: 'published')
 */
export async function getBlogsByAuthor(authorId, status = 'published') {
    try {
        const q = query(
            collection(db, 'blog_posts'),
            where('authorId', '==', authorId),
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('❌ Error fetching author blogs:', error);
        return [];
    }
}

/**
 * Get related blog posts (same category)
 * @param {string} blogId - Current blog ID
 * @param {string} category - Category to match
 * @param {number} limit - Number of posts to return
 */
export async function getRelatedBlogs(blogId, category, maxLimit = 3) {
    try {
        const q = query(
            collection(db, 'blog_posts'),
            where('status', '==', 'published'),
            where('category', '==', category),
            orderBy('publishedAt', 'desc'),
            limit(maxLimit)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs
            .filter(doc => doc.id !== blogId)
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    } catch (error) {
        console.error('❌ Error fetching related blogs:', error);
        return [];
    }
}

// === BLOG COMMENTS ===

/**
 * Add a comment to a blog post
 * @param {string} blogId - Blog post ID
 * @param {Object} commentData - { content, parentId (optional) }
 */
export async function addBlogComment(blogId, commentData) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const userData = await getDoc(doc(db, 'users', user.uid));
    const userDataObj = userData.data();

    const comment = {
        blogId: blogId,
        userId: user.uid,
        userName: user.displayName || userDataObj?.displayName || 'Anonymous',
        userRole: userDataObj?.role || 'member',
        userImage: userDataObj?.photoURL || null,
        content: commentData.content,
        parentId: commentData.parentId || null,
        likes: 0,
        replies: 0,
        createdAt: serverTimestamp()
    };

    try {
        const docRef = await addDoc(collection(db, 'blog_comments'), comment);
        
        // Increment comment count on blog
        const blogRef = doc(db, 'blog_posts', blogId);
        await updateDoc(blogRef, {
            commentsCount: increment(1)
        });

        console.log('✅ Comment added:', docRef.id);
        return { id: docRef.id, ...comment };
    } catch (error) {
        console.error('❌ Error adding comment:', error);
        throw error;
    }
}

/**
 * Get comments for a blog post
 * @param {string} blogId - Blog post ID
 */
export async function getBlogComments(blogId) {
    try {
        // Get parent comments first
        const parentQuery = query(
            collection(db, 'blog_comments'),
            where('blogId', '==', blogId),
            where('parentId', '==', null),
            orderBy('createdAt', 'asc')
        );

        const snapshot = await getDocs(parentQuery);
        const parentComments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Get replies for each parent comment
        const commentsWithReplies = await Promise.all(
            parentComments.map(async (comment) => {
                const replyQuery = query(
                    collection(db, 'blog_comments'),
                    where('blogId', '==', blogId),
                    where('parentId', '==', comment.id),
                    orderBy('createdAt', 'asc')
                );

                const replySnapshot = await getDocs(replyQuery);
                const replies = replySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                return {
                    ...comment,
                    replies
                };
            })
        );

        return commentsWithReplies;
    } catch (error) {
        console.error('❌ Error fetching comments:', error);
        return [];
    }
}

/**
 * Delete a blog comment
 * @param {string} commentId - Comment ID
 */
export async function deleteBlogComment(commentId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const commentRef = doc(db, 'blog_comments', commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
        throw new Error('Comment not found');
    }

    const commentData = commentDoc.data();
    
    // Check permissions: comment author or admin
    const userRoleDoc = await getDoc(doc(db, 'roles', user.uid));
    const isAdmin = userRoleDoc.data()?.admin === true;
    const isAuthor = commentData.userId === user.uid;

    if (!isAdmin && !isAuthor) {
        throw new Error('Unauthorized: Only comment author or admin can delete');
    }

    try {
        await deleteDoc(commentRef);
        
        // Decrement comment count on blog
        const blogRef = doc(db, 'blog_posts', commentData.blogId);
        await updateDoc(blogRef, {
            commentsCount: increment(-1)
        });

        console.log('✅ Comment deleted:', commentId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting comment:', error);
        throw error;
    }
}

/**
 * Like a blog comment
 * @param {string} commentId - Comment ID
 */
export async function likeBlogComment(commentId) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    try {
        const commentRef = doc(db, 'blog_comments', commentId);
        const commentDoc = await getDoc(commentRef);
        
        if (!commentDoc.exists()) {
            throw new Error('Comment not found');
        }

        const commentData = commentDoc.data();
        
        if (commentData.likedBy?.includes(user.uid)) {
            // Unlike
            await updateDoc(commentRef, {
                likes: increment(-1),
                likedBy: arrayRemove(user.uid)
            });
            return { liked: false };
        } else {
            // Like
            await updateDoc(commentRef, {
                likes: increment(1),
                likedBy: arrayUnion(user.uid)
            });
            return { liked: true };
        }
    } catch (error) {
        console.error('❌ Error liking comment:', error);
        throw error;
    }
}

console.log('✅ Blog Service loaded');
