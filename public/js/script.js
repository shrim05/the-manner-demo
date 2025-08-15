// public/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // 모바일 메뉴 토글 기능
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // 메뉴 아이템 클릭 시 메뉴 닫기 (모바일)
        const mobileMenuItems = mobileMenu.querySelectorAll('a, button');
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 부드러운 스크롤 기능 (네비게이션 링크 클릭 시)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 스크롤 애니메이션 (예시: 특징 섹션 요소들)
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // 뷰포트의 10%가 보이면 실행
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 특징 카드에 애니메이션 클래스 추가
                    const featureCards = entry.target.querySelectorAll('.transform.hover\\:scale-105');
                    featureCards.forEach((card, index) => {
                        // 각 카드에 순차적으로 애니메이션 적용
                        card.style.animationDelay = `${index * 0.1}s`;
                        card.classList.add('animate-fade-in-up');
                    });
                    observer.unobserve(entry.target); // 한 번만 실행되도록 관찰 중지
                }
            });
        }, observerOptions);

        observer.observe(featuresSection);
    }
});

