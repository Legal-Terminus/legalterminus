import XCTest

/// PRODUCTION app checks that need NO account: launch and the sign-in screen only. There are no
/// signed-in tests here on purpose: the production app must never be driven with test accounts or
/// touch live data. (Signed-in tests live in iOSApp/, against the QA environment.)
///
/// Run (from iOSAppProd/ios/App, after `npm run sync` in iOSAppProd/):
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

    // The wrong-password test lives in iOSApp/ (QA only): it submits a sign-in, and the production app
    // must not send test sign-ins to the live service.

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

    /// D-1 guard. With the keyboard open the page must keep its left margin: iOS zooms into a
    /// focused field whose font is under 16px and pans the page, so text starts at the very edge
    /// of the screen. Element frames do not show that (XCUITest reports layout coordinates), so
    /// this looks at real pixels: a few points in from the left edge, beside the "Welcome back"
    /// line, the page is blank white when the margin is intact.
    private func leftMarginPixelsAreBlank(file: StaticString = #filePath, line: UInt = #line) -> Bool {
        let welcome = web.staticTexts.matching(NSPredicate(format: "label BEGINSWITH 'Welcome back'")).firstMatch
        guard welcome.waitForExistence(timeout: 10), let cg = XCUIScreen.main.screenshot().image.cgImage,
              let data = cg.dataProvider?.data, let bytes = CFDataGetBytePtr(data) else { return false }
        let scale = CGFloat(cg.width) / app.windows.firstMatch.frame.width
        let bytesPerPixel = cg.bitsPerPixel / 8
        let y = Int(welcome.frame.midY * scale)
        for xPoint in stride(from: 2.0, through: 12.0, by: 2.0) {
            let x = Int(CGFloat(xPoint) * scale)
            let o = y * cg.bytesPerRow + x * bytesPerPixel
            let brightness = (Int(bytes[o]) + Int(bytes[o + 1]) + Int(bytes[o + 2])) / 3
            if brightness < 200 { return false } // dark or grey pixel inside the margin
        }
        return true
    }

    func testPageKeepsItsMarginWhileTyping() {
        waitForSignIn()
        XCTAssertTrue(leftMarginPixelsAreBlank(), "Margin missing on first load")
        let email = web.textFields.firstMatch
        email.tap()
        email.typeText("qa-nobody@legalterminus.test")
        web.secureTextFields.firstMatch.tap()
        XCTAssertTrue(app.keyboards.firstMatch.waitForExistence(timeout: 10))
        sleep(1) // let any focus zoom/scroll finish
        // The check only means something with the keyboard up at THIS moment.
        XCTAssertTrue(app.keyboards.firstMatch.exists, "The keyboard went away before the margin check")
        attach("margin-with-keyboard")
        XCTAssertTrue(leftMarginPixelsAreBlank(),
                      "D-1: the page is zoomed/panned with the keyboard open — the left margin is gone")
    }

    // MARK: pre-login screens (opened, never submitted: no email is sent, no account is made)

    private func openFromSignIn(_ label: String, name: String) {
        waitForSignIn()
        let target = web.descendants(matching: .any).matching(NSPredicate(format: "label == %@", label)).firstMatch
        XCTAssertTrue(target.waitForExistence(timeout: 10), "\(label) is missing on the sign-in page")
        target.tap()
        XCTAssertTrue(web.textFields.firstMatch.waitForExistence(timeout: 20), "\(label) did not open a form with an email/text field")
        attach(name)
    }

    func testSignUpScreenOpens() {
        openFromSignIn("Sign up", name: "sign-up-screen")
        XCTAssertGreaterThanOrEqual(web.textFields.count + web.secureTextFields.count, 2, "Sign-up should offer several fields")
        XCTAssertEqual(web.staticTexts.matching(NSPredicate(format: "label CONTAINS 'auth/'")).count, 0)
    }

    func testForgotPasswordScreenOpens() {
        openFromSignIn("Forgot password?", name: "forgot-password-screen")
    }

    /// Asking for a sign-in link with no email must say so, in plain words, on the same page.
    func testEmailLinkWithoutEmailShowsFriendlyMessage() {
        waitForSignIn()
        control("Email me a sign-in link").tap()
        let message = web.staticTexts.matching(NSPredicate(format: "label CONTAINS[c] 'Enter your email'")).firstMatch
        XCTAssertTrue(message.waitForExistence(timeout: 10), "No message when asking for a sign-in link without an email")
        XCTAssertEqual(web.staticTexts.matching(NSPredicate(format: "label CONTAINS 'auth/'")).count, 0, "A raw Firebase code was shown")
        attach("email-link-needs-email")
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
        // KNOWN, expected until the owner registers the production Firebase iOS app (com.legalterminus.app) and
        // the production GoogleService-Info.plist is put in the build (docs/ios-production-app.md, prerequisite 2):
        // without it Google sign-in shows an error. When that is done this becomes an unexpected pass: delete the wrapper.
        XCTExpectFailure("Production Firebase iOS app / GoogleService-Info.plist not set up yet") {
            XCTAssertFalse(failure.exists, "Google sign-in showed an error instead of starting")
            XCTAssertTrue(started, "Tapping Google did not open the native sign-in")
        }
        if systemPrompt.exists { systemPrompt.buttons.element(boundBy: 0).tap() } // Cancel: no account is used
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
