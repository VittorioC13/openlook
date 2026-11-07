import {env} from 'cloudflare:workers';
import {shareSchema,type SharedLook} from './model';
import {getChatGPTUser} from '@/app/chatgpt-auth';
const buckets=new Map<string,{count:number;at:number}>();
export function rateLimit(id:string):boolean{const now=Date.now(),old=buckets.get(id);if(!old||now-old.at>60000){if(buckets.size>2000)buckets.clear();buckets.set(id,{count:1,at:now});return true;}return ++old.count<=20;}
export function db(){if(!env.DB)throw new Error('Share storage unavailable');return env.DB;}
export async function identity(){return getChatGPTUser();}
export async function getShared(token:string):Promise<SharedLook|null>{if(!/^[a-f0-9]{32}$/.test(token))return null;const row=await db().prepare('SELECT payload FROM shared_looks WHERE token = ?').bind(token).first<{payload:string}>();if(!row)return null;return shareSchema.parse(JSON.parse(row.payload));}
export function failure(message='That did not save. Try once more.',status=400){return Response.json({ok:false,error:{code:status===401?'UNAUTHORIZED':'REQUEST_FAILED',message}},{status});}
export function sameOrigin(request:Request){const origin=request.headers.get('Origin');return origin===new URL(request.url).origin;}
