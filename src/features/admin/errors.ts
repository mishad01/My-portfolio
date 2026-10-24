/** Turn Firebase/Firestore errors into a sentence the site owner can act on. */
export function describeError(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e);
  if (/auth\/(invalid-credential|wrong-password|user-not-found|invalid-email)/.test(m)) return 'Wrong email or password.';
  if (/auth\/operation-not-allowed/.test(m)) return 'Email/Password sign-in is turned off. Enable it in Firebase → Authentication → Sign-in method.';
  if (/auth\/too-many-requests/.test(m)) return 'Too many attempts. Wait a minute and try again.';
  if (/firestore-timeout|offline|unavailable/i.test(m))
    return 'Signed in, but Firestore didn’t respond. Create the Firestore database in the Firebase console (Databases and storage → Firestore).';
  if (/permission|insufficient/i.test(m))
    return 'Signed in, but the Firestore rules don’t allow this account yet. Put your User UID in the rules and publish them.';
  if (/not-found|NOT_FOUND|database .* does not exist/i.test(m)) return 'Signed in, but the Firestore database doesn’t exist yet. Create it in the Firebase console.';
  return m.replace(/^Firebase:\s*/, '');
}
