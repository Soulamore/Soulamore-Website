/**
 * AUTH GUARD V2 - Role-Based Access Control
 * Redirects users to correct dashboard based on their role
 *
 * Roles: admin, psychologist, peer, user (member)
 */
(function () {
    console.log('🔒 Auth Guard Checking...');

    const currentPath = window.location.pathname.toLowerCase();
    const LOGIN_URL = '../portal/login.html';

    // Dashboard role requirements - STRICT ENFORCEMENT
    const ROLE_RULES = {
        'user-dashboard': ['user', 'member', 'student', 'workplace', 'corporate', 'admin'],
        'user-dashboard-v2': ['user', 'member', 'student', 'workplace', 'corporate', 'admin'],
        'student-dashboard-v2': ['student', 'user', 'member', 'admin'],
        'workplace-dashboard-v2': ['workplace', 'corporate', 'user', 'member', 'admin'],
        'peer-dashboard': ['peer', 'admin'],
        'peer-dashboard-v2': ['peer', 'admin'],
        'psych-dashboard': ['psychologist', 'admin'],
        'psych-dashboard-v2': ['psychologist', 'admin'],
        'admin-dashboard': ['admin'],
        'admin-dashboard-v2': ['admin']
    };

    // Get user's role via RoleHelper (Standardized)
    async function getUserRole(uid, email) {
        try {
            const { getUserRole: getRobustRole } = await import('./role-helper.js');
            const roleInfo = await getRobustRole(uid, email);
            console.log('✅ User role loaded via RoleHelper:', roleInfo.role);
            return roleInfo.role;
        } catch (err) {
            console.error('❌ Error loading role via RoleHelper:', err);
            return 'user';
        }
    }

    // Redirect to correct dashboard based on role
    function redirectToDashboard(role) {
        const roleLower = role.toLowerCase();

        // Map roles to V2 dashboard URLs (absolute paths)
        const dashboardMap = {
            'admin': '/portal/admin-dashboard-v2.html',
            'psychologist': '/portal/psych-dashboard-v2.html',
            'peer': '/portal/peer-dashboard-v2.html',
            'student': '/portal/student-dashboard-v2.html',
            'workplace': '/portal/workplace-dashboard-v2.html',
            'corporate': '/portal/workplace-dashboard-v2.html',
            'user': '/portal/user-dashboard-v2.html',
            'member': '/portal/user-dashboard-v2.html'
        };

        const targetDashboard = dashboardMap[roleLower] || dashboardMap['user'];

        // Compare by filename to avoid relative vs absolute path mismatches
        const currentFile = window.location.pathname.split('/').pop();
        const targetFile = targetDashboard.split('/').pop();

        // Only redirect if not already on correct dashboard
        if (currentFile !== targetFile) {
            console.log('🔄 Redirecting to', roleLower, 'dashboard:', targetDashboard);
            window.location.replace(targetDashboard);
        }
    }

    // Main auth check
    async function runAuthCheck() {
        try {
            const { auth, onAuthStateChanged } = await import('./firebase-config.js');

            onAuthStateChanged(auth, async (user) => {
                // --- DEV BYPASS CHECK ---
                const session = JSON.parse(localStorage.getItem('soulamore_session') || '{}');
                const isDevSession = session.isLoggedIn && session.userId && session.userId.startsWith('dev-');

                if (!user && !isDevSession) {
                    console.log('⚠️ No user logged in, redirecting to login');
                    window.location.href = LOGIN_URL;
                    return;
                }

                console.log('✅ User authenticated:', user ? user.email : 'Dev Session');

        // --- COMPLIANCE: WELLNESS ONBOARDING CONSENT MODAL ---
        function showOnboardingConsentModal(user, userDocRef, userData) {
            if (document.getElementById('compliance-onboarding-modal')) return;

            const modalHtml = `
                <div id="compliance-onboarding-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(15px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;">
                    <div style="background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; max-width: 500px; padding: 40px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); text-align: center; color: #f1f5f9; font-family: 'Plus Jakarta Sans', sans-serif;">
                        <div style="font-size: 3.5rem; color: #4ECDC4; margin-bottom: 20px;">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.8rem; margin-bottom: 15px; background: linear-gradient(135deg, #fff, #a5f3fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Before you begin</h2>
                        <p style="font-size: 1rem; opacity: 0.85; line-height: 1.6; margin-bottom: 20px; text-align: left;">
                            Soulamore stores your journal entries and mood data to power your self-reflection experience. 
                        </p>
                        <p style="font-size: 0.95rem; opacity: 0.85; line-height: 1.6; margin-bottom: 20px; text-align: left; font-weight: 600;">
                            This is sensitive information. Here's our commitment to you:
                        </p>
                        <ul style="text-align: left; font-size: 0.9rem; opacity: 0.85; line-height: 1.6; margin-bottom: 25px; padding-left: 20px;">
                            <li style="margin-bottom: 8px;">It is encrypted and only you can see it.</li>
                            <li style="margin-bottom: 8px;">We never share it with advertisers or third parties.</li>
                            <li style="margin-bottom: 8px;">You can delete it all at any time from your account settings.</li>
                        </ul>
                        <p style="font-size: 0.85rem; opacity: 0.7; line-height: 1.5; margin-bottom: 25px; text-align: left;">
                            If you ever need support beyond self-reflection, please reach out to a professional. 
                            We have crisis helplines always available on our <a href="/company/compliance.html" target="_blank" style="color: #4ECDC4; text-decoration: underline;">Crisis Resources Page</a>.
                        </p>
                        <div style="display: flex; gap: 15px; justify-content: center;">
                            <button id="btn-consent-accept" style="border: none; padding: 12px 24px; border-radius: 50px; font-weight: 700; font-size: 0.95rem; cursor: pointer; background: linear-gradient(135deg, #4ECDC4, #2a9d8f); color: #0f172a; transition: 0.3s;">I understand — let's go</button>
                            <a href="/company/compliance.html" target="_blank" style="border: 1px solid rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 50px; font-weight: 700; font-size: 0.95rem; color: #f1f5f9; text-decoration: none; display: inline-block; transition: 0.3s;">Learn Privacy</a>
                        </div>
                    </div>
                </div>
            `;

            const div = document.createElement('div');
            div.innerHTML = modalHtml;
            document.body.appendChild(div.firstElementChild);

            document.getElementById('btn-consent-accept').addEventListener('click', async () => {
                const btn = document.getElementById('btn-consent-accept');
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

                try {
                    const { doc, setDoc, updateDoc, db, serverTimestamp } = await import('./firebase-config.js');
                    const consentId = crypto.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));
                    
                    await setDoc(doc(db, "processing_consents", consentId), {
                        userId: user.uid,
                        consentType: 'wellness_data_processing',
                        consentVersion: '1.0',
                        consentTextShown: 'Soulamore stores your journal entries and mood data to power your self-reflection experience. This is sensitive information. It is encrypted, never shared, and can be deleted at any time.',
                        consented: true,
                        consentMethod: 'onboarding_modal',
                        createdAt: serverTimestamp()
                    });

                    await updateDoc(userDocRef, {
                        consentWellnessDataProcessing: true
                    });

                    const modal = document.getElementById('compliance-onboarding-modal');
                    if (modal) modal.remove();
                } catch (e) {
                    console.error("Failed to save consent:", e);
                    alert("Error saving consent settings: " + e.message);
                    btn.disabled = false;
                    btn.textContent = "I understand — let's go";
                }
            });
        }

        // --- COMPLIANCE CHECK: MINOR CONSENT & ONBOARDING GATE ---
                    if (user && !isDevSession) {
                        try {
                            const { doc, getDoc, db, collection, query, where, getDocs, updateDoc } = await import('./firebase-config.js');
                            const userDocRef = doc(db, 'users', user.uid);
                            const userDoc = await getDoc(userDocRef);
                            
                            if (userDoc.exists()) {
                                const userData = userDoc.data();

                                if (userData.status === 'pending_deletion') {
                                    console.warn('🔒 Account is pending deletion. Logging out...');
                                    alert("This account is scheduled for deletion and is currently deactivated. If you wish to restore your account, please contact support.");
                                    const { auth } = await import('./firebase-config.js');
                                    await auth.signOut();
                                    localStorage.removeItem('soulamore_session');
                                    window.location.href = '../portal/login.html';
                                    return;
                                }
                                
                                if (userData.ageGateTier === 'minor' && userData.parentalConsentStatus === 'pending') {
                                    console.log('🔒 Minor user pending consent check. Checking approvals...');
                                    
                                    const consentQuery = query(
                                        collection(db, 'parental_consents'),
                                        where('minorUserId', '==', user.uid)
                                    );
                                    const querySnapshot = await getDocs(consentQuery);
                                    
                                    let status = 'pending';
                                    querySnapshot.forEach(doc => {
                                        const cData = doc.data();
                                        if (cData.status === 'approved') status = 'approved';
                                        if (cData.status === 'denied') status = 'denied';
                                    });
                                    
                                    if (status === 'approved') {
                                        console.log('✅ Minor approved by parent. Updating user doc...');
                                        await updateDoc(userDocRef, {
                                            parentalConsentStatus: 'approved'
                                        });
                                    } else if (status === 'denied') {
                                        console.warn('❌ Minor denied by parent. Logging out...');
                                        alert("Registration denied by parent or guardian. This account will be deleted.");
                                        const { auth } = await import('./firebase-config.js');
                                        await auth.signOut();
                                        localStorage.removeItem('soulamore_session');
                                        window.location.href = '../portal/login.html';
                                        return;
                                    } else {
                                        console.warn('🔒 Minor consent is still pending. Redirecting...');
                                        const { auth } = await import('./firebase-config.js');
                                        await auth.signOut();
                                        localStorage.removeItem('soulamore_session');
                                        window.location.href = '../auth/parental-consent-pending.html';
                                        return;
                                    }
                                }

                                // Gate onboarding consent modal
                                if (!userData.consentWellnessDataProcessing) {
                                    console.log('🔒 Onboarding wellness consent modal triggered.');
                                    showOnboardingConsentModal(user, userDocRef, userData);
                                }
                            }
                        } catch (complianceErr) {
                            console.error('Error checking compliance gates:', complianceErr);
                        }
                    }

                // Get user's role
                let role = isDevSession ? session.role : await getUserRole(user.uid, user.email);

                // Update role in session if needed
                if (session.role !== role) {
                    session.role = role;
                    localStorage.setItem('soulamore_session', JSON.stringify(session));
                }

                try {
                    const { redirectIfMaintenanceActive } = await import('./maintenance-mode.js');
                    const redirectedForMaintenance = await redirectIfMaintenanceActive({ role });
                    if (redirectedForMaintenance) {
                        console.warn('Maintenance mode active. Redirecting non-admin user.');
                        return;
                    }
                } catch (maintenanceError) {
                    console.warn('Maintenance check failed inside auth guard:', maintenanceError.message);
                }

                // 🔄 IMMEDIATE REDIRECT: Check if user is on correct dashboard
                let currentPage = '';
                const isSuperAdminEmail = user && user.email && (user.email.toLowerCase() === 'aditya110197@gmail.com' || user.email.toLowerCase() === 'admin@soulamore.com');

                for (const [pageKey, allowedRoles] of Object.entries(ROLE_RULES)) {
                    if (currentPath.includes(pageKey)) {
                        currentPage = pageKey;

                        // Check if user's role matches this dashboard
                        if (!allowedRoles.includes(role.toLowerCase()) && !isSuperAdminEmail) {
                            console.warn('⛔ Role', role, 'not allowed on', pageKey, '- Redirecting to', role, 'dashboard');
                            redirectToDashboard(role);
                            return; // Exit immediately
                        } else {
                            console.log('✅ Access granted to', pageKey, 'for role:', role);
                        }
                        break;
                    }
                }

                // If not on a dashboard page, redirect to appropriate dashboard
                if (!currentPage) {
                    console.log('📍 Not on a dashboard page, redirecting to', role, 'dashboard');
                    redirectToDashboard(role);
                }
            });

        } catch (error) {
            console.error('❌ Auth Guard failed:', error);
            // Fail open - allow access but log error
        }
    }

    // Run auth check
    runAuthCheck();

    console.log('✅ Auth Guard initialized');
})();
