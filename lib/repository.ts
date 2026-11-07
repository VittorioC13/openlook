import {stateSchema,emptyState,type AppState} from './model';
import {seedState} from './seed';
const DB='mira-local-v1';
function open():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('app');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(new Error('Local storage is unavailable.'));});}
async function read():Promise<unknown>{const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('app','readonly');const r=tx.objectStore('app').get('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
export async function saveState(state:AppState):Promise<void>{const valid=stateSchema.parse(state);const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('app','readwrite');tx.objectStore('app').put(valid,'state');tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>{db.close();reject(new Error('That did not save. Device storage may be full.'));};tx.onerror=()=>reject(tx.error);});}
export async function loadState():Promise<AppState>{const value=await read();if(value===undefined){const state=seedState();await saveState(state);return state;}return stateSchema.parse(value);}
export async function deleteEverything():Promise<AppState>{const state=emptyState();await saveState(state);document.cookie='mira_locale=; Max-Age=0; Path=/; SameSite=Lax';return state;}
export function exportState(state:AppState):string{return JSON.stringify(stateSchema.parse(state),null,2);}
export async function importState(text:string):Promise<AppState>{const state=stateSchema.parse(JSON.parse(text));await saveState(state);return state;}
