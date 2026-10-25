/* v2.45 Backspace view toggle (shared by index.html = calculator and game.html = game).
   Normal flow: the calculator Easter egg opens an about:blank tab that hosts BOTH views as iframes and defines window.__toggle; each view forwards Backspace to it.
   Fallback flow (pop-up blocked): the tab navigates calculator <-> game and sessionStorage 'zh_fb' marks it. Typing in inputs/textareas/editables is never intercepted. */
(()=>{
const typing=e=>{const t=e.target,n=t&&t.tagName;return n==='INPUT'||n==='TEXTAREA'||n==='SELECT'||!!(t&&t.isContentEditable)};
const host=()=>{try{return window.parent!==window&&typeof window.parent.__toggle==='function'?window.parent:null}catch(x){return null}};
addEventListener('keydown',e=>{
if(e.key!=='Backspace'||e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||typing(e))return;
const h=host();if(h){e.preventDefault();if(!e.repeat)h.__toggle();return}
let fb=false;try{fb=sessionStorage.getItem('zh_fb')==='1'}catch(x){}
if(!fb)return;e.preventDefault();if(e.repeat)return;
location.href=document.body.dataset.view==='game'?'index.html':'game.html'})})();
