import { Capacitor } from '@capacitor/core';
import {
  OAuthProvider, getAdditionalUserInfo, signInWithCredential, signInWithPopup,
  type Auth, type UserCredential,
} from 'firebase/auth';
import { appleFullName, showAppleSignIn } from './nativeRules';

/**
 * E29-S11 — Sign in with Apple. Same shape as googleSignIn.ts: in the app the native
 * Apple sheet returns an ID token that is handed to the Firebase web SDK (one session
 * for app and website); on the website a pop-up.
 *
 * App Store guideline 4.8 requires it in the iPhone app because Google is offered.
 * D6: the website offers it too (someone who signed up with Apple on an iPhone must be
 * able to sign in on legalterminus.com), Android does not for the first release.
 */

export { appleSignInMessage } from './nativeRules';

const provider = () => {
  const p = new OAuthProvider('apple.com');
  p.addScope('email');
  p.addScope('name');
  return p;
};

/** Whether this page shows the Apple button (pure rule in nativeRules.ts). */
export const appleSignInAvailable = (): boolean =>
  showAppleSignIn(Capacitor.getPlatform(), import.meta.env.VITE_APPLE_SIGN_IN as string | undefined);

export interface AppleSignIn {
  result: UserCredential;
  /** The name Apple sent — on the FIRST sign-in only, so it must be registered now. */
  name: string | null;
}

export async function startAppleSignIn(auth: Auth): Promise<AppleSignIn> {
  if (Capacitor.isNativePlatform()) {
    const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
    const native = await FirebaseAuthentication.signInWithApple({ scopes: ['email', 'name'], skipNativeAuth: true });
    const { credential } = native;
    if (!credential?.idToken) throw Object.assign(new Error('No Apple ID token'), { code: 'auth/user-cancelled' });
    // The plugin sends Apple a hashed nonce; Firebase checks the token against the raw one.
    const result = await signInWithCredential(
      auth, provider().credential({ idToken: credential.idToken, rawNonce: credential.nonce ?? undefined }),
    );
    // Apple's ID token carries no name; the native sheet hands it over separately.
    return { result, name: appleFullName(null, native.user?.displayName ?? result.user.displayName) };
  }
  const result = await signInWithPopup(auth, provider());
  return { result, name: appleFullName(getAdditionalUserInfo(result)?.profile, result.user.displayName) };
}
