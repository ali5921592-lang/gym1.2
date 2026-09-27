# Store release checklist — Fitness Copilot

Status checked 27 September 2026. Latest source changes and the screenshot package are committed to `main` (`2c5cef3` and `490e7f6`). iOS IPA workflow run `36316398654` is in progress.

## Verified locally

- [x] Device preferred language is selected on first launch when no saved language exists. Supported locales are Turkish, US English, Spanish, Brazilian Portuguese, French, German, and Arabic; unsupported device languages fall back to US English. A user’s saved language choice takes precedence.
- [x] The app itself has no sign-in requirement. Workout history and onboarding settings are stored on-device.
- [x] Free users can see and rotate the 3D anatomy preview; muscle selection, exercise matching, and training heatmap remain Pro-gated. The in-app atlas preview should let App Review understand the gated feature without reviewer credentials.
- [x] Updated App Review notes are prepared in `APP_REVIEW_NOTES.md`; the live App Store Connect Notes field still needs to be saved.
- [x] `npm run build` succeeds. Language fallback tests passed for TR, DE, AR, PT, FR, ES, EN and unsupported Japanese (US English fallback).
- [x] There are 7 app UI locales. Store screenshots are static localized assets in App Store Connect; customers see the best matching App Store localization, not screenshots generated at runtime based on storefront country.

## App Store Connect — live page findings

- [x] App version 1.0 is in **Prepare for Submission**.
- [x] Three Turkish iPhone screenshots are listed, but their previews show red error markers. Replace them with validated screenshots.
- [x] Prepared 21 iPhone screenshots (Home, Exercises, and the interactive Muscle Atlas preview) for `tr-TR`, `en-US`, `es-ES`, `pt-BR`, `fr-FR`, `de-DE`, and `ar`. Each image is 1290 × 2796 JPEG; see `Fitness-Copilot-App-Store-Screenshots.zip`.
- [ ] Upload those screenshots in App Store Connect and add matching localized listing metadata. The ASC language menu and file picker did not respond in this browser session; no upload is claimed.
- [ ] Verify the selected build in the App Store version record, then ensure the final reviewed build includes the atlas-preview change.
- [ ] Confirm both auto-renewable products and their 7-day introductory offers in App Store Connect. The user’s requested standard prices are USD 7.90/month and USD 49/year in higher-price markets, USD 2.90/month and USD 19/year in lower-price markets; configure storefront prices through Apple’s price points and validate exact displayed regional amounts. Do not assume Android or RevenueCat setup proves Apple products are ready.
- [ ] Confirm both products are linked to the `pro` entitlement and the current RevenueCat offering, including sandbox purchase and restore tests.
- [ ] Add an App Review contact name and phone number. The fields are currently blank; the app does not need demo login credentials. The owner previously said they would enter contact details themselves.
- [ ] Set/verify App Review notes from `APP_REVIEW_NOTES.md`, subscription review screenshots, Privacy Policy URL, age rating, privacy answers, content rights, availability, and release mode.
- [ ] Submit the version and first subscription products together for App Review after required metadata and assets are complete.

## Release engineering / external checks

- [ ] Verify the signed iOS workflow `36316398654` completes and the build appears in App Store Connect.
- [ ] Build a new signed iOS release with production RevenueCat and AdMob identifiers, then upload that exact build to App Store Connect and wait for processing.
- [ ] Test on a physical iPhone: free atlas preview, sandbox full-atlas purchase, restore, eligible/ineligible trial copy, each exercise video fallback, and ad suppression during training.
- [ ] Verify model/video license permissions and retained attribution for all shipped assets.
- [ ] Confirm GitHub Pages Privacy Policy and Terms URLs return public HTML and match the final app metadata.

A successful local bundle build is not proof of a successful signed IPA, App Store processing, subscription availability, or review approval.
