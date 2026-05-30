# Firebase Authentication Migration Guide

## 🎉 Completed Tasks

### ✅ HTML Pages Updated to Firebase Auth
All static authentication pages have been migrated from localStorage to Firebase Authentication:

1. **Frontend/public/login.html**
   - Changed from: localStorage `lt_users` array lookup
   - Changed to: `firebase.auth().signInWithEmailAndPassword(email, password)`
   - Error handling: Firebase error codes (auth/user-not-found, auth/wrong-password, etc.)
   - UI: Preserved all HTML/CSS design, only JavaScript logic updated

2. **Frontend/public/signup.html**
   - Changed from: Direct insertion into localStorage `lt_users` array with plaintext passwords
   - Changed to: `firebase.auth().createUserWithEmailAndPassword(email, password)`
   - Profile data: Stores additional info (name, phone, state) in localStorage under `lt_user_profile` key
   - Error handling: Firebase error codes (auth/email-already-in-use, auth/weak-password, etc.)
   - UI: Preserved all HTML/CSS design, password validation remains client-side

3. **Frontend/public/forgot-password.html**
   - Changed from: Two-step manual password reset within app
   - Changed to: Single-step `firebase.auth().sendPasswordResetEmail(email)`
   - Flow: Firebase sends email link to user, user resets password via email
   - UI: Preserved design, users directed to check email for reset link

4. **Frontend/public/account.html**
   - Changed from: Reading user data from localStorage `lt_logged_in` 
   - Changed to: `firebase.auth().onAuthStateChanged()` listener
   - User data: Gets user from Firebase, profile extras from localStorage
   - Profile updates: Uses `firebase.auth().currentUser.updateProfile()` for name changes, `updateEmail()` for email changes
   - Logout: Uses `firebase.auth().signOut()` instead of clearing localStorage

### ✅ React Components Updated
1. **Frontend/src/App.jsx**
   - Removed React Login component import
   - Removed `/login` route (users now use static /login.html)
   - Routing now uses Firebase rewrites configured in firebase.json

2. **Frontend/src/Components/Navbar/Navbar.jsx**
   - Removed localStorage auth check
   - Removed custom `lt-auth-change` event listener
   - Now uses `firebase.auth().onAuthStateChanged()` to track login state
   - Displays "Account" link when user is logged in, "Login" link when logged out
   - Added Firebase SDK imports and initialization

3. **Frontend/src/Components/ProCheckoutModal/ProCheckoutModal.jsx**
   - Removed import from `utils/userProfile.js`
   - Changed `saveUserProfile()` calls to direct `localStorage.setItem('lt_user_profile', ...)`
   - Profile data saved on successful payment for future checkout auto-fill

### ✅ Removed/Deprecated
- ❌ React Login page (Frontend/src/Pages/Login/Login.jsx) - No longer needed, users use static /login.html
- ❌ `utils/userProfile.js` - Replaced with Firebase auth and localStorage for profile data
- ❌ All localStorage auth keys (`lt_users`, `lt_logged_in`) - Replaced with Firebase Authentication

---

## 🔧 What Still Needs to Be Done

### 1️⃣ Replace Firebase Config Placeholder Values

All HTML pages and React components contain placeholder Firebase config. You MUST replace these with actual values from your Firebase Console.

**Current placeholder (in all HTML files and Navbar.jsx):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDZ0ZZfY0RfZ0XZfZ0ZZfZ0ZZfZ0RfZ0XZ",
  authDomain: "legalterminus.firebaseapp.com",
  projectId: "legalterminus",
  storageBucket: "legalterminus.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

**How to get real values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your "legalterminus" project
3. Click Project Settings (gear icon)
4. Scroll to "Your apps" section
5. Find the Web app and click "Config"
6. Copy the config object and replace placeholder values

**Files to update:**
- `Frontend/public/login.html`
- `Frontend/public/signup.html`
- `Frontend/public/forgot-password.html`
- `Frontend/public/account.html`
- `Frontend/src/Components/Navbar/Navbar.jsx`

### 2️⃣ Enable Email/Password Authentication in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select "legalterminus" project
3. Go to **Authentication** → **Sign-in method**
4. Find "Email/Password" provider
5. Click **Enable** (if not already enabled)
6. Save

### 3️⃣ Configure Firebase Hosting Rewrites (Already Done ✅)

