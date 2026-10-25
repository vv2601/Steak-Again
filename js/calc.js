/* v2.45 calculator landing page (index.html). Safe recursive-descent evaluator (no eval). Easter egg: the exact expression 0-100 followed by "=" opens the game. */
(function(root){
function evaluate(src,deg){
const s=String(src).replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/\s+/g,'').toLowerCase();
let i=0;const bad=()=>{throw new Error('Syntax')},pk=()=>s[i];
const R=x=>deg?x*Math.PI/180:x,B=x=>deg?x*180/Math.PI:x;
const F={sin:x=>Math.sin(R(x)),cos:x=>Math.cos(R(x)),tan:x=>{if(Math.abs(Math.cos(R(x)))<1e-12)throw new Error('Undefined');return Math.tan(R(x))},asin:x=>B(Math.asin(x)),acos:x=>B(Math.acos(x)),atan:x=>B(Math.atan(x)),sqrt:Math.sqrt,ln:Math.log,log:Math.log10,abs:Math.abs};
function atom(){const c=pk();if(c==='('){i++;const v=expr();if(pk()!==')')bad();i++;return v}
let m=/^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));if(m){i+=m[0].length;return parseFloat(m[0])}
m=/^[a-z]+/.exec(s.slice(i));if(!m)return bad();const n=m[0];i+=n.length;
if(n==='pi')return Math.PI;if(n==='e')return Math.E;if(!F[n]||pk()!=='(')return bad();i++;const v=expr();if(pk()!==')')bad();i++;return F[n](v)}
function power(){const b=atom();if(pk()==='^'){i++;return Math.pow(b,unary())}return b}
function unary(){if(pk()==='-'){i++;return -unary()}if(pk()==='+'){i++;return unary()}return power()}
function term(){let v=unary();for(;;){const c=pk();if(c==='*'||c==='/'){i++;const r=unary();v=c==='*'?v*r:v/r}else if(c&&(c==='('||/[a-z\d.]/.test(c)))v*=unary();else return v}}
function expr(){let v=term();while(pk()==='+'||pk()==='-'){const c=s[i++],r=term();v=c==='+'?v+r:v-r}return v}
if(!s)return 0;const v=expr();if(i!==s.length)bad();if(!Number.isFinite(v))throw new Error('Undefined');return Math.abs(v)<1e-12?0:+v.toPrecision(12)}
/* exact match only: "0-100" with optional spaces / unicode minus. 0-100+1, 10-100, 0-1000, -100 etc. do not trigger. */
const isEgg=src=>String(src).replace(/\s+/g,'').replace(/[−–]/g,'-')==='0-100';
const api={evaluate,isEgg};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(typeof document==='undefined'||!document.getElementById('disp'))return;
const $=id=>document.getElementById(id),disp=$('disp'),ex=$('ex'),mode=$('mode');
let expr='',deg=true,fresh=false,gw=null;
const embedded=()=>{try{return window.parent!==window&&typeof window.parent.__toggle==='function'}catch(e){return false}};
const view=t=>t.replace(/\*/g,'×').replace(/\//g,'÷').replace(/-/g,'−').replace(/sqrt/g,'√').replace(/pi/g,'π');
const show=()=>{disp.textContent=view(expr)||'0';disp.scrollLeft=disp.scrollWidth};
const add=t=>{if(fresh){if(/^[\d.(a-z]/.test(t))expr='';fresh=false;ex.textContent=''}expr+=t;show()};
const back=()=>{if(fresh){expr='';fresh=false;ex.textContent=''}else expr=expr.replace(/(sqrt\(|sin\(|cos\(|tan\(|asin\(|acos\(|atan\(|ln\(|log\(|abs\(|pi|.)$/,'');show()};
const clear=()=>{expr='';fresh=false;ex.textContent='';show()};
/* Easter egg: about:blank host tab that holds the calculator AND the game (window.__toggle switches them); falls back to navigating this tab */
const HOST="(function(){var v='game',F={game:document.getElementById('vg'),calc:document.getElementById('vc')};function show(x){v=x;for(var k in F)F[k].style.display=k===x?'block':'none';try{F[x].contentWindow.focus()}catch(e){}}window.__toggle=function(){show(v==='game'?'calc':'game')};window.__view=function(){return v};F.game.addEventListener('load',function(){if(v==='game')try{F.game.contentWindow.focus()}catch(e){}});F.calc.addEventListener('load',function(){if(v==='calc')try{F.calc.contentWindow.focus()}catch(e){}});document.addEventListener('keydown',function(e){if(e.key==='Backspace'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();if(!e.repeat)window.__toggle()}});show('game')})();";
function host(w){try{const d=w.document,base=new URL('.',location.href).href;d.title=document.title;d.documentElement.style.height='100%';d.body.style.cssText='margin:0;height:100%;background:#fff';
const mk=(id,src)=>{const f=d.createElement('iframe');f.id=id;f.src=src;f.style.cssText='border:0;width:100%;height:100%;display:none';d.body.appendChild(f)};
mk('vg',base+'game.html');mk('vc',base+'index.html?embed=1');const sc=d.createElement('script');sc.textContent=HOST;d.body.appendChild(sc);return true}catch(e){return false}}
function openGame(){clear();
if(embedded()){window.parent.__toggle();return}
if(gw&&!gw.closed){try{gw.focus()}catch(e){}return}
let w=null;try{w=window.open('about:blank','_blank')}catch(e){}
if(w&&host(w)){gw=w;return}
try{if(w)w.close()}catch(e){}
try{sessionStorage.setItem('zh_fb','1')}catch(e){}
location.href='game.html'}
function equals(){if(!expr)return;if(isEgg(expr)){openGame();return}
try{const r=evaluate(expr,deg);ex.textContent=view(expr)+' =';expr=String(r);fresh=true;disp.textContent=view(expr)}catch(e){ex.textContent=view(expr)+' =';disp.textContent=e.message==='Undefined'?'Undefined':'Error';expr='';fresh=false}}
document.querySelectorAll('[data-k]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.k;if(k==='=')equals();else if(k==='C')clear();else if(k==='bk')back();else if(k==='mode'){deg=!deg;mode.textContent=deg?'DEG':'RAD'}else add(k)}));
addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.defaultPrevented)return;const k=e.key;
if(k==='Backspace'){e.preventDefault();back()}   /* reached only when toggle.js did not claim Backspace (plain calculator use) */
else if(k==='Enter'||k==='='){e.preventDefault();equals()}else if(k==='Escape'||k==='Delete')clear();
else if(/^[0-9.+\-*/^()]$/.test(k)){e.preventDefault();add(k)}else if(k==='x'||k==='X')add('*')});
show()})(typeof window!=='undefined'?window:this);
