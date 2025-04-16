// DOM 요소 선택
const themeToggle = document.querySelector('.theme-toggle');
const timerDisplay = document.querySelector('.timer-display');
const timerModeButtons = document.querySelectorAll('.timer-modes button');
const timerControlButtons = document.querySelectorAll('.timer-controls button');
const quoteElement = document.querySelector('.quote');
const quoteAuthorElement = document.querySelector('.quote-author');
const playButton = document.getElementById('play-button');
const volumeControl = document.getElementById('volume-control');
const musicSelector = document.getElementById('music-selector');
const customTimerBtn = document.querySelector('.custom-timer-btn');
const customTimerForm = document.querySelector('.custom-timer-form');
const customMinutesInput = document.getElementById('custom-minutes');
const customNameInput = document.getElementById('custom-label');
const cancelCustomTimeBtn = document.getElementById('cancel-custom-time');
const applyCustomTimeBtn = document.getElementById('apply-custom-time');

// 타이머 관련 변수
let timer = null;
let minutes = 25;
let seconds = 0;
let isRunning = false;
let isPaused = false;
let currentMode = '25분 집중';
let initialMinutes = 25;

// 오디오 관련 변수
const audioFiles = {
  meditation: 'https://creative-sprinkles-98614d.netlify.app/meditation.mp3',
  forest: 'https://creative-sprinkles-98614d.netlify.app/forest.mp3',
  rain: 'https://creative-sprinkles-98614d.netlify.app/rain.mp3'
};
const alarmAudio = new Audio('../assets/audio/alarm.mp3');
let audio = null;
let isPlaying = false;

// 사용자 정의 타이머 관련 변수
let customTimers = [];
let customTimerButtons = [];
let currentCustomIndex = -1;

// 명언 관련 변수
let quoteInterval;

// 명언 목록
const quotes = [
  {
    text: "현재에 머무름으로써 과거의 후회와 미래의 불안에서 벗어날 수 있습니다.",
    author: "틱낫한"
  },
  {
    text: "마음이 고요해지면 세상이 달라 보입니다.",
    author: "틱낫한"
  },
  {
    text: "들이쉬면서 나는 내 몸과 마음을 진정시킨다. 내쉬면서 나는 미소짓는다.",
    author: "틱낫한"
  },
  {
    text: "마음챙김은 깨어있는 것입니다. 그것은 당신이 무엇을 하고 있는지 아는 것입니다.",
    author: "존 카밧진"
  },
  {
    text: "지금 이 순간이 기쁨과 행복으로 가득 차 있습니다. 주의를 기울이면 볼 수 있을 것입니다.",
    author: "틱낫한"
  },
  {
    text: "당신의 가장 큰 적은 당신에게 해를 끼칠 수 없습니다. 당신의 현명하지 못한 생각만큼.",
    author: "부처"
  },
  {
    text: "명상은 마음에 영양을 공급합니다, 음식이 몸에 영양을 공급하는 것처럼.",
    author: "헤드스페이스"
  },
  {
    text: "당신이 할 수 있는 한 최선을 다하세요. 그리고 나머지는 내려놓으세요.",
    author: "부처"
  }
];

// ===== 타이머 관련 함수 =====

// 타이머 설정 함수
function setTimer(totalSeconds) {
  // 진행 중인 타이머가 있으면 정지
  stopTimer();
  
  // 시간 설정
  minutes = Math.floor(totalSeconds / 60);
  seconds = totalSeconds % 60;
  initialMinutes = minutes; // 리셋을 위해 초기값 저장
  
  // 디스플레이 업데이트
  updateTimerDisplay();
  
  // 프로그레스 바 초기화
  resetProgressBar();
}

