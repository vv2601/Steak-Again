/* v2.3 anti-autoclicker guard. Loaded right after main.js. Every wager (App.bet) and crate roll (App.human) needs its own fresh, TRUSTED, human-initiated input:
   a real mouse click, or a real (non-repeating) Space/Enter key press. Each accepted input is consumed once.
   Rejected: synthetic events (isTrusted=false, e.g. scripts/extensions), re-using an old click, held-down key auto-repeat, double-fires < MIN_GAP ms apart.
   v2.45 hardening (OS-level autoclickers produce trusted events, so timing is what gives them away):
   - CLICK STREAM: EVERY trusted click/press is recorded, including ones the game ignores (e.g. clicks while a Cases spin is running). At wager time the last 20
     inputs (within 40 s) are checked: sustained rate faster than ~8.3/s, or near-constant spacing (sd < 12% of the mean below 400 ms, < 4% above), is a macro.
   - Wager-regularity check now covers slow games too (was only gaps < 2.5 s, which Cases/Aviamasters never hit).
   - Escalating cool-down: 3 s, 9 s, 27 s, 81 s, then 120 s per repeat offence; stored (signed) so a page refresh / new tab does not clear it.
   Ordinary fast human clicking (irregular, under ~8/s) is never penalised beyond MIN_GAP. This is client-side only: the game has no server (see README). */
const Guard=(()=>{
const MAX_AGE=1500,MIN_GAP=60,REP_BLOCK=350,WIN=13,CW=20,SPAN=40000,AF='steak_v2_af',H={t:0,n:0,u:0,rep:-1e9,lock:0,flags:0,g:{},c:[]};
const nowMs=()=>typeof performance!=='undefined'?performance.now():Date.now();
const lockFor=()=>Math.min(120000,3000*Math.pow(3,Math.max(0,H.flags-1)));
function mark(trusted,rep,now=nowMs()){if(!trusted)return;if(rep){H.rep=now;return}H.t=now;H.n++;H.c.push(now);if(H.c.length>CW)H.c.shift()}
function flag(now){H.flags++;const ms=lockFor();H.lock=now+ms;H.c.length=0;try{Store.writeSigned(AF,JSON.stringify({n:H.flags,t:Date.now(),u:Date.now()+ms}))}catch(e){}}
const stats=a=>{const d=[];for(let i=1;i<a.length;i++)d.push(a[i]-a[i-1]);const m=d.reduce((x,y)=>x+y,0)/d.length;return{m,sd:Math.sqrt(d.reduce((x,y)=>x+(y-m)*(y-m),0)/d.length)}};
function stream(now){const c=H.c.filter(t=>now-t<=SPAN);if(c.length<CW)return false;const{m,sd}=stats(c);return m<=120||sd<Math.max(3,m*(m<400?.12:.04))}
const wait=ms=>Math.ceil(ms/1000)+'s';
function take(tag,now=nowMs()){
if(now<H.lock)return{ok:false,msg:'Unusually regular input detected. Please wait '+wait(H.lock-now)+'.'};
if(now-H.rep<REP_BLOCK)return{ok:false,msg:'Release the key: each wager needs its own press'};
if(!H.n||H.u===H.n||now-H.t>MAX_AGE)return{ok:false,msg:'Each wager needs its own real click or Space press'};
H.u=H.n;const g=H.g[tag]||(H.g[tag]=[]),last=g.length?g[g.length-1]:0;
if(last&&now-last<MIN_GAP)return{ok:false,msg:'Too fast: one wager per press'};
if(stream(now)){g.length=0;flag(now);return{ok:false,msg:'Automated clicking detected. Wagers paused for '+wait(H.lock-now)+'.'}}
g.push(now);if(g.length>WIN)g.shift();
if(g.length>=WIN){const{m,sd}=stats(g);
if(m<30000&&sd<Math.max(10,m*.02)){g.length=0;flag(now);return{ok:false,msg:'Unusually regular input detected. Please wait '+wait(H.lock-now)+'.'}}}
return{ok:true}}
/* restore a still-running cool-down after a refresh / new tab (signed store; a tampered value is ignored) */
try{const r=Store.readSigned(AF);if(r.status==='ok'&&r.raw){const o=JSON.parse(r.raw),w=Date.now();if(o&&o.u>w){H.lock=nowMs()+(o.u-w);H.flags=Math.max(0,Math.floor(o.n)||0)}else if(o&&w-o.t<1800000)H.flags=Math.max(0,Math.floor(o.n)||0)}}catch(e){}
if(typeof document!=='undefined'){
document.addEventListener('click',e=>mark(e.isTrusted,false),true);
document.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter')mark(e.isTrusted,e.repeat)},true)}
if(typeof App!=='undefined'){
App.human=tag=>{const r=take(tag);if(!r.ok)App.toast(r.msg);return r.ok};
const ob=App.bet;App.bet=function(el,game,keep){if(Store.d&&Store.d.user&&!App.human(game))return 0;return ob.call(this,el,game,keep)}}
return{mark,take,H}})();
