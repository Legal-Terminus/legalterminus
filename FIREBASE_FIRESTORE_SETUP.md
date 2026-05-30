# Firebase Authentication + Firestore Integration Guide

## 🎉 Completed Implementation

### ✅ Firestore Integration Complete

User profiles are now stored in Firestore instead of localStorage for better security and cross-device persistence:

**Updated Files:**
- ✅ `Frontend/public/signup.html` - Saves user profile to Firestore after registration
- ✅ `Frontend/public/account.html` - Reads and writes profile from/to Firestore
- ✅ `Frontend/src/Components/ProCheckoutModal/ProCheckoutModal.jsx` - Saves checkout data to Firestore

**Firestore Collection: `users`**
```javascript
{
  uid: "firebase-auth-id",
  name: "User's Name",
  email: "user@example.com",
  phone: "1234567890",
  state: "Maharashtra",
  fullName: "For checkout",
  businessName: "For checkout",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🔒 GitHub Secrets Configuration (CRITICAL)

### Step 1: Get Firebase Configuration Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your "legalterminus" project
3. Click ⚙️ **Project Settings**
4. Scroll to **Your apps** → Web app
5. Click **Show Config** and copy these 6 values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Step 2: Create GitHub Secrets

Go to your GitHub repository:
1. Settings → Secrets and variables → Actions
2. Click **"New repository secret"** for each value:

```
FIREBASE_API_KEY = (your api key)
FIREBASE_AUTH_DOMAIN = (your auth domain)
FIREBASE_PROJECT_ID = (your project id)
FIREBASE_STORAGE_BUCKET = (your storage bucket)
FIREBASE_MESSAGING_SENDER_ID = (your sender id)
FIREBASE_APP_ID = (your app id)
```

### Step 3: Do NOT Commit These to Git

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

---

## 💻 Local Development Setup

### For React Component (Navbar.jsx)

Create `Frontend/.env.local`:
```env
VITE_FIREBASE_API_KEY=your_actual_value
VITE_FIREBASE_AUTH_DOMAIN=your_actual_value
VITE_FIREBASE_PROJECT_ID=your_actual_value
VITE_FIREBASE_STORAGE_BUCKET=your_actual_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_value
VITE_FIREBASE_APP_ID=your_actual_value
```

### For Static HTML Pages (login.html, signup.html, etc.)

**Option 1: Backend Config Endpoint (RECOMMENDED)**

Create backend route in `backend/src/routes/auth.js`:
```javascript
router.get('/api/firebase-config', (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  });
});
```

Update HTML pages to fetch config:
```javascript
let firebaseConfig;

fetch('/api/firebase-config')
  .then(res => res.json())
  .then(config => {
    firebaseConfig = config;
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
    // ... rest of auth code
  });
```

**Option 2: Inline for Development Only**

Directly in HTML head:
```javascript
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_VALUE",
  authDomain: "legalterminus.firebaseapp.com",
  projectId: "legalterminus",
  storageBucket: "legalterminus.appspot.com",
  messagingSenderId: "your_value",
  appId: "your_value"
};
```

---

## 🚀 Production Deployment

### GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd Frontend
          npm install
      
      - name: Build React app
        run: |
          cd Frontend
          npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: legalterminus
```

### Backend Environment Variables

Create `backend/.env`:
```env
FIREBASE_API_KEY=${{ secrets.FIREBASE_API_KEY }}
FIREBASE_AUTH_DOMAIN=${{ secrets.FIREBASE_AUTH_DOMAIN }}
FIREBASE_PROJECT_ID=${{ secrets.FIREBASE_PROJECT_ID }}
FIREBASE_STORAGE_BUCKET=${{ secrets.FIREBASE_STORAGE_BUCKET }}
FIREBASE_MESSAGING_SENDER_ID=${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
FIREBASE_APP_ID=${{ secrets.FIREBASE_APP_ID }}
```

---

## 🔐 Firestore Security Rules

Go to Firebase Console → Firestore Database → Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
    }
  }
}
```

---

## ✅ Setup Checklist

- [ ] Created GitHub Secrets for all Firebase config values
- [ ] Added `.env.local` to `.gitignore`
- [ ] Set up Backend config endpoint OR updated HTML files with values
- [ ] Created `.github/workflows/deploy.yml` for CI/CD
- [ ] Enabled Firestore in Firebase Console
- [ ] Set up Firestore Security Rules
- [ ] Enabled Email/Password authentication in Firebase
- [ ] Tested signup → creates Firestore document
- [ ] Tested account page → reads/writes to Firestore
- [ ] Tested logout → clears session
- [ ] Verified cross-browser session isolation

---

## 📝 Key Changes from Previous Implementation

| Before | After |
|--------|-------|
| localStorage `lt_users` array | Firestore collection |
| localStorage `lt_logged_in` | Firebase Auth session |
| localStorage `lt_user_profile` | Firestore user document |
| Client-side only storage | Server-side persistent storage |
| No validation | Firestore Rules + Backend validation |
| localStorage vulnerable to XSS | Firebase secure authentication |

---

## 🆘 Troubleshooting

**"Error: Firebase has not been initialized" in HTML pages**
- Backend config endpoint is not returning config
- Check backend server is running at deployment
- Verify `/api/firebase-config` route exists

**"Firestore is not available" error**
- Firestore SDK not loaded before auth code runs
- Check Firebase script tag order in HTML

**Can't update email/phone from account page**
- Check Firestore Security Rules allow writes
- Verify user is authenticated (`auth.currentUser` exists)
- Check browser console for specific error

**GitHub Actions deployment fails**
- Verify all 6 GitHub Secrets are created and named correctly
- Check Firebase Service Account has deploy permission
- Look at GitHub Actions logs for detailed error

---

## 📚 File Changes Summary

| File | Change | Notes |
|------|--------|-------|
| signup.html | Added Firestore SDK and save logic | Users saved to `users/{uid}` collection |
| account.html | Added Firestore SDK and read/write | Profile data read from Firestore |
| ProCheckoutModal.jsx | Added Firestore save on checkout | Falls back to localStorage if not logged in |
| Navbar.jsx | Added Firebase SDK imports | Already implemented in previous update |

---

## 🔗 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Last Updated:** Firestore Implementation Complete
**Status:** ✅ Ready for Firebase credential configuration and GitHub Secrets setup
