import {classifyMuscle,detailMuscles} from './anatomy-data.js';
import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {muscleColors} from './catalog.js';

let cached;
const accent=new T.Color('#c1fa62');
const relatedColor=new T.Color('#4dd7b0');
const mutedMuscle=new T.Color('#66515a');
const heatPalette=['#53596a','#69d8be','#bda2ff','#ff9b60'];

export function createAtlas(container,initial,onSelect){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
 renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.08;
 renderer.setClearColor(0x000000,0);
 container.appendChild(renderer.domElement);
 renderer.domElement.setAttribute('role','img');
 renderer.domElement.setAttribute('aria-label','Gerçek 3B kas anatomisi. Döndürmek için sürükle, kas seçmek için dokun.');

 const scene=new T.Scene();
 const camera=new T.PerspectiveCamera(31,1,.01,50);
 const body=new T.Group();
 camera.position.set(0,0,7.1);
 scene.add(body);
 scene.add(new T.HemisphereLight(0xf0f5ff,0x2d3137,1.65));
 for(const [color,power,pos] of [[0xffeadb,2.6,[-3,4,5]],[0x9cbcff,1.8,[4,1,2]],[0x6effd0,1.5,[0,3,-3]]]){
  const light=new T.DirectionalLight(color,power);light.position.set(...pos);scene.add(light);
 }
 const rim=new T.PointLight(0x9fff54,1.15,9);rim.position.set(0,1,3);scene.add(rim);

 const loading=document.createElement('div');
 loading.className='atlas-loading';
 loading.innerHTML='<span class="loader-ring"></span><strong>Anatomi hazırlanıyor</strong><small>Kas yüzeyleri netleştiriliyor…</small>';
 container.appendChild(loading);

 let heat=null,alive=true,frame,last=0,meshes=[],materials=new Map(),selected=initial,angle=0,zoom=7.1,down=null,moved=false;
 const heatColor=n=>n>=8?heatPalette[3]:n>=4?heatPalette[2]:n>0?heatPalette[1]:heatPalette[0];
 function paint(){
  materials.forEach((material,key)=>{
   const group=key.startsWith('__')?null:key;
   const base=group?(muscleColors[group]||'#d49a86'):key==='__tendon__'?'#d6c7b2':'#ae7568';
   const isSelected=group===selected;
   const isRelated=!!(group&&detailMuscles[group]?.parent===selected);
   const color=heat?heatColor(heat[group]||0):isSelected?accent:isRelated?relatedColor:new T.Color(base).lerp(mutedMuscle,.38);
   material.color.set(color);
   material.emissive.set(isSelected?accent:isRelated?relatedColor:0x000000);
   material.emissiveIntensity=isSelected?.3:isRelated?.15:0;
   material.roughness=isSelected?.34:.53;
  });
 }
 if(!cached)cached=new GLTFLoader().loadAsync('./assets/anatomy.glb').catch(error=>{cached=null;throw error;});
 cached.then(gltf=>{
  if(!alive)return;
  const root=gltf.scene.clone(true);
  root.rotation.x=-Math.PI/2;
  root.updateMatrixWorld(true);
  const bounds=new T.Box3().setFromObject(root),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
  const scale=3.78/size.y;
  root.scale.setScalar(scale);
  root.position.copy(center.multiplyScalar(-scale));
  root.traverse(mesh=>{
   if(!mesh.isMesh)return;
   const name=mesh.name||mesh.parent?.name||'';
   const group=classifyMuscle(name);
   const source=Array.isArray(mesh.material)?mesh.material[0]:mesh.material;
   const key=group||(source?.name?.toLowerCase().includes('tendon')?'__tendon__':'__unmapped__');
   let material=materials.get(key);
   if(!material){
    material=source?.clone?.()||new T.MeshStandardMaterial();
    material.color.set(group?(muscleColors[group]||'#d49a86'):source?.color||'#d6c7b2');
    material.side=T.DoubleSide;
    material.roughness=.53;
    material.metalness=.015;
    if('envMapIntensity' in material)material.envMapIntensity=.8;
    materials.set(key,material);
   }
   mesh.material=material;
   mesh.userData={group,anatomicalName:name.replaceAll('_',' ')};
   meshes.push(mesh);
  });
  body.add(root);paint();loading.remove();
 }).catch(()=>{if(alive)loading.innerHTML='<strong>3B model yüklenemedi</strong><small>Kas listesini kullanarak devam edebilirsin.</small>';});

 const ray=new T.Raycaster(),pointer=new T.Vector2();
 function resize(){const width=Math.max(1,container.clientWidth),height=Math.max(1,container.clientHeight);renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(container);resize();
 function start(event){if(event.button!==undefined&&event.button!==0)return;down={x:event.clientX,y:event.clientY,angle};moved=false;}
 function move(event){if(!down)return;const dx=event.clientX-down.x,dy=event.clientY-down.y;if(Math.abs(dx)>5||Math.abs(dy)>8)moved=true;if(moved)angle=down.angle+dx*.011;}
 function end(event){if(!down)return;down=null;if(moved)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(meshes,false).find(item=>item.object.userData.group);if(hit){selected=hit.object.userData.group;paint();onSelect(selected);}}
 const cancel=()=>{down=null;};
 renderer.domElement.addEventListener('pointerdown',start);
 window.addEventListener('pointermove',move);window.addEventListener('pointerup',end);window.addEventListener('pointercancel',cancel);
 function animate(time){if(!alive)return;frame=requestAnimationFrame(animate);if(time-last<24||document.hidden)return;last=time;body.rotation.y+=(angle-body.rotation.y)*.13;camera.position.z+=(zoom-camera.position.z)*.13;renderer.render(scene,camera);}
 frame=requestAnimationFrame(animate);
 return{
  setHeat:counts=>{heat=counts;paint();},
  select:key=>{selected=key;paint();},
  rotate:r=>{angle=r;},
  zoom:d=>{zoom=T.MathUtils.clamp(zoom-d*.58,4.25,9);},
  dispose:()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();renderer.domElement.removeEventListener('pointerdown',start);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',cancel);materials.forEach(material=>material.dispose());materials.clear();renderer.dispose();renderer.domElement.remove();loading.remove();}
 };
}
