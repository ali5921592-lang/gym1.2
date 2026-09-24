# Fitness Copilot

Fitness Copilot, ev ve spor salonu egzersizleri için plan, hareket rehberi, antrenman günlüğü ve etkileşimli kas atlası sunan Capacitor tabanlı Android/iOS uygulamasıdır. Egzersizler genel bilgi amaçlıdır; kişisel sonuç veya sakatlıksız antrenman garantisi vermez.

## Uygulama

- Seviye, hedef ve ekipmana göre dört haftalık hazır planlar; egzersiz ekleme/çıkarma ve sıfırdan rutin oluşturma.
- 64 hareketin teknik adımları, yaygın hataları ve güvenlik notları; sağlayıcıya bağlı uygulama içi video rehberleri.
- Seçilebilir kas bölgeleriyle 3B atlas; kas seçiminden uygun egzersizlere geçiş.
- Set/yük/tekrar kaydı, dinlenme sayacı, haftalık özet ve yerel ilerleme görünümü.
- Pro üyelik için RevenueCat, ücretsiz deneyim için AdMob geçiş reklamları. Banner reklam yoktur; aktif seans sırasında reklam gösterilmez.

Veriler büyük ölçüde cihazın yerel depolamasında tutulur. Hesap ve cihazlar arası senkronizasyon bulunmaz. Anatomi ve medya kaynakları için `dist/assets/ATTRIBUTION.txt` dosyasına bakın. Harici video sağlayıcılarının oynatma ve erişim koşulları değişebilir.

## Kurulum

```bash
npm ci
npm run native:sync
```

Android projesi `android/`, iOS projesi `ios/`, web kaynağı `dist/` içindedir. Derleme, imzalama ve mağaza sırları için [GITHUB_BUILD_GUIDE.md](GITHUB_BUILD_GUIDE.md); inceleme öncesi kontroller için [STORE_SUBMISSION_CHECKLIST.md](STORE_SUBMISSION_CHECKLIST.md) dosyalarını kullanın. Depodaki varsayılan yapılandırma test reklam kimlikleri ve boş RevenueCat anahtarları içerir. Canlı sürümde GitHub Actions sırlarıyla gerçek değerler enjekte edilir; eksik yapılandırma release derlemesini durdurur.

Gizlilik politikası [privacy.html](privacy.html), kullanım koşulları [terms.html](terms.html) dosyalarındadır. Mağaza URL'leri için GitHub Pages'in `main` kökünden yayımlanması ve sayfaların açıldığının doğrulanması gerekir.
