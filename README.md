# Fitness Copilot Gym Studio

Android ve iOS mağaza projeleri hazırdır. GitHub Actions ile imzalı AAB/IPA üretme, AdMob ve RevenueCat ayarları için [GITHUB_BUILD_GUIDE.md](GITHUB_BUILD_GUIDE.md) dosyasını izleyin.

## Plan Studio arayüzü

- Bugünkü seans, dinlenme, tamamlanmış gün ve takvimi bitmiş plan için ayrı durumlar; yarım seansa devam etme önceliği.
- Dört hafta sekmesi, klavyeyle gezinme, yedi günlük seçim ve bugüne dönüş.
- Yalnızca aktif plandaki benzersiz tamamlanmış günlerden hesaplanan seans ilerlemesi.
- Seans hareket/set/süre özeti, ana kaslardan atlasa geçiş ve mobil başlat/devam çubuğu.
- Yeni plan önizlemesi ve açık onay; kaydedilmiş seans varken plan değiştirme engeli.
- Egzersiz aramasında sonuç sayısı, filtreleri temizleme ve boş sonuçtan tüm hareketlere dönüş.
- Türkçe arayüz düzenlemesidir; önceki sürümün kısmi çeviri sorunu henüz tamamlanmadı.

Doğrulama: plan özeti ve jsdom etkileşim testleri, mevcut özel rutin/seans bütünleşme testi ve 1.664 program seansı denetimi geçti. Gerçek tarayıcıda görsel inceleme yapılmadı.

Türkçe, telefon ekranına uyumlu fitness web uygulaması.

## Bu sürüm

- Antrenmanı öne alan yeni Studio ana ekranı; grafit, turuncu ve mor tasarım, dokunma ve ekran geçişleri.
- 10/15/20 dakikalık ekipmana uygun hızlı seans önerileri.
- Odak modu: tekrar/yük girişi, önceki set kaydı, 45/60/90/120 saniye dinlenme, ilk set öncesinde aynı kas için alternatif hareket.
- Yarım kalan seansı saklama ve sürdürme; form alanları video rehberinden dönünce korunur.
- Favoriler ve doğrudan video filtresi.
- Gerçek kayıtlardan 28 günlük devamlılık haritası ve en yüksek girilmiş yükler.
- Kullanıcının günlük enerji seçimi; sağlık sensörü, yapay zekâ veya fizyolojik ölçüm iddiası yoktur.
- 64 egzersiz, 23 seçilebilir kas bölgesi, gerçek anatomi verisinden 467 yapı, 33 ekipman, 4 aylık plan.
- 15 doğrudan MP4, 48 YouTube, 1 DVIDS kaynağı. Resmî YouTube IFrame API, alternatif embed alan adı, yükleme/hata durumları ve oynatıcı temizliği.
- Adım adım teknik, risk açıklamaları, giriş serisi, XP ve rozetler.

## Kullanım

`dist/` HTTP üzerinden sunulur. Hesap, ödeme, cihazlar arası eşitleme ve çevrimdışı video yoktur. Günlük ve tercihler bu tarayıcıda tutulur. Yerel önizleme ile HTTPS yayını farklı tarayıcı kayıt alanları kullanır. Planlar sağlıklı yetişkinler için genel şablonlardır.

Anatomi lisansları: `dist/assets/ATTRIBUTION.txt`. Videolar sahiplerinin kullanım şartlarına tabidir. Your Move ücretsiz klipleri uygulama içinde ticari kullanılabilir; bağımsız video kütüphanesi olarak yeniden satılamaz. YouTube için resmî gömülü oynatıcı kullanılır.

## Doğrulama

1.664 plan seansı, 23 kas/mesh eşleştirmesi ve 18 hızlı seans/ekipman kombinasyonu doğrulandı. Kişisel kayıt hesapları kontrol edildi. Ayrı localhost test alanında 6 setlik hızlı seans, kaydet/devam et, alternatif hareket, dinlenme atlama, tamamlanma ve günlüğe işlenme tarayıcıda test edildi. Hızlı seans aylık plan ilerlemesine eklenmez.

Dambıl row MP4 tarayıcı içinde 12,84 saniyelik gösterimi tamamladı. YouTube önizleme tarayıcısında boş iframe/yanıt alamama sorunu gözlendi; API ve alternatif kaynak eklendi. Her sağlayıcı/cihaz için oynatma doğrulanmış değildir. Video bağlantısının metadata yanıtı vermesi oynatma garantisi değildir.

