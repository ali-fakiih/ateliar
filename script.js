const slides=[...document.querySelectorAll('.hero-slide')];let current=0;let timer;
function showSlide(index){slides[current].classList.remove('active');current=(index+slides.length)%slides.length;slides[current].classList.add('active');document.querySelector('.hero-bottom>span').textContent=`0${current+1} — 0${slides.length}`;}
function restart(){clearInterval(timer);timer=setInterval(()=>showSlide(current+1),6000)}
document.querySelector('.slide-next').addEventListener('click',()=>{showSlide(current+1);restart()});
document.querySelector('.slide-prev').addEventListener('click',()=>{showSlide(current-1);restart()});restart();
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);toggle.textContent=open?'×':'☰'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.filter.active').classList.remove('active');button.classList.add('active');const category=button.dataset.filter;document.querySelectorAll('.gallery-item').forEach(item=>item.classList.toggle('hidden',category!=='all'&&item.dataset.category!==category));}));
document.getElementById('contactForm').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const subject=encodeURIComponent(`Photography enquiry — ${data.get('project')||'New project'}`);const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject: ${data.get('project')||'Not specified'}\n\n${data.get('message')||''}`);document.getElementById('formNote').textContent='Your email app should open with your enquiry ready to send.';window.location.href=`mailto:hello@atelierframe.com?subject=${subject}&body=${body}`;});
// Keep every visual slot filled even when a remote photo host is unavailable.
const fallbackForCategory = category => ({
  weddings: 'assets/fallback-wedding.svg',
  portraits: 'assets/fallback-portrait.svg',
  editorial: 'assets/fallback-editorial.svg',
  travel: 'assets/fallback-travel.svg'
}[category] || 'assets/fallback-camera.svg');
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    if (img.dataset.fallback && !img.dataset.fallbackUsed) {
      img.dataset.fallbackUsed = '1';
      img.src = img.dataset.fallback;
    } else if (!img.dataset.fallbackUsed) {
      img.dataset.fallbackUsed = '1';
      const item = img.closest('[data-category]');
      img.src = fallbackForCategory(item?.dataset.category);
    }
    img.classList.add('image-failed');
  }, { once: false });
});

// Background slides and decorative photo panels also receive local fallbacks.
const backgroundFallbacks = [
  'assets/fallback-wedding.svg',
  'assets/fallback-portrait.svg',
  'assets/fallback-editorial.svg'
];
document.querySelectorAll('.hero-slide').forEach((slide, index) => {
  const match = slide.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
  if (!match) return;
  const probe = new Image();
  probe.onload = () => slide.classList.add('photo-ready');
  probe.onerror = () => { slide.style.backgroundImage = `url("${backgroundFallbacks[index % backgroundFallbacks.length]}")`; };
  probe.src = match[1];
});
const decorativeBackgrounds = [
  ['.quote-band', 'assets/fallback-travel.svg'],
  ['.contact', 'assets/fallback-ocean.svg']
];
decorativeBackgrounds.forEach(([selector, fallback]) => {
  const element = document.querySelector(selector);
  if (!element) return;
  const match = getComputedStyle(element).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
  if (!match) return;
  const probe = new Image();
  probe.onerror = () => { element.style.backgroundImage = `linear-gradient(rgba(9,10,8,.82),rgba(9,10,8,.88)),url("${fallback}")`; };
  probe.src = match[1];
});
