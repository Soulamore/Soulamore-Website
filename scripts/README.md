# API Key Management Scripts

These scripts handle secure API key injection for the Gemini API in SoulBot.

## 🔐 Security Setup

### 1. Add GitHub Secret (Required for Deployment)

1. Go to your GitHub repository: https://github.com/Soulamore/Soulamore-Website
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GEMINI_API_KEY`
5. Value: Your actual Gemini API key from Google Cloud Console
6. Click **Add secret**

Once this is added, GitHub Actions will automatically inject the API key during deployment when you push to `main`.

### 2. Local Development Setup

For local development, run:

```bash
./scripts/setup-local-dev.sh YOUR_ACTUAL_API_KEY
```

This will inject your API key into the HTML files for local testing.

### 3. Before Committing Changes

Always restore the placeholder before committing to git:

```bash
./scripts/restore-placeholder.sh
```

This ensures the API key is never accidentally committed.

## 📝 Workflow

### For Development:
1. Run `./scripts/setup-local-dev.sh YOUR_API_KEY` to inject the key locally
2. Test your changes locally
3. Run `./scripts/restore-placeholder.sh` to restore placeholder
4. Commit and push your changes

### For Production:
1. Ensure `GEMINI_API_KEY` secret is set in GitHub
2. Push to `main` branch
3. GitHub Actions will automatically:
   - Inject the API key from secrets
   - Deploy to Firebase Hosting
4. Your site at `soulamore.com` will have the API key injected automatically

## ⚠️ Important Notes

- **Never commit the API key** - Always use the placeholder in committed files
- The placeholder is `YOUR_GEMINI_API_KEY_HERE`
- CI/CD automatically replaces the placeholder during build
- Local files can have the real API key (they're not committed)

