/* Interactive periodic table for the calculator page (index.html). Opened from the right-hand side bar.
   Hover / focus an element to read its details; arrow keys move between elements; the legend filters by category.
   Clicking Gold (Au) opens the game page (window.__openGame from calc.js). Pure data + DOM, no network access. */
(function(root){
const DATA='H,Hydrogen,1.008;He,Helium,4.0026;Li,Lithium,6.94;Be,Beryllium,9.0122;B,Boron,10.81;C,Carbon,12.011;N,Nitrogen,14.007;O,Oxygen,15.999;F,Fluorine,18.998;Ne,Neon,20.180;'
+'Na,Sodium,22.990;Mg,Magnesium,24.305;Al,Aluminium,26.982;Si,Silicon,28.085;P,Phosphorus,30.974;S,Sulfur,32.06;Cl,Chlorine,35.45;Ar,Argon,39.948;K,Potassium,39.098;Ca,Calcium,40.078;'
+'Sc,Scandium,44.956;Ti,Titanium,47.867;V,Vanadium,50.942;Cr,Chromium,51.996;Mn,Manganese,54.938;Fe,Iron,55.845;Co,Cobalt,58.933;Ni,Nickel,58.693;Cu,Copper,63.546;Zn,Zinc,65.38;'
+'Ga,Gallium,69.723;Ge,Germanium,72.630;As,Arsenic,74.922;Se,Selenium,78.971;Br,Bromine,79.904;Kr,Krypton,83.798;Rb,Rubidium,85.468;Sr,Strontium,87.62;Y,Yttrium,88.906;Zr,Zirconium,91.224;'
+'Nb,Niobium,92.906;Mo,Molybdenum,95.95;Tc,Technetium,98;Ru,Ruthenium,101.07;Rh,Rhodium,102.91;Pd,Palladium,106.42;Ag,Silver,107.87;Cd,Cadmium,112.41;In,Indium,114.82;Sn,Tin,118.71;'
+'Sb,Antimony,121.76;Te,Tellurium,127.60;I,Iodine,126.90;Xe,Xenon,131.29;Cs,Caesium,132.91;Ba,Barium,137.33;La,Lanthanum,138.91;Ce,Cerium,140.12;Pr,Praseodymium,140.91;Nd,Neodymium,144.24;'
+'Pm,Promethium,145;Sm,Samarium,150.36;Eu,Europium,151.96;Gd,Gadolinium,157.25;Tb,Terbium,158.93;Dy,Dysprosium,162.50;Ho,Holmium,164.93;Er,Erbium,167.26;Tm,Thulium,168.93;Yb,Ytterbium,173.05;'
+'Lu,Lutetium,174.97;Hf,Hafnium,178.49;Ta,Tantalum,180.95;W,Tungsten,183.84;Re,Rhenium,186.21;Os,Osmium,190.23;Ir,Iridium,192.22;Pt,Platinum,195.08;Au,Gold,196.97;Hg,Mercury,200.59;'
+'Tl,Thallium,204.38;Pb,Lead,207.2;Bi,Bismuth,208.98;Po,Polonium,209;At,Astatine,210;Rn,Radon,222;Fr,Francium,223;Ra,Radium,226;Ac,Actinium,227;Th,Thorium,232.04;'
+'Pa,Protactinium,231.04;U,Uranium,238.03;Np,Neptunium,237;Pu,Plutonium,244;Am,Americium,243;Cm,Curium,247;Bk,Berkelium,247;Cf,Californium,251;Es,Einsteinium,252;Fm,Fermium,257;'
+'Md,Mendelevium,258;No,Nobelium,259;Lr,Lawrencium,266;Rf,Rutherfordium,267;Db,Dubnium,268;Sg,Seaborgium,269;Bh,Bohrium,270;Hs,Hassium,277;Mt,Meitnerium,278;Ds,Darmstadtium,281;'
+'Rg,Roentgenium,282;Cn,Copernicium,285;Nh,Nihonium,286;Fl,Flerovium,289;Mc,Moscovium,290;Lv,Livermorium,293;Ts,Tennessine,294;Og,Oganesson,294';
const CATS=[['alkali','Alkali metal'],['alkaline','Alkaline earth metal'],['transition','Transition metal'],['post','Post-transition metal'],['metalloid','Metalloid'],['nonmetal','Nonmetal'],['halogen','Halogen'],['noble','Noble gas'],['lanthanide','Lanthanide'],['actinide','Actinide']];
const S=(...a)=>new Set(a);
const SETS={alkali:S(3,11,19,37,55,87),alkaline:S(4,12,20,38,56,88),noble:S(2,10,18,36,54,86,118),halogen:S(9,17,35,53,85,117),metalloid:S(5,14,32,33,51,52),nonmetal:S(1,6,7,8,15,16,34),post:S(13,31,49,50,81,82,83,84,113,114,115,116)};
const cat=z=>{for(const k in SETS)if(SETS[k].has(z))return k;if(z>=57&&z<=71)return'lanthanide';if(z>=89&&z<=103)return'actinide';return'transition'};
/* [row, column] in an 18-column table; rows 1-7 are the periods, row 8 is a spacer, rows 9/10 hold the lanthanides (La-Yb) and actinides (Ac-No) */
function pos(z){if(z===1)return[1,1];if(z===2)return[1,18];
if(z<=4)return[2,z-2];if(z<=10)return[2,z+8];if(z<=12)return[3,z-10];if(z<=18)return[3,z];
if(z<=36)return[4,z-18];if(z<=54)return[5,z-36];if(z<=56)return[6,z-54];if(z<=70)return[9,z-54];if(z<=86)return[6,z-68];
if(z<=88)return[7,z-86];if(z<=102)return[10,z-86];return[7,z-100]}
const NOSTD=z=>z===43||z===61||(z>=84&&z<=89)||z>=93;   // no standard atomic weight: the mass number of the most stable isotope is shown in brackets
const E=DATA.split(';').map((s,i)=>{const[sy,n,m]=s.split(',');return{z:i+1,s:sy,n,m:NOSTD(i+1)?'('+m+')':m,k:cat(i+1),p:pos(i+1)}});
const api={E,pos,cat,CATS};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(typeof document==='undefined'||!document.getElementById('ptb'))return;
const $=id=>document.getElementById(id),btn=$('ptb'),NAME=Object.fromEntries(CATS);
/* side bar icon: a tiny periodic-table silhouette */
{const rows=['x....x','xx..xx','xx..xx','xxxxxx','','.xxxx.','.xxxx.'];let r='';rows.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='x')r+=`<rect x="${(1.2+x*3.6).toFixed(1)}" y="${(1.2+y*3.1).toFixed(1)}" width="3" height="2.6" rx=".5"/>`}));
btn.innerHTML=`<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">${r}</svg>`}
let dlg=null,grid=null,info=null,last=null,pinned=0,filter='';const cells={};
const ph=()=>{info.innerHTML='<div class="pis">&nbsp;</div><div class="pit"><span>Hover over or focus an element to see its details.</span></div>'};
function show(z){if(!z){ph();return}const e=E[z-1];info.innerHTML=`<div class="pis k-${e.k}">${e.s}</div><div class="pit"><strong>${e.n}</strong><span>Atomic number ${e.z}</span><span>Atomic mass ${e.m}</span><span>${NAME[e.k]}</span></div>`}
function build(){dlg=document.createElement('div');dlg.className='ptm';dlg.hidden=true;
dlg.innerHTML=`<div class="ptd" role="dialog" aria-modal="true" aria-labelledby="ptt"><div class="pth"><h2 id="ptt">Periodic table</h2><button type="button" class="ptx" aria-label="Close periodic table">×</button></div>
<div class="ptw"><div class="ptg" id="ptg"><div class="ptinfo" id="pti" aria-live="polite"></div>${E.map(e=>`<button type="button" class="pe k-${e.k}" data-z="${e.z}" aria-label="${e.n}, atomic number ${e.z}" tabindex="-1" style="grid-row:${e.p[0]};grid-column:${e.p[1]}"><i>${e.z}</i><b>${e.s}</b></button>`).join('')}</div></div>
<div class="ptl" role="group" aria-label="Filter by category">${CATS.map(([k,n])=>`<button type="button" class="pk" data-k="${k}" aria-pressed="false"><span class="sw k-${k}"></span>${n}</button>`).join('')}</div>
<p class="ptn">Atomic masses in brackets are the mass number of the most stable isotope.</p></div>`;
document.body.appendChild(dlg);grid=dlg.querySelector('#ptg');info=dlg.querySelector('#pti');ph();
grid.querySelectorAll('.pe').forEach(b=>cells[b.dataset.z]=b);cells[1].tabIndex=0;
const at={};E.forEach(e=>at[e.p[0]+','+e.p[1]]=cells[e.z]);
const mv=(b,dr,dc)=>{let r=+E[b.dataset.z-1].p[0],c=+E[b.dataset.z-1].p[1];for(let i=0;i<20;i++){r+=dr;c+=dc;if(r<1||r>10||c<1||c>18)return;const n=at[r+','+c];if(n){n.focus();return}}};
grid.addEventListener('mouseover',e=>{const b=e.target.closest('.pe');if(b)show(+b.dataset.z)});
grid.addEventListener('mouseleave',()=>show(pinned));
grid.addEventListener('focusin',e=>{const b=e.target.closest('.pe');if(!b)return;grid.querySelectorAll('.pe[tabindex="0"]').forEach(x=>x.tabIndex=-1);b.tabIndex=0;show(+b.dataset.z)});
grid.addEventListener('focusout',()=>show(pinned));
grid.addEventListener('click',e=>{const b=e.target.closest('.pe');if(!b)return;const z=+b.dataset.z;
if(z===79){close(true);if(typeof root.__openGame==='function')root.__openGame();else location.href='game.html';return}   // Gold opens the game page
if(pinned&&cells[pinned])cells[pinned].classList.remove('sel');pinned=pinned===z?0:z;if(pinned)b.classList.add('sel');show(pinned||z)});
grid.addEventListener('keydown',e=>{const b=e.target.closest('.pe');if(!b)return;const d={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[e.key];if(d){e.preventDefault();mv(b,d[0],d[1])}});
dlg.querySelector('.ptl').addEventListener('click',e=>{const b=e.target.closest('.pk');if(!b)return;filter=filter===b.dataset.k?'':b.dataset.k;
dlg.querySelectorAll('.pk').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.k===filter)));E.forEach(x=>cells[x.z].classList.toggle('dim',!!filter&&x.k!==filter))});
dlg.querySelector('.ptx').onclick=()=>close(true);
dlg.addEventListener('mousedown',e=>{if(e.target===dlg)close(true)});
dlg.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close(true)}
else if(e.key==='Tab'){const f=[...dlg.querySelectorAll('button')].filter(x=>x.tabIndex>=0&&!x.disabled);if(!f.length)return;const i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()}})}
function open(){if(!dlg)build();last=document.activeElement;dlg.hidden=false;document.body.classList.add('pt-open');btn.setAttribute('aria-expanded','true');dlg.querySelector('.ptx').focus()}
function close(back){if(!dlg||dlg.hidden)return;dlg.hidden=true;document.body.classList.remove('pt-open');btn.setAttribute('aria-expanded','false');if(back&&last&&last.focus)try{last.focus()}catch(e){}}
btn.setAttribute('aria-expanded','false');btn.addEventListener('click',open)})(typeof window!=='undefined'?window:this);
