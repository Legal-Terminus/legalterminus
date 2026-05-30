# Firebase App Hosting Migration Guide

## Architecture Overview

Your application is now migrated to **Firebase App Hosting** with the following structure:

```
┌─────────────────────────────────────────────┐
│   Firebase App Hosting (Single Container)   │
├─────────────────────────────────────────────┤
│  Express Server (Port 5000)                 │
│  ├─ React Frontend (Static)  → /            │
│  └─ API Routes               → /api/*       │
├─────────────────────────────────────────────┤
│  Shared Firebase Services                   │
│  ├─ Firestore (Database)                    │
│  ├─ Firebase Auth                           │
│  ├─ Cloud Storage (Files)                   │
│  └─ Security Rules                          │
└─────────────────────────────────────────────┘
```

## Deployment Flow

```
Git Push to main
    ↓
GitHub Actions Workflow
    ├─ Build React Frontend
    ├─ Build Docker Container (Frontend + Backend)
    ├─ Push to Google Artifact Registry (GAR)
    └─ Deploy to Firebase App Hosting
         ↓
    Live at: https://legal-terminus-web.firebaseapp.com
```

## ✅ Completed Steps

### 1. Dockerfile Created ✓
- Location: `/Dockerfile`
- Packages Frontend build + Backend API together
- Serves React from Express `/public` folder
- Multi-stage build for optimization

### 2. Backend Updated for Firestore ✓
- **File**: `backend/src/config/firebase.js`
  - Firebase Admin SDK initialization
  - Firestore database connection
  
- **File**: `backend/src/config/firestore.js`
  - CRUD utility functions
  - Works with all collections
  
- **File**: `backend/src/server.js`
  - Removed MongoDB connection
  - Serves React static files
  - Updated CORS for Firebase domains
  - Fallback route for SPA routing

- **File**: `backend/package.json`
  - Removed: `mongoose`, `bcryptjs`, `joi`
  - Added: `firebase-admin`

### 3. Blog Controller Migrated ✓
- **File**: `backend/src/controllers/blog.controller.firestore.js`
- Uses Firestore instead of MongoDB
- Image upload still works locally (can migrate to Cloud Storage later)

### 4. GitHub Actions Updated ✓
- **File**: `.github/workflows/firebase-deploy.yml`
- Builds Docker image
- Pushes to Google Artifact Registry
- Deploys to Firebase App Hosting

---

## ⏳ Remaining Steps

### STEP 1: Create Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **legal-terminus-web**
3. Navigate to: **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file (keep it secure!)
6. Copy the entire JSON content

### STEP 2: Add GitHub Secrets

Run these commands (replace with actual content from Step 1):

```bash
cd /Users/ankygoyal/Documents/git/legalterminus/Legal-Terminus

# Create service account JSON secret
gh secret set FIREBASE_SERVICE_ACCOUNT_JSON --body '{"type": "service_account", "project_id": "...", ...}'

# Create CLI token for Firebase deployment
firebase login:ci
# This generates a token - add it as:
gh secret set FIREBASE_CLI_TOKEN --body "YOUR_TOKEN"
```

### STEP 3: Create Google Artifact Registry (Optional - for production)

```bash
gcloud artifacts repositories create legal-terminus-app \
  --repository-format=docker \
  --location=us-central1 \
  --project=legal-terminus-web
```

### STEP 4: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **legal-terminus-web** project
3. Navigate to **Firestore Database**
4. Click **Create Database**
5. Choose: **Production mode**
6. Select region: **us-central1** (or your preference)
7. Click **Create**

### STEP 5: Migrate Collections to Firestore

Currently you have these MongoDB collections (need to migrate to Firestore):
- `blogs`
- `categories`
- `employees`
- `clients`
- `testimonials`
- `videotestimonials`

**Quick Data Migration Option:**
```bash
# Export from MongoDB
mongoexport --db yourdb --collection blogs --out blogs.json

# Import to Firestore (manual or via Firebase Admin SDK script)
```

### STEP 6: Update Firebase Security Rules

Go to Firestore → **Rules** and update:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Blogs - Public read, Admin write
    match /blogs/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // Users - Own data only
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Employees - Admin only
    match /employees/{document=**} {
      allow read, write: if request.auth.uid != null && 
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### STEP 7: Enable Firebase Authentication

1. Go to Firebase Console → **Authentication**
2. Click **Get started**
3. Enable **Email/Password** provider
4. Click **Save**

### STEP 8: Migrate Remaining Controllers

Still need to update:
- `employee.controller.js` → Use Firestore + Firebase Auth
- `category.controller.js` → Use Firestore
- `client.controller.js` → Use Firestore
- `testimonial.controller.js` → Use Firestore
- `videotestimonial.controller.js` → Use Firestore

Pattern to follow (see `blog.controller.firestore.js`):
```javascript
import { createDoc, getDoc, getAllDocs, updateDoc, deleteDoc } from "../config/firestore.js";

const COLLECTION = "yourCollection";

export const getAllDocs = async (req, res) => {
  const docs = await getAllDocs(COLLECTION);
  res.json(docs);
};
```

### STEP 9: Update Employee Authentication

Replace password-based auth with Firebase Auth:

```javascript
// Before: MongoDB + bcrypt
const employee = await Employee.create({name, email, password: hashedPassword});

// After: Firebase Auth + Firestore
const user = await admin.auth().createUser({email, password});
await db.collection('employees').doc(user.uid).set({
  name, email, createdAt: new Date()
});
```

### STEP 10: Test Deployment

```bash
# Test locally
cd backend
npm install  # installs firebase-admin
npm start

# Should see:
# ✅ Firebase Admin SDK initialized
# 🚀 Server running on http://localhost:5000
```

---

## GitHub Secrets Required

You already have (STEP 7):
- ✅ FIREBASE_API_KEY
- ✅ FIREBASE_AUTH_DOMAIN
- ✅ FIREBASE_PROJECT_ID
- ✅ FIREBASE_STORAGE_BUCKET
- ✅ FIREBASE_MESSAGING_SENDER_ID
- ✅ FIREBASE_APP_ID

Still need to add:
- ⏳ FIREBASE_SERVICE_ACCOUNT_JSON (service account key)
- ⏳ FIREBASE_CLI_TOKEN (firebase login token)

---

## Troubleshooting

### Error: "Firebase Admin SDK initialization failed"
- Check `backend/.env.qa` has all 6 Firebase values
- Verify service account JSON has private_key set correctly

### Error: "Cannot find module firebase-admin"
- Run: `npm ci --omit=dev` in backend folder
- Check node_modules exists

### Docker build fails
- Ensure Frontend build works: `cd Frontend && npm run build`
- Check Dockerfile path is correct: `Dockerfile` (not in subdirectory)

### Firestore read/write fails
- Check Security Rules are published
- Verify user is authenticated (check browser console)
- Check collection name matches (case-sensitive)

---

## Next Steps

1. ✅ Create service account key (STEP 1)
2. ✅ Add GitHub Secrets (STEP 2)
3. ✅ Set up Firestore database (STEP 4)
4. ✅ Migrate data to Firestore (STEP 5)
5. ✅ Update Security Rules (STEP 6)
6. ✅ Complete remaining controller migrations (STEP 8)
7. ✅ Test deployment workflow

After completing these, your deployment will automatically trigger on every push to `main` branch!

