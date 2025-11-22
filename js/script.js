// =========================================
// 1. 테마(Dark/Light) 관리
// =========================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function getStoredTheme() {
    return localStorage.getItem('theme') || 'dark';
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function applyTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        body.setAttribute('data-theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 테마 변경 시 파티클 색상 업데이트를 위해 리로드 (선택사항)
    if(window.pJSDom && window.pJSDom.length > 0) {
        // 필요시 여기에 파티클 리셋 로직 추가 가능
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// =========================================
// 2. 스크롤 이벤트 (네비게이션 & 진행바)
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

window.addEventListener('scroll', () => {
    // A. 네비게이션 바 배경 변경
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = body.classList.contains('light-mode') ? 'rgba(67, 97, 238, 0.95)' : 'rgba(10, 25, 47, 0.95)';
        } else {
            navbar.style.background = 'transparent';
        }
    }

    // B. [복구됨] 상단 스크롤 진행바 계산
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
});

// =========================================
// 3. 메인 로직 (효과 포함)
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = getStoredTheme();
    applyTheme(savedTheme);

    // [효과 1] 파티클 배경 실행
    if (document.getElementById('particles-js')) {
        let particleColor = savedTheme === 'light' ? "#0066cc" : "#64ffda";
        
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": particleColor },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": particleColor,
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }

    // [효과 2] 타이핑 효과
    const textElement = document.querySelector('.subtitle');
    const texts = ["데이터를 다루는 웹 & 모바일 개발자", "문제를 집요하게 해결하는 개발자", "사용자 경험을 중요시하는 개발자"];
    
    if(textElement) {
        textElement.textContent = ''; 
        textElement.classList.add('typing-cursor');
        let count = 0;
        let index = 0;
        let currentText = '';
        let letter = '';

        (function type() {
            if (count === texts.length) { count = 0; }
            currentText = texts[count];
            letter = currentText.slice(0, ++index);
            textElement.textContent = letter;

            if (letter.length === currentText.length) {
                count++;
                index = 0;
                setTimeout(type, 2000);
            } else {
                setTimeout(type, 100);
            }
        })();
    }

    // [효과 3] 스크롤 등장 효과
    const reveals = document.querySelectorAll('.section, .project-card, .skill-item, .cert-card, .timeline-item, .ts-card');
    reveals.forEach((element) => element.classList.add('reveal'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;
        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 

    // [효과 4] 3D 틸트 효과
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".project-card, .cert-card, .ts-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
            scale: 1.05
        });
    }

    // [기능] 홈 버튼 z-index 수정
    const homeButtons = document.querySelectorAll('.home-buttons a');
    homeButtons.forEach(button => {
        button.style.position = 'relative';
        button.style.zIndex = '100';
        button.style.pointerEvents = 'auto';
    });

    // [기능] 게임 더보기
    const showAllGamesBtn = document.getElementById('show-all-games-btn');
    const gamesContainer = document.querySelector('.games-container');
    if (showAllGamesBtn && gamesContainer) {
        showAllGamesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            gamesContainer.classList.toggle('show-all-games');
            if (gamesContainer.classList.contains('show-all-games')) {
                showAllGamesBtn.textContent = '접기';
            } else {
                showAllGamesBtn.textContent = '모든 게임 보기';
            }
        });
    }
    
    // [기능] 코드 하이라이팅
    const codeBlock = document.querySelector('.code-display code');
    if (codeBlock) {
        const keywords = ['class', 'constructor', 'this', 'return', 'new', 'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'try', 'catch', 'import', 'from', 'def'];
        let codeContent = codeBlock.innerHTML;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            codeContent = codeContent.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        codeContent = codeContent.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
        codeContent = codeContent.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
        codeBlock.innerHTML = codeContent;
    }
});

// =========================================
// 4. 폼 제출 (Formspree)
// =========================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';
        
        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                formStatus.textContent = '메시지가 성공적으로 전송되었습니다!';
                formStatus.className = 'form-status success';
                contactForm.reset();
                setTimeout(() => { formStatus.style.display = 'none'; }, 3000);
            } else {
                const data = await response.json();
                throw new Error(data.error || '메시지 전송 실패');
            }
        } catch (error) {
            formStatus.textContent = error.message || '전송 실패. 다시 시도해주세요.';
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

/* === [필수] 스크롤 진행바 계산 로직 === */
window.addEventListener('scroll', function() {
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        // 전체 스크롤 가능한 높이
        const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        // 현재 스크롤 위치
        const scrollCurrent = document.documentElement.scrollTop || document.body.scrollTop;
        
        // 퍼센트 계산
        const scrollPercentage = (scrollCurrent / scrollTotal) * 100;
        
        // CSS width 업데이트
        progressBar.style.width = scrollPercentage + "%";
    }
});
