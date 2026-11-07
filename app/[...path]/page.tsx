import MiraApp from '@/components/mira-app';
import {notFound} from 'next/navigation';
export default async function Page({params}:{params:Promise<{path:string[]}>}){const {path}=await params;if(!['wardrobe','capture','looks','today','settings','onboarding'].includes(path[0])||path.length>2||(path.length===2&&path[0]!=='wardrobe'))notFound();return <MiraApp/>;}