// 타이머 시작 함수
function startTimer() {
  if (isRunning) return;
  
  isRunning = true;
  isPaused = false;
  
  timer = setInterval(() => {
    // 초가 0이면 분 감소
    if (seconds === 0) {
      if (minutes === 0) {
        // 타이머 종료
        stopTimer();
        playAlarm();
        showNotification('타이머가 종료되었습니다!');
        displayRandomQuote(); // 명언 변경
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    
    // 타이머 디스플레이 업데이트
    updateTimerDisplay();
    
    // 프로그레스 바 업데이트
    updateProgressBar();
  }, 1000);
}

// 타이머 일시정지 함수
function pauseTimer() {
  if (!isRunning) return;
  
  clearInterval(timer);
  timer = null;
  isRunning = false;
  isPaused = true;
}

// 타이머 정지 함수
function stopTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = false;
  isPaused = false;
}

// 타이머 리셋 함수
function resetTimer() {
  // 타이머 정지
  stopTimer();
  
  // 타이머 초기화
  minutes = initialMinutes;
  seconds = 0;
  
  // 표시 업데이트
  updateTimerDisplay();
  
  // 시작 버튼 상태로 되돌리기
  timerControlButtons[0].textContent = '시작';
  timerControlButtons[0].classList.remove('pause');
  timerControlButtons[0].classList.add('start');
  
  // 프로그레스 바 초기화
  resetProgressBar();
}

// 타이머 디스플레이 업데이트 함수
function updateTimerDisplay() {
  const minutesDisplay = minutes < 10 ? `0${minutes}` : minutes;
  const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
  timerDisplay.textContent = `${minutesDisplay}:${secondsDisplay}`;
}

// 프로그레스 바 초기화 함수
function resetProgressBar() {
  document.querySelector('.progress-bar-fill').style.width = '0%';
}

// 프로그레스 바 업데이트 함수
function updateProgressBar() {
  const totalSeconds = initialMinutes * 60;
  const remainingSeconds = minutes * 60 + seconds;
  const progressPercent = 100 - (remainingSeconds / totalSeconds * 100);
  document.querySelector('.progress-bar-fill').style.width = `${progressPercent}%`;
}

// ===== 알림 및 소리 관련 함수 =====

// 알람 재생 함수
function playAlarm() {
  alarmAudio.currentTime = 0;
  alarmAudio.play();
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // 알림 화면에 추가
  document.body.appendChild(notification);
  
  // 애니메이션 효과
  setTimeout(() => notification.classList.add('show'), 10);
  
  // 3초 후 자동 제거
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== 기본 UI 함수 =====

// 버튼 활성화 표시 함수
function highlightActiveButton(buttons, activeIndex) {
  buttons.forEach((btn, idx) => {
    if (idx === activeIndex) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// 랜덤 명언 표시 함수
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // 부드러운 전환을 위한 페이드 효과
  quoteElement.style.opacity = 0;
  quoteAuthorElement.style.opacity = 0;
  
  setTimeout(() => {
    quoteElement.textContent = `"${quote.text}"`;
    quoteAuthorElement.textContent = `- ${quote.author}`;
    
    quoteElement.style.opacity = 1;
    quoteAuthorElement.style.opacity = 1;
  }, 500);
}

// 주기적 명언 업데이트 시작
function startQuoteInterval() {
  // 기존 인터벌 제거
  clearInterval(quoteInterval);
  
  // 5분마다 명언 업데이트
  quoteInterval = setInterval(displayRandomQuote, 5 * 60 * 1000);
}

// ===== 오디오 관련 함수 =====

// 오디오 초기화 함수
function initAudio() {
  // 오디오 객체 생성
  audio = new Audio();
  
  // 음악 선택 이벤트
  musicSelector.addEventListener('change', () => {
    const selectedMusic = musicSelector.value;
    audio.src = audioFiles[selectedMusic];
    
    if (isPlaying) {
      audio.play();
    }
  });
  
  // 재생 버튼 이벤트
  playButton.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playButton.querySelector('i').classList.remove('fa-pause');
      playButton.querySelector('i').classList.add('fa-play');
    } else {
      // 선택된 음악 재생
      const selectedMusic = musicSelector.value;
      if (!audio.src || audio.src.indexOf(selectedMusic) === -1) {
        audio.src = audioFiles[selectedMusic];
      }
      audio.play();
      playButton.querySelector('i').classList.remove('fa-play');
      playButton.querySelector('i').classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
  });
  
  // 볼륨 조절 이벤트
  volumeControl.addEventListener('input', () => {
    audio.volume = volumeControl.value / 100;
  });
  
  // 오디오 반복 재생 설정
  audio.loop = true;

  // 음악 토글 버튼 이벤트
  const musicToggle = document.getElementById('music-toggle');
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      const dropdownContainer = document.querySelector('.music-dropdown-container');
      dropdownContainer.style.opacity = dropdownContainer.style.opacity === '1' ? '0' : '1';
      dropdownContainer.style.pointerEvents = dropdownContainer.style.pointerEvents === 'auto' ? 'none' : 'auto';
      dropdownContainer.style.transform = dropdownContainer.style.transform === 'translateY(0px)' ? 'translateY(-10px)' : 'translateY(0px)';
    });
  }
}

// ===== 테마 관련 함수 =====

// 다크모드 토글 함수
function initThemeToggle() {
  // 기존 상태 확인
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // 초기 상태 설정
  if (isDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-mode');
    if (themeToggle.querySelector('i')) {
      themeToggle.querySelector('i').classList.remove('fa-moon');
      themeToggle.querySelector('i').classList.add('fa-sun');
    }
  }
  
  themeToggle.addEventListener('click', () => {
    // 현재 다크모드 상태 확인
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // 아이콘 변경
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-moon');
      icon.classList.toggle('fa-sun');
    }
    
    // 다크모드 토글
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    }
  });
}

