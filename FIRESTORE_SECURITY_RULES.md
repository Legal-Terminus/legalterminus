# Firestore Security Rules for Legal Terminus

Copy the rules below and paste them into Firebase Console → Firestore Database → Rules tab.

---

## Security Rules (Copy & Paste This)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============ USERS COLLECTION ============
    // Users can only read/write their own document
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // ============ EMPLOYEES COLLECTION ============
    // Only authenticated users with admin role can read/write
    match /employees/{employeeId} {
      allow read: if request.auth != null && (request.auth.uid == employeeId || isAdmin());
      allow write: if request.auth != null && isAdmin();
      allow delete: if request.auth != null && isAdmin();
    }

    // ============ BLOGS COLLECTION ============
    // Public read, admin write
    match /blogs/{blogId} {
      allow read: if true;
      allow create: if request.auth != null && isAdmin();
      allow update: if request.auth != null && isAdmin();
      allow delete: if request.auth != null && isAdmin();
    }

    // ============ CATEGORIES COLLECTION ============
    // Public read, admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow create: if request.auth != null && isAdmin();
      allow update: if request.auth != null && isAdmin();
      allow delete: if request.auth != null && isAdmin();
    }

    // ============ CLIENTS COLLECTION ============
    // Authenticated users can read all, admin can write
    match /clients/{clientId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && isAdmin();
      allow update: if request.auth != null && isAdmin();
      allow delete: if request.auth != null && isAdmin();
    }

    // ============ TESTIMONIALS COLLECTION ============
    // Public read, admin write
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow create: if request.auth != null && isAdmin();
      allow update: if request.auth != null && isAdmin();
      allow delete: if request.auth != null && isAdmin();
    }

    // ============ VIDEO TESTIMONIALS COLLECTION ============
    // Public read (published only), admin write
    match /videotestimonials/{videoId} {
      allow read: if resource.data.status == 'published' || (request.auth != null && isAdmin());
      allow create: if request.auth != null && isAdmin();
      allow update: if request.auth != null && isAdmin();
      allow delete: if request.auth != null && isAdmin();
    }

    // ============ CUSTOM CLAIMS (HELPER FUNCTION) ============
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth.token.role == 'admin' || 
             request.auth.token.email == 'admin@legalterminus.com';
    }

  }
}
```

---

## What These Rules Do

| Collection | Public Read | User Read Own | Admin Only |
|---|---|---|---|
| **users** | ❌ No | ✅ Yes | N/A |
| **employees** | ❌ No | ✅ Own | ✅ Admin |
| **blogs** | ✅ Yes | ✅ Yes | ✅ Admin write |
| **categories** | ✅ Yes | ✅ Yes | ✅ Admin write |
| **clients** | ❌ No | ✅ Auth users | ✅ Admin write |
| **testimonials** | ✅ Yes | ✅ Yes | ✅ Admin write |
| **videotestimonials** | ✅ Published | ✅ Yes | ✅ Admin write |

---

## How to Apply

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select: **legal-terminus-web**

2. **Navigate to Firestore Rules**
   - Left sidebar → **Firestore Database**
   - Click **Rules** tab

3. **Replace Existing Rules**
   - Clear all existing text
   - Paste the rules above

4. **Publish**
   - Click **Publish** button (top right)

---

## Setting Admin Role for Users

To make a user an admin, add a custom claim in Firebase Console:

1. Go to **Authentication** → **Users**
2. Click the user's UID
3. Scroll to **Custom Claims**
4. Add:
   ```json
   {
     "role": "admin"
   }
   ```

Or in your backend, use Firebase Admin SDK:
```javascript
await getAuth().setCustomUserClaims(uid, { role: 'admin' });
```

---

## Testing Rules

You can test rules in Firebase Console:
- Firestore Database → **Rules** tab
- Click **Simulate** (top right)
- Enter user UID and collection path to test

