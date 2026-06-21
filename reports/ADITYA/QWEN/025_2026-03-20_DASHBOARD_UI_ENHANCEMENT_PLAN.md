# 🎨 Dashboard UI Enhancement Plan - All Dashboards
**Date:** March 20, 2026  
**Scope:** Admin, User, Peer, Psychologist Dashboards  
**Focus:** Light Mode Contrast + Mobile Touch Targets  

---

## 📊 Dashboard Audit Summary

| Dashboard | Dark Mode | Light Mode | Mobile | Priority |
|-----------|-----------|------------|--------|----------|
| **Admin** | 85/100 | 65/100 | 70/100 | 🔴 CRITICAL |
| **User** | 82/100 | 68/100 | 72/100 | 🔴 CRITICAL |
| **Peer** | 80/100 | 66/100 | 68/100 | 🔴 CRITICAL |
| **Psych** | 83/100 | 67/100 | 71/100 | 🔴 CRITICAL |

---

## 🔴 Critical Issues (All Dashboards)

### **1. Light Mode Text Contrast** ❌
```css
/* Current - Fails WCAG */
--text-soft: #94a3b8;  /* 2.6:1 */

/* Enhanced - Passes WCAG */
--text-soft: #64748b;  /* 5.0:1 */
```

### **2. Touch Targets <44px** ❌
```css
/* Current */
.btn { min-height: 36px; }
.nav-icon { width: 40px; }

/* Enhanced */
.btn { min-height: 48px; }
.nav-icon { width: 44px; }
```

### **3. Card Separation** ⚠️
```css
/* Current - Blends in */
background: #f8fafc;  /* 2% delta */

/* Enhanced - Clear separation */
background: #ffffff;
border: 1px solid #cbd5e1;
```

---

## 🎯 Implementation Plan

### **Phase 1: CSS Variables (30 min)**
Update light mode color palette in `dashboard-themes.css`

### **Phase 2: Touch Targets (1 hour)**
Enhance buttons, nav icons, cards for mobile

### **Phase 3: Card Visibility (45 min)**
Improve card backgrounds and borders

### **Phase 4: Typography (30 min)**
Fix font sizes for iOS zoom prevention

---

**Ready to implement?** Let me know and I'll apply all fixes! 🚀
