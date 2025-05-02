// 다국어 지원
const translations = {
    ko: {
        home: '홈',
        about: '소개',
        skills: '기술',
        projects: '프로젝트',
        libraries: '라이브러리',
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
        libraries: 'Libraries',
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
        libraries: 'ライブラリ',
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

// 문서 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 홈 버튼 클릭 가능하도록 설정
    const homeButtons = document.querySelectorAll('.home-buttons a');
    homeButtons.forEach(button => {
        button.style.position = 'relative';
        button.style.zIndex = '100';
        button.style.pointerEvents = 'auto';
    });
    
    // 모든 게임 보기 기능
    const showAllGamesBtn = document.getElementById('show-all-games-btn');
    const gamesContainer = document.querySelector('.games-container');
    
    if (showAllGamesBtn && gamesContainer) {
        // 초기 상태 설정
        const hiddenRows = gamesContainer.querySelector('.hidden-rows');
        
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
    
    // 코드 디스플레이 하이라이팅
    const codeBlock = document.querySelector('.code-display code');
    if (codeBlock) {
        // 키워드 강조 처리
        const keywords = ['class', 'constructor', 'this', 'return', 'new', 'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'try', 'catch'];
        let codeContent = codeBlock.innerHTML;
        
        // 키워드 강조
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            codeContent = codeContent.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // 문자열 강조
        codeContent = codeContent.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
        
        // 숫자 강조
        codeContent = codeContent.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
        
        codeBlock.innerHTML = codeContent;
    }
    
    // 라이브러리 미리보기 효과 (이미지에 대한 추가 효과가 필요하면 여기에 코드 추가)
    const previewImages = document.querySelectorAll('.preview-image');
    if (previewImages.length > 0) {
        previewImages.forEach(img => {
            // 이미지 로드 오류 시 대체 텍스트 표시
            img.addEventListener('error', function() {
                const parent = this.parentElement;
                parent.innerHTML = `
                    <div style="padding: 2rem; text-align: center;">
                        <p>이미지를 불러올 수 없습니다</p>
                    </div>
                `;
            });
        });
    }
}); 
