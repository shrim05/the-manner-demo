// js/script.js
document.addEventListener('DOMContentLoaded', () => {
  // 작은 헬퍼: 한 번만 트리거되는 IO
  const ioOnce = (els, opts, onEnter) => {
    if (!els || els.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        onEnter(entry.target, observer);
        observer.unobserve(entry.target);
      });
    }, opts);
    els.forEach(el => observer.observe(el));
    return observer;
  };

  /* ── HERO ───────────────────────────────────────────── */
  // 텍스트: 즉시(1% 보이면) 노출 → 플래시 방지
  const heroTexts = Array.from(document.querySelectorAll('.hero-text-overlay .reveal'));
  ioOnce(heroTexts, { threshold: 0.01 }, (el) => el.classList.add('show'));

  // 폰: 즉시(1%) 1회 애니메이션
  const heroPhoneImg = document.querySelector('.hero-phone .phone-image');
  if (heroPhoneImg) {
    ioOnce([heroPhoneImg], { threshold: 0.01 }, (img) => {
      if (!img.classList.contains('fadeInUp')) {
        img.style.animationDelay = '140ms';
        img.classList.add('fadeInUp');
        img.addEventListener('animationend', () => {
          img.style.animationDelay = '';
        }, { once: true });
      }
    });
  }

  /* ── BANNERS (그대로 빠르게 트리거) ───────────────────── */
  const banners = Array.from(document.querySelectorAll('.banner-section-1, .banner-section-2'));
  banners.forEach(el => el.classList.add('will-reveal'));
  ioOnce(banners, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }, (el) => {
    el.classList.remove('will-reveal');
    el.classList.add('fadeInUp');
  });

  /* ── MAIN 섹션 (폰 이미지 포함한 섹션만, 35% 보이면) ─── */
  const mainSections = Array.from(document.querySelectorAll('main section'))
    .filter(sec => sec.querySelector('.phone-image, .phone-mock'));
  mainSections.forEach(sec => sec.classList.add('will-reveal'));
  ioOnce(mainSections, { threshold: 0.55 }, (sec) => {
    sec.classList.remove('will-reveal');
    sec.classList.add('fadeInUp');
  });

  /* ── Reduce-motion 대응 ──────────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.will-reveal').forEach(el => el.classList.remove('will-reveal'));
    heroTexts.forEach(el => el.classList.add('show'));
    if (heroPhoneImg) {
      heroPhoneImg.classList.remove('fadeInUp');
      heroPhoneImg.style.opacity = 1;
      heroPhoneImg.style.transform = 'none';
    }
  }
});
