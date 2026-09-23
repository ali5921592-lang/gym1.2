import {currentLanguage,currentLocale,translateText} from './i18n.js';
let enabled=false,notify=()=>{};
export function stopVoice(){if('speechSynthesis'in window)window.speechSynthesis.cancel();}
export function setVoice(value,onError=()=>{}){notify=onError;enabled=!!value;stopVoice();if(enabled&&!('speechSynthesis'in window)){enabled=false;notify('Bu tarayıcı sesli rehberi desteklemiyor.');}return enabled;}
export function speak(text){if(!enabled||document.hidden)return;stopVoice();const u=new SpeechSynthesisUtterance(translateText(text));u.lang=currentLocale();u.rate=1;const prefix=currentLanguage().split('-')[0];const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(prefix));if(voice)u.voice=voice;u.onerror=e=>{if(!['canceled','interrupted'].includes(e.error))notify(translateText('Ses başlatılamadı. Cihazın sesini ve seçili dilde konuşma desteğini kontrol et.'));};window.speechSynthesis.speak(u);}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVoice();});
