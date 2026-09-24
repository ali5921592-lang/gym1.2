import translations,{FORMA_LANGUAGES,FORMA_LANGUAGE_CODES,formaDir,formaLocale,formaT} from './forma-translations.js';
import additions from './translation-additions.js';
import atlasTranslations from './atlas-translations.js';

const STORAGE_KEY='forma-lang';
const extra={
 'Akıllı Koç':{'en-US':'Smart Coach',es:'Coach inteligente','pt-BR':'Coach inteligente',fr:'Coach intelligent',de:'Smart Coach',ar:'المدرب الذكي'},
 'RPE/RIR, hacim ve gelişim içgörüleri':{'en-US':'RPE/RIR, volume and progress insights',es:'RPE/RIR, volumen y análisis del progreso','pt-BR':'RPE/RIR, volume e análises de progresso',fr:'RPE/RIR, volume et suivi des progrès',de:'RPE/RIR, Volumen und Fortschrittsanalysen',ar:'مؤشرات الجهد والحجم والتقدم'},
 'Kas ısı haritası ve gelişmiş anatomi':{'en-US':'Muscle heat map and advanced anatomy',es:'Mapa muscular y anatomía avanzada','pt-BR':'Mapa muscular e anatomia avançada',fr:'Carte musculaire et anatomie avancée',de:'Muskel-Heatmap und erweiterte Anatomie',ar:'خريطة حرارية للعضلات وتشريح متقدم'},
 'Sınırsız plan':{'en-US':'Unlimited plans',es:'Planes ilimitados','pt-BR':'Planos ilimitados',fr:'Programmes illimités',de:'Unbegrenzte Pläne',ar:'خطط غير محدودة'},
 'Özel programlar ve ekipman profilleri':{'en-US':'Custom routines and equipment profiles',es:'Rutinas personalizadas y perfiles de equipo','pt-BR':'Rotinas personalizadas e perfis de equipamento',fr:'Programmes personnalisés et profils de matériel',de:'Eigene Programme und Geräteprofile',ar:'برامج مخصصة وملفات المعدات'},
 'Reklamsız':{'en-US':'Ad-free',es:'Sin anuncios','pt-BR':'Sem anúncios',fr:'Sans publicité',de:'Werbefrei',ar:'بلا إعلانات'},
 'Kesintisiz keşif ve antrenman':{'en-US':'Uninterrupted browsing and training',es:'Exploración y entrenamiento sin interrupciones','pt-BR':'Exploração e treino sem interrupções',fr:'Exploration et entraînement sans interruption',de:'Ungestörtes Entdecken und Trainieren',ar:'تصفح وتدريب بلا انقطاع'},
 'yıl':{'en-US':'year',es:'año','pt-BR':'ano',fr:'an',de:'Jahr',ar:'سنة'},
 'ay':{'en-US':'month',es:'mes','pt-BR':'mês',fr:'mois',de:'Monat',ar:'شهر'},
 'Kapat':{'en-US':'Close',es:'Cerrar','pt-BR':'Fechar',fr:'Fermer',de:'Schließen',ar:'إغلاق'},
 'Evim':{'en-US':'My home',es:'Mi casa','pt-BR':'Minha casa',fr:'Chez moi',de:'Mein Zuhause',ar:'منزلي'},
 'Seyahat':{'en-US':'Travel',es:'Viaje','pt-BR':'Viagem',fr:'Voyage',de:'Reise',ar:'السفر'},
 'harekete.':{'en-US':'get moving.',es:'a moverte.','pt-BR':'vamos nos mexer.',fr:'bougeons.',de:'komm in Bewegung.',ar:'هيا نتحرك.'},
 'HIZLI SEANS':{'en-US':'QUICK SESSION',es:'SESIÓN RÁPIDA','pt-BR':'SESSÃO RÁPIDA',fr:'SÉANCE RAPIDE',de:'SCHNELLE EINHEIT',ar:'جلسة سريعة'},
 'Seviye':{'en-US':'Level',es:'Nivel','pt-BR':'Nível',fr:'Niveau',de:'Level',ar:'المستوى'},
 'hareket':{'en-US':'exercise',es:'ejercicio','pt-BR':'exercício',fr:'exercice',de:'Übung',ar:'تمرين'},
 'set':{'en-US':'set',es:'serie','pt-BR':'série',fr:'série',de:'Satz',ar:'مجموعة'},
 'tekrar':{'en-US':'reps',es:'repeticiones','pt-BR':'repetições',fr:'répétitions',de:'Wiederholungen',ar:'تكرارات'},
 'taraf':{'en-US':'side',es:'lado','pt-BR':'lado',fr:'côté',de:'Seite',ar:'جهة'},
 'saniye':{'en-US':'seconds',es:'segundos','pt-BR':'segundos',fr:'secondes',de:'Sekunden',ar:'ثوانٍ'},
 'Ekipmansız':{'en-US':'No equipment',es:'Sin equipo','pt-BR':'Sem equipamento',fr:'Sans matériel',de:'Ohne Geräte',ar:'بدون معدات'},
 'HAFTALIK ÖZET':{'en-US':'WEEKLY SUMMARY',es:'RESUMEN SEMANAL','pt-BR':'RESUMO SEMANAL',fr:'RÉSUMÉ HEBDOMADAIRE',de:'WOCHENÜBERSICHT',ar:'الملخص الأسبوعي'},
 'Uygula':{'en-US':'Apply',es:'Aplicar','pt-BR':'Aplicar',fr:'Appliquer',de:'Anwenden',ar:'طبّق'},
 'Fit ve dengeli':{'en-US':'Fit and balanced',es:'En forma y equilibrado','pt-BR':'Em forma e equilibrado',fr:'En forme et équilibré',de:'Fit und ausgewogen',ar:'لياقة وتوازن'},
 'Açık havada koşan sporcu':{'en-US':'Athlete running outdoors',es:'Atleta corriendo al aire libre','pt-BR':'Atleta correndo ao ar livre',fr:'Athlète courant en plein air',de:'Athlet beim Laufen im Freien',ar:'رياضي يركض في الهواء الطلق'},
 'Ses başlatılamadı. Cihazın sesini ve seçili dilde konuşma desteğini kontrol et.':{'en-US':'Audio could not start. Check your device volume and voice support for the selected language.',es:'No se pudo iniciar el audio. Comprueba el volumen y la voz del idioma seleccionado.','pt-BR':'Não foi possível iniciar o áudio. Verifique o volume e a voz do idioma selecionado.',fr:'Le son n’a pas pu démarrer. Vérifiez le volume et la voix de la langue sélectionnée.',de:'Die Sprachausgabe konnte nicht gestartet werden. Prüfe Lautstärke und Sprachunterstützung.',ar:'تعذر تشغيل الصوت. تحقّق من مستوى الصوت ودعم اللغة المحددة.'}
};
Object.assign(extra,additions,atlasTranslations);
const supported=new Set(FORMA_LANGUAGE_CODES);
const storage=typeof localStorage==='undefined'?null:localStorage;
const legacy={'en':'en-US','pt':'pt-BR'};
const saved=legacy[storage?.getItem(STORAGE_KEY)]||storage?.getItem(STORAGE_KEY);
let language=supported.has(saved)?saved:'tr';
let translating=false,scheduled=false;
const normalize=value=>String(value).replace(/\s+/g,' ').trim();
const dictionary=Object.fromEntries(Object.entries({...translations,...extra}).map(([key,value])=>[normalize(key),value]));
const originals=new WeakMap(),attributeOriginals=new WeakMap();
const escapeRegex=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const templates=Object.keys(dictionary).filter(key=>/__v\d+__/.test(key)&&/\p{L}/u.test(key.replace(/__v\d+__/g,''))).sort((a,b)=>b.replace(/__v\d+__/g,'').length-a.replace(/__v\d+__/g,'').length).map(key=>({key,names:[...key.matchAll(/__v(\d+)__/g)].map(match=>Number(match[1])),pattern:new RegExp('^'+key.split(/__v\d+__/g).map(escapeRegex).join('(.+?)')+'$')}));
const fragments=Object.keys(dictionary).filter(key=>!/__v\d+__/.test(key)&&key.length>=2).sort((a,b)=>b.length-a.length);
const fragmentPattern=new RegExp('(?<![\\p{L}])(?:'+fragments.map(escapeRegex).join('|')+')(?![\\p{L}])','gu');

