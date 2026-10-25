/* v2.3 loader. Fetches every game script and runs them inside ONE private function scope, so Store / Econ / App / Games are NOT reachable
   from the browser console (a pasted `Store.d.balance=1e9` throws ReferenceError). Falls back to plain <script> tags if fetch is unavailable
   (e.g. opening index.html from file://), where the in-code integrity checks (signed saves + shadow ledger) still apply.
   DEVELOPER MODE: js/devmode.js is added ONLY when the page is served locally (localhost / 127.0.0.1 / file://) AND the URL has ?dev=1.
   Production builds should simply not ship js/devmode.js (see DEV.md); on any other host the file is never requested. */
(()=>{
try{if(window.top!==window.self&&window.top.location.href!=='about:blank'){document.documentElement.innerHTML='';return}}catch(e){document.documentElement.innerHTML='';return}   // anti-clickjacking (v2.4: our own same-origin about:blank tab may host the game; a foreign embedder throws here and is blocked)
const LOCAL=location.protocol==='file:'||['localhost','127.0.0.1','[::1]',''].includes(location.hostname),DEV=LOCAL&&/[?&]dev=1(&|$)/.test(location.search);
const F=['config','cosmetics','cosfx','storage','firebase','stats','economy','main','guard','hardening','ui','pages','crates','games/plinko','games/mines','games/crash','games/chicken','games/flip','games/aviamasters','games/doubleornothing','games/blackjack','games/cases','games/guessthecup'].concat(DEV?['devmode']:[]).map(n=>'js/'+n+'.js');
const fallback=()=>{let i=0;const next=()=>{if(i>=F.length){Shell.init();App.init();return}const s=document.createElement('script');s.src=F[i++];s.onload=next;s.onerror=next;document.body.appendChild(s)};next()};
Promise.all(F.map(f=>fetch(f,{credentials:'same-origin'}).then(r=>{if(!r.ok)throw new Error(f);return r.text()}))).then(a=>{
let run;try{run=new Function(a.join('\n;\n')+'\n;Shell.init();App.init();')}catch(e){console.error(e);return fallback()}
run()},fallback)})();
