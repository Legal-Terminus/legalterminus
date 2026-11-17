# LEGAL_TERMINUS_TESTFLIGHT_FINAL_REPORT — 2026-11-17

1. **Audit:** `docs/LEGAL_TERMINUS_IOS_QA_AUDIT.md`. QA build has no production host/bucket; shared Firebase Auth is protected by the QA API's test-domain rule.
2. **Features tested:** sign-in screens, wrong password, keyboard, rotation, Terms link, Google prompt start, 5-role sign-in and navigation/RBAC, session persistence, sign out (real app); matters, discussion, notifications, recurring, RBAC (Playwright, phone WebKit). Not tested: documents, payments, uploads, real iPhone (QA report, "Not run").
3. **Credentials used:** the five `qa-*@legalterminus.test` accounts (admin, manager, team, client, pro), read from the gitignored `Portal/e2e/.env.e2e`. No passwords appear in any file or log.
4. **QA environment verification:** audit §3.
5. **Issues discovered:** D-1, D-2, T-1, P-1 (classified), P-2, O-1, O-3, O-4.
6. **Fixed:** D-1 (16px fields), D-2 (account button name), T-1. 7. **Remaining:** P-2 (Send under bottom nav), O-1, O-3, O-4; 6 phone specs are desktop-only selectors.
8. **Readiness:** 58/100. 9-11. **Version 1.0.0, build 7 (builds 5, 6 superseded), `com.legalterminus.app.qa`.**
12. **TestFlight upload:** uploaded; **13. Apple processing:** VALID (confirmed in App Store Connect).
14. **Beta App Review: NOT submitted.** Apple needs a contact first/last name, phone, email and a demo login; I did not invent them. App Store Connect → TestFlight → Test Information → Beta App Review Information is empty.
15. **External group:** "Legal Terminus QA Testers" created (empty, no build attached yet; id `322a9ec0-64d8-41a1-b1fc-27b6cec290a3`).
16. **Add testers:** App Store Connect → Legal Terminus QA → TestFlight → External Testing → Legal Terminus QA Testers → Testers (+) → add emails. Attach build 5 under Builds; the first external build goes to Beta App Review (usually under a day), after which invitations go out.

**Tester flow:** invitation email → install Apple's TestFlight app → accept → install Legal Terminus QA → sign in with a QA login (`qa-*@legalterminus.test`; personal Google/Apple accounts are refused on QA by design) → send feedback from TestFlight.
**Not done:** no production change, no public release, no App Store review submission.
