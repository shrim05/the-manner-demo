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
        // heroTexts 각각 딜레이
        heroTexts.forEach((el, idx) => {
          el.style.transitionDelay = `${idx * 400}ms`; // 순차 등장
          el.classList.add('show');
        });
        if (heroPhoneImg && !heroPhoneImg.classList.contains('fadeInUp')) {
          heroPhoneImg.style.animationDelay = '1500ms';
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

  /* ── MAIN 섹션: 섹션 단위 등장 ───────────────── */
  /* ── LIST → GRID 순차등장 섹션(자동 감지) ────────────────── */
  // ul.figma-list 와 .stagger-grid를 동시에 가지는 섹션 = 대상
  const stagedSections = Array.from(document.querySelectorAll('main section'))
    .filter(sec => sec.querySelector('ul.figma-list .reveal') && sec.querySelector('.stagger-grid'));

  // GRID는 먼저 숨겨두기 (섹션 통째 애니와 분리)
  stagedSections.forEach(sec => {
    const grid = sec.querySelector('.stagger-grid');
    if (grid && !grid.classList.contains('will-reveal')) grid.classList.add('will-reveal');
  });

  ioOnce(stagedSections, { threshold: 0.25 }, (sec) => {
    const startList = () => {
      const liEls = Array.from(sec.querySelectorAll('ul.figma-list .reveal'));
      // 요소의 `offsetHeight` 속성을 읽어 강제로 리플로우 발생
      Promise.all([document.fonts.ready])
        .then(() => {
          liEls.forEach(el => {
            el.offsetHeight;
            el.classList.add('show');
          });
          // 이하 GRID 타이밍 계산은 기존 로직 유지
          const maxDelay = liEls.reduce((m, el) => {
            const raw = getComputedStyle(el).getPropertyValue('--delay') || '0ms';
            const ms = parseFloat(raw);
            return Math.max(m, isNaN(ms) ? 0 : ms);
          }, 0);
          const EXTRA = 300;
          const WAIT = Math.min(900, maxDelay + EXTRA);
          const grid = sec.querySelector('.stagger-grid');
          if (grid) {
            setTimeout(() => {
              grid.classList.remove('will-reveal');
              grid.classList.add('fadeInUp');
            }, WAIT);
          }
        })
        .catch(err => {
          // 폰트 로딩 실패 시에도 애니메이션을 시작하여 사용자 경험을 해치지 않음
          console.error("Font loading failed, proceeding with animation.", err);
          liEls.forEach(el => el.classList.add('show'));
          const grid = sec.querySelector('.stagger-grid');
          if (grid) {
            grid.classList.remove('will-reveal');
            grid.classList.add('fadeInUp');
          }
        })
    };
  });
  /* ── MAIN 섹션(기존 전체 섹션 등장)에서 staged 제외 ───────── */
  const mainSections = Array.from(document.querySelectorAll('main section'))
    .filter(sec => sec.querySelector('.phone-image, .phone-mock') && !stagedSections.includes(sec));
  mainSections.forEach(sec => sec.classList.add('will-reveal'));
  ioOnce(mainSections, { threshold: 0.55 }, (sec) => {
    sec.classList.remove('will-reveal');
    sec.classList.add('fadeInUp');
  });

  /* ── Reduce-motion 대응 ───────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.will-reveal').forEach(el => el.classList.remove('will-reveal'));
    // hero
    document.querySelectorAll('.hero-text-overlay .reveal').forEach(el => el.classList.add('show'));
    const heroPhoneImg = document.querySelector('.hero-phone .phone-image');
    if (heroPhoneImg) {
      heroPhoneImg.classList.remove('fadeInUp');
      heroPhoneImg.style.opacity = 1;
      heroPhoneImg.style.transform = 'none';
    }
    // staged grid 즉시 표시
    stagedSections.forEach(sec => {
      const grid = sec.querySelector('.stagger-grid');
      if (grid) {
        grid.classList.remove('fadeInUp');
        grid.style.opacity = 1;
        grid.style.transform = 'none';
      }
    });
  }
});
