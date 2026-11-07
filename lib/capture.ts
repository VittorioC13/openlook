import {garmentSchema,categories,type Garment} from './model';
const colors=[['#25364B','navy'],['#F0E8D9','ecru'],['#B08B64','camel'],['#773B3C','oxblood'],['#4E4C47','charcoal'],['#62798E','denim']] as const;
export async function analyzeLocal(file:File):Promise<Garment>{if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15*1024*1024)throw new Error('Choose a JPG, PNG or WebP smaller than 15 MB.');const bytes=await file.arrayBuffer();const digest=await crypto.subtle.digest('SHA-256',bytes);const hash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');const seed=parseInt(hash.slice(0,8),16);const words=file.name.toLowerCase();const category=/jean|trouser|pant|skirt|bottom/.test(words)?'bottom':/coat|jacket|blazer|cardigan|outerwear/.test(words)?'outerwear':/shoe|boot|loafer|sneaker/.test(words)?'shoes':/dress/.test(words)?'dress':/bag|tote/.test(words)?'bag':/scarf|belt|accessory/.test(words)?'accessory':/shirt|tee|top|knit/.test(words)?'top':categories[seed%categories.length];const [color,colorName]=colors[(seed>>>4)%colors.length];const original=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>typeof r.result==='string'?resolve(r.result):reject(new Error('Unreadable file'));r.onerror=()=>reject(r.error);r.readAsDataURL(file);});const image=await normalize(original);await new Promise(r=>setTimeout(r,800+seed%600));return garmentSchema.parse({id:`local-${hash.slice(0,24)}`,name:file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ').slice(0,100)||'New piece',category,color,colorName,formality:seed%3+2,seasons:['spring','autumn'],fabric:category==='outerwear'?'wool':'cotton',image,wearCount:0,lastWorn:null,createdAt:new Date().toISOString()});}
async function normalize(url:string):Promise<string>{const image=new Image();await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Image could not be read.'));image.src=url;});const canvas=document.createElement('canvas');const ratio=Math.min(1,1000/Math.max(image.width,image.height));canvas.width=Math.round(image.width*ratio);canvas.height=Math.round(image.height*ratio);const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Image processing unavailable');ctx.drawImage(image,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/webp',.85);}
let removalInFlight=false;
export async function cutoutLocal(image:string):Promise<string>{
 if(removalInFlight||typeof Worker==='undefined')return image;
 removalInFlight=true;
 return new Promise(resolve=>{
  let worker:Worker|undefined;
  let finished=false;
  const finish=(result:string)=>{if(finished)return;finished=true;clearTimeout(timer);worker?.terminate();removalInFlight=false;resolve(result);};
  const timer=setTimeout(()=>finish(image),4000);
  try{
   worker=new Worker(new URL('./background.worker.ts',import.meta.url),{type:'module'});
   worker.onmessage=(event:MessageEvent<unknown>)=>{const data=event.data;finish(data&&typeof data==='object'&&'image'in data&&typeof data.image==='string'?data.image:image);};
   worker.onerror=()=>finish(image);
   worker.postMessage(image);
  }catch{finish(image);}
 });
}
