import XCTest

/// iOS QA that needs NO account: drives the real app in the simulator (WKWebView) through
/// launch and the sign-in screen. Signed-in flows live in SignedInUITests.swift and are
/// skipped unless the QA test account is passed in (LT_QA_EMAIL / LT_QA_PASSWORD).
///
/// Run (from iOSApp/ios/App, after `npm run sync:qa` in iOSApp/):
///   xcodebuild test -workspace App.xcworkspace -scheme App \
///     -destination 'platform=iOS Simulator,name=iPhone 18 Pro' CODE_SIGNING_ALLOWED=NO
final class LaunchAndSignInUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launch()
    }

    // MARK: helpers

    /// Elements of the web page: the Portal draws everything inside one WKWebView.
    private var web: XCUIElement { app.webViews.firstMatch }

    private func control(_ label: String) -> XCUIElement {
        let query = web.descendants(matching: .any).matching(NSPredicate(format: "label == %@", label))
        return query.firstMatch
    }

    private func attach(_ name: String) {
        let shot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        shot.name = name
        shot.lifetime = .keepAlways
        add(shot)
    }

    private func waitForSignIn(file: StaticString = #filePath, line: UInt = #line) {
        XCTAssertTrue(web.waitForExistence(timeout: 30), "The web view never appeared", file: file, line: line)
        XCTAssertTrue(control("Continue with Google").waitForExistence(timeout: 30),
                      "The sign-in page did not appear (stuck on the splash screen?)", file: file, line: line)
    }

    // MARK: tests

    func testLaunchReachesSignInAndSplashHides() {
        waitForSignIn()
        attach("sign-in-portrait")
    }

    func testSignInOptionsArePresent() {
        waitForSignIn()
        XCTAssertTrue(control("Continue with Google").exists, "Google button")
        XCTAssertTrue(control("Sign in with Apple").exists, "Apple button is required on iOS (guideline 4.8)")
        XCTAssertTrue(control("Email me a sign-in link").exists, "email link button")
        XCTAssertTrue(control("Forgot password?").exists, "forgot password")
        XCTAssertTrue(control("Sign up").exists, "sign up")
    }

    func testWrongCredentialsShowAFriendlyMessage() {
        waitForSignIn()
        let email = web.textFields.firstMatch
        XCTAssertTrue(email.waitForExistence(timeout: 10))
        email.tap()
        email.typeText("qa-nobody@legalterminus.test")
        let password = web.secureTextFields.firstMatch
        password.tap()
        password.typeText("definitely-wrong-password")
        control("Sign in").buttonOrSelf(in: web).tap()

        // A person-readable message, never a Firebase error code.
        let friendly = web.staticTexts.matching(NSPredicate(format: "label CONTAINS[c] 'invalid' OR label CONTAINS[c] 'incorrect' OR label CONTAINS[c] 'not found' OR label CONTAINS[c] 'no account' OR label CONTAINS[c] 'try again'")).firstMatch
        XCTAssertTrue(friendly.waitForExistence(timeout: 30), "No error message after a wrong sign-in")
        let leaked = web.staticTexts.matching(NSPredicate(format: "label CONTAINS 'auth/' OR label CONTAINS[c] 'firebase'"))
        XCTAssertEqual(leaked.count, 0, "A raw Firebase error code was shown to the user")
        attach("wrong-credentials")
    }

    func testKeyboardAppearsAndFieldStaysVisible() throws {
        waitForSignIn()
        let password = web.secureTextFields.firstMatch
        password.tap()
        guard app.keyboards.firstMatch.waitForExistence(timeout: 10) else {
            throw XCTSkip("Software keyboard hidden (Simulator → I/O → Keyboard → Connect Hardware Keyboard is on)")
        }
        XCTAssertTrue(password.isHittable, "The focused password field is covered by the keyboard")
        attach("keyboard-open")
    }

    func testRotationKeepsSignInUsable() {
        waitForSignIn()
        XCUIDevice.shared.orientation = .landscapeLeft
        XCTAssertTrue(control("Continue with Google").waitForExistence(timeout: 10), "Sign-in broke in landscape")
        attach("sign-in-landscape")
        XCUIDevice.shared.orientation = .portrait
        XCTAssertTrue(control("Continue with Google").waitForExistence(timeout: 10), "Sign-in broke after rotating back")
    }

    /// Every key control must sit fully inside the screen, before AND after typing (the page
    /// must not scroll sideways when the keyboard opens).
    private func assertControlsInsideScreen(_ when: String, file: StaticString = #filePath, line: UInt = #line) {
        let screen = app.windows.firstMatch.frame
        for label in ["Continue with Google", "Sign in with Apple", "Email me a sign-in link"] {
            let f = control(label).frame
            XCTAssertGreaterThanOrEqual(f.minX, -0.5, "\(label) starts off-screen \(when): \(f)", file: file, line: line)
            XCTAssertLessThanOrEqual(f.maxX, screen.width + 0.5, "\(label) runs off the right edge \(when): \(f) in \(screen)", file: file, line: line)
        }
    }

    func testNoHorizontalOverflowBeforeAndAfterTyping() {
        waitForSignIn()
        assertControlsInsideScreen("on first load")
        let email = web.textFields.firstMatch
        email.tap()
        email.typeText("qa-nobody@legalterminus.test")
        let password = web.secureTextFields.firstMatch
        password.tap()
        password.typeText("definitely-wrong-password")
        // KNOWN DEFECT (IOS_QA_REPORT.md, D-1): after typing, the page sits ~2 pt too far right in
        // the real WKWebView (iPhone WebKit in Playwright shows no overflow, so it is the
        // keyboard-focus scroll, not the layout). Expected to fail until fixed; delete this
        // wrapper when it is.
        XCTExpectFailure("D-1: ~2 pt horizontal shift after the keyboard opens") {
            assertControlsInsideScreen("after typing")
        }
        attach("after-typing")
    }

    /// Tapping Google must open the native Google sign-in (an Apple system prompt, then Google's
    /// page) — NOT show an error in the page. Needs GoogleService-Info.plist in the build. The test
    /// stops before any account is entered.
    func testGoogleButtonStartsNativeSignIn() {
        waitForSignIn()
        control("Continue with Google").tap()
        let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
        let systemPrompt = springboard.alerts.firstMatch
        let googlePage = app.webViews.staticTexts.matching(NSPredicate(format: "label CONTAINS[c] 'Sign in with Google' OR label CONTAINS[c] 'Choose an account' OR label CONTAINS[c] 'accounts.google.com'")).firstMatch
        let failure = web.staticTexts.matching(NSPredicate(format: "label CONTAINS[c] 'did not complete' OR label CONTAINS[c] 'not configured' OR label CONTAINS[c] 'try again'")).firstMatch
        let deadline = Date().addingTimeInterval(25)
        var started = false
        while Date() < deadline && !started {
            started = systemPrompt.exists || googlePage.exists || app.state != .runningForeground
            if failure.exists { break }
            usleep(500_000)
        }
        attach("google-sign-in-started")
        XCTAssertFalse(failure.exists, "Google sign-in showed an error instead of starting")
        XCTAssertTrue(started, "Tapping Google did not open the native sign-in")
        if systemPrompt.exists { systemPrompt.buttons.element(boundBy: 0).tap() } // Cancel/Continue: no account is used
    }

    func testTermsLinkOpensOutsideTheApp() {
        waitForSignIn()
        let terms = web.links.matching(NSPredicate(format: "label CONTAINS 'Terms'")).firstMatch
        XCTAssertTrue(terms.waitForExistence(timeout: 10))
        terms.tap()
        let safari = XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
        XCTAssertTrue(safari.wait(for: .runningForeground, timeout: 20),
                      "External links must open in Safari, not inside the app (E29-S06)")
    }

    func testLaunchPerformance() throws {
        try XCTSkipUnless(ProcessInfo.processInfo.environment["LT_PERF"] == "1", "Set LT_PERF=1 to measure launch time")
        measure(metrics: [XCTApplicationLaunchMetric()]) { XCUIApplication().launch() }
    }
}

private extension XCUIElement {
    /// A web "Sign in" label matches both the heading and the button; prefer the button.
    func buttonOrSelf(in web: XCUIElement) -> XCUIElement {
        let button = web.buttons.matching(NSPredicate(format: "label == %@", label)).firstMatch
        return button.exists ? button : self
    }
}
