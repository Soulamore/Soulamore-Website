# ============================================================
# Soulamore Compliance Sprint Deploy Script
# Branch: feat/compliance-security-rules
# Run this in an interactive PowerShell terminal
# ============================================================

Write-Host "=== Soulamore Compliance Deploy ===" -ForegroundColor Cyan
Write-Host "Project: soulamore-f0a64" -ForegroundColor Yellow

# Step 1: Switch to correct firebase account
Write-Host "`n[1/5] Switching Firebase account to contact.soulamore@gmail.com..." -ForegroundColor Green
firebase login:use contact.soulamore@gmail.com
if ($LASTEXITCODE -ne 0) {
    Write-Host "Account not found locally. Adding it now (browser will open)..." -ForegroundColor Yellow
    firebase login:add
    firebase login:use contact.soulamore@gmail.com
}

# Step 2: Build Cloud Functions
Write-Host "`n[2/5] Building Cloud Functions..." -ForegroundColor Green
Set-Location functions
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Functions build failed!"; exit 1 }
Set-Location ..

# Step 3: Deploy Firestore Rules (Security Lockdown - CRITICAL)
Write-Host "`n[3/5] Deploying Firestore Security Rules..." -ForegroundColor Green
firebase deploy --only firestore:rules --project soulamore-f0a64
if ($LASTEXITCODE -ne 0) { Write-Error "Firestore rules deploy failed!"; exit 1 }
Write-Host "   ✅ Rules deployed! Roles lockdown + consent collections secured." -ForegroundColor Green

# Step 4: Deploy Cloud Functions
Write-Host "`n[4/5] Deploying Cloud Functions..." -ForegroundColor Green
firebase deploy --only functions --project soulamore-f0a64
if ($LASTEXITCODE -ne 0) { Write-Host "   ⚠️  Functions deploy failed - check error above" -ForegroundColor Yellow }

# Step 5: Deploy Hosting (new HTML pages, auth guard, signup, parental consent)
Write-Host "`n[5/5] Deploying Hosting (new pages + JS updates)..." -ForegroundColor Green
firebase deploy --only hosting --project soulamore-f0a64
if ($LASTEXITCODE -ne 0) { Write-Error "Hosting deploy failed!"; exit 1 }
Write-Host "   ✅ Hosting deployed!" -ForegroundColor Green

Write-Host "`n=== DEPLOY COMPLETE ===" -ForegroundColor Cyan
Write-Host "Live URL: https://soulamore-f0a64.web.app" -ForegroundColor Yellow
Write-Host ""
Write-Host "Post-deploy verification checklist:" -ForegroundColor White
Write-Host "  1. Visit /portal/signup.html -> test age gating (DOB < 13 = hard block)" -ForegroundColor Gray
Write-Host "  2. Test password strength meter + HaveIBeenPwned breach check" -ForegroundColor Gray
Write-Host "  3. Register as 13-17 minor -> verify parent email prompt" -ForegroundColor Gray
Write-Host "  4. Check /auth/parental-consent-pending.html renders correctly" -ForegroundColor Gray
Write-Host "  5. Login as new user -> verify wellness consent modal appears" -ForegroundColor Gray
Write-Host "  6. Check Firestore Console -> roles collection write rules are locked" -ForegroundColor Gray
