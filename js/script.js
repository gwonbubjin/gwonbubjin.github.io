// 다국어 지원
const translations = {
    ko: {
        home: '홈',
        about: '소개',
        skills: '기술',
        projects: '프로젝트',
        games: '게임',
        contact: '연락처',
        name: '이름',
        email: '이메일',
        message: '메시지',
        send: '보내기'
    },
    en: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        projects: 'Projects',
        games: 'Games',
        contact: 'Contact',
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send'
    },
    ja: {
        home: 'ホーム',
        about: '自己紹介',
        skills: 'スキル',
        projects: 'プロジェクト',
        games: 'ゲーム',
        contact: 'お問い合わせ',
        name: '名前',
        email: 'メール',
        message: 'メッセージ',
        send: '送信'
    }
};

// 다크모드/라이트모드 전환
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// 언어 변경
const languageSelect = document.getElementById('language-select');
const navLinks = document.querySelectorAll('.nav-links a');

languageSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    document.documentElement.lang = lang;
    
    // 네비게이션 링크 텍스트 변경
    navLinks.forEach(link => {
        const section = link.getAttribute('href').substring(1);
        link.textContent = translations[lang][section];
    });

    // 폼 레이블 변경
    document.querySelector('label[for="name"]').textContent = translations[lang].name;
    document.querySelector('label[for="email"]').textContent = translations[lang].email;
    document.querySelector('label[for="message"]').textContent = translations[lang].message;
    document.querySelector('#contact-form button').textContent = translations[lang].send;
});

// 스무스 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 폼 제출 처리
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('메시지가 전송되었습니다!');
    contactForm.reset();
});

// 스크롤 시 네비게이션 바 스타일 변경
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(36, 36, 36, 0.9)';
    } else {
        navbar.style.background = 'var(--secondary-color)';
    }
}); 
