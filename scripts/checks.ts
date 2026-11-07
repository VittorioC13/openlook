import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {seedState,dateKey,seedWeather} from '../lib/seed';
import {suggest,colorHarmony} from '../lib/engine';
import {emptyState,logOutfit,removeGarment,stateSchema,shareSchema} from '../lib/model';
import {exportState} from '../lib/repository';
const state=seedState(new Date('2026-11-07T12:00:00'));
assert.equal(state.garments.length,42);assert.equal(state.logs.length,14);assert.equal(seedWeather.length,6);assert.equal(new Set(state.garments.map(g=>g.category)).size,7);
const start=performance.now();let candidates=suggest(state.garments,{tempC:18,condition:'cloudy'},'casual','2026-11-07');const elapsed=performance.now()-start;
assert.equal(candidates.length,3);assert.ok(elapsed<80,`Engine took ${elapsed}ms`);
assert.deepEqual(candidates,suggest(state.garments,{tempC:18,condition:'cloudy'},'casual','2026-11-07'));
for(const a of candidates)for(const b of candidates)if(a.id!==b.id)assert.ok(a.items.filter(g=>!b.items.some(i=>i.id===g.id)).length>=2);
assert.ok(!/score|%|flattering|body type/i.test(JSON.stringify(candidates.map(c=>c.reasoning))));
assert.equal(suggest([],{tempC:18,condition:'clear'},'work','2026-11-07').length,0);
const excluded=state.garments.filter(g=>g.category==='top').map(g=>g.id);
assert.ok(suggest(state.garments,{tempC:28,condition:'clear'},'casual','2026-11-07',excluded).every(c=>c.items.every(g=>!excluded.includes(g.id))));
const selected=candidates[0],logged=logOutfit(state,selected);assert.equal(logged.logs.length,15);assert.equal(logOutfit(logged,selected).logs.length,15);
for(const item of selected.items)assert.equal(logged.garments.find(g=>g.id===item.id)?.wearCount,item.wearCount+1);
const removed=removeGarment(logged,selected.items[0].id);assert.ok(!removed.garments.some(g=>g.id===selected.items[0].id));assert.ok(removed.logs[0].items.some(g=>g.id===selected.items[0].id));assert.ok(stateSchema.safeParse(removed).success);
assert.deepEqual(stateSchema.parse(JSON.parse(exportState(state))),state);assert.equal(emptyState().garments.length,0);assert.equal(emptyState().logs.length,0);assert.equal(emptyState().mode,'personal');
const safe={name:selected.name,occasion:selected.occasion,weather:selected.weather,items:selected.items.map(g=>({category:g.category,color:g.color,name:g.name})),reasoning:selected.reasoning};assert.ok(shareSchema.safeParse(safe).success);assert.ok(!shareSchema.safeParse({...safe,photo:'data:image/jpeg;base64,private'}).success);assert.ok(!shareSchema.safeParse({...safe,items:selected.items}).success);
assert.ok(!stateSchema.safeParse({...state,garments:[{...state.garments[0],color:'javascript:bad'}]}).success);
assert.equal(colorHarmony([state.garments[0],state.garments[0]]),1);assert.equal(dateKey(new Date(2026,10,7)),'2026-11-07');
console.log(JSON.stringify({checks:23,engineMs:Number(elapsed.toFixed(2)),candidates:candidates.map(c=>c.items.map(g=>g.name)),result:'PASS'},null,2));
function rgb(hex:string){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));}
function lum(hex:string){const [r,g,b]=rgb(hex);return .2126*r+.7152*g+.0722*b;}
const pairs=[['ink/paper','#14120D','#F6F2EA'],['secondary/paper','#4A4438','#F6F2EA'],['metadata/paper','#6E675C','#F6F2EA'],['metadata/inset','#6E675C','#EFE9DE'],['primary text/oxblood','#F6F2EA','#7A2E2E'],['worn text/sage','#F6F2EA','#5C6B5A']];
for(const [name,a,b] of pairs){const ratio=(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);assert.ok(ratio>=4.5,`${name}: ${ratio}`);console.log(`${name}: ${ratio.toFixed(2)}:1`);}
for(let i=0;i<100;i++)candidates=suggest(state.garments,{tempC:i%35,condition:i%2?'rain':'clear'},i%2?'work':'casual','2026-11-07');assert.ok(candidates.length>0);