export const currentLanguage=()=>language;
export const currentLocale=()=>formaLocale(language);
export const t=source=>language==='tr'?String(source):(dictionary[normalize(source)]?.[language]||String(source));
export function translateText(source,depth=0){
 const value=normalize(source);if(language==='tr')return String(source);const direct=t(value);if(direct!==value)return direct;
 if(depth<2)for(const template of templates){const match=value.match(template.pattern);if(!match)continue;const values=new Map(template.names.map((name,index)=>[name,translateText(match[index+1],depth+1)]));return t(template.key).replace(/__v(\d+)__/g,(_,name)=>values.get(Number(name))??_);}
 return value.replace(fragmentPattern,key=>t(key));
}
const ignored=node=>{const el=node.nodeType===1?node:node.parentElement;return !el||!!el.closest('script,style,textarea,[data-i18n-ignore]');};
export function translateTree(root=typeof document==='undefined'?null:document.body){
 if(!root||translating)return root;translating=true;const doc=root.ownerDocument||document;
 const visit=node=>{if(ignored(node))return;const raw=node.nodeValue,previous=originals.get(node);if(previous&&raw===previous.output&&previous.language===language)return;const source=previous&&raw===previous.output?previous.source:raw;if(!source.trim())return;const output=source.replace(source.trim(),translateText(source.trim()));originals.set(node,{source,output,language});if(output!==raw)node.nodeValue=output;};
 if(root.nodeType===3)visit(root);else{const walker=doc.createTreeWalker(root,4);let node;while((node=walker.nextNode()))visit(node);for(const el of [root,...(root.querySelectorAll?.('[placeholder],[aria-label],[title],[alt]')||[])]){if(ignored(el))continue;const values=attributeOriginals.get(el)||{};for(const attr of ['placeholder','aria-label','title','alt']){const raw=el.getAttribute?.(attr);if(!raw)continue;const previous=values[attr],source=previous&&raw===previous.output?previous.source:raw,output=translateText(source);values[attr]={source,output};if(output!==raw)el.setAttribute(attr,output);}attributeOriginals.set(el,values);}}
 translating=false;return root;
}
function applyDocument(){document.documentElement.lang=language;document.documentElement.dir=formaDir(language);document.body?.classList.toggle('rtl',language==='ar');const pill=document.querySelector('.language-pill');if(pill)pill.textContent=language==='en-US'?'EN':language==='pt-BR'?'PT':language.toUpperCase();translateTree(document.body);}
export function setLanguage(next){if(!supported.has(next))return false;storage?.setItem(STORAGE_KEY,next);language=next;applyDocument();return true;}
function schedule(){if(scheduled||translating)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;translateTree(document.body);});}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyDocument,{once:true});else applyDocument();
 if(typeof MutationObserver!=='undefined')new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title','alt']});
}
export async function chooseInitialLanguage(){
 if(supported.has(legacy[storage?.getItem(STORAGE_KEY)]||storage?.getItem(STORAGE_KEY)))return;
 const candidates=[...(navigator.languages||[]),navigator.language].filter(Boolean).map(value=>String(value).toLowerCase());
 const detected=candidates.map(value=>{
  if(value.startsWith('tr'))return'tr';if(value.startsWith('ar'))return'ar';if(value.startsWith('de'))return'de';
  if(value.startsWith('es'))return'es';if(value.startsWith('pt'))return'pt-BR';if(value.startsWith('fr'))return'fr';
  if(value.startsWith('en'))return'en-US';return null;
 }).find(Boolean)||'en-US';
 setLanguage(detected);
}
if(typeof window!=='undefined')window.FORMA_I18N={currentLanguage,currentLocale,setLanguage,t:translateText,languages:FORMA_LANGUAGES};
export {FORMA_LANGUAGES,FORMA_LANGUAGE_CODES};
