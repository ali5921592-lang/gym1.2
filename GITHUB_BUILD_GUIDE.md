# Fitness Copilot — GitHub üzerinden AAB ve IPA

Bu depo Android ve iOS yerel projelerini içerir. Uygulama kimliği iki platformda da `com.fitnesscopilot.app` olarak ayarlanmıştır. Mağaza kaydı açmadan önce farklı bir kimlik istiyorsanız `capacitor.config.json`, Android `applicationId` ve iOS Bundle Identifier birlikte değiştirilmelidir.

## 1. Depoyu GitHub'a yükleme

ZIP'i açın, içindeki tüm dosya ve klasörleri yeni bir GitHub deposunun köküne yükleyin. `.github`, `android`, `ios`, `dist`, `scripts`, `package.json` ve `package-lock.json` aynı seviyede görünmelidir.

## 2. Android AAB için GitHub Secrets

Repository → Settings → Secrets and variables → Actions bölümüne şunları ekleyin:

- `ANDROID_KEYSTORE_BASE64`: Play Store yükleme anahtarının `.jks` dosyası Base64 içeriği
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`
- `ADMOB_TESTING`: mağaza sürümünde `false`
- `ADMOB_ANDROID_APP_ID`
- `ADMOB_ANDROID_INTERSTITIAL`
- `REVENUECAT_ANDROID_API_KEY`

Actions → Android AAB → Run workflow seçildiğinde imzalı `Fitness-Copilot-AAB` artefaktı oluşur.

## 3. iOS IPA için GitHub Secrets

- `APPLE_CERTIFICATE_BASE64`: Apple Distribution `.p12` dosyasının Base64 içeriği
- `APPLE_CERTIFICATE_PASSWORD`
- `APPLE_PROVISIONING_PROFILE_BASE64`: `com.fitnesscopilot.app` için App Store provisioning profile
- `APPLE_TEAM_ID`
- `KEYCHAIN_PASSWORD`: yalnızca GitHub geçici anahtar zinciri için güçlü bir değer
- `ADMOB_TESTING`: mağaza sürümünde `false`
- `ADMOB_IOS_APP_ID`
- `ADMOB_IOS_INTERSTITIAL`
- `REVENUECAT_IOS_API_KEY`

Actions → iOS IPA → Run workflow seçildiğinde `Fitness-Copilot-IPA` artefaktı oluşur. Apple sertifikası ve provisioning profile olmadan imzalı IPA üretilemez.

## 4. RevenueCat ürünleri

App Store Connect ve Google Play Console'da aylık ve yıllık abonelik ürünlerini oluşturun. RevenueCat'te entitlement adını tam olarak `pro` yapın, ürünleri Current Offering içine `MONTHLY` ve `ANNUAL` paketleri olarak bağlayın. Uygulamadaki 7 günlük deneme süresi mağaza ürünlerinin introductory offer ayarından tanımlanmalıdır.

## 5. AdMob

Geliştirme yapılandırması Google'ın test reklam kimliklerini kullanır. Canlı mağaza derlemesinde kendi App ID ve geçiş reklamı kimliklerinizi Secrets'a girip `ADMOB_TESTING=false` ayarlayın. Banner reklam kullanılmaz. Aktif antrenmanda reklam gösterilmez; tam ekran reklamlar en az 8 dakika ve 5 uygun eylem aralığıyla, günde en fazla 2 kez gösterilir. Başarısız reklam isteği gösterim sayılmaz.

## Yerel komutlar

```bash
npm ci
npm run native:sync
```

Android Studio için `npm run android`, macOS üzerindeki Xcode için `npm run ios` kullanılabilir.
