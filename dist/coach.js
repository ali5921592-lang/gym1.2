import {exercises,available,muscles,photos,dayWorkout} from './data.js';
import {dateKey,streak} from './experience.js';
import {currentLocale} from './i18n.js';

export function lastSet(state,id){
 for(const h of [...state.history].reverse()){
  const rows=(h.logs||[]).filter(l=>l.exercise===id&&l.amount!=null);
  if(rows.length)return rows.at(-1);
 }return null;
}
export function quickWorkout(state,minutes=15){
 const pool=available(state).filter(e=>e.category==='strength');
 const groups=['quads','chest','back','glutes','abs','shoulders'];
 const chosen=groups.map(m=>pool.find(e=>e.muscle===m)).filter(Boolean).slice(0,minutes===10?3:minutes===20?5:4);
 return {title:minutes+' dakikalık hızlı seans',minutes,sets:2,week:0,rest:false,exercises:chosen};
}
export function records(state){
 const rows=[];
 for(const e of exercises){
  const all=state.history.flatMap(h=>(h.logs||[]).filter(l=>l.exercise===e.id&&l.unit==='tekrar'&&Number(l.load)>0&&Number(l.amount)>0));
  if(!all.length)continue;
  const best=all.reduce((a,b)=>b.load>a.load?b:a);
  rows.push({name:e.name,load:best.load,reps:best.amount});
 }return rows.sort((a,b)=>b.load-a.load);
}
export function dashboard(state,{next,goal,plan,finished,today,dayDate,row}){
 const day=next<0?null:dayWorkout(state,state.plan,next),xp=(state.checkins?.length||0)*10+state.history.length*50;
 const base=Math.floor(today/7)*7,check=state.wellness?.date===dateKey()?state.wellness:null;
 const recommendation=check?.energy==='low'?'Bugün temponu düşür.':check?.energy==='high'?'Kontrollü bir seansa hazırsın.':'Bugünkü ritmini seç.';
 return `<div class="command-heading"><div><span class="eyebrow">SENİN ALANIN. SENİN GELİŞİMİN.</span><h1>Hadi, <em>harekete.</em></h1></div><button class="streak-capsule" data-action="rewards"><span>🔥</span><strong>${streak(state)}<small>günlük seri</small></strong><span>↗</span></button></div>
 ${state.activeSession?'<button class="resume-banner" data-action="resume"><span class="live-dot"></span><span><strong>Yarım kalan seansın seni bekliyor.</strong><small>Kaydettiğin setlerden devam et.</small></span><b>Devam et →</b></button>':''}
 <div class="command-grid"><section class="training-spotlight"><img src="${photos.strength}" alt="Dambıl ile antrenman yapan sporcu"><div class="spotlight-shade"></div><div class="spotlight-content"><div class="spotlight-label"><span class="live-dot"></span>${next<0?'YENİ BİR HEDEF':'SIRADAKİ SEANS'}<span>${state.place==='home'?'EVDE':'SALONDA'}</span></div><h2>${day?.title||'Yeni bir<br>başlangıç.'}</h2><p>${goal} · ${day?dayDate(next).toLocaleDateString(currentLocale(),{day:'numeric',month:'long'}):'Dört haftanı tamamladın'}</p><div class="spotlight-metrics"><div><strong>${day?.minutes||'—'}</strong><span>dakika</span></div><div><strong>${String(day?.exercises.length||0).padStart(2,'0')}</strong><span>hareket</span></div><div><strong>${day?.sets||'—'}</strong><span>set / kuvvet</span></div></div><button class="primary start-button" data-action="${state.activeSession?'resume':next<0?'setup':'start'}" data-day="${next}">${state.activeSession?'Seansıma devam et':next<0?'Hedefimi yenile':'Antrenmanı başlat'} <span>↗</span></button></div><img class="spotlight-logo" src="assets/fitness-copilot-logo.jpeg" alt=""></section>
 <div class="command-side"><section class="coach-card"><div class="section-label"><span class="coach-symbol">✦</span><span>GÜNLÜK ASİSTAN</span><span class="mini-pill">Sana göre</span></div><h2>${recommendation}</h2><p>${check?check.energy==='low'?'Enerjin düşükse kısa ve rahat hareketi seç; dinlenmeye de yer var.':'Bugünkü enerji tercihin kaydedildi. İlk sette formunu kontrol et.':'Enerjini seç; gününü nasıl başlatacağına birlikte karar verelim.'}</p><div class="energy-options">${[['low','Sakin'],['normal','Dengeli'],['high','Enerjik']].map(([v,t])=>`<button data-action="energy" data-value="${v}" aria-pressed="${check?.energy===v}">${t}</button>`).join('')}</div><small>Senin seçimine dayalı rehber · Sağlık ölçümü değil</small></section><button class="atlas-portal" data-action="open-atlas"><span class="portal-icon">◎</span><span class="eyebrow">ANATOMİ LABORATUVARI</span><h3>Kasını tanı.<br>Hareketini bul.</h3><span>23 bölge · Etkileşimli 3D <b>↗</b></span></button></div></div>
 <div class="daily-strip"><div><span class="eyebrow">BU HAFTA</span><strong>${plan.name}</strong></div><div class="week-strip">${Array.from({length:7},(_,j)=>{const i=base+j,w=dayWorkout(state,state.plan,i),d=dayDate(i);return `<button class="day ${w.rest?'':'workout'} ${i===today?'current':''} ${finished(i)?'done':''}" data-action="day-open" data-day="${i}" aria-label="${d.toLocaleDateString(currentLocale())} ${w.title}"><span>${d.toLocaleDateString(currentLocale(),{weekday:'short'})}</span><strong>${finished(i)?'✓':d.getDate()}</strong><span class="day-dot"></span></button>`;}).join('')}</div><a href="#plan" class="text-button">Planı aç ↗</a></div>
 <div class="studio-grid"><section class="studio-panel"><div class="section-heading"><h2>Vaktin kadar hareket.</h2><span class="mini-pill">Ekipmanına uygun</span></div><p class="muted">Kısa kuvvet seansını aç, hareketleri incele, hazır olduğunda başla.</p><div class="quick-grid">${[10,15,20].map((n,i)=>`<button data-action="quick" data-value="${n}" class="quick-card"><span>0${i+1} / HIZLI SEANS</span><strong>${n}<small>dk</small></strong><div>${['Küçük bir başlangıç','Günlük ritim','Biraz daha fazlası'][i]} <b>↗</b></div></button>`).join('')}</div></section><section class="studio-panel momentum"><span class="eyebrow">DEVAMLILIK KAZANDIRIR</span><div class="xp-display">${xp}<small>XP</small><span>Seviye ${Math.floor(xp/250)+1}</span></div><div class="xp-track"><i style="width:${xp%250/250*100}%"></i></div><p>Sonraki seviyeye ${250-xp%250} XP. Dinlenme günlerinde de buradasın.</p><div class="momentum-bottom"><span><b>${state.history.length}</b> tamamlanan seans</span><button class="text-button" data-action="rewards">Rozetler ↗</button></div></section></div>
 ${day?`<section class="studio-panel session-preview"><div class="section-heading"><h2>Seansın içinde</h2><span class="mini-pill">${day.exercises.length} hareket</span></div>${day.exercises.slice(0,4).map((e,i)=>row(e,i,day.sets)).join('')}</section>`:''}`;
}
export function performanceMarkup(state){
 const best=records(state),days=Array.from({length:28},(_,i)=>{const d=new Date();d.setDate(d.getDate()-27+i);return{date:dateKey(d),label:d.toLocaleDateString(currentLocale(),{day:'numeric',month:'long'})};});
 return `<div class="studio-grid"><section class="studio-panel"><span class="eyebrow">SON 28 GÜN</span><h2 class="space-title">Devamlılık haritan</h2><div class="activity-map">${days.map(d=>{const n=state.history.filter(h=>dateKey(h.date)===d.date).length;return `<div class="activity-cell ${n?'filled':''}" title="${d.label}: ${n} seans" aria-label="${d.label}: ${n} seans">${n?'✓':''}</div>`;}).join('')}</div><p class="muted">Her dolu kare, tamamladığın bir antrenman günü.</p></section><section class="studio-panel"><span class="eyebrow">KENDİNLE YARIŞ</span><h2 class="space-title">Kayıtlı en yüksek yüklerin</h2>${best.length?best.slice(0,4).map(r=>`<div class="record-row"><span>${r.name}</span><strong>${r.load} <small>kg · ${r.reps} tekrar</small></strong></div>`).join(''):'<p class="muted">Setlerine yük ve tekrar ekledikçe kişisel kayıtların burada görünecek.</p>'}<small>Yalnızca girdiğin kayıtlar; maksimum güç tahmini değildir.</small></section></div>`;
}
