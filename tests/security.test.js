// Update 2.25 security tests. Run: node tests/security.test.js   (no browser needed)
const fs=require('fs'),vm=require('vm'),path=require('path');
const store={};global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]};global.window=global;global.Games={};global.addEventListener=()=>{};
const toasts=[];global.App={toast:m=>toasts.push(m),bal(){}};
for(const f of ['config','cosmetics','cosfx','storage','stats','economy'])vm.runInThisContext(fs.readFileSync(path.join(__dirname,'../js/'+f+'.js'),'utf8'),{filename:f});
vm.runInThisContext(fs.readFileSync(path.join(__dirname,'../js/games/cases.js'),'utf8'),{filename:'cases'});
let pass=0,fail=0;const t=(n,ok,x='')=>{ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''))};
const fresh=()=>{Store.d=Store.def();Store.d.user='t';Store.sync();Store.tamper=0;toasts.length=0};
const realLoad=Store.load.bind(Store);Store.load=()=>Store.d;   // in-memory like economy.test.js; real reload path exercised via realLoad()
Store.armed=true;   // browser behaviour
// ---- shadow ledger
fresh();Store.d.balance=1e9;t('console-style balance edit is clamped',Store.check()&&Store.d.balance===CFG.UNRANKED_START&&Store.tamper===1);
fresh();Store.d.gems=999;Store.check();t('console-style gem edit is clamped',Store.d.gems===0);
fresh();Store.d.balance=NaN;Store.check();t('NaN balance is repaired',Store.d.balance===CFG.UNRANKED_START);
fresh();Store.d.balance=1e9;const ck=Econ.checkBet('500','MINES',1e9);t('bet validation ignores a caller-supplied / tampered balance',!ck.ok&&Store.d.balance===CFG.UNRANKED_START);
fresh();Store.d.balance=1e9;Store.save();t('tampered balance can never be persisted',JSON.parse(Store.readSigned(Store.key).raw).balance===CFG.UNRANKED_START);
fresh();Store.d.balance-=4;Store.check();Econ.settle('MINES',4,8);t('spending then winning is NOT flagged',Store.tamper===0&&Store.d.balance===CFG.UNRANKED_START+4);
// ---- every legitimate credit path must pass the ledger (no false positives)
fresh();Store.d.rc=2500;Store.d.rq=50;Rank.rankUp();Store.check();t('rank-up credit not flagged',Store.tamper===0&&Store.d.gems===1);
Store.d.dr={id:'low',amount:400};Store.d.dc=false;Daily.credit();Store.d.dr={id:'gem',amount:3};Store.d.dc=false;Daily.credit();Store.check();t('daily Steakcoin + Gem rewards not flagged',Store.tamper===0&&Store.d.gems===4);
Gems.convert(2);Store.check();t('gem conversion not flagged',Store.tamper===0);
Econ.resetBalance();Econ.addCoins(5);Store.check();t('reset / addCoins not flagged',Store.tamper===0);
for(let i=0;i<500;i++)Econ.settle('MINES',1,1);Quests.claim('d','d_r500');Store.check();t('quest gem claim not flagged',Store.tamper===0);
// ---- signed saves
fresh();Store.d.balance=77;Store.d.gems=0;Store.sync();Store.save();const raw=localStorage.getItem(Store.key);t('save is signed',raw.startsWith('S2:'));realLoad();t('signed save round-trips',Store.d.balance===77&&Store.tamper===0);
localStorage.setItem(Store.key,raw.replace('"balance":77','"balance":9999999'));realLoad();t('edited signed save is rejected and reset',Store.d.balance===CFG.UNRANKED_START&&Store.tamper===1&&/integrity/.test(Store.notice));
localStorage.setItem(Store.key,JSON.stringify({user:'old',balance:1e12,gems:99999,rk:0,rc:100}));realLoad();t('legacy 2.0 save migrates once, clamped',Store.d.user==='old'&&Store.d.balance<=CFG.UNRANKED_START+100+25000&&Store.d.gems<=300&&localStorage.getItem(Store.key).startsWith('S2:'));
Store.LEGACY_MIGRATION=false;localStorage.setItem(Store.key,JSON.stringify({user:'x',balance:5e5}));realLoad();t('unsigned save refused once migration window is closed',Store.d.balance===CFG.UNRANKED_START);Store.LEGACY_MIGRATION=true;
localStorage.setItem(Store.key,JSON.stringify({user:'x'.repeat(500)}));realLoad();t('username length capped on load',Store.d.user.length<=16);
Store.writeSigned(Store.tpKey,JSON.stringify({t:5000,l:1}));t('playtime signed round-trip',Store.playtime().t===5000);
localStorage.setItem(Store.tpKey,localStorage.getItem(Store.tpKey).replace('5000','999999999'));t('edited playtime is rejected',Store.playtime().t===0);
// ---- resale arbitrage
fresh();const sh=Shop.current(),deal=sh.offers.find(o=>o.deal&&Cos.by(o.id).rar!=='common');const dc=Cos.by(deal.id),pr=Shop.price(dc,true);Store.d.gems=pr;Store.sync();Inv.buy(deal.id);
const b0=Store.d.balance,sv=Cos.sellValue(dc);t('resale value capped at Gems actually paid (no deal->sell profit)',sv===pr*CFG.GEM.TO_COIN&&sv<=Cos.gems(dc)*CFG.GEM.TO_COIN);
const s1=Inv.sell(deal.id);t('sell pays the capped value, once',s1.ok&&s1.amt===sv&&Store.d.balance===b0+sv&&!Inv.sell(deal.id).ok&&Store.tamper===0);
// ---- cosmetics VFX
t('Epic + Legendary cosmetics get VFX classes + colours; others do not',COS.every(c=>{const h=Cos.html(c);return(c.rar==='epic'?/ fxe"/.test(h):c.rar==='legendary'?/ fxl"/.test(h):!/fx[el]"/.test(h))&&((c.rar==='epic'||c.rar==='legendary')?/--p1:#[0-9a-f]{6};--p2:#[0-9a-f]{6};--p3:#[0-9a-f]{6}/.test(h):true)}));
t('VFX colours come from the item (Gem gradient is pink/purple, Flame is not fx)',/--p1:#f0[0-9a-f]{4}/.test(Cos.html(Cos.by('g_gem')))&&!/--p1/.test(Cos.html(Cos.by('g_flame'))));
t('dark palettes are lightened so particles stay visible',(()=>{const m=Cos.html(Cos.by('g_grief')).match(/--p3:#([0-9a-f]{6})/)[1];const v=[0,2,4].map(i=>parseInt(m.slice(i,i+2),16));return(.2126*v[0]+.7152*v[1]+.0722*v[2])/255>=.5})());
t('username still escapes through Cos.user',Cos.user('<b>',null).includes('<b>')&&Cos.user('&lt;b&gt;','g_gem').includes('&lt;b&gt;'));
// ---- Cases
const C=Games.cases,R=CFG.RANKS;
t('spin speed: Silver 1.5x, Amethyst..Verifier I 2x, Radiant I..Extreme Demon 2.5x, else 1x',[0,2,3,6,7,9,10,12,15,16,19,21].map(C.spinSpeed).join()==='1,1,1.5,1.5,2,2,2,2,2,2.5,2.5,2.5'&&R[3].n==='Silver'&&R[7].n==='Amethyst'&&R[10].n==='Verifier I'&&R[16].n==='Radiant I');
const mk=(k,fx)=>({r:{k,fx},m:1}),arr=Array.from({length:60},()=>mk('Common'));
t('no tease with plain neighbours',C.teaseIdx(arr,48,mk('Common'))===-1);
arr[47]=mk('Legendary','#fbbf24');t('tease when Legendary is right before a Common/Uncommon result',C.teaseIdx(arr,48,mk('Common'))===47&&C.teaseIdx(arr,48,mk('Uncommon'))===47);
arr[49]=mk('Mythic','#ef4444');t('tease picks the higher rarity neighbour (Mythic)',C.teaseIdx(arr,48,mk('Common'))===49);
t('no tease when the result itself is Rare or better',C.teaseIdx(arr,48,mk('Rare'))===-1&&C.teaseIdx(arr,48,mk('Legendary','#fbbf24'))===-1);
const m={x0:0,xA:-5000,xT:-5114,dur:6500,tease:2400};t('tease motion: reaches the Legendary tile, crawls, then lands on the result last',C.pos(6500,m)===-5000&&Math.abs(C.pos(6500+2400*.5,m)+5000)<=10&&C.pos(6500+2400*.8,m)<-5010&&C.pos(8900,m)===-5114&&C.pos(9999,m)===-5114);
let mono=true,pv=0;for(let ms=0;ms<=8900;ms+=20){const x=C.pos(ms,m);if(x>pv+1e-9)mono=false;pv=x}t('tease motion never moves backwards',mono);
const m2={x0:0,xA:-5114,xT:-5114,dur:6500,tease:0};t('normal spin unchanged (ends exactly on target at DUR)',C.pos(6499,m2)>-5114&&C.pos(6500,m2)===-5114);
fresh();Store.d.cs=1234;Store.save();realLoad();t('lifetime Cases spin total persists',Store.d.cs===1234);
console.log(`\n${pass} passed, ${fail} failed`);process.exit(fail?1:0);
