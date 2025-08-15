
document.addEventListener('DOMContentLoaded', () => {
    // 섹션 애니메이션을 위한 Intersection Observer 설정
    const sections = document.querySelectorAll('main section, .banner-section-1, .banner-section-2');

    const observerOptions = {
        root: null, // 뷰포트를 루트로 사용
        rootMargin: '0px',
        threshold: 0.15 // 섹션의 15%가 보이면 콜백 실행
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 섹션이 뷰포트에 들어왔을 때 애니메이션 클래스 추가
                entry.target.classList.add('animate-fade-in-up', 'opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                // hero-section 내부의 요소들은 별도의 animation-delay를 가질 수 있도록 animate-fade-in-up은 여기서 추가하지 않습니다.
                // 대신 transition-all을 통해 부드러운 전환을 유도합니다.
                observer.unobserve(entry.target); // 한 번만 애니메이션을 실행하도록 관찰 중지
            }
        });
    }, observerOptions);

    // 각 섹션에 초기 애니메이션 클래스를 추가하고 관찰 시작
    sections.forEach(section => {
        // 이미 .hero-section에 있는 애니메이션 클래스와 텍스트 애니메이션을 제외
        if (!section.classList.contains('hero-section')) {
            section.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000', 'ease-out');
            sectionObserver.observe(section);
        }
    });

    // 각 요소를 순회하며 초기 애니메이션 클래스를 추가하고 관찰 시작
    sectionsToAnimate.forEach(element => {
        // .hero-section 자체와 그 안의 직접적인 텍스트/버튼은 이미 HTML에서 처리되므로 제외
        if (!element.classList.contains('hero-section') &&
            !element.classList.contains('hero-text-overlay') && // hero-text-overlay는 HTML에서 처리됨
            !element.classList.contains('hero-button')) { // hero-button은 HTML에서 처리됨
            element.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000', 'ease-out');
            sectionObserver.observe(element);
        }
    });

    // hero-section의 텍스트와 버튼에 대한 초기 애니메이션 설정 (HTML에 이미 적용되어 있음)
    // 이 부분은 HTML에서 'animate-fade-in-up' 및 'delay-XXX' 클래스로 처리되었습니다.
    // CSS에 다음 클래스를 추가하여 애니메이션을 정의해야 합니다.
    /*
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
        opacity: 0; // 초기 상태를 숨김
    }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    */
});