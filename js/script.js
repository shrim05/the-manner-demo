document.addEventListener('DOMContentLoaded', () => {
  // ✅ 히어로 텍스트(기존 유지)
  const heroTexts = document.querySelectorAll('.hero-text-overlay .reveal');
  const heroPhoneImg = document.querySelector('.hero-phone .phone-image');
  const heroObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  heroTexts.forEach(el => heroObserver.observe(el));

  if (heroPhoneImg) {
    const heroPhoneObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!heroPhoneImg.classList.contains('fadeInUp')) {
          heroPhoneImg.style.animationDelay = '140ms';
          heroPhoneImg.classList.add('fadeInUp');
          heroPhoneImg.addEventListener('animationend', () => {
            heroPhoneImg.style.animationDelay = ''; // 깔끔하게 정리
          }, { once: true });
        }
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    heroPhoneObserver.observe(heroPhoneImg);
  }

  // ✅ 섹션 단위 애니메이션 — hero 제외
  const sections = document.querySelectorAll('main section, .banner-section-1, .banner-section-2');
  // 관찰 시작 전에 '초기 숨김 상태' 부여
  sections.forEach(section => {
    if (!section.classList.contains('hero-section')) {
      section.classList.add('will-reveal');
    }
  });

  const sectionObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // 초기 상태 제거 후, 한 번만 애니메이션 적용
      entry.target.classList.remove('will-reveal');
      if (!entry.target.classList.contains('fadeInUp')) {
        entry.target.classList.add('fadeInUp');
      }
      obs.unobserve(entry.target);
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  sections.forEach(section => {
    if (!section.classList.contains('hero-section')) {
      sectionObserver.observe(section);
    }
  });

  // ⛔️ 개별 이미지 관찰(폰/위젯) 제거 — 섹션 단위로만 애니메이션
  // (기존 phoneObserver, widgetObserver 관련 코드 전부 삭제)
});