// ===== 사용자 정의 타이머 관련 함수 =====

// 사용자 정의 타이머 저장 함수
function saveCustomTimers() {
  localStorage.setItem('customTimers', JSON.stringify(customTimers));
}

// 사용자 정의 타이머 불러오기 함수
function loadCustomTimers() {
  const savedTimers = localStorage.getItem('customTimers');
  if (savedTimers) {
    customTimers = JSON.parse(savedTimers);
  }
}

// 사용자 정의 타이머 폼 토글 함수
function toggleCustomTimerForm() {
  if (customTimerForm.classList.contains('show')) {
    customTimerForm.classList.remove('show');
  } else {
    customTimerForm.classList.add('show');
    
    // 폼이 열릴 때 입력 필드에 포커스
    customMinutesInput.focus();
    customMinutesInput.select(); // 기존 텍스트 선택
  }
}

// 사용자 정의 타이머 폼 초기화 함수
function resetCustomTimerForm() {
  customMinutesInput.value = '25';
  customNameInput.value = '';
}

// 사용자 정의 타이머 버튼 초기화 함수
function updateCustomTimerButtons() {
  // 이전 버튼 제거
  const customTimerContainer = document.querySelector('.custom-timers-container');
  if (!customTimerContainer) return;
  
  customTimerContainer.innerHTML = '';
  
  // 버튼 추가
  customTimers.forEach((timer, index) => {
    const button = document.createElement('button');
    button.classList.add('timer-button', 'custom-timer-button');
    button.textContent = `${timer.name} (${timer.minutes}분)`;
    button.setAttribute('data-index', index);
    
    button.addEventListener('click', () => {
      // 활성화된 버튼 스타일 변경
      customTimerButtons.forEach(btn => btn.classList.remove('active'));
      timerModeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // 타이머 설정
      currentCustomIndex = index;
      currentMode = timer.name;
      initialMinutes = timer.minutes;
      setTimer(timer.minutes * 60);
      
      // 상태 초기화
      isRunning = false;
      isPaused = false;
      timerControlButtons[0].textContent = '시작';
      timerControlButtons[0].classList.remove('pause');
      timerControlButtons[0].classList.add('start');
    });
    
    customTimerContainer.appendChild(button);
  });
  
  // customTimerButtons 배열 업데이트
  customTimerButtons = [...document.querySelectorAll('.custom-timer-button')];
}

// 사용자 정의 타이머 처리 함수
function processCustomTimer() {
  // 시간 기반으로 자동 이름 생성
  const customMinutes = parseInt(customMinutesInput.value);
  const customName = `${customMinutes}분 타이머`; // 자동으로 이름 생성
  
  // 유효성 검사
  if (isNaN(customMinutes) || customMinutes < 1 || customMinutes > 180) {
    showNotification('1분에서 180분 사이의 시간을 입력해주세요.', 'error');
    return;
  }
  
  // 사용자 정의 타이머 추가 (자동 생성된 이름 사용)
  const newTimer = { name: customName, minutes: customMinutes };
  customTimers.push(newTimer);
  saveCustomTimers();
  
  // 사용자 정의 타이머 버튼 업데이트
  updateCustomTimerButtons();
  
  // 새로 추가된 타이머 선택
  currentCustomIndex = customTimers.length - 1;
  currentMode = customName;
  initialMinutes = customMinutes;
  
  // 타이머 설정
  setTimer(customMinutes * 60);
  
  // 폼 닫기
  toggleCustomTimerForm();
  
  // 상태 초기화
  isRunning = false;
  isPaused = false;
  timerControlButtons[0].textContent = '시작';
  timerControlButtons[0].classList.remove('pause');
  timerControlButtons[0].classList.add('start');
  
  // 알림 표시
  showNotification('새로운 타이머가 생성되었습니다!', 'success');
  
  // 타이머 모드 표시에 이름 적용
  currentMode = customName;
  
  // 타이머 이름을 화면에 표시 (선택적)
  const modeDisplay = document.querySelector('.current-mode') || document.createElement('div');
  if (!document.querySelector('.current-mode')) {
    modeDisplay.className = 'current-mode';
    document.querySelector('.timer-section').insertBefore(modeDisplay, document.querySelector('.timer-display'));
  }
  modeDisplay.textContent = customName;
}

// ===== 초기화 및 이벤트 핸들러 =====

