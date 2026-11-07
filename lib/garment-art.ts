import type { Category } from './model';
const paths:Record<Category,string>={
 top:'M80 40 L116 27 Q140 45 164 27 L200 40 L241 116 L207 137 L188 101 L191 263 Q140 274 89 263 L92 101 L73 137 L39 116 Z',
 outerwear:'M94 30 L117 20 L140 45 L163 20 L186 30 L221 59 L246 230 L211 240 L186 129 L194 278 L86 278 L94 129 L69 240 L34 230 L59 59 Z',
 bottom:'M77 24 L203 24 L207 90 L222 278 L157 278 L139 122 L123 278 L58 278 L73 90 Z',
 dress:'M105 22 L124 18 Q140 35 156 18 L175 22 L198 79 L178 94 L173 80 L167 116 L216 275 Q140 292 64 275 L113 116 L107 80 L102 94 L82 79 Z',
 shoes:'M45 146 L91 140 L99 175 L125 193 L125 221 L34 221 L29 204 L36 174 Z M170 136 L213 144 L220 176 L252 195 L253 221 L151 221 L148 201 L163 177 Z',
 bag:'M73 117 L207 117 L224 247 Q140 269 56 247 Z',
 accessory:'M88 32 Q140 14 192 32 L185 95 Q155 116 163 184 L190 258 L151 271 L120 173 Q104 115 87 95 Z'
};
export function garmentSvg(category:Category,color:string):string {
 const details:Record<Category,string>={top:'<path d="M116 27 Q140 59 164 27 M94 102 L91 250 M186 102 L189 250 M89 251 Q140 261 191 251"/>',outerwear:'<path d="M117 20 L107 72 L140 108 L122 142 L140 271 M163 20 L173 72 L140 108 M99 192 L122 190 M158 190 L181 192 M94 30 L82 70 M186 30 L198 70"/><circle cx="148" cy="162" r="3"/><circle cx="148" cy="204" r="3"/><circle cx="148" cy="246" r="3"/>',bottom:'<path d="M77 39 L203 39 M140 39 L140 100 M81 44 Q81 80 105 80 M199 44 Q199 80 175 80 M94 105 L86 267 M182 105 L192 267 M59 266 L123 266 M157 266 L221 266"/>',dress:'<path d="M124 18 Q140 53 156 18 M113 116 L167 116 M116 132 L96 265 M164 132 L184 265 M140 129 L140 274"/>',shoes:'<path d="M34 208 L125 208 M151 208 L252 208 M42 179 L89 176 M166 177 L211 181 M47 184 L86 181 M171 183 L213 187"/>',bag:'<path d="M101 124 L101 87 Q140 43 179 87 L179 124" stroke-width="9"/><path d="M71 137 L209 137 M76 155 L77 235 M204 155 L203 235"/>',accessory:'<path d="M96 34 Q140 63 184 34 M102 50 Q140 79 177 51 M144 176 L173 258 M159 267 L183 258"/>'};
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 300"><path d="${paths[category]}" fill="${color}" stroke="#29251c" stroke-opacity=".22" stroke-width="1.3"/><g fill="none" stroke="${['#F0E8D9','#E9E4D8'].includes(color)?'#968a73':'#F6F2EA'}" stroke-opacity=".38" stroke-width="1.5" stroke-linejoin="round">${details[category]}</g><path d="${paths[category]}" fill="none" stroke="#14120D" stroke-opacity=".1" stroke-width="5" stroke-linejoin="round"/></svg>`;
}
export function artUrl(category:Category,color:string):string{return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(garmentSvg(category,color))}`;}
