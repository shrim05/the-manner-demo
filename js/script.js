document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('main section, .banner-section-1, .banner-section-2');
  const phoneImages = document.querySelectorAll('.phone-image');
  const widgetImages = document.querySelectorAll('._widget_data[data-widget-type="image"]');

  // ✅ 폰 전용
  const phoneObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fadeInUp');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -20% 0px', threshold: 0.1 });
  phoneImages.forEach(img => phoneObserver.observe(img));

  // ✅ 일반 이미지
  const widgetObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fadeInUp');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  widgetImages.forEach(w => widgetObserver.observe(w));

  // ✅ 섹션 reveal
  const sectionObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up','opacity-100','translate-y-0');
        entry.target.classList.remove('opacity-0','translate-y-10');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  sections.forEach(section => {
    if (!section.classList.contains('hero-section')) {
      section.classList.add('opacity-0','translate-y-10','transition-all','duration-1000','ease-out');
      sectionObserver.observe(section);
    }
  });

  // ✅ 히어로 텍스트: 처음엔 숨겨두고(HTML/CSS에서), viewport 진입 시 순차 등장
  const heroTexts = document.querySelectorAll('.hero-text-overlay .reveal');
  const heroObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show'); // CSS에서 reveal.show → 보이게
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 }); // 히어로 영역 25% 보이면 트리거

  heroTexts.forEach(el => heroObserver.observe(el));
});
