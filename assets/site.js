
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {if(document.querySelector('#service-choice'))document.querySelector('#service-choice').value=link.dataset.service;}));
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
toggle.addEventListener('click', () => {const open = toggle.getAttribute('aria-expanded') !== 'true';toggle.setAttribute('aria-expanded', String(open));navigation.classList.toggle('is-open', open);});
navigation.addEventListener('click', event => {if(event.target.closest('a')) {toggle.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');}});
document.addEventListener('keydown', event => {if(event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true'){toggle.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');toggle.focus();}});
const inquiryChoice=document.querySelector('#service-choice');
const inquiryNext=document.querySelector('#inquiry-next');
if(inquiryNext && ['http:', 'https:'].includes(window.location.protocol)) inquiryNext.value=new URL('thanks.html', window.location.href).href;
const requestedService=new URLSearchParams(window.location.search).get('service');
if(inquiryChoice && [...inquiryChoice.options].some(option=>option.value===requestedService)) inquiryChoice.value=requestedService;
document.querySelectorAll('[data-viewer]').forEach(viewer=>{
 const buttons=[...viewer.querySelectorAll('[data-panel]')];
 const panels=[...viewer.querySelectorAll('.viewer-panel')];
 let current=0;
 function show(index,focus=false){current=(index+panels.length)%panels.length;buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));panels.forEach((panel,i)=>panel.hidden=i!==current);viewer.querySelector('output').textContent=(current+1)+' / '+panels.length;viewer.querySelectorAll('.source-slide-dots i').forEach((dot,i)=>dot.classList.toggle('active',i===current));if(focus)buttons[current].focus();}
 buttons.forEach((button,i)=>{button.addEventListener('click',()=>show(i));button.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();show(current+(event.key==='ArrowRight'?1:-1),true)}})});
 viewer.querySelector('[data-previous]').addEventListener('click',()=>show(current-1));viewer.querySelector('[data-next]').addEventListener('click',()=>show(current+1));show(0);
});
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.1});document.querySelectorAll('.image-feature,.report-card').forEach(element=>observer.observe(element));}
