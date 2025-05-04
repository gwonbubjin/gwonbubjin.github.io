// 다크모드/라이트모드 전환
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// 로컬 스토리지에서 저장된 테마 가져오기
function getStoredTheme() {
    return localStorage.getItem('theme') || 'dark'; // 기본값은 'dark'
}

// 테마 적용 함수
function applyTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        body.setAttribute('data-theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();
}

// 테마 전환 및 저장 함수
function toggleTheme() {
    const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // 테마 적용
    applyTheme(newTheme);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('theme', newTheme);
}

// 테마 토글 버튼 이벤트 리스너
themeToggle.addEventListener('click', toggleTheme);

// 테마 아이콘 업데이트 함수
function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

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

// 폼 제출 처리 (Formspree 통합)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 전송 버튼 비활성화
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';
        
        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // 성공 메시지 표시
                formStatus.textContent = '메시지가 성공적으로 전송되었습니다. 감사합니다!';
                formStatus.className = 'form-status success';
                contactForm.reset();
                
                // 3초 후 메시지 숨기기
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 3000);
            } else {
                const data = await response.json();
                throw new Error(data.error || '메시지 전송에 실패했습니다.');
            }
        } catch (error) {
            // 오류 메시지 표시
            formStatus.textContent = error.message || '메시지 전송에 실패했습니다. 다시 시도해 주세요.';
            formStatus.className = 'form-status error';
        } finally {
            // 전송 버튼 복원
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

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
    // 저장된 테마 적용
    const savedTheme = getStoredTheme();
    applyTheme(savedTheme);
    
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
