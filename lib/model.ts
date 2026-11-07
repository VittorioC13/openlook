import { z } from 'zod';
import {artUrl} from './garment-art';
export const categories = ['top','bottom','outerwear','dress','shoes','bag','accessory'] as const;
export const seasons = ['spring','summer','autumn','winter'] as const;
export const garmentSchema = z.object({id:z.string(),name:z.string().max(100),category:z.enum(categories),color:z.string().regex(/^#[0-9a-fA-F]{6}$/),colorName:z.string(),formality:z.number().int().min(1).max(5),seasons:z.array(z.enum(seasons)),fabric:z.string(),image:z.string().refine(value=>/^\/seed\/[a-z]+-[0-5]\.svg$/.test(value)||/^data:image\/(?:jpeg|png|webp);base64,/.test(value)||value.startsWith('data:image/svg+xml;charset=utf-8,'),'Only local garment images are supported.'),wearCount:z.number().int().nonnegative(),lastWorn:z.string().nullable(),createdAt:z.string()});
export type Garment = z.infer<typeof garmentSchema>;
export type Category = Garment['category'];
export const weatherSchema = z.object({tempC:z.number().min(-40).max(55),condition:z.enum(['clear','cloudy','rain','snow'])});
export type Weather = z.infer<typeof weatherSchema>;
export const occasions = ['work','casual','date','formal','travel','home'] as const;
export type Occasion = typeof occasions[number];
export const reasonSchema = z.object({label:z.enum(['weather','occasion','color','recency','wardrobe']),text:z.string().max(250)});
export const outfitSchema = z.object({id:z.string(),date:z.string(),occasion:z.enum(occasions),weather:weatherSchema,items:z.array(garmentSchema),reasoning:z.array(reasonSchema),name:z.string()});
export type Outfit = z.infer<typeof outfitSchema>;
export const profileSchema = z.object({locale:z.enum(['en-US','zh-CN']),sizes:z.object({top:z.string(),bottom:z.string(),shoe:z.string()}),styles:z.array(z.string()),onboarded:z.boolean(),consent:z.boolean()});
export const stateSchema = z.object({version:z.literal(1),mode:z.enum(['demo','personal']),garments:z.array(garmentSchema),logs:z.array(outfitSchema),profile:profileSchema,current:outfitSchema.nullable().default(null),photo:z.string().nullable(),shares:z.array(z.object({token:z.string(),name:z.string()}))});
export type AppState = z.infer<typeof stateSchema>;
export const sharedPieceSchema = z.object({category:z.enum(categories),color:z.string().regex(/^#[0-9a-fA-F]{6}$/),name:z.string().max(100)}).strict();
export const shareSchema = z.object({name:z.string().max(100),occasion:z.enum(occasions),weather:weatherSchema,items:z.array(sharedPieceSchema).min(1).max(7),reasoning:z.array(reasonSchema).max(4)}).strict();
export type SharedLook = z.infer<typeof shareSchema>;
export const defaultProfile: AppState['profile'] = {locale:'en-US',sizes:{top:'',bottom:'',shoe:''},styles:['Quiet classics'],onboarded:false,consent:false};
export function emptyState(): AppState {return {version:1,mode:'personal',garments:[],logs:[],profile:structuredClone(defaultProfile),current:null,photo:null,shares:[]};}
export function removeGarment(state:AppState,id:string):AppState {return {...state,garments:state.garments.filter(g=>g.id!==id),current:state.current?.items.some(g=>g.id===id)?null:state.current};}
export function logOutfit(state:AppState,outfit:Outfit):AppState {if(state.logs.some(l=>l.id===outfit.id))return state;return {...state,logs:[{...outfit,items:outfit.items.map(g=>({...g,image:artUrl(g.category,g.color)}))},...state.logs],garments:state.garments.map(g=>outfit.items.some(i=>i.id===g.id)?{...g,wearCount:g.wearCount+1,lastWorn:outfit.date}:g)};}
