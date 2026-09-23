import {youtubeAPI} from './youtube-player.js';
import {mediaData} from './media-data.js';
export const mediaFor=e=>e&&(mediaData[e.id]||(e.video?{type:'youtube',url:e.video,provider:'Egzersiz anlatım videosu'}:null));
let cleanup=()=>{};
export function stopMedia(){cleanup();cleanup=()=>{};}
export function mediaMarkup(e){
 const m=mediaFor(e);if(!m)return '<div class="tip">Bu hareketin video kaynağı henüz eklenmedi.</div>';
 return `<div class="video-frame ${m.type==='video'?'native-video-frame':''}" id="video-frame"><button class="video-cover" data-action="video" data-id="${e.id}">${m.poster?`<img class="video-poster" src="${m.poster}" alt="${e.name} gösterimi">`:''}<span class="play-big">▶</span><span>${e.name}</span><small>${m.type==='video'?'Harekete özel kısa gösterim':'Eğitmen anlatımı'} · İzlemek için dokun</small></button></div><div class="media-credit">${m.provider}${m.license?' · '+m.license:''}${m.licenseUrl?` · <a href="${m.licenseUrl}" target="_blank" rel="noopener">Lisans</a>`:''}</div>${m.note?`<p class="video-variation">${m.note}</p>`:''}<div class="video-mode"><button class="secondary" data-action="video" data-id="${e.id}">▶ Videoyu aç</button>${m.type==='youtube'?`<button class="quiet" data-action="video" data-id="${e.id}" data-mode="standard">Diğer oynatıcıyı dene</button>`:''}</div><p class="media-status" id="media-status" role="status" aria-live="polite"></p>`;
}
export function playMedia(e,mode='private'){
 stopMedia();const m=mediaFor(e),host=document.querySelector('#video-frame'),status=document.querySelector('#media-status');if(!m||!host)return;
 const message=t=>{if(status?.isConnected)status.textContent=t;};
 let timeout;const fail=t=>{if(!host.isConnected)return;stopMedia();message(t);host.innerHTML='<div class="video-error"><strong>Video bağlantısı kurulamadı</strong><p>Sağlayıcının oynatıcısı bu tarayıcıda yüklenemedi. Hareketin adım adım rehberi aşağıda kullanılabilir.</p><button class="secondary" data-action="video" data-id="'+e.id+'" data-mode="standard">Videoyu yeniden dene</button></div>';};message('Video bağlanıyor…');
 if(m.type==='video'){
  const v=document.createElement('video');v.controls=true;v.playsInline=true;v.preload='auto';v.src=m.url;v.setAttribute('aria-label',e.name+' hareket gösterimi');if(m.poster)v.poster=m.poster;host.replaceChildren(v);
  v.addEventListener('loadeddata',()=>{clearTimeout(timeout);message('Video hazır. ▶ ile başlatabilir, tam ekran izleyebilirsin.');});
  v.addEventListener('ended',()=>message('Gösterim tamamlandı. Tekrar izleyebilirsin.'));
  v.addEventListener('playing',()=>{clearTimeout(timeout);message('Oynatılıyor · '+m.provider);});
  v.addEventListener('error',()=>{clearTimeout(timeout);if(!v.isConnected)return;const reason=v.error?.code===4?'Tarayıcı video biçimini veya kaynağını açamadı.':'Video sağlayıcısına bağlantı kurulamadı.';host.innerHTML=`<div class="video-error"><strong>Video yüklenemedi</strong><p>${reason}</p><button class="secondary" data-action="video" data-id="${e.id}">Yeniden yükle</button></div>`;message(reason);});
  timeout=setTimeout(()=>{if(v.readyState<2)fail('Bağlantı beklenenden uzun sürdü. Videoyu yeniden yüklemeyi deneyebilirsin.');},15000);
  cleanup=()=>{clearTimeout(timeout);v.pause();v.remove();v.removeAttribute('src');v.load();};v.play().catch(()=>message('Otomatik başlatma engellendi. Videonun üzerindeki ▶ düğmesine dokun.'));return;
 }
 const frame=document.createElement('iframe');frame.title=e.name+' anlatımı';const domain=mode==='standard'?'https://www.youtube.com':'https://www.youtube-nocookie.com';
 frame.src=m.type==='embed'?m.url:domain+'/embed/'+m.url+'?autoplay=1&playsinline=1&rel=0&enablejsapi=1&origin='+encodeURIComponent(location.origin);frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;host.replaceChildren(frame);
 let ready=false,player,cancelled=false;
 timeout=setTimeout(()=>{if(ready||cancelled)return;if(m.type==='youtube'&&mode!=='standard'){playMedia(e,'standard');return;}fail('Bağlantı yanıt vermedi. Doğrudan video filtresindeki klipler ayrı bir oynatıcı kullanır.');},12000);
 if(m.type==='youtube')youtubeAPI().then(YT=>{if(cancelled||!frame.isConnected)return;player=new YT.Player(frame,{events:{onReady:()=>{if(cancelled)return;ready=true;clearTimeout(timeout);message('Video hazır. Başlatmak için oynatıcının ▶ düğmesine dokun.');},onStateChange:ev=>{if(ev.data===1)message('Oynatılıyor · '+m.provider);if(ev.data===0)message('Gösterim tamamlandı. Tekrar izleyebilirsin.');},onError:ev=>{clearTimeout(timeout);const errors={100:'Video silinmiş veya gizli olarak değiştirilmiş.',101:'Video sahibi uygulama içinde oynatmayı kapatmış.',150:'Video sahibi uygulama içinde oynatmayı kapatmış.',153:'YouTube bu tarayıcının kimlik bilgisini kabul etmedi.'};fail((errors[ev.data]||'YouTube videoyu başlatamadı.')+' Diğer oynatıcıyı deneyebilirsin.');}}});}).catch(()=>{if(!cancelled)fail('YouTube ile bağlantı kurulamadı. Diğer oynatıcıyı deneyebilirsin.');});
 else frame.addEventListener('load',()=>{clearTimeout(timeout);message('Oynatıcı yüklendi. Başlatmak için ▶ düğmesine dokun.');});
 cleanup=()=>{cancelled=true;clearTimeout(timeout);try{player?.destroy();}catch{}};
}
