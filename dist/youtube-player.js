let loading;
export function youtubeAPI(){
 if(window.YT?.Player)return Promise.resolve(window.YT);
 if(loading)return loading;
 loading=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
  const timeout=setTimeout(()=>{loading=null;script.remove();reject(new Error('YouTube bağlantısı zaman aşımına uğradı.'));},10000);
  window.onYouTubeIframeAPIReady=()=>{clearTimeout(timeout);resolve(window.YT);};
  script.onerror=()=>{clearTimeout(timeout);loading=null;script.remove();reject(new Error('YouTube oynatıcısı yüklenemedi.'));};
  document.head.appendChild(script);
 });return loading;
}
