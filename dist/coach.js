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
 const day=next<0?null:dayWorkout(state,state.plan,next),base=Math.floor(today/7)*7;
 return `<div class="command-heading"><div><span class="eyebrow">BUGÜNKÜ ÖNERİN</span><h1>Hadi, <em>harekete.</em></h1></div><button class="streak-capsule" data-action="rewards" aria-label="${streak(state)} günlük seri"><span>🔥</span><strong>${streak(state)}<small>günlük seri</small></strong></button></div>
 ${state.activeSession?'<button class="resume-banner" data-action="resume"><span class="live-dot"></span><span><strong>Devam eden antrenmanın</strong><small>Kaydettiğin setler yerinde.</small></span><b>Devam et →</b></button>':''}
 <section class="training-spotlight home-spotlight"><img src="${photos.strength}" alt="Dambıl ile antrenman yapan sporcu"><div class="spotlight-shade"></div><div class="spotlight-content"><div class="spotlight-label"><span class="live-dot"></span>${day?'SIRADAKİ ANTRENMAN':'PROGRAM TAMAMLANDI'}<span>${state.place==='home'?'EVDE':'SALONDA'}</span></div><h2>${day?.title||'Yeni bir hedef seç.'}</h2><p>${goal} · ${day?dayDate(next).toLocaleDateString(currentLocale(),{day:'numeric',month:'long'}):'Dört haftalık programın tamamlandı'}</p><div class="spotlight-metrics"><div><strong>${day?.minutes||'—'}</strong><span>dakika</span></div><div><strong>${day?.exercises.length||'—'}</strong><span>hareket</span></div><div><strong>${day?.sets||'—'}</strong><span>set</span></div></div><button class="primary start-button" data-action="${state.activeSession?'resume':next<0?'setup':'start'}" data-day="${next}">${state.activeSession?'Antrenmana dön':next<0?'Yeni program oluştur':'Antrenmanı başlat'} <span>→</span></button></div></section>
 <section class="daily-strip home-week"><div><span class="eyebrow">4 HAFTALIK PLANIN</span><strong>${plan.name}</strong></div><div class="week-strip">${Array.from({length:7},(_,j)=>{const i=base+j,w=dayWorkout(state,state.plan,i),d=dayDate(i);return `<button class="day ${w.rest?'':'workout'} ${i===today?'current':''} ${finished(i)?'done':''}" data-action="day-open" data-day="${i}" aria-label="${d.toLocaleDateString(currentLocale())} ${w.title}"><span>${d.toLocaleDateString(currentLocale(),{weekday:'short'})}</span><strong>${finished(i)?'✓':d.getDate()}</strong><span class="day-dot"></span></button>`;}).join('')}</div><a href="#plan" class="text-button">Aylık planı gör →</a></section>
 ${day?`<section class="studio-panel session-preview home-preview"><div class="section-heading"><div><span class="eyebrow">BUGÜNÜN HAREKETLERİ</span><h2>${day.exercises.length} hareket · yaklaşık ${day.minutes} dk</h2></div><a href="#plan" class="text-button">Düzenle →</a></div>${day.exercises.slice(0,3).map((e,i)=>row(e,i,day.sets)).join('')}${day.exercises.length>3?`<a href="#plan" class="text-button">${day.exercises.length-3} hareket daha · Planı aç</a>`:''}</section>`:''}`;
}
export function performanceMarkup(state){
 const best=records(state),days=Array.from({length:28},(_,i)=>{const d=new Date();d.setDate(d.getDate()-27+i);return{date:dateKey(d),label:d.toLocaleDateString(currentLocale(),{day:'numeric',month:'long'})};});
 return `<div class="studio-grid"><section class="studio-panel"><span class="eyebrow">SON 28 GÜN</span><h2 class="space-title">Devamlılık haritan</h2><div class="activity-map">${days.map(d=>{const n=state.history.filter(h=>dateKey(h.date)===d.date).length;return `<div class="activity-cell ${n?'filled':''}" title="${d.label}: ${n} seans" aria-label="${d.label}: ${n} seans">${n?'✓':''}</div>`;}).join('')}</div><p class="muted">Her dolu kare, tamamladığın bir antrenman günü.</p></section><section class="studio-panel"><span class="eyebrow">KENDİNLE YARIŞ</span><h2 class="space-title">Kayıtlı en yüksek yüklerin</h2>${best.length?best.slice(0,4).map(r=>`<div class="record-row"><span>${r.name}</span><strong>${r.load} <small>kg · ${r.reps} tekrar</small></strong></div>`).join(''):'<p class="muted">Setlerine yük ve tekrar ekledikçe kişisel kayıtların burada görünecek.</p>'}<small>Yalnızca girdiğin kayıtlar; maksimum güç tahmini değildir.</small></section></div>`;
}
