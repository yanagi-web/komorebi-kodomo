// モバイルのナビゲーションを、キーボードでも操作できるよう状態とARIA属性を同期します。
const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const header = document.querySelector('.site-header');
const heroImages = document.querySelectorAll('.hero-image');

function closeMenu() {
  menuButton.classList.remove('is-open');
  siteNav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'メニューを開く';
  document.body.style.overflow = '';
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.classList.toggle('is-open', !isOpen);
  siteNav.classList.toggle('is-open', !isOpen);
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.querySelector('.sr-only').textContent = isOpen ? 'メニューを開く' : 'メニューを閉じる';
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

// スクロール後は白い背景に切り替え、常にナビゲーションを読みやすく保ちます。
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 30), { passive: true });

// 写真を重ねてopacityだけを切り替え、ズーム値を保ったままフェードさせます。
let activeHeroIndex = 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function showNextHero() {
  const activeHero = heroImages[activeHeroIndex];
  const nextHeroIndex = (activeHeroIndex + 1) % heroImages.length;
  const nextHero = heroImages[nextHeroIndex];

  activeHero.classList.remove('is-active');
  activeHero.classList.add('is-leaving');
  nextHero.classList.add('is-active');
  activeHeroIndex = nextHeroIndex;

  window.setTimeout(() => activeHero.classList.remove('is-leaving'), 2000);
}

if (heroImages.length > 1 && !prefersReducedMotion.matches) {
  window.setInterval(showNextHero, 6000);
}

// 画面に入った要素だけを表示して、動きを控えめにしています。
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
