import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),read=file=>fs.readFileSync(path.join(root,file),'utf8'),write=(file,value)=>fs.writeFileSync(path.join(root,file),value),env=(name,fallback='')=>process.env[name]||fallback;
const testing=env('ADMOB_TESTING','true')!=='false';
if(env('RELEASE_BUILD')==='true'){
 const platform=env('RELEASE_PLATFORM');
 if(!['android','ios'].includes(platform))throw new Error('RELEASE_PLATFORM must be android or ios for release builds.');
 const required=platform==='android'?['ADMOB_ANDROID_APP_ID','ADMOB_ANDROID_INTERSTITIAL','REVENUECAT_ANDROID_API_KEY']:['ADMOB_IOS_APP_ID','ADMOB_IOS_INTERSTITIAL','REVENUECAT_IOS_API_KEY'];
 for(const name of required)if(!env(name))throw new Error(`${name} is required for a release build.`);
 if(testing)throw new Error('ADMOB_TESTING must be false for a release build.');
 const appId=env(`ADMOB_${platform.toUpperCase()}_APP_ID`),interstitialId=env(`ADMOB_${platform.toUpperCase()}_INTERSTITIAL`);
 if(!/^ca-app-pub-\d{16}~\d{10}$/.test(appId)||!/^ca-app-pub-\d{16}\/\d{10}$/.test(interstitialId))throw new Error('AdMob App ID or interstitial ID has an invalid format.');
 if(appId.startsWith('ca-app-pub-3940256099942544')||interstitialId.startsWith('ca-app-pub-3940256099942544'))throw new Error('Production AdMob identifiers must replace Google test identifiers for a release build.');
}
write('dist/native-config.js',`window.FITNESS_COPILOT_NATIVE_CONFIG=${JSON.stringify({admob:{testing,androidInterstitial:env('ADMOB_ANDROID_INTERSTITIAL','ca-app-pub-3940256099942544/1033173712'),iosInterstitial:env('ADMOB_IOS_INTERSTITIAL','ca-app-pub-3940256099942544/4411468910')},revenueCat:{androidApiKey:env('REVENUECAT_ANDROID_API_KEY'),iosApiKey:env('REVENUECAT_IOS_API_KEY'),annualEntitlement:'pro',monthlyEntitlement:'pro'}},null,2)};\n`);
const androidManifest='android/app/src/main/AndroidManifest.xml';if(fs.existsSync(path.join(root,androidManifest))){let value=read(androidManifest),id=env('ADMOB_ANDROID_APP_ID','ca-app-pub-3940256099942544~3347511713');if(!value.includes('com.google.android.gms.ads.APPLICATION_ID'))value=value.replace('<application','<application\n        android:usesCleartextTraffic="false"').replace('</application>',`<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${id}"/>\n    </application>`);else value=value.replace(/(<meta-data\s+android:name="com\.google\.android\.gms\.ads\.APPLICATION_ID"\s+android:value=")[^"]+("\s*\/>)/m,`$1${id}$2`);write(androidManifest,value);}
const plist='ios/App/App/Info.plist';if(fs.existsSync(path.join(root,plist))){let value=read(plist),id=env('ADMOB_IOS_APP_ID','ca-app-pub-3940256099942544~1458002511');if(!value.includes('GADApplicationIdentifier')){const closing=value.lastIndexOf('</dict>');value=value.slice(0,closing)+`\t<key>GADApplicationIdentifier</key>\n\t<string>${id}</string>\n`+value.slice(closing);}else value=value.replace(/(<key>GADApplicationIdentifier<\/key>\s*<string>)[^<]+(<\/string>)/m,`$1${id}$2`);value=value.replace(/\s*<key>NSUserTrackingUsageDescription<\/key>\s*<string>[^<]*<\/string>/m,'');write(plist,value);}
