const native=!!window.Capacitor?.isNativePlatform?.();
if(native)startNative().catch(error=>console.error('Native services failed',error));

async function startNative(){
 const [{Capacitor},{AdMob,AdmobConsentStatus,BannerAdPosition,BannerAdSize},{Purchases}]=await Promise.all([import('@capacitor/core'),import('@capacitor-community/admob'),import('@revenuecat/purchases-capacitor')]);
 const platform=Capacitor.getPlatform(),config=window.FITNESS_COPILOT_NATIVE_CONFIG||{};
 let adsReady=false,interstitialReady=false,purchasesReady=false;
 const adId=kind=>config.admob?.[platform+kind[0].toUpperCase()+kind.slice(1)]||'';
 async function initializeAds(){if(adsReady)return;await AdMob.initialize({initializeForTesting:!!config.admob?.testing});let consent=await AdMob.requestConsentInfo();if(consent.isConsentFormAvailable&&consent.status===AdmobConsentStatus.REQUIRED)consent=await AdMob.showConsentForm();adsReady=!!consent.canRequestAds;if(adsReady)await prepareInterstitial();}
 async function prepareInterstitial(){const id=adId('interstitial');if(!id)return;try{await AdMob.prepareInterstitial({adId:id,isTesting:!!config.admob?.testing});interstitialReady=true;}catch{interstitialReady=false;}}
 async function showBanner(){await initializeAds();const id=adId('banner');if(!adsReady||!id)return;await AdMob.showBanner({adId:id,adSize:BannerAdSize.ADAPTIVE_BANNER,position:BannerAdPosition.BOTTOM_CENTER,margin:82,isTesting:!!config.admob?.testing});}
 async function hideBanner(){if(adsReady)await AdMob.removeBanner().catch(()=>{});}
 async function showInterstitial(){await initializeAds();if(!adsReady||!interstitialReady)return;interstitialReady=false;await AdMob.showInterstitial();await prepareInterstitial();}
 async function initializePurchases(){const key=config.revenueCat?.[platform+'ApiKey'];if(!key||purchasesReady)return purchasesReady;await Purchases.configure({apiKey:key});purchasesReady=true;const info=await Purchases.getCustomerInfo();syncEntitlement(info.customerInfo);return true;}
 function syncEntitlement(customerInfo){const active=customerInfo?.entitlements?.active||{};window.FORMA_BILLING?.setEntitlement(active.pro?'active':'inactive',active.pro?.expirationDate||null);}
 async function checkout(product){if(!await initializePurchases())throw new Error('RevenueCat API anahtarı eksik.');const offerings=await Purchases.getOfferings(),packages=offerings.current?.availablePackages||[],wanted=product==='monthly'?'MONTHLY':'ANNUAL',selected=packages.find(item=>item.packageType===wanted)||packages[0];if(!selected)throw new Error('RevenueCat offering bulunamadı.');const result=await Purchases.purchasePackage({aPackage:selected});syncEntitlement(result.customerInfo);}
 async function restorePurchases(){if(!await initializePurchases())throw new Error('RevenueCat API anahtarı eksik.');const result=await Purchases.restorePurchases();syncEntitlement(result.customerInfo);}
 window.FORMA_BILLING?.setAdAdapter({showBanner,hideBanner,showInterstitial});
 await initializePurchases().catch(console.error);
 await initializeAds().catch(console.error);
 window.addEventListener('forma:checkout',event=>checkout(event.detail?.product).catch(error=>console.error('Checkout failed',error)));
 window.addEventListener('fitness:restore-purchases',()=>restorePurchases().catch(error=>console.error('Restore failed',error)));
 window.addEventListener('fitness:entitlement-change',()=>{if(window.FORMA_BILLING?.isPro())hideBanner();});
}
