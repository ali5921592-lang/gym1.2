export const measureUnit=e=>/saniye|\bsn\b/.test(e.reps)?'sn':/dakika|\bdk\b/.test(e.reps)?'dk':'tekrar';
export function weekStart(now=new Date()){const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d;}
export function weeklyStats(history,catalog,now=new Date()){
 const start=weekStart(now),end=new Date(start);end.setDate(end.getDate()+7);const previous=new Date(start);previous.setDate(previous.getDate()-7);
 const current=history.filter(h=>new Date(h.date)>=start&&new Date(h.date)<end),before=history.filter(h=>new Date(h.date)>=previous&&new Date(h.date)<start);
 const counts={};let sets=0;
 for(const h of current)for(const l of h.logs||[]){const e=catalog.find(e=>e.id===l.exercise);if(!e||e.category!=='strength')continue;sets++;for(const k of new Set([e.muscle,...e.secondary]))counts[k]=(counts[k]||0)+1;}
 const gains=[];for(const e of catalog){const get=rows=>rows.flatMap(h=>(h.logs||[]).filter(l=>l.exercise===e.id&&l.unit==='tekrar'&&l.amount!=null));const a=get(current),b=get(before);if(!a.length||!b.length)continue;const loads=[...new Set(a.map(l=>l.load))];for(const load of loads){const aa=a.filter(l=>l.load===load),bb=b.filter(l=>l.load===load);if(!bb.length)continue;const delta=Math.max(...aa.map(l=>l.amount))-Math.max(...bb.map(l=>l.amount));if(delta>0){gains.push({name:e.name,delta,load});break;}}}
 return{start,end,current,before,sets,counts,minutes:current.reduce((n,h)=>n+(Number(h.minutes)||0),0),delta:current.length-before.length,gains};
}
export function adaptExercise(state,e,baseSets){
 const base={...e,sets:e.category==='strength'?baseSets:1};if(e.category!=='strength'||state.adaptive===false)return base;
 const history=[...(state.history||[])].reverse().filter(h=>(h.logs||[]).some(l=>l.exercise===e.id)).slice(0,2),last=history[0];
 if(!last)return base;
 if(last.feedback==='hard')return{...base,sets:Math.max(1,baseSets-1),adaptation:'Son seansı zor olarak işaretledin: bu harekette bir set azaltıldı. Rahat yük seç.'};
 const rows=(last.logs||[]).filter(l=>l.exercise===e.id&&l.unit==='tekrar'&&Number(l.amount)>0),range=e.reps.match(/^(\d+)[–-](\d+)/);
 if(!rows.length||!range)return{...base,adaptation:'Önceki tekrar kaydı yeterli değil; temel hedef korundu.'};
 const low=+range[1],high=+range[2],reps=Math.min(...rows.map(l=>l.amount)),load=rows.every(l=>l.load===rows[0].load)?rows[0].load:null;
 if(last.feedback==='easy'&&reps<high)return{...base,reps:Math.max(low,Math.min(high,reps+1))+' tekrar',suggestedLoad:load,adaptation:'Son seans kolaydı: aynı yükle bir tekrar eklemeyi dene; form bozulursa önceki hedefte kal.'};
 if(history.length===2&&history.every(h=>h.feedback==='easy'&&(h.logs||[]).filter(l=>l.exercise===e.id).every(l=>l.unit==='tekrar'&&l.amount>=high))&&Number(load)>0)return{...base,reps:low+' tekrar',suggestedLoad:Math.round(load*1.025*100)/100,adaptation:'İki kolay seansta üst tekrar sınırına ulaştın: yaklaşık %2,5 yük artışı önerisi. Ekipmanındaki en küçük artış daha büyükse aynı yükte kal.'};
 return{...base,suggestedLoad:load,adaptation:'Önceki yük ve temel tekrar aralığı korundu; kontrollü devam et.'};
}
export function adaptWorkout(state,w){return w.rest?w:{...w,exercises:w.exercises.map(e=>adaptExercise(state,e,w.sets))};}
export function sessionSequence(w){
 const out=[];for(let i=0;i<w.exercises.length;i++){const a=w.exercises[i],b=w.exercises[i+1],count=a.sets||(a.category==='strength'?w.sets:1);
  if(a.pairNext&&b){const bc=b.sets||(b.category==='strength'?w.sets:1);for(let n=1;n<=Math.max(count,bc);n++){if(n<=count)out.push({index:i,set:n,restAfter:n>bc});if(n<=bc)out.push({index:i+1,set:n,restAfter:true});}i++;}
  else for(let n=1;n<=count;n++)out.push({index:i,set:n,restAfter:true});
 }if(out.length)out.at(-1).restAfter=false;return out;
}
