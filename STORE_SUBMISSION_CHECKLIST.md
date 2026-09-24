# Store submission checklist

Complete these items before submitting Fitness Copilot for App Review.

- [ ] Add a real, monitored private support contact to `privacy.html` and `terms.html`; the current public GitHub issue link is for general support and must not receive personal information. Use the same contact in both store listings.
- [ ] Enable GitHub Pages from `main` / root, then verify `https://ali5921592-lang.github.io/gym1.2/privacy.html` and `/terms.html` both return rendered HTML (HTTP 200, `text/html`). Enter those URLs in both stores. The previous `raw.githubusercontent.com` URL returned source text.
- [ ] Create the monthly and annual auto-renewable subscriptions in App Store Connect, including their 7-day introductory offers, review screenshots, localized display names, and review notes.
- [ ] In RevenueCat, connect the App Store products to the `pro` entitlement and configure a current offering containing the monthly and annual packages.
- [ ] Add `REVENUECAT_IOS_API_KEY` to GitHub Actions Secrets before producing the release build.
- [ ] Add production AdMob identifiers only when the AdMob account and consent messages are ready. Keep `ADMOB_TESTING=true` for TestFlight testing.
- [ ] Complete App Privacy answers to match the final AdMob and RevenueCat configuration.
- [ ] Complete Google Play Data safety and Health apps declarations for this workout planner; include the final AdMob and RevenueCat SDK data practices. Check iOS App Privacy answers against the same release binary.
- [ ] Publish an AdMob European regulations consent message for the selected territories and languages. Verify the in-app Privacy and ad choices button reopens privacy options where required.
- [ ] Confirm screenshots and descriptions show actual in-app screens, and label every Pro-only feature clearly.
- [ ] Keep third-party video and anatomy license/permission evidence available for App Review; remove any source whose playback or permitted use cannot be confirmed.
- [ ] Test every exercise video, the Restore Purchases flow, the subscription trial flow, Pro atlas access, and all external links on a physical iPhone.
- [ ] Test Android purchase/restore, consent choices, interstitial timing, and video playback on a physical Android device.
- [ ] Paste the contents of `APP_REVIEW_NOTES.md` into App Store Connect Review Notes.
