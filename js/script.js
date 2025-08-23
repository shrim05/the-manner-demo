// js/script.js
document.addEventListener('DOMContentLoaded', () => {
  // --- 1회 고정 vh 세팅 (스크롤에 따른 resize는 무시) ---
  const setVHOnce = () => {
    const h = (window.visualViewport?.height || window.innerHeight) * 0.01;
    document.documentElement.style.setProperty('--vh', `${h}px`);
  };
  // 최초 페인트 직후 2프레임 뒤 고정
  requestAnimationFrame(() => requestAnimationFrame(setVHOnce));
  // iOS bfcache 복귀 시(뒤로가기 등) 다시 고정
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) setVHOnce();
  });

  // 화면 방향 전환 시에만 재측정 (주소창 개폐로 인한 resize는 무시)
  window.addEventListener('orientationchange', () => {
    setTimeout(setVHOnce, 400); // 회전 애니 끝난 뒤
  });
  // 한 번만 트리거되는 IO 유틸
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

  /* ── HERO 안전 트리거 ─────────────────────────────── */
  const heroTexts = Array.from(document.querySelectorAll('.hero-text-overlay .reveal'));
  const heroPhoneImg = document.querySelector('.hero-phone .phone-image');

  let heroStarted = false;
  const startHero = () => {
    if (heroStarted) return;
    heroStarted = true;

    // 첫 페인트가 끝난 뒤 적용 (double rAF)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroTexts.forEach(el => el.classList.add('show'));
        if (heroPhoneImg && !heroPhoneImg.classList.contains('fadeInUp')) {
          heroPhoneImg.style.animationDelay = '140ms';
          heroPhoneImg.classList.add('fadeInUp');
          heroPhoneImg.addEventListener('animationend', () => {
            heroPhoneImg.style.animationDelay = '';
          }, { once: true });
        }
      });
    });
  };

  // IO: 1%만 보여도 즉시 시작
  ioOnce(heroTexts, { threshold: 0.01 }, () => startHero());
  if (heroPhoneImg) ioOnce([heroPhoneImg], { threshold: 0.01 }, () => startHero());

  // 폴백 1: 모든 리소스 로드 후에도 IO가 못붙으면 강제 시작
  window.addEventListener('load', () => {
    setTimeout(() => { if (!heroStarted) startHero(); }, 150);
  });

  // 폴백 2: bfcache 복귀(탭 전환 복귀) 시 재시작
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !heroStarted) {
      startHero();
    }
  });

  /* ── BANNERS ──────────────────────────────────────── */
  const banners = Array.from(document.querySelectorAll('.banner-section-1, .banner-section-2'));
  banners.forEach(el => el.classList.add('will-reveal'));
  ioOnce(banners, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }, (el) => {
    el.classList.remove('will-reveal');
    el.classList.add('fadeInUp');
  });

  /* ── MAIN 섹션 ─────────────────────────────────────── */
  const mainSections = Array.from(document.querySelectorAll('main section'))
    .filter(sec => sec.querySelector('.phone-image, .phone-mock'));
  mainSections.forEach(sec => sec.classList.add('will-reveal'));
  ioOnce(mainSections, { threshold: 0.55 }, (sec) => {
    sec.classList.remove('will-reveal');
    sec.classList.add('fadeInUp');
  });

  /* ── Reduce-motion 대응 ───────────────────────────── */
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
