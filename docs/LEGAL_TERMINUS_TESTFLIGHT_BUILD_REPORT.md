# LEGAL_TERMINUS_TESTFLIGHT_BUILD_REPORT

| | |
|---|---|
| App Store Connect app | **Legal Terminus QA**, Apple ID `6835742436`, SKU `legalterminus-ios-qa`, created 2026-11-17 (the team had no apps before) |
| Bundle identifier | `com.legalterminus.app.qa` (separate QA identity by design; production `com.legalterminus.app` untouched) |
| Version / build | 1.0.0 (**6**; build 5 also uploaded, superseded) |
| QA API | `https://legal-terminus-qa.web.app`; DB `qa-data`; bucket `legal-terminus-web-qa` |
| Environment check | Built with `LT_APP_ENV=qa`; bundle guard passed; the `.ipa` has 0 production hosts (audit §3, re-checked on build 6: 0 production hosts in `dist-mobile`) |
| Signing | Apple Distribution, LEGAL TERMINUS PRIVATE LIMITED (`LMD2KSCQZX`), App Store profile, managed signing |
| Upload | `xcodebuild -exportArchive` (destination upload): "Upload succeeded" |
| Apple processing | Builds 5 and 6 **VALID** in App Store Connect (read from the web API); export compliance answered by `Info.plist` (`usesNonExemptEncryption=false`) |
| Known limits | Sign in with Google/Apple with a personal account is refused on QA by design; testers must use QA logins. Emails are off on QA. Payments are Razorpay TEST. Not run on a physical iPhone. Beta App Review not yet submitted |
