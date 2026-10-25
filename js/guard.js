/* v2.3 anti-autoclicker guard. Loaded right after main.js. Every wager (App.bet) and crate roll (App.human) needs its own fresh, TRUSTED, human-initiated input:
   a real mouse click, or a real (non-repeating) Space/Enter key press. Each accepted input is consumed once.
   Rejected: synthetic events (isTrusted=false, e.g. scripts/extensions), re-using an old click, held-down key auto-repeat, double-fires < MIN_GAP ms apart.
   Soft macro detection: 12+ wagers whose gaps are almost perfectly regular (sd < 2% of the mean, min 10 ms) -> 3 s cool-down + a signed flag counter.
   Ordinary fast human clicking is never penalised beyond MIN_GAP. This is client-side only: the game has no server (see README). */
const Guard=(()=>{
const MAX_AGE=1500,MIN_GAP=60,REP_BLOCK=350,WIN=13,H={t:0,n:0,u:0,rep:-1e9,lock:0,flags:0,g:{}};
const nowMs=()=>typeof performance!=='undefined'?performance.now():Date.now();
function mark(trusted,rep,now=nowMs()){if(!trusted)return;if(rep){H.rep=now;return}H.t=now;H.n++}
function flag(now){H.flags++;H.lock=now+3000;try{Store.writeSigned('steak_v2_af',JSON.stringify({n:H.flags,t:Date.now()}))}catch(e){}}
function take(tag,now=nowMs()){
if(now<H.lock)return{ok:false,msg:'Unusually regular input detected. Please wait a few seconds.'};
if(now-H.rep<REP_BLOCK)return{ok:false,msg:'Release the key: each wager needs its own press'};
if(!H.n||H.u===H.n||now-H.t>MAX_AGE)return{ok:false,msg:'Each wager needs its own real click or Space press'};
H.u=H.n;const g=H.g[tag]||(H.g[tag]=[]),last=g.length?g[g.length-1]:0;
if(last&&now-last<MIN_GAP)return{ok:false,msg:'Too fast: one wager per press'};
g.push(now);if(g.length>WIN)g.shift();
if(g.length>=WIN){const d=[];for(let i=1;i<g.length;i++)d.push(g[i]-g[i-1]);const m=d.reduce((a,b)=>a+b,0)/d.length,sd=Math.sqrt(d.reduce((a,b)=>a+(b-m)*(b-m),0)/d.length);
if(m<2500&&sd<Math.max(10,m*.02)){g.length=0;flag(now);return{ok:false,msg:'Unusually regular input detected. Please wait a few seconds.'}}}
return{ok:true}}
if(typeof document!=='undefined'){
document.addEventListener('click',e=>mark(e.isTrusted,false),true);
document.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter')mark(e.isTrusted,e.repeat)},true)}
if(typeof App!=='undefined'){
App.human=tag=>{const r=take(tag);if(!r.ok)App.toast(r.msg);return r.ok};
const ob=App.bet;App.bet=function(el,game,keep){if(Store.d&&Store.d.user&&!App.human(game))return 0;return ob.call(this,el,game,keep)}}
return{mark,take,H}})();
