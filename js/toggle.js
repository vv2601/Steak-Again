/* Right Shift view toggle (shared by index.html = calculator and game.html = game).
   Press and release the RIGHT SHIFT key on its own to switch views. It is a "tap": if any other key is pressed while Right Shift is held
   (typing ( ) * ^ etc. with Right Shift, or Shift+click combos), nothing happens, so normal typing is never hijacked.
   Normal flow: the calculator Easter egg / the Gold element opens an about:blank tab that hosts BOTH views as iframes and defines window.__toggle; each view forwards the tap to it.
   Fallback flow (pop-up blocked): the tab navigates calculator <-> game and sessionStorage 'zh_fb' marks it. Typing in inputs/textareas/editables is never intercepted. */
(()=>{
const typing=e=>{const t=e.target,n=t&&t.tagName;return n==='INPUT'||n==='TEXTAREA'||n==='SELECT'||!!(t&&t.isContentEditable)};
const host=()=>{try{return window.parent!==window&&typeof window.parent.__toggle==='function'?window.parent:null}catch(x){return null}};
let armed=false;
function go(){const h=host();if(h){h.__toggle();return}
let fb=false;try{fb=sessionStorage.getItem('zh_fb')==='1'}catch(x){}
if(!fb)return;location.href=document.body.dataset.view==='game'?'index.html':'game.html'}
addEventListener('keydown',e=>{
if(e.code==='ShiftRight'){if(!e.repeat)armed=!(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||typing(e));return}
armed=false});
addEventListener('keyup',e=>{if(e.code!=='ShiftRight')return;const a=armed;armed=false;if(a)go()});
addEventListener('blur',()=>{armed=false})})();
