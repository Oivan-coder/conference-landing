// Smooth anchor
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{const id=a.getAttribute('href'); if(id.length<2)return; const el=document.querySelector(id); if(!el)return; e.preventDefault(); el.scrollIntoView({behavior:'smooth'});});
});

// Sticky progress
const bar=document.getElementById('progress');
window.addEventListener('scroll',()=>{const h=document.documentElement; const sc=h.scrollTop; const max=h.scrollHeight-h.clientHeight; bar.style.width=((sc/max)*100)+'%';});

// Countdown to 25 Sep 2025 11:00 (Europe/Moscow ~ UTC+3)
const target=new Date('2025-09-25T08:00:00Z'); // 11:00 MSK ≈ 08:00 UTC
function tick(){
  const now=new Date(); const diff=target-now; if(diff<=0){['cd-d','cd-h','cd-m','cd-s'].forEach(id=>document.getElementById(id).textContent='00'); return;}
  const s=Math.floor(diff/1000); const d=Math.floor(s/86400); const h=Math.floor((s%86400)/3600); const m=Math.floor((s%3600)/60); const sec=s%60;
  document.getElementById('cd-d').textContent=String(d).padStart(2,'0');
  document.getElementById('cd-h').textContent=String(h).padStart(2,'0');
  document.getElementById('cd-m').textContent=String(m).padStart(2,'0');
  document.getElementById('cd-s').textContent=String(sec).padStart(2,'0');
}
tick(); setInterval(tick,1000);

// Program tabs filter
const tabs=document.querySelectorAll('.tab');
const slots=[...document.querySelectorAll('.slot')];
tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active')); t.classList.add('active'); const tag=t.dataset.tag; slots.forEach(s=>{ if(tag==='all'){s.style.display='block'} else { const tags=s.dataset.tags.split(' '); s.style.display=tags.includes(tag)?'block':'none'; } }); }));

// RSVP modal
const modal=document.getElementById('modalRSVP');
const openBtns=['openRSVP','openRSVP2','openRSVP3'].map(id=>document.getElementById(id));
openBtns.forEach(b=>b&&b.addEventListener('click',()=>{modal.style.display='flex'}));
document.getElementById('closeRSVP').addEventListener('click',()=>{modal.style.display='none'});
modal.addEventListener('click',e=>{if(e.target===modal) modal.style.display='none'});

function encodeRFC3986URIComponent(str){return encodeURIComponent(str).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());}

document.getElementById('sendRSVP').addEventListener('click',()=>{
  const name=document.getElementById('fName').value.trim();
  const role=document.getElementById('fRole').value;
  const org=document.getElementById('fOrg').value.trim();
  const mail=document.getElementById('fMail').value.trim();
  const phone=document.getElementById('fPhone').value.trim();
  const note=document.getElementById('fNote').value.trim();
  if(!name||!mail){alert('Укажите ФИО и e‑mail.'); return;}
  const to='info@example.ru';
  const subject=`Заявка на участие — ${name}`;
  const body=`ФИО: ${name}%0D%0AРоль: ${role}%0D%0AОрганизация: ${org}%0D%0AE‑mail: ${mail}%0D%0AТелефон: ${phone}%0D%0AКомментарии: ${note}%0D%0A%0D%0AИсточник: сайт конференции`;
  const href=`mailto:${to}?subject=${encodeRFC3986URIComponent(subject)}&body=${body}`;
  window.location.href=href; modal.style.display='none';
});

// Add to Calendar (.ics)
function downloadICS(){
  const dtStart='20250925T080000Z'; // 11:00 MSK
  const dtEnd='20250925T150000Z'; // 18:00 MSK
  const ics=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Conference//LabMed MO//RU
BEGIN:VEVENT
UID:${Date.now()}@labmed-mo
DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:Лабораторная медицина Подмосковья: этапы, инновации, перспективы
LOCATION:Дом Правительства МО, Красногорск, БЦ «Новатор», 7 эт.
DESCRIPTION:Официальная конференция Московской области
END:VEVENT
END:VCALENDAR`;
  const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='LabMed_MO_2025-09-25.ics'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
document.getElementById('addToCal').addEventListener('click',downloadICS);

// Download simple invite PDF (generated as text -> print dialog)
document.getElementById('dlInvite').addEventListener('click',()=>{
  const w=window.open('','_blank');
  w.document.write(`<html><head><title>Приглашение</title></head><body style="font-family:Manrope,Arial; line-height:1.5; padding:24px">`+
    `<h2>Лабораторная медицина Подмосковья</h2>`+
    `<p><strong>Дата:</strong> 25 сентября 2025 (четверг), 11:00–18:00<br>`+
    `<strong>Место:</strong> Дом Правительства МО, г. Красногорск, БЦ «Новатор», 7 этаж, конференц‑зал</p>`+
    `<p>Подтвердите участие ответом на это письмо или через кнопку RSVP на сайте.</p>`+
    `</body></html>`);
  w.document.close(); w.focus(); w.print();
});

// Canvas particles — простая анимация для вовлечения
const canvas=document.getElementById('heroCanvas');
const ctx=canvas.getContext('2d');
let w=canvas.width, h=canvas.height;
let mouse={x:w/2,y:h/2};
const particles=Array.from({length:120},()=>({x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-0.5)*0.6, vy:(Math.random()-0.5)*0.6}));
canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top;});
function step(){
  ctx.fillStyle='#0a142a'; ctx.fillRect(0,0,w,h);
  particles.forEach(p=>{
    const dx=mouse.x-p.x, dy=mouse.y-p.y; const d=Math.hypot(dx,dy)+0.001; const force=40/(d*d);
    p.vx+=force*dx; p.vy+=force*dy; p.vx*=0.96; p.vy*=0.96; p.x+=p.vx*0.02; p.y+=p.vy*0.02;
    if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
    ctx.fillStyle='rgba(96,165,250,0.9)'; ctx.fillRect(p.x,p.y,1.5,1.5);
  });
  requestAnimationFrame(step);
}
step();
window.addEventListener('resize',()=>{const r=canvas.getBoundingClientRect(); canvas.width=r.width*devicePixelRatio; canvas.height=r.height*devicePixelRatio; w=canvas.width; h=canvas.height;});
