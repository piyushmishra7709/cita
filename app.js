(function(){'use strict';
var D=document,$=function(i){return D.getElementById(i)},Q=function(s,c){return[].slice.call((c||D).querySelectorAll(s))};
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,cl=function(v,a,b){return Math.min(b,Math.max(a,v))},ez=function(t){return 1-Math.pow(1-t,3)},sg=function(p,a,b){return cl((p-a)/(b-a),0,1)};
var NS='http://www.w3.org/2000/svg',i;
if(RM)D.documentElement.classList.add('rm');
/* nav */
var mb=$('mb');if(mb)mb.onclick=function(){var o=$('nl').classList.toggle('open');mb.setAttribute('aria-expanded',o)};
var hd=D.querySelector('header');addEventListener('scroll',function(){hd&&hd.classList.toggle('sc',scrollY>20)},{passive:true});
/* image fallback chain: local -> official site -> drawing */
D.addEventListener('error',function(e){var t=e.target;if(t.tagName!=='IMG')return;if(t.dataset.r&&!t.dataset.a){t.dataset.a=1;t.src=t.dataset.r;return}if(t.dataset.b)return;t.dataset.b=1;t.src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 380"><rect x="80" y="20" width="140" height="330" rx="14" fill="#dff2ff" stroke="#10213f" stroke-width="4"/><rect x="98" y="44" width="104" height="80" fill="#10213f"/><path d="M155 150l-28 48h20l-9 40 34-54h-22z" fill="#19b36b"/></svg>')},true);
/* reveal + counters */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;t.classList.add('in');io.unobserve(t);if(t.dataset.c){var n=+t.dataset.c,s=t.dataset.s||'',st=performance.now();(function f(now){var k=RM?1:cl((now-st)/1400,0,1);t.textContent=Math.round(ez(k)*n).toLocaleString('en-IN')+s;if(k<1)requestAnimationFrame(f)})(st)}})},{threshold:.18});
Q('.rv,[data-c]').forEach(function(e){io.observe(e)});
/* tilt */
if(!RM&&matchMedia('(hover:hover)').matches)Q('[data-tilt]').forEach(function(e){e.addEventListener('pointermove',function(ev){var r=e.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;e.style.transform='perspective(900px) rotateY('+x*9+'deg) rotateX('+-y*9+'deg) translateY(-4px)'});e.addEventListener('pointerleave',function(){e.style.transform=''})});
/* filter */
var f=$('flt');if(f)f.onclick=function(e){var k=e.target.getAttribute('data-k');if(!k)return;Q('button',f).forEach(function(b){b.setAttribute('aria-pressed',b===e.target)});Q('[data-t]').forEach(function(c){c.hidden=!(k==='all'||c.dataset.t===k)})};
/* lightbox */
var gl=Q('.gal2 img');if(gl.length){var lb=D.createElement('div');lb.className='lb';lb.hidden=true;lb.innerHTML='<img alt=""><button aria-label="Close">×</button>';D.body.appendChild(lb);gl.forEach(function(i){i.onclick=function(){lb.firstChild.src=i.currentSrc||i.src;lb.firstChild.alt=i.alt;lb.hidden=false}});lb.onclick=function(){lb.hidden=true}}
/* quote cart (stored in this browser only) */
var CK='cita_quote',cart=[];try{cart=JSON.parse(localStorage.getItem(CK))||[]}catch(e){}
var cp=$('cartp'),cb=$('cartb');
function sv(){try{localStorage.setItem(CK,JSON.stringify(cart))}catch(e){}draw()}
function mk(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function draw(){var n=cart.reduce(function(a,x){return a+x.q},0);if($('cn'))$('cn').textContent=n;if(!cp)return;cp.textContent='';var h=mk('div','ch');h.appendChild(mk('h3','','Your quote list'));var x=mk('button','cx','×');x.setAttribute('aria-label','Close');x.onclick=function(){cp.classList.remove('open')};h.appendChild(x);cp.appendChild(h);
if(!cart.length)cp.appendChild(mk('p','','Nothing here yet. Use “Add to quote” on any charger.'));
cart.forEach(function(it,i){var r=mk('div','ci');r.appendChild(mk('span','',it.n));var q=mk('div','qq');[['−',-1],['+',1]].forEach(function(b,j){var bt=mk('button','',b[0]);bt.onclick=function(){it.q+=b[1];if(it.q<1)cart.splice(i,1);sv()};if(j)q.appendChild(mk('b','',it.q));q.appendChild(bt)});r.appendChild(q);cp.appendChild(r)});
if(cart.length){var a=mk('a','btn lime','Request quotation');a.href='contact.html?cart=1';cp.appendChild(a);var c=mk('button','btn line','Clear list');c.onclick=function(){cart=[];sv()};cp.appendChild(c)}}
function add(n){var it=cart.filter(function(x){return x.n===n})[0];it?it.q++:cart.push({n:n,q:1});sv();cp&&cp.classList.add('open')}
if(cb)cb.onclick=function(){cp.classList.toggle('open')};
D.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.aq');if(b){e.preventDefault();add(b.dataset.n);b.textContent='Added ✓';setTimeout(function(){b.textContent='Add to quote'},1400)}});draw();
/* scroll scene engine */
var sc=[];function reg(id,fn,rp){var e=$(id);if(e)sc.push({e:e,f:fn,rp:rp})}
var tk=0;function run(){tk=0;var vh=innerHeight;sc.forEach(function(s){var r=s.e.getBoundingClientRect();if(r.bottom<-60||r.top>vh+60)return;var h=r.height-vh;s.f(RM?s.rp:cl(-r.top/(h>1?h:1),0,1))})}
function req(){if(!tk)tk=requestAnimationFrame(run)}addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
function el(n,a,p){var e=D.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e}
function caps(box,i){Q('li',box).forEach(function(l,j){l.classList.toggle('on',j===i);l.classList.toggle('dn',j<i)})}

/* ---- Scene 2: charger shelf (horizontal) ---- */
var tr=$('trk');if(tr)reg('spin',function(p){var m=tr.scrollWidth-innerWidth+60;tr.style.transform='translate3d('+(-p*Math.max(0,m))+'px,0,0)';var sb=$('sbar');if(sb)sb.style.width=p*100+'%'},0);

/* ---- Scene 4: software walkthrough on a phone ---- */
var pb=$('pbox');if(pb){var q='<svg viewBox="0 0 260 520" role="img" aria-label="The CITA EV App: find, scan, charge, pay"><rect x="14" y="4" width="232" height="512" rx="34" fill="#020a06" stroke="#c6f24e" stroke-opacity=".5" stroke-width="2"/><defs><clipPath id="pc"><rect x="22" y="14" width="216" height="492" rx="26"/></clipPath></defs><g clip-path="url(#pc)">';
q+='<g id="p0"><rect x="22" y="14" width="216" height="492" fill="#dfe9dc"/><path d="M22 120L238 80M60 14V506M170 14L120 506M22 300H238" stroke="#fff" stroke-width="9"/>';[[80,170],[150,240],[190,130],[110,330]].forEach(function(a){q+='<path d="M'+a[0]+' '+a[1]+'a11 11 0 1 1 .1 0l-11 20z" fill="#0b1f16"/><circle cx="'+a[0]+'" cy="'+(a[1]-5)+'" r="4" fill="#c6f24e"/>'});q+='<rect x="34" y="388" width="192" height="104" rx="14" fill="#06130d"/><text x="48" y="414" fill="#fff" font-size="13" font-weight="700">CITA Hub, Nagpur</text><text x="48" y="432" fill="#9db5a8" font-size="10">DC 120 kW · 2 of 3 free</text><rect x="48" y="448" width="164" height="30" rx="8" fill="#c6f24e"/><text x="130" y="468" text-anchor="middle" fill="#06130d" font-size="12" font-weight="700">Navigate</text></g>';
q+='<g id="p1"><rect x="22" y="14" width="216" height="492" fill="#06130d"/><text x="130" y="70" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">Scan charger QR</text><g stroke="#c6f24e" stroke-width="4" fill="none"><path d="M70 186v-30h30M160 156h30v30M190 246v30h-30M100 276H70v-30"/></g><rect x="82" y="168" width="96" height="96" fill="#12301f"/><g fill="#e8f3ec">';for(i=0;i<36;i++)q+=((i*7)%5<2?'<rect x="'+(86+(i%6)*15)+'" y="'+(172+((i/6)|0)*15)+'" width="11" height="11"/>':'');q+='</g><rect id="scan" x="70" y="200" width="120" height="3" fill="#c6f24e"/><text x="130" y="360" text-anchor="middle" fill="#9db5a8" font-size="11">Point at the QR on the charger</text></g>';
q+='<g id="p2"><rect x="22" y="14" width="216" height="492" fill="#0b2216"/><circle cx="130" cy="210" r="78" fill="none" stroke="#1f3d2d" stroke-width="14"/><circle id="ring" cx="130" cy="210" r="78" fill="none" stroke="#c6f24e" stroke-width="14" stroke-linecap="round" transform="rotate(-90 130 210)" stroke-dasharray="490" stroke-dashoffset="490"/><text id="pk" x="130" y="206" text-anchor="middle" fill="#fff" font-size="34" font-weight="700">0</text><text x="130" y="228" text-anchor="middle" fill="#9db5a8" font-size="12">kW</text><text id="ps" x="130" y="330" text-anchor="middle" fill="#c6f24e" font-size="20" font-weight="700">20%</text><text id="pt" x="130" y="356" text-anchor="middle" fill="#9db5a8" font-size="12">-- min left</text><rect x="48" y="420" width="164" height="38" rx="10" fill="#ff7a2f"/><text x="130" y="444" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">Stop charging</text></g>';
q+='<g id="p3"><rect x="22" y="14" width="216" height="492" fill="#f3f1e8"/><circle cx="130" cy="110" r="30" fill="#c6f24e"/><path d="M116 110l10 10 20-22" stroke="#06130d" stroke-width="5" fill="none"/><text x="130" y="176" text-anchor="middle" fill="#06130d" font-size="16" font-weight="700">Session complete</text><text x="130" y="206" text-anchor="middle" fill="#58655d" font-size="12">24.0 kWh · 24 min</text><text x="130" y="262" text-anchor="middle" fill="#06130d" font-size="32" font-weight="700">₹ 432</text><rect x="44" y="316" width="172" height="36" rx="9" fill="#06130d"/><text x="130" y="339" text-anchor="middle" fill="#c6f24e" font-size="13" font-weight="700">Pay with UPI</text><rect x="44" y="362" width="172" height="36" rx="9" fill="none" stroke="#06130d"/><text x="130" y="385" text-anchor="middle" fill="#06130d" font-size="13">Card / Wallet</text><text x="130" y="440" text-anchor="middle" fill="#58655d" font-size="10">Invoice sent to your email</text></g></g></svg>';
pb.innerHTML=q;var pg=[0,1,2,3].map(function(i){return $('p'+i)});
reg('ppin',function(p){var ph=p<.25?0:p<.5?1:p<.78?2:3;pg.forEach(function(g,i){g.setAttribute('opacity',i===ph?1:0)});var t=sg(p,.5,.78);$('scan').setAttribute('y',196+Math.abs(Math.sin(p*40))*64);$('ring').setAttribute('stroke-dashoffset',490*(1-(.2+.6*t)));$('pk').textContent=Math.round(t>0?62*Math.min(1,t*8):0);$('ps').textContent=Math.round(20+60*t)+'%';$('pt').textContent=Math.round(24*(1-t))+' min left';caps($('pcap'),ph);$('pbar').style.width=p*100+'%'},.55)}

/* ---- charger inspector: drag to rotate, flip for specs ---- */
Q('.insp').forEach(function(e){var fl=e.querySelector('.flip'),rx=0,ry=0,b=0,dn=0,x0,y0,r0,x1;function ap(){fl.style.transform='rotateX('+rx+'deg) rotateY('+(ry+b)+'deg)'}
e.addEventListener('pointerdown',function(v){dn=1;x0=v.clientX;y0=v.clientY;r0=[ry,rx];e.setPointerCapture(v.pointerId)});e.addEventListener('pointermove',function(v){if(!dn)return;ry=cl(r0[0]+(v.clientX-x0)*.3,-40,40);rx=cl(r0[1]-(v.clientY-y0)*.2,-14,14);ap()});e.addEventListener('pointerup',function(){dn=0;ry=0;rx=0;ap()});
var bt=e.querySelector('.fb2');bt&&(bt.onclick=function(){b=b?0:180;bt.textContent=b?'Show photo':'Flip for specs';ap()})});

/* ---- contact form: CSRF + PHP handler, mailto fallback ---- */
var fm=$('cform');if(fm){var stx=$('fst'),tok=fm.querySelector('[name=csrf]'),sp=new URLSearchParams(location.search),ok=false;
['model','details'].forEach(function(k){var v=sp.get(k),e=fm.querySelector('[name='+k+']');if(v&&e)e.value=v.slice(0,1500)});
if(sp.get('cart')&&cart.length){fm.querySelector('[name=details]').value='Quote list: '+cart.map(function(x){return x.q+' x '+x.n}).join('; ');fm.querySelector('[name=interest]').value='Buying chargers'}
fetch('csrf.php',{credentials:'same-origin'}).then(function(r){return r.json()}).then(function(j){tok.value=j.token;ok=true}).catch(function(){ok=false});
fm.addEventListener('submit',function(e){e.preventDefault();if(!fm.checkValidity()){fm.reportValidity();return}var d=new FormData(fm);
if(!ok){var b=Q('[name]',fm).filter(function(x){return x.name!=='csrf'&&x.name!=='website'&&x.value}).map(function(x){return x.name+': '+x.value}).join('\n');stx.className='status err';stx.textContent='The server form is unavailable, opening your email app instead.';location.href='mailto:sales@citabharatev.com?subject='+encodeURIComponent('Enquiry: '+d.get('interest'))+'&body='+encodeURIComponent(b);return}
stx.className='status';stx.textContent='Sending...';fetch('contact.php',{method:'POST',body:d,credentials:'same-origin'}).then(function(r){return r.json()}).then(function(j){stx.className='status '+(j.ok?'ok':'err');stx.textContent=j.message;if(j.ok)fm.reset()}).catch(function(){stx.className='status err';stx.textContent='Could not send. Please call or WhatsApp +91 70204 04346.'})})}
var js=$('jr');if(js)addEventListener('scroll',function(){var r=js.getBoundingClientRect();js.style.setProperty('--p',cl((innerHeight*.6-r.top)/r.height,0,1))},{passive:true});
var ii=new URLSearchParams(location.search).get('interest'),is=$('ty');if(ii&&is)Q('option',is).forEach(function(o){if(o.textContent.indexOf(ii)>-1)is.value=o.textContent});
run();
})();
