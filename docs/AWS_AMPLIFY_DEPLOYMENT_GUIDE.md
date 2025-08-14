# 🚀 AWS Amplify Deployment Guide for Medical Intake Form

## Prerequisites Checklist ✅
- [x] AWS Account with access to Amplify Console
- [x] GitHub repository with your code
- [x] Code committed and pushed to main branch
- [x] amplify.yml build configuration file added

---

## Step-by-Step Deployment Instructions

### Step 1: Access AWS Amplify Console
1. **Log into AWS Console**: Go to https://aws.amazon.com/console/
2. **Find Amplify**: Search for "Amplify" in the services search bar
3. **Open Amplify Console**: Click on "AWS Amplify"

### Step 2: Create New Amplify App
1. **Click "Host web app"** (orange button)
2. **Select GitHub** as your Git provider
3. **Authorize GitHub**: Click "Continue" and authorize AWS to access your GitHub

### Step 3: Connect Your Repository
1. **Select Repository**: Choose `pallavkoppisetti/medical-intake-form`
2. **Select Branch**: Choose `main` branch
3. **Click "Next"**

### Step 4: Configure Build Settings
1. **App name**: Enter `medical-intake-form` or your preferred name
2. **Environment name**: Use `production`
3. **Build specification**: AWS should auto-detect the `amplify.yml` file
4. **Service role**: 
   - If this is your first Amplify app, click "Create new service role"
   - If you have an existing role, select it
5. **Advanced settings** (click to expand):
   - **Environment variables**:
     ```
     VITE_APP_VERSION = 2.0.0
     VITE_APP_ENV = production
     ```
6. **Click "Next"**

### Step 5: Review and Deploy
1. **Review all settings**:
   - Repository: `pallavkoppisetti/medical-intake-form`
   - Branch: `main`
   - Build command: `npm run build`
   - Output directory: `dist`
2. **Click "Save and deploy"**

### Step 6: Monitor Deployment
The deployment process has 4 phases:
1. **Provision** (1-2 minutes): AWS sets up infrastructure
2. **Build** (3-5 minutes): Your app is built using Node.js
3. **Deploy** (1-2 minutes): Files are deployed to CDN
4. **Verify** (30 seconds): Health check

**Total time**: Approximately 5-10 minutes

---

## 🔧 Configuration Details

### Build Commands (Automatic)
```yaml
preBuild: npm ci
build: npm run build
baseDirectory: dist
```

### Environment Variables to Set
```
VITE_APP_VERSION = 2.0.0
VITE_APP_ENV = production
VITE_ENABLE_TEST_DATA = false
VITE_ENABLE_CONSOLE_LOGS = false
```

### Custom Domain Setup (Optional)
1. **In Amplify Console**: Go to "Domain management"
2. **Add domain**: Click "Add domain"
3. **Enter your domain**: e.g., `medical-form.yourdomain.com`
4. **Configure DNS**: Follow AWS instructions to update your DNS records

---

## 📱 Testing Your Deployed App

### After Deployment Success:
1. **Copy the URL**: AWS provides a URL like `https://main.d1234567890.amplifyapp.com`
2. **Test Core Features**:
   - ✅ Form loads correctly
   - ✅ All 8 sections are accessible
   - ✅ Data saves and persists
   - ✅ PDF generation works
   - ✅ Mobile responsiveness

### Quick Test Checklist:
- [ ] Open the Amplify-provided URL
- [ ] Navigate through all form sections
- [ ] Fill out some test data
- [ ] Verify auto-save works (check save indicator)
- [ ] Generate a PDF to test functionality
- [ ] Test on mobile device
- [ ] Test in different browsers

---

## 🚨 Troubleshooting Common Issues

### Build Fails
**Problem**: Build phase fails with npm errors
**Solution**: 
1. Check that `package.json` has correct scripts
2. Ensure all dependencies are in `package.json`
3. Check build logs in Amplify Console

### Environment Variables Not Working
**Problem**: App doesn't recognize environment variables
**Solution**:
1. Ensure variables start with `VITE_`
2. Check they're set in Amplify Console under "Environment variables"
3. Redeploy after adding variables

### 404 Errors on Refresh
**Problem**: Direct URLs return 404 errors
**Solution**:
1. In Amplify Console, go to "Rewrites and redirects"
2. Add rule: `/*` → `/index.html` → `200`

---

## 🔄 Continuous Deployment

Once set up, your app will automatically redeploy when you:
1. Push changes to the `main` branch
2. AWS Amplify detects the changes
3. Automatically triggers a new build and deployment

### To Push Updates:
```bash
git add .
git commit -m "your changes"
git push origin main
```

---

## 💰 Cost Estimation

**AWS Amplify Pricing** (as of 2025):
- **Build minutes**: $0.01 per build minute
- **Data storage**: $0.023 per GB per month
- **Data transfer**: $0.15 per GB served

**Estimated monthly cost** for a small medical practice:
- ~10 builds/month: $0.50
- ~1GB storage: $0.02
- ~10GB transfer: $1.50
- **Total**: ~$2-5/month

---

## 📞 Support Resources

- **AWS Amplify Documentation**: https://docs.amplify.aws/
- **AWS Support**: Available through AWS Console
- **Community Forums**: https://github.com/aws-amplify/amplify-js/discussions

---

## 🎉 Success! Your App is Live

Once deployment completes:
1. **Your URL**: `https://main.d[random].amplifyapp.com`
2. **SSL Certificate**: Automatically provided by AWS
3. **Global CDN**: Your app loads fast worldwide
4. **Automatic Backups**: AWS handles infrastructure
5. **99.9% Uptime**: Enterprise-grade reliability

**Congratulations!** Your Medical Intake Form is now professionally deployed and ready for production use!

---

**Last Updated**: August 12, 2025  
**Version**: 2.0.0  
**AWS Region**: Use your nearest region for best performance
