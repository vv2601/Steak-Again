/* v2.25 particle / VFX layer for EPIC and LEGENDARY cosmetics (player tags + name gradients).
   v2.3: adds themed effects (.cx-light / .cx-orbit / .cx-andro / .cx-gore) that reuse the same pseudo-element particle system (no new animation engine).
   Replaces Cos.html: same markup plus a fx class and 3 colours taken from the item's own gradient (darks are lightened so they stay visible).
   Pure-CSS particles (two animated pseudo-elements), so it works everywhere a cosmetic is drawn: header, dashboard, shop, inventory, previews, crates. */
(()=>{
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),lum=r=>(.2126*r[0]+.7152*r[1]+.0722*r[2])/255,
lift=r=>{const L=lum(r);if(L>=.55)return r;const t=(.55-L)/(1-L);return r.map(v=>Math.round(v+(255-v)*t))},toHex=r=>'#'+r.map(v=>v.toString(16).padStart(2,'0')).join('');
const cache={};
function colours(c){if(cache[c.id])return cache[c.id];const u=[...new Set((c.bg.match(/#[0-9a-f]{6}/gi)||['#ffffff']).map(x=>x.toLowerCase()))].map(hex).sort((a,b)=>lum(b)-lum(a)),n=u.length;
return cache[c.id]=[u[0],u[Math.floor((n-1)/2)],u[n-1]].map(r=>toHex(lift(r)))}
const hs=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h};
Cos.html=(c,txt)=>{const t=c.rar==='legendary'?' fxl':c.rar==='epic'?' fxe':'';let v='';
if(t){const[a,b,d]=colours(c);v=`;--p1:${a};--p2:${b};--p3:${d};--dl:${-(hs(c.id)%30)/10}s`}
return `<span class="cos${c.anim?' an'+c.anim:''}${c.fx?' cx-'+c.fx:''}${t}" style="background-image:${c.bg}${v}">${txt==null?c.label:txt}</span>`};
if(typeof document==='undefined'||document.getElementById('stk-cosfx'))return;
const dot=(c,r,s,p)=>`radial-gradient(circle,${c} 0 ${r}px,transparent ${r+.9}px)`;
const L=(cols,r)=>cols.map(c=>dot(c,r)).join(',');
const s=document.createElement('style');s.id='stk-cosfx';s.textContent=`
.cos.fxe,.cos.fxl{position:relative;display:inline-block!important}
.cos.fxe::before,.cos.fxe::after,.cos.fxl::before,.cos.fxl::after{content:"";position:absolute;left:-7px;right:-7px;top:-9px;bottom:-9px;pointer-events:none;background-repeat:no-repeat;opacity:0;animation-iteration-count:infinite;animation-timing-function:ease-out;animation-delay:var(--dl,0s)}
/* EPIC: soft sparkles */
.cos.fxe::before{background-image:${L(['var(--p1)','var(--p2)','var(--p3)'],1.1)};background-size:6px 6px;background-position:10% 72%,50% 88%,90% 60%;animation-name:cfxUp;animation-duration:3s}
.cos.fxe::after{background-image:${L(['var(--p3)','var(--p1)','var(--p2)'],1)};background-size:6px 6px;background-position:30% 92%,70% 76%,98% 90%;animation-name:cfxUp;animation-duration:3.6s;animation-delay:calc(var(--dl,0s) - 1.4s)}
/* LEGENDARY: denser, brighter, glowing embers + twinkles */
.cos.fxl{filter:drop-shadow(0 0 3px var(--p1))}
.cos.fxl::before{background-image:${L(['var(--p1)','var(--p2)','var(--p3)','var(--p1)','var(--p2)'],1.7)};background-size:8px 8px;background-position:6% 80%,26% 90%,50% 70%,74% 92%,94% 76%;animation-name:cfxUp;animation-duration:2s}
.cos.fxl::after{background-image:${L(['var(--p2)','var(--p3)','var(--p1)','var(--p3)','var(--p2)'],1.3)};background-size:7px 7px;background-position:16% 60%,38% 84%,62% 62%,84% 88%,100% 66%;animation-name:cfxTw;animation-duration:1.5s;animation-delay:calc(var(--dl,0s) - .7s)}
@keyframes cfxUp{0%{opacity:0;transform:translateY(6px) scale(.6)}20%{opacity:1}70%{opacity:.9}100%{opacity:0;transform:translateY(-13px) scale(1.15)}}
@keyframes cfxTw{0%,100%{opacity:0;transform:scale(.5)}35%{opacity:1;transform:scale(1.25) translateY(-3px)}60%{opacity:.2;transform:scale(.9) translateY(-6px)}80%{opacity:.9;transform:scale(1.1) translateY(-8px)}}
/* v2.3 themed legendary effects: same two pseudo-elements, different palettes / motion */
.cos.anx.cx-light{animation:cosx 4s linear infinite,cxPulse 2.6s ease-in-out infinite}
.cos.fxl.cx-light::before{background-image:${L(['#ffffff','#fff3b0','#bfe9ff','#ffffff','#fff3b0'],2)}}
.cos.fxl.cx-light::after{background-image:${L(['#ffffff','#bfe9ff','#fff3b0','#ffffff','#bfe9ff'],1.5)}}
.cos.fxl.cx-orbit::before{background-image:${L(['#ff4d4d','#ffd84d','#4dff88','#4dd2ff','#b44dff'],1.9)}}
.cos.fxl.cx-orbit::after{background-image:${L(['#ff2bd6','#4dd2ff','#ffee00','#33ff00','#ff4d4d'],1.4)}}
.cos.fxl.cx-andro{filter:drop-shadow(0 0 4px #a78bfa)}
.cos.fxl.cx-andro::before{background-image:${L(['#ffffff','#e9d5ff','#a5b4fc','#ffffff','#c4b5fd'],1.1)};background-size:7px 7px;animation-name:cfxTw;animation-duration:1.9s}
.cos.fxl.cx-andro::after{background-image:linear-gradient(100deg,transparent 20%,rgba(196,181,253,.55) 44%,rgba(255,255,255,.75) 50%,rgba(129,140,248,.5) 56%,transparent 80%);background-size:220% 100%;background-position:120% 50%;animation-name:cxMilky;animation-duration:3.4s;animation-timing-function:linear;mix-blend-mode:screen}
.cos.any.cx-gore{animation:cosy 3s linear infinite,cxThrob 1.8s ease-in-out infinite}
.cos.fxl.cx-gore::before{background-image:${L(['#b00020','#e11d2f','#7f0000','#ff4d4d','#b00020'],1.8)};animation-name:cxDrip;animation-duration:2.4s}
.cos.fxl.cx-gore::after{background-image:${L(['#ff4d4d','#7f0000','#e11d2f','#ff4d4d','#7f0000'],1.3)}}
@keyframes cxPulse{0%,100%{filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 8px #bfe9ff)}50%{filter:drop-shadow(0 0 6px #fff) drop-shadow(0 0 16px #fff3b0)}}
@keyframes cxThrob{0%,100%{filter:drop-shadow(0 0 2px #7f0000)}50%{filter:drop-shadow(0 0 7px #ff1a1a)}}
@keyframes cxMilky{0%{background-position:120% 50%;opacity:0}15%,85%{opacity:.9}100%{background-position:-20% 50%;opacity:0}}
@keyframes cxDrip{0%{opacity:0;transform:translateY(-6px) scale(.7)}25%{opacity:1}100%{opacity:0;transform:translateY(16px) scale(1.2)}}
/* v2.4 previews (catalog, chances list, inventory cards, crate reel): particles + glow pulses only while hovered/focused; the gradient animation keeps running. Equipped names elsewhere are untouched. */
${['.ce','.chr','.ic','.crtile'].map(h=>`${h}:not(:hover):not(:focus-visible) .cos::before,${h}:not(:hover):not(:focus-visible) .cos::after`).join(',')}{animation:none!important;opacity:0!important}
${['.ce','.chr','.ic','.crtile'].map(h=>`${h}:not(:hover):not(:focus-visible) .cos.anx.cx-light`).join(',')}{animation:cosx 4s linear infinite!important}
${['.ce','.chr','.ic','.crtile'].map(h=>`${h}:not(:hover):not(:focus-visible) .cos.any.cx-gore`).join(',')}{animation:cosy 3s linear infinite!important}
@media(prefers-reduced-motion:reduce){.cos.fxe::before,.cos.fxe::after,.cos.fxl::before,.cos.fxl::after{display:none}.cos.cx-light,.cos.cx-gore{animation:none!important}}`;document.head.appendChild(s)})();