Tasarım referansları: Apple Workouts HIG, Motion animate, Material motion, Chrome View Transitions ve Uiverse buton örnekleri. İlgili bağlantılar uygulamadaki kaynak panelindedir. Azaltılmış hareket tercihine uyulur.

## Gym asistanı genişletmesi

- Hazır aylık planlarda seans geri bildirimiyle açıklanabilir uyarlama: zor seanstan sonra bir set azaltma; kolay seansta aynı yükle bir tekrar önerisi; iki kolay ve üst tekrar sınırına ulaşılmış seans sonrasında yaklaşık %2,5 yük artışı referansı. Planım ekranından kapatılabilir. Özel rutinler kendi hedeflerini korur. Bu kurallar genel şablondur, tıbbi değerlendirme değildir.
- Pazartesi başlayan haftada ana/yardımcı kas eşleşmelerine göre kaydedilmiş kuvvet setleri; atlas üzerinde 0 / 1–3 / 4–7 / 8+ renkleri. Toparlanma ölçümü değildir; bir set birden çok kas grubunda görünebilir.
- Özel program oluşturma, ad/gün düzenleme, hareket ekleme/çıkarma ve sıralama, set/tur ve tekrar/süre hedefi, komşu iki hareketi süperset yapma. Süperset turu sonunda dinlenme; eşit olmayan set sayıları ve kardiyo turları desteklenir. Özel hedefler seans saklanıp sürdürülürken korunur. Bugünün programları ana ekranda gösterilir.
- İsteğe bağlı Türkçe Web Speech rehberi: hareket/set duyurusu, dinlenme süresi, son saniyeler ve bitiş. Ses tarayıcı ve cihaz seslerine bağlıdır; sayfa arka plandayken konuşma durdurulur. Gerçek cihazda ses çıkışı bu sürümde doğrulanmadı; olay akışı simülasyonla test edildi.
- Haftalık seans, süre, kuvvet seti ve aynı yükte en yüksek tekrar değişimi özeti; eksik veri durumları açıklanır.
- Ev, salon ve seyahat için ayrı adlandırılabilir 33 ekipman profili; tümünü seç, temizle, kaydet ve tek dokunuşla geçiş. Profil geçişi aylık başlangıç tarihini değiştirmez.

Yeni doğrulama: saf mantık testleri (uyarlama, haftalık sınırlar, kas sayımı, yük karşılaştırma ve süperset sırası); jsdom bütünleşme testi (profil kaydı, program/gün/süperset oluşturma, metin kaçışları, ses olayı, set/dinlenme, özel hedeflerle duraklat/devam, tamamlanma ve geri bildirim). Gerçek tarayıcıda bu altı yeni özelliğin görsel/sesli QA'sı yapılmadı. Mevcut video sistemi ve hesap/eşitleme kapsamı değiştirilmedi.

## Global dil ve gelir altyapısı

- Türkçe, İngilizce, İspanyolca, Brezilya Portekizcesi, Almanca, Fransızca, Arapça, Hintçe ve Endonezce için dil seçici; ana navigasyon ve üyelik akışı yerelleştirildi. Egzersiz adları ve ayrıntılı teknik içerik Türkçe kaynak dilinde kalır; mağaza yayını öncesinde uzman çevirisi gerekir.
- Aylık/yıllık Pro ürün seçimi, açık 7 günlük deneme koşulları, otomatik yenileme açıklaması, deneme bitiş tarihi, isteğe bağlı 24 saat öncesi hatırlatma, satın alma geri yükleme ve üyelik yönetimi yüzeyleri.
- `window.FORMA_BILLING` adaptörü ve `forma:checkout` olayı, App Store / Google Play veya web ödeme sağlayıcısına bağlanmak için entegrasyon noktasıdır. Bu statik prototip gerçek ödeme almaz; gösterilen fiyatlar örnek ürün kataloğudur.
- Ücretsiz kullanıcıda keşif ekranlarında en fazla tek etiketli sponsor alanı; aktif deneme/Pro üyelikte, ilerleme ekranında ve antrenman odak modunda reklam gösterilmez. Gerçek reklam SDK'sı, rıza yönetimi ve çocuklara yönelik reklam kısıtları mağaza sürümünde ayrıca bağlanmalıdır.
