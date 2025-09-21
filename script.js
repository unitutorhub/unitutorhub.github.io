// Theme toggle
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('uth-theme');
if (savedTheme === 'dark') root.classList.add('dark');
themeToggle?.addEventListener('click', () => {
  root.classList.toggle('dark');
  localStorage.setItem('uth-theme', root.classList.contains('dark') ? 'dark' : 'light');
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Open/close guidelines modal
const dlg = document.getElementById('guidelines');
document.getElementById('openGuidelines')?.addEventListener('click', (e)=>{e.preventDefault(); dlg.showModal();});
document.getElementById('closeGuidelines')?.addEventListener('click', ()=> dlg.close());

// Prefill tutor from card → request form
document.querySelectorAll('[data-tutor]').forEach(el=>{
  el.addEventListener('click', (e)=>{
    const name = el.getAttribute('data-tutor');
    document.getElementById('tutorField').value = name || '';
  });
});

// “See reviews” button scrolls to reviews + filters
document.querySelectorAll('[data-reviews-open]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const who = btn.getAttribute('data-reviews-open');
    const list = document.getElementById('reviews');
    const items = [...list.querySelectorAll('.review')];
    items.forEach(i => i.style.display = (i.dataset.tutor === who ? '' : 'none'));
    list.scrollIntoView({behavior:'smooth'});
  });
});

// Basic filter
document.getElementById('filterForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const q = document.getElementById('q').value.toLowerCase();
  const degree = document.getElementById('degree').value;
  document.querySelectorAll('.tutor').forEach(card=>{
    const hay = (card.dataset.modules + ' ' + card.dataset.degree + ' ' + card.textContent).toLowerCase();
    const passQ = q ? hay.includes(q) : true;
    const passDeg = degree ? card.dataset.degree === degree : true;
    card.style.display = (passQ && passDeg) ? '' : 'none';
  });
});

// Request form (v0: just show success; later pipe to email/form backend)
document.getElementById('requestForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const msg = document.getElementById('requestMsg');
  msg.textContent = '✅ Request received — we’ll connect you with a tutor by email.';
  e.target.reset();
  setTimeout(()=> msg.textContent = '', 4000);
});

// Reviews (stored in localStorage for demo)
const REV_KEY = 'uth-reviews';
const reviewsEl = document.getElementById('reviews');
const saved = JSON.parse(localStorage.getItem(REV_KEY) || '[]');
function renderReviews(list){
  reviewsEl.innerHTML = '';
  if (list.length === 0) {
    reviewsEl.innerHTML = '<p class="muted">No reviews yet. Be the first!</p>';
    return;
  }
  list.slice(-20).reverse().forEach(r=>{
    const el = document.createElement('article');
    el.className = 'card review';
    el.dataset.tutor = r.tutor;
    el.innerHTML = `
      <header style="display:flex;justify-content:space-between;align-items:center">
        <strong>${r.tutor}</strong>
        <span class="pill">⭐ ${r.rating}/5</span>
      </header>
      <p class="muted tiny">${r.module}</p>
      <p>${r.text}</p>
    `;
    reviewsEl.appendChild(el);
  });
}
renderReviews(saved);

document.getElementById('reviewForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const r = {
    tutor: fd.get('tutor').trim(),
    module: fd.get('module').trim(),
    rating: Number(fd.get('rating')),
    text: fd.get('text').trim(),
    ts: Date.now()
  };
  const data = JSON.parse(localStorage.getItem(REV_KEY) || '[]');
  data.push(r);
  localStorage.setItem(REV_KEY, JSON.stringify(data));
  renderReviews(data);
  e.target.reset();
});
