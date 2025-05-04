// 메시지 수신 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'blockSite') {
    showBlockPage();
  }
  
  // 비동기 응답을 위해 true 반환
  return true;
});

// 페이지 로드 시 즉시 실행 - URL 체크 자체 구현
async function checkCurrentUrl() {
  try {
    // 현재 집중모드 상태와 차단된 사이트 목록 가져오기
    const { focusMode, blockedSites } = await chrome.storage.local.get(['focusMode', 'blockedSites']);
    
    // 집중모드가 꺼져있으면 아무것도 하지 않음
    if (!focusMode) return;
    
    // 차단된 사이트 목록이 없으면 아무것도 하지 않음
    if (!blockedSites || !Array.isArray(blockedSites) || blockedSites.length === 0) return;
    
    // 현재 URL (대소문자 구분 없이 확인하기 위해 소문자로 변환)
    const currentUrl = window.location.href.toLowerCase();
    const currentHostname = window.location.hostname.toLowerCase();
    
    // 차단 목록과 비교 - 강화된 로직
    const isBlocked = blockedSites.some(site => {
      // 사이트 도메인을 소문자로 변환
      const siteLower = site.toLowerCase();
      
      // 1. 전체 URL에 도메인이 포함되어 있는지 확인
      // 2. 호스트명에 도메인이 포함되어 있는지 확인
      // 3. www. 제거 후 호스트명에 도메인이 포함되어 있는지 확인
      return currentUrl.includes(siteLower) || 
             currentHostname.includes(siteLower) || 
             currentHostname.replace(/^www\./, '').includes(siteLower);
    });
    
    // 차단된 사이트면 차단 화면 표시
    if (isBlocked) {
      showBlockPage();
    }
  } catch (error) {
    console.error('현재 URL 확인 중 오류 발생:', error);
  }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', checkCurrentUrl);

// 페이지가 로드되기 전에도 빠르게 확인 (더 나은 차단 효과)
if (document.readyState === 'loading') {
  checkCurrentUrl();
} else {
  // 이미 DOM이 로드된 경우 즉시 실행
  checkCurrentUrl();
}

// 차단 페이지 표시 함수
function showBlockPage() {
  // 이미 차단 화면이 표시되었는지 확인 (중복 실행 방지)
  if (document.getElementById('focus-blocker-overlay')) {
    return;
  }
  
  // 페이지의 콘텐츠 가리기
  document.body.style.display = 'none';
  
  // 차단 오버레이 생성
  const overlay = document.createElement('div');
  overlay.id = 'focus-blocker-overlay';
  
  // 차단 화면 내용
  overlay.innerHTML = `
    <div class="focus-blocker-content">
      <div class="focus-blocker-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m1-4a2 2 0 100-4 2 2 0 000 4z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12a8 8 0 01-8 8a8 8 0 01-8-8a8 8 0 018-8a8 8 0 018 8z" />
        </svg>
      </div>
      <h1>집중 모드가 활성화되었습니다</h1>
      <p>현재 사이트는 집중 모드에 의해 차단되었습니다.</p>
      <p class="focus-blocker-motivation">지금은 자신의 목표에 집중할 시간입니다!</p>
      <div class="focus-blocker-actions">
        <button id="focus-blocker-back" class="focus-blocker-button">이전 페이지로 돌아가기</button>
        <button id="focus-blocker-settings" class="focus-blocker-button focus-blocker-secondary">설정 열기</button>
      </div>
    </div>
  `;
  
  // 차단 화면 스타일
  const style = document.createElement('style');
  style.textContent = `
    #focus-blocker-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      color: white;
      animation: focusBlockerFadeIn 0.5s ease forwards;
    }
    
    @keyframes focusBlockerFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .focus-blocker-content {
      text-align: center;
      padding: 2rem;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      max-width: 600px;
      width: 90%;
      animation: focusBlockerSlideUp 0.5s 0.2s ease backwards;
    }
    
    @keyframes focusBlockerSlideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .focus-blocker-icon {
      margin-bottom: 1.5rem;
      animation: focusBlockerPulse 2s infinite;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    @keyframes focusBlockerPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    .focus-blocker-icon svg {
      color: white;
    }
    
    .focus-blocker-content h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    .focus-blocker-content p {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      line-height: 1.5;
      opacity: 0.9;
    }
    
    .focus-blocker-motivation {
      font-size: 1.3rem !important;
      font-weight: 500;
      margin: 1.5rem 0 !important;
      color: #ffd166;
    }
    
    .focus-blocker-actions {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }
    
    .focus-blocker-button {
      padding: 0.8rem 1.5rem;
      border-radius: 50px;
      font-weight: 500;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      min-width: 240px;
    }
    
    .focus-blocker-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    #focus-blocker-back {
      background-color: white;
      color: #6246ea;
    }
    
    .focus-blocker-secondary {
      background-color: transparent;
      color: white;
      border: 2px solid white;
    }
    
    /* 반응형 스타일 */
    @media (max-width: 768px) {
      .focus-blocker-content h1 {
        font-size: 1.8rem;
      }
      
      .focus-blocker-content p {
        font-size: 1rem;
      }
      
      .focus-blocker-motivation {
        font-size: 1.1rem !important;
      }
      
      .focus-blocker-button {
        font-size: 0.9rem;
        padding: 0.7rem 1.3rem;
      }
    }
  `;
  
  // 페이지에 차단 화면 삽입
  document.documentElement.appendChild(style);
  document.documentElement.appendChild(overlay);
  
  // 이벤트 리스너 추가
  document.getElementById('focus-blocker-back').addEventListener('click', () => {
    history.back();
  });
  
  document.getElementById('focus-blocker-settings').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openOptions' });
  });
} 