// DOM 요소 선택
const siteInput = document.getElementById('siteInput');
const addSiteBtn = document.getElementById('addSiteBtn');
const siteList = document.getElementById('siteList');
const emptyList = document.getElementById('emptyList');
const toggleFocus = document.getElementById('toggleFocus');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

// 초기 상태 (빈 배열, 집중모드 비활성화)
let blockedSites = [];
let focusMode = false;

// 페이지 로드 시 데이터 가져오기
document.addEventListener('DOMContentLoaded', () => {
  loadBlockedSites();
  loadFocusMode();
});

// 블록 사이트 목록 로드
function loadBlockedSites() {
  chrome.storage.local.get(['blockedSites'], (result) => {
    if (result.blockedSites && Array.isArray(result.blockedSites)) {
      blockedSites = result.blockedSites;
      renderSiteList();
    }
  });
}

// 집중모드 상태 로드
function loadFocusMode() {
  chrome.storage.local.get(['focusMode'], (result) => {
    if (typeof result.focusMode === 'boolean') {
      focusMode = result.focusMode;
      updateFocusModeUI();
      
      // 토글 스위치 상태 업데이트
      toggleFocus.checked = focusMode;
    }
  });
}

// 사이트 목록 렌더링
function renderSiteList() {
  // 목록 초기화
  siteList.innerHTML = '';
  
  // 빈 목록 메시지 토글
  if (blockedSites.length === 0) {
    emptyList.style.display = 'block';
  } else {
    emptyList.style.display = 'none';
    
    // 사이트 목록 렌더링
    blockedSites.forEach((site, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'site-item';
      
      const siteText = document.createElement('span');
      siteText.textContent = site;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.textContent = '삭제';
      deleteBtn.dataset.index = index;
      deleteBtn.addEventListener('click', deleteSite);
      
      listItem.appendChild(siteText);
      listItem.appendChild(deleteBtn);
      siteList.appendChild(listItem);
    });
  }
}

// URL을 정리하는 함수 (프로토콜, www, 쿼리 파라미터 등 제거)
function cleanUrl(url) {
  // 입력이 URL 형식인 경우 처리
  let domain = url.trim().toLowerCase();
  
  try {
    // 완전한 URL인지 확인
    if (url.includes('://') || url.includes('www.')) {
      // URL 객체로 변환 가능한 경우 (프로토콜 추가)
      const urlWithProtocol = url.includes('://') ? url : `https://${url}`;
      const urlObj = new URL(urlWithProtocol);
      domain = urlObj.hostname.replace(/^www\./, '').toLowerCase();
    } else {
      // URL 형식이 아닌 경우 그대로 사용하되 선행/후행 공백 제거 및 소문자 변환
      domain = domain.replace(/^www\./, '');
    }
  } catch (e) {
    // URL 객체 생성 실패 시 입력값 그대로 사용 (잘못된 형식 무시)
    console.log('URL 파싱 오류, 입력값 그대로 사용:', e);
  }
  
  return domain;
}

// 중복 확인 함수 (대소문자 무시, 부분 문자열 확인)
function isDuplicate(newSite) {
  const cleanedNewSite = cleanUrl(newSite);
  
  return blockedSites.some(existingSite => {
    const cleanedExistingSite = cleanUrl(existingSite);
    return cleanedNewSite === cleanedExistingSite ||
           cleanedNewSite.includes(cleanedExistingSite) || 
           cleanedExistingSite.includes(cleanedNewSite);
  });
}

// 사이트 추가 핸들러
function addSite() {
  const site = siteInput.value.trim();
  
  // 입력 유효성 검사
  if (!site) {
    return alert('차단할 사이트를 입력해주세요.');
  }
  
  // 중복 검사 (강화된 로직)
  if (isDuplicate(site)) {
    return alert('이미 차단 목록에 있는 사이트입니다.');
  }
  
  // 사이트 도메인 형식 정리
  const formattedSite = cleanUrl(site);
  
  // 목록에 추가
  blockedSites.push(formattedSite);
  
  // 스토리지에 저장
  saveSites();
  
  // 입력 필드 초기화
  siteInput.value = '';
  
  // 목록 다시 렌더링
  renderSiteList();
}

// 사이트 삭제 핸들러
function deleteSite(event) {
  const index = parseInt(event.target.dataset.index);
  
  if (index >= 0 && index < blockedSites.length) {
    blockedSites.splice(index, 1);
    saveSites();
    renderSiteList();
  }
}

// 차단 사이트 목록 저장
function saveSites() {
  chrome.storage.local.set({ blockedSites });
}

// 집중모드 토글 핸들러
function toggleFocusMode() {
  focusMode = toggleFocus.checked;
  
  // 스토리지에 저장
  chrome.storage.local.set({ focusMode });
  
  // UI 업데이트
  updateFocusModeUI();
}

// 집중모드 UI 업데이트
function updateFocusModeUI() {
  if (focusMode) {
    statusIndicator.parentElement.className = 'status status-on';
    statusText.textContent = 'ON';
  } else {
    statusIndicator.parentElement.className = 'status status-off';
    statusText.textContent = 'OFF';
  }
}

// 엔터 키로 사이트 추가
siteInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addSite();
  }
});

// 이벤트 리스너 등록
addSiteBtn.addEventListener('click', addSite);
toggleFocus.addEventListener('change', toggleFocusMode); 