import type {Metadata} from 'next';
import {brand} from '@/lib/brand';
import './globals.css';
import QAObserver from '@/components/qa-observer';
export const metadata:Metadata={title:`${brand.name} — ${brand.tagline}`,description:'Your clothes. A little context. Something to wear. A private daily wardrobe companion.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/fraunces-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{process.env.NODE_ENV==='development'&&<QAObserver/>}<a href="#main-content" className="skip-link">Skip to content</a>{children}</body></html>;}
