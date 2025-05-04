// 확장 프로그램 아이콘 클릭 시 사이드패널을 여는 이벤트 리스너
chrome.action.onClicked.addListener(async (tab) => {
  // 사이드패널 열기
  await chrome.sidePanel.open({ tabId: tab.id });
  
  // 사이드패널 포커스 설정
  await chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel.html',
    enabled: true
  });
});

// 탭 이동 이벤트 리스너
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 페이지가 로드되었을 때만 실행
  if (changeInfo.status === 'loading' && tab.url) {
    checkBlockedSite(tabId, tab.url);
  }
});

// 새 탭 생성 이벤트 리스너
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url) {
    checkBlockedSite(tab.id, tab.url);
  }
});

// 차단된 사이트인지 확인하는 함수
async function checkBlockedSite(tabId, url) {
  try {
    // 현재 집중모드 상태와 차단된 사이트 목록 가져오기
    const { focusMode, blockedSites } = await chrome.storage.local.get(['focusMode', 'blockedSites']);
    
    // 집중모드가 꺼져있으면 아무것도 하지 않음
    if (!focusMode) return;
    
    // 차단된 사이트 목록이 없으면 아무것도 하지 않음
    if (!blockedSites || !Array.isArray(blockedSites) || blockedSites.length === 0) return;
    
    // URL 객체 생성 (유효한 URL인지 확인)
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      // 유효하지 않은 URL이면 무시
      return;
    }
    
    // 전체 URL을 소문자로 변환 (대소문자 구분 없이 비교)
    const fullUrl = url.toLowerCase();
    
    // 차단 목록과 비교 - 강화된 로직
    const isBlocked = blockedSites.some(site => {
      // 사이트 도메인을 소문자로 변환하여 비교
      const siteLower = site.toLowerCase();
      
      // 1. URL에 도메인이 포함되어 있는지 확인
      // 2. URL의 호스트명에 도메인이 포함되어 있는지 확인
      // 3. 호스트명의 www. 버전도 확인
      return fullUrl.includes(siteLower) || 
             urlObj.hostname.toLowerCase().includes(siteLower) || 
             urlObj.hostname.toLowerCase().replace(/^www\./, '').includes(siteLower);
    });
    
    // 차단된 사이트면 content script로 메시지 전달
    if (isBlocked) {
      chrome.tabs.sendMessage(tabId, { action: 'blockSite' })
        .catch(() => {
          // 첫 실행 시 content script가 아직 로드되지 않았을 수 있으므로
          // 특별한 처리를 한 후 content script를 실행
          injectContentScript(tabId);
        });
    }
  } catch (error) {
    console.error('차단 사이트 확인 중 오류 발생:', error);
  }
}

// Content Script 동적 삽입
async function injectContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    
    // 다시 메시지 전송 시도
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { action: 'blockSite' });
    }, 100);
  } catch (error) {
    console.error('Content script 삽입 중 오류 발생:', error);
  }
} 