The `firebase.json` file already has rewrites configured to serve static HTML pages:
```json
{
  "rewrites": [
    { "source": "/login", "destination": "/login.html" },
    { "source": "/signup", "destination": "/signup.html" },
    { "source": "/forgot-password", "destination": "/forgot-password.html" },
    { "source": "/account", "destination": "/account.html" },
    { "source": "/**", "destination": "/index.html" }
  ]
}
```

**No changes needed** — this is already correctly configured.

### 4️⃣ Test All Auth Flows

**Signup Flow:**
1. Visit `/signup`
2. Enter email (valid format like test@example.com)
3. Enter password (min 6 characters for Firebase)
4. Enter name, phone, state
5. Click "Create Account"
6. Should redirect to home page and show "Account" link in navbar

**Login Flow:**
1. Visit `/login`
2. Enter email from signup
3. Enter correct password
4. Click "Login"
5. Should redirect to home page

**Password Reset Flow:**
1. Visit `/forgot-password`
2. Enter email
3. Click "Send Reset Link"
4. Check email for password reset link from Firebase
5. Click link and reset password
6. Try logging in with new password

**Account Page:**
1. Login to account
2. Visit `/account`
3. Should show your profile information
4. Edit name, email, phone, state
5. Changes should persist
6. Logout button should sign out and redirect to home

**Cross-Device Login:**
1. Login on one browser
2. Open another browser/incognito window
3. You should NOT be logged in (separate auth session)
4. Login in the second browser
5. Each session is independent ✓

---

## 📋 Environment Variables (Optional but Recommended)

For production, consider using environment variables instead of hardcoding Firebase config.

**Create `.env` file in Frontend root:**
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

**Update Navbar.jsx to use env variables:**
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

For static HTML pages, you'll need a different approach (e.g., a config endpoint or inline script tag).

---

## 🔐 Security Considerations

1. **Firebase Security Rules**: By default, only authenticated users can sign up/in. This is good.
2. **Password Storage**: Firebase uses bcrypt hashing on their servers — passwords are never stored in plain text.
3. **CORS**: Firebase automatically handles CORS for your domain.
4. **Session Persistence**: Firebase SDK automatically persists auth state across page reloads using localStorage internally.

---

## 📚 File Reference

### Modified Files:
- ✅ `Frontend/public/login.html` - Firebase signin
- ✅ `Frontend/public/signup.html` - Firebase signup
- ✅ `Frontend/public/forgot-password.html` - Firebase password reset
- ✅ `Frontend/public/account.html` - Firebase profile management
- ✅ `Frontend/src/App.jsx` - Removed login route
- ✅ `Frontend/src/Components/Navbar/Navbar.jsx` - Firebase auth state
- ✅ `Frontend/src/Components/ProCheckoutModal/ProCheckoutModal.jsx` - Removed userProfile import

### Files with Placeholder Config (⚠️ NEED UPDATE):
- `Frontend/public/login.html` - Line ~10-20
- `Frontend/public/signup.html` - Line ~10-20
- `Frontend/public/forgot-password.html` - Line ~10-20
- `Frontend/public/account.html` - Line ~10-20 and ~400-420
- `Frontend/src/Components/Navbar/Navbar.jsx` - Line ~295-305

---

## 🚀 Next Steps

1. **Get Firebase Credentials** → Replace placeholder config values
2. **Enable Email/Password Auth** in Firebase Console
3. **Test Signup** → Create test account
4. **Test Login** → Login with test account
5. **Test Password Reset** → Verify email reset flow
6. **Test Account Management** → Edit profile, logout
7. **Deploy** → Push to production when ready

---

## 📞 Troubleshooting

**"Firebase is not defined" error:**
- Make sure Firebase SDK script tags are in the HTML `<head>`
- Check that the script loads before your auth code runs

**"auth/configuration-not-found" error:**
- Firebase config values are incorrect
- Double-check values in Firebase Console

**Auth state not persisting after reload:**
- Firebase SDK should handle this automatically
- Check browser's localStorage is not being cleared
- Check browser console for errors

**Email/password rejection:**
- Password must be at least 6 characters
- Email must be valid format
- Email/password provider must be enabled in Firebase Console

---

**Last Updated:** During Firebase Auth Migration
**Status:** ✅ Core implementation complete, awaiting Firebase credential configuration
