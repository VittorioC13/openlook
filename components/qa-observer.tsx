'use client';
import {useEffect} from 'react';
// Local-development measurements only. No collection, transmission, or production output.
export default function QAObserver(){useEffect(()=>{let cls=0;document.body.dataset.qaCls='0';if(!PerformanceObserver.supportedEntryTypes.includes('layout-shift'))return;const observer=new PerformanceObserver(list=>{for(const entry of list.getEntries()){const shift=entry as PerformanceEntry&{value:number;hadRecentInput:boolean};if(!shift.hadRecentInput)cls+=shift.value;}document.body.dataset.qaCls=cls.toFixed(5);});observer.observe({type:'layout-shift',buffered:true});return()=>observer.disconnect();},[]);return null;}
