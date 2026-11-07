import {mkdir,writeFile} from 'node:fs/promises';
// Bundled, original vector garment studies. No runtime image dependency or third-party licensing.
const {garmentSvg}=await import('../lib/garment-art.ts');
await mkdir('public/seed',{recursive:true});
for(const cat of ['top','bottom','outerwear','dress','shoes','bag','accessory'])for(const [i,color] of ['#25364B','#F0E8D9','#B08B64','#773B3C','#4E4C47','#62798E'].entries())await writeFile(`public/seed/${cat}-${i}.svg`,garmentSvg(cat,color));
console.log('42 original garment studies bundled.');
