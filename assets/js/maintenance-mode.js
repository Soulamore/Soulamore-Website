import { db, doc, getDoc } from "./firebase-config.js";

const COLLECTION_NAME = "public_runtime";
const DOCUMENT_NAME = "maintenance";
const CACHE_KEY = "soulamore_maintenance_cache_v1";
const CACHE_TTL_MS = 60000;
const MAINTENANCE_URL = "/maintenance.html";
const BYPASS_PATHS = [
    "/maintenance.html",
    "/portal/admin-dashboard.html",
    "/portal/login.html",
    "/portal/signup.html",
    "/portal/forgot-password.html",
    "/portal/logged-out.html"
];

function readCache() {
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        if (!parsed.timestamp || (Date.now() - parsed.timestamp) > CACHE_TTL_MS) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }

        return parsed.data || null;
    } catch (error) {
        console.warn("Maintenance cache read failed:", error.message);
        return null;
    }
}

function writeCache(data) {
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data
        }));
    } catch (error) {
        console.warn("Maintenance cache write failed:", error.message);
    }
}

export function shouldBypassMaintenance(pathname = window.location.pathname) {
    const normalizedPath = (pathname || "").toLowerCase();
    return BYPASS_PATHS.some(path => normalizedPath.endsWith(path));
}

export async function getMaintenanceState(options = {}) {
    const { force = false } = options;

    if (!force) {
        const cached = readCache();
        if (cached) return cached;
    }

    try {
        const maintenanceRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
        const snapshot = await getDoc(maintenanceRef);
        const data = snapshot.exists() ? snapshot.data() : {};
        const normalized = {
            enabled: !!data.enabled,
            message: data.message || "",
            updatedAt: data.updatedAt || null,
            updatedBy: data.updatedBy || null
        };

        writeCache(normalized);
        return normalized;
    } catch (error) {
        console.warn("Maintenance state fetch failed:", error.message);
        return readCache() || { enabled: false, message: "", updatedAt: null, updatedBy: null };
    }
}

export async function redirectIfMaintenanceActive(options = {}) {
    const {
        role = "guest",
        pathname = window.location.pathname
    } = options;

    if (shouldBypassMaintenance(pathname)) {
        return false;
    }

    if ((role || "").toLowerCase() === "admin") {
        return false;
    }

    const state = await getMaintenanceState();
    if (!state.enabled) {
        return false;
    }

    const source = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace(`${MAINTENANCE_URL}?source=${source}`);
    return true;
}