// 타이머 모드 버튼 초기화 함수
function initTimerModeButtons() {
  timerModeButtons.forEach((button, index) => {
    if (index < 3) { // 기본 타이머 버튼들 (25분, 5분, 1분)
      button.addEventListener('click', () => {
        // 활성화된 버튼 스타일 변경
        timerModeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // 현재 사용자 정의 타이머 선택 해제
        currentCustomIndex = -1;
        customTimerButtons.forEach(btn => btn.classList.remove('active'));
        
        // 타이머 리셋 및 모드 변경
        switch(index) {
          case 0: // 25분 집중
            currentMode = '25분 집중';
            initialMinutes = 25;
            setTimer(25 * 60);
            break;
          case 1: // 5분 휴식
            currentMode = '5분 휴식';
            initialMinutes = 5;
            setTimer(5 * 60);
            break;
          case 2: // 1분 집중 (테스트용)
            currentMode = '1분 집중';
            initialMinutes = 1;
            setTimer(60);
            break;
        }
        
        // 상태 초기화
        isRunning = false;
        isPaused = false;
        timerControlButtons[0].textContent = '시작';
        timerControlButtons[0].classList.remove('pause');
        timerControlButtons[0].classList.add('start');
      });
    } else if (index === 3) { // 직접 설정 버튼
      button.addEventListener('click', toggleCustomTimerForm);
    }
  });
}

// 타이머 컨트롤 버튼 초기화 함수
function initTimerControlButtons() {
  // 시작/일시정지 버튼 (첫 번째 버튼)
  const startPauseButton = timerControlButtons[0];
  
  startPauseButton.addEventListener('click', () => {
    if (!isRunning) {
      if (isPaused) {
        // 일시정지 상태에서 다시 시작
        startTimer();
        startPauseButton.textContent = '일시정지';
        startPauseButton.classList.remove('start');
        startPauseButton.classList.add('pause');
      } else {
        // 처음부터 시작
        startTimer();
        startPauseButton.textContent = '일시정지';
        startPauseButton.classList.remove('start');
        startPauseButton.classList.add('pause');
      }
    } else {
      // 실행 중이면 일시정지
      pauseTimer();
      startPauseButton.textContent = '시작';
      startPauseButton.classList.remove('pause');
      startPauseButton.classList.add('start');
    }
  });
  
  // 두 번째 버튼을 리셋 버튼으로 설정
  const resetButton = timerControlButtons[1];
  if (resetButton) {
    resetButton.textContent = '리셋';
    
    // 만약 아이콘이 있다면 리셋 아이콘으로 변경
    const icon = resetButton.querySelector('i');
    if (icon) {
      // 기존 클래스 제거 후 리셋 아이콘 클래스 추가
      icon.className = '';
      icon.classList.add('fas', 'fa-redo-alt');
    }
    
    // 클래스 추가
    resetButton.classList.add('reset-button');
    
    // 리셋 기능 추가 (이벤트 리스너 다시 설정)
    resetButton.addEventListener('click', resetTimer);
  }
  
  // 세 번째 버튼이 있다면 제거
  if (timerControlButtons.length > 2) {
    const thirdButton = timerControlButtons[2];
    if (thirdButton && thirdButton.parentNode) {
      thirdButton.parentNode.removeChild(thirdButton);
    }
  }
}

// 사용자 정의 타이머 컨트롤 초기화 함수
function initCustomTimerControls() {
  // 적용 버튼 이벤트 리스너
  const applyBtn = document.getElementById('apply-custom-time');
  if (applyBtn) {
    applyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      processCustomTimer();
    });
  }
  
  // 취소 버튼 이벤트 리스너
  cancelCustomTimeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleCustomTimerForm();
    resetCustomTimerForm();
  });
}

// 페이지 초기화 함수
function initializePage() {
  // 저장된 타이머 불러오기
  loadCustomTimers();
  
  // 타이머 모드 버튼 초기화
  initTimerModeButtons();
  
  // 타이머 컨트롤 버튼 초기화
  initTimerControlButtons();
  
  // 사용자 정의 타이머 컨트롤 초기화
  initCustomTimerControls();
  
  // 사용자 정의 타이머 버튼 생성
  updateCustomTimerButtons();
  
  // 오디오 초기화
  initAudio();
  
  // 다크모드 토글 초기화
  initThemeToggle();
  
  // 랜덤 명언 표시
  displayRandomQuote();
  
  // 명언 주기적 업데이트 시작
  startQuoteInterval();
  
  // 기본 타이머 설정 (25분)
  setTimer(25 * 60);
  
  // 첫 번째 버튼 활성화 (25분 집중)
  timerModeButtons[0].classList.add('active');
}

// 페이지 로드 시 초기화 함수 호출
document.addEventListener('DOMContentLoaded', initializePage);
