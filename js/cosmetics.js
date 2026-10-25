/* Cosmetic catalog (28 tags + 18 gradients) and style helpers. Rarity prices come from CFG.RAR.
   v2.3: +5 tags (LIGHT, ORBIT, ANDROMEDA, SLAUGHTERHOUSE, THE MANIPULATOR), +4 gradients (Light, Orbit, Andromeda, Manipulator).
   Optional 5th/6th args: anim ('x'|'y' = animated background) and fx (themed particle/glow effect, styled in cosfx.js as .cx-<fx>). */
const G=(a,b,d='90deg')=>`linear-gradient(${d},${a},${b})`,SOLID=c=>`linear-gradient(${c},${c})`;
const RAINBOW='linear-gradient(90deg,#ff0000,#ff9900,#ffee00,#33ff00,#00ccff,#6600ff,#ff00cc,#ff0000)',GOLD='linear-gradient(90deg,#b8860b,#ffe08a,#b8860b)',FOUND='linear-gradient(90deg,#ffd200,#ffffff,#ffd200)',
GRIEF='linear-gradient(180deg,#731919,#e52b2b,#731919)',TIDAL='linear-gradient(90deg,#0a2a6b,#5bc0ff,#0a2a6b)',MOG='linear-gradient(90deg,#000000,#ffffff,#000000)',D1='linear-gradient(90deg,#00e5ff,#7c3aed,#ff2bd6,#00e5ff)',
LIGHT='linear-gradient(90deg,#ffffff,#fff3b0,#bfe9ff,#ffffff)',ANDRO='linear-gradient(90deg,#0b0018,#5b21b6,#c084fc,#1e1b4b,#0b0018)',GORE='linear-gradient(180deg,#4a0000,#c8102e,#ff5a5a,#4a0000)',MANIP='linear-gradient(90deg,#3b0000,#e11d2f,#7f0000,#e11d2f,#3b0000)';
const T=(id,name,label,rar,bg,anim,fx)=>({id,type:'tag',name,label,rar,bg,anim:anim||'',fx:fx||''}),Gr=(id,name,rar,bg,anim,fx)=>({id,type:'grad',name,label:name,rar,bg,anim:anim||'',fx:fx||''});
const COS=[
T('t_larper','Larp Tag','[LARPER]','common',G('#ffffff','#9ca3af','180deg')),T('t_bloodbath','Blood Tag','[BLOODBATH]','common',SOLID('#b00000')),T('t_hoid','Hoid Tag','[HOID]','common',SOLID('#ff5a5a')),T('t_green','Green Tag','[GREEN]','common',SOLID('#7cfc3c')),T('t_hiddengem','Gem Tag','[HIDDEN GEM]','common',SOLID('#c77dff')),
Gr('g_flame','Flame Gradient','rare','linear-gradient(0deg,#490e24,#f35e61,#ffe385)'),Gr('g_iron','Iron Gradient','rare',G('#d1d5db','#4b5563')),Gr('g_bloodbath','Bloodbath Gradient','rare',G('#5c0000','#d11a1a')),Gr('g_larper','Larper Gradient','rare',G('#ffffff','#9ca3af')),Gr('g_green','Green Gradient','rare',G('#9bff6a','#2e8b1f')),
T('t_beast','Beast Tag','[THE BEAST]','rare',G('#d9a27a','#5a3320')),T('t_caseopener','Case Opener Tag','[CASE OPENER]','rare',G('#3b6fd8','#cfe3ff')),T('t_ace','Ace Tag','[THE ACE]','rare',G('#ffffff','#8a8f98','180deg')),T('t_jester','Jester Tag','[THE JESTER]','rare',G('#ffffff','#8a8f98')),T('t_pawn','Pawn Tag','[THE PAWN]','rare',G('#ffffff','#8a8f98','45deg')),
Gr('g_gem','Gem Gradient','epic',G('#f093ff','#be0bb1')),Gr('g_jewel','Jewel Gradient','epic',G('#14532d','#22c55e')),Gr('g_ruby','Ruby Gradient','epic',G('#fca5a5','#7f1d1d')),Gr('g_diamond','Diamond Gradient','epic','linear-gradient(90deg,#d9f0ff,#7aa2ff,#e8fbff)'),
Gr('g_manip','Manipulator Gradient','epic',MANIP,'x'),
T('t_amethyst','Amethyst Tag','[THE AMETHYST]','epic',G('#5b21b6','#e0b3ff')),T('t_colossal','Colossal Tag','[THE COLOSSAL]','epic','linear-gradient(90deg,#4a1d5c,#c4406a,#ffb27a)'),T('t_geeg','Geeg Tag','[GEEG]','epic','linear-gradient(90deg,#9ca3af,#f3f4f6,#9ca3af)'),T('t_ascendant','Ascendant Tag','[ASCENDANT]','epic',G('#4ade80','#14532d')),T('t_legend','Legend Tag','[LEGEND]','epic',G('#ffd1d1','#d97a7a')),
T('t_manip','Manipulator Tag','[THE MANIPULATOR]','epic',MANIP,'x'),
Gr('g_gilded','Gilded Gradient','legendary',GOLD,'x'),Gr('g_grief','Grief Gradient','legendary',GRIEF,'y'),Gr('g_tidal','Tidal Gradient','legendary',TIDAL,'x'),Gr('g_rgb','RGB Gradient','legendary',RAINBOW,'x'),Gr('g_d1','D1 Gradient','legendary',D1,'x'),
Gr('g_light','Light Gradient','legendary',LIGHT,'x','light'),Gr('g_orbit','Orbit Gradient','legendary',RAINBOW,'x','orbit'),Gr('g_andromeda','Andromeda Gradient','legendary',ANDRO,'x','andro'),
T('t_founder','Founder Tag','[THE FOUNDER]','legendary',FOUND,'x'),T('t_bigspender','Spender Tag','[THE BIG SPENDER]','legendary',SOLID('#ffde59')),T('t_elite','Elite Tag','[ELITE]','legendary',GOLD,'x'),T('t_grief','Grief Tag','[GRIEF]','legendary',GRIEF,'y'),T('t_tidal','Tidal Tag','[TIDAL]','legendary',TIDAL,'x'),T('t_mogger','Mogger Tag','[THE MOGGER]','legendary',MOG,'x'),T('t_goat','Goat Tag','[THE GOAT]','legendary',RAINBOW,'x'),T('t_div1','D1 Tag','[DIV 1]','legendary',D1,'x'),
T('t_light','Light Tag','[LIGHT]','legendary',LIGHT,'x','light'),T('t_orbit','Orbit Tag','[ORBIT]','legendary',RAINBOW,'x','orbit'),T('t_andromeda','Andromeda Tag','[ANDROMEDA]','legendary',ANDRO,'x','andro'),T('t_slaughter','Slaughterhouse Tag','[SLAUGHTERHOUSE]','legendary',GORE,'y','gore')];
const Cos={
all:COS,by:id=>COS.find(c=>c.id===id)||null,
gems:c=>CFG.RAR[c.rar].gems,                              // normal Gem price = resale reference
sellValue:c=>Cos.gems(c)*CFG.GEM.TO_COIN,                  // sale pays Gem value x 50 01O0coin (no Gems)
html(c,txt){return `<span class="cos${c.anim?' an'+c.anim:''}${c.fx?' cx-'+c.fx:''}" style="background-image:${c.bg}">${txt==null?c.label:txt}</span>`},
user(name,gradId){const c=gradId&&Cos.by(gradId);return c?Cos.html(c,name):`<span class="cos0">${name}</span>`}};
