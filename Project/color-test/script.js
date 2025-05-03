// DOM 요소 가져오기
const gameContainer = document.getElementById('game-container');
const levelDisplay = document.getElementById('level-display');
const timerDisplay = document.getElementById('timer-display');
const messageArea = document.getElementById('message-area');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const gameOverContainer = document.getElementById('game-over-container');
const gameOverTitle = document.getElementById('game-over-title');
const gameOverReason = document.getElementById('game-over-reason');
const reachedLevelSpan = document.getElementById('reached-level');
const retryYesButton = document.getElementById('retry-yes');
const retryNoButton = document.getElementById('retry-no');

// 게임 상수
const MAX_LEVEL = 100; // 최대 레벨
const TIME_LIMIT = 10; // 기본 제한 시간(초)

// 게임 변수
let currentLevel = 1;
let isGameStarted = false;
let timerId = null;
let timeLeft = TIME_LIMIT;

// 이벤트 리스너 설정
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
retryYesButton.addEventListener('click', resetGame);
retryNoButton.addEventListener('click', endGame);

// 게임 시작 함수
function startGame() {
    isGameStarted = true;
    startButton.classList.add('hidden');
    resetButton.classList.remove('hidden');
    messageArea.classList.add('hidden');
    gameOverContainer.classList.add('hidden');
    
    generateLevel(currentLevel);
    startTimer();
}

// 게임 초기화 함수
function resetGame() {
    currentLevel = 1;
    updateLevelDisplay();
    clearTimer();
    gameOverContainer.classList.add('hidden');
    startGame();
}

// 게임 종료 함수
function endGame() {
    isGameStarted = false;
    gameOverContainer.classList.add('hidden');
    startButton.classList.remove('hidden');
    resetButton.classList.add('hidden');
    gameContainer.innerHTML = '';
    clearTimer();
}

// 타이머 시작 함수
function startTimer() {
    clearTimer(); // 기존 타이머 제거
    
    timeLeft = TIME_LIMIT;
    updateTimerDisplay();
    
    timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        // 3초 이하일 때 경고 스타일 추가
        if (timeLeft <= 3) {
            timerDisplay.classList.add('warning');
        } else {
            timerDisplay.classList.remove('warning');
        }
        
        // 시간 초과 시 게임 오버
        if (timeLeft <= 0) {
            clearTimer();
            gameOver('timeout');
        }
    }, 1000);
}

// 타이머 초기화 함수
function clearTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    timerDisplay.classList.remove('warning');
}

// 타이머 표시 업데이트 함수
function updateTimerDisplay() {
    timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
}

// 게임 오버 함수
function gameOver(reason) {
    isGameStarted = false;
    clearTimer();
    
    // 게임 오버 이유에 따른 메시지 설정
    if (reason === 'timeout') {
        gameOverTitle.textContent = '⏰ 시간 초과!';
        gameOverReason.textContent = '제한 시간 내에 정답을 찾지 못했습니다.';
    }
    
    // 도달한 레벨 표시
    reachedLevelSpan.textContent = currentLevel;
    
    // 게임 오버 화면 표시
    gameOverContainer.classList.remove('hidden');
}

// 레벨 생성 함수
function generateLevel(level) {
    // 게임 컨테이너 초기화
    gameContainer.innerHTML = '';
    updateLevelDisplay();
    
    // 레벨에 따라 그리드 크기 결정
    const gridSize = getGridSizeByLevel(level);
    const totalBlocks = gridSize * gridSize;
    
    // 블록 크기 계산 (최대 너비 500px 기준)
    const blockSize = Math.floor(500 / gridSize) - 4; // 마진 고려하여 계산
    
    // 색상 생성
    const colorDifference = getColorDifferenceByLevel(level);
    const baseColor = getRandomRGBColor();
    const differentColor = getSlightlyDifferentColor(baseColor, colorDifference);
    
    // 정답 위치 랜덤 선택
    const correctBlockIndex = Math.floor(Math.random() * totalBlocks);
    
    // 블록 생성
    for (let i = 0; i < totalBlocks; i++) {
        const block = document.createElement('div');
        block.className = 'color-block';
        block.style.width = `${blockSize}px`;
        block.style.height = `${blockSize}px`;
        
        // 정답 블록이면 다른 색상 부여, 아니면 기본 색상
        if (i === correctBlockIndex) {
            block.style.backgroundColor = differentColor;
            block.dataset.correct = 'true';
        } else {
            block.style.backgroundColor = baseColor;
            block.dataset.correct = 'false';
        }
        
        // 클릭 이벤트 추가
        block.addEventListener('click', handleBlockClick);
        
        // 게임 컨테이너에 블록 추가
        gameContainer.appendChild(block);
    }
}

// 레벨에 따른 그리드 크기 반환 함수 (100단계에 맞게 조정)
function getGridSizeByLevel(level) {
    if (level <= 5) return level + 1; // 2x2, 3x3, 4x4, 5x5, 6x6
    if (level <= 15) return 7; // 7x7
    if (level <= 30) return 8; // 8x8
    if (level <= 50) return 9; // 9x9
    if (level <= 75) return 10; // 10x10
    return 11; // 11x11 (최대)
}

// 레벨에 따른 색상 차이 반환 함수 (레벨이 높을수록 값이 작아져 구별하기 어려워짐)
function getColorDifferenceByLevel(level) {
    // 100단계일 때 차이가 2까지 줄어들도록 설정
    return Math.max(50 - (level * 0.48), 2);
}

// 랜덤 RGB 색상 생성 함수
function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 200 + 20); // 너무 어둡거나 밝지 않게 범위 조정
    const g = Math.floor(Math.random() * 200 + 20);
    const b = Math.floor(Math.random() * 200 + 20);
    return `rgb(${r}, ${g}, ${b})`;
}

// 기준 색상에서 약간 다른 색상 생성 함수
function getSlightlyDifferentColor(baseColor, difference) {
    // baseColor는 "rgb(r, g, b)" 형식의 문자열
    const rgbValues = baseColor.match(/\d+/g).map(Number);
    let [r, g, b] = rgbValues;
    
    // 무작위로 색상 채널 선택해서 변경 (더 자연스러운 차이를 위해)
    const randomChannel = Math.floor(Math.random() * 3); // 0, 1, 2 중 하나
    
    switch (randomChannel) {
        case 0: // R 채널 변경
            r = adjustColorValue(r, difference);
            break;
        case 1: // G 채널 변경
            g = adjustColorValue(g, difference);
            break;
        case 2: // B 채널 변경
            b = adjustColorValue(b, difference);
            break;
    }
    
    return `rgb(${r}, ${g}, ${b})`;
}

// 색상 값 조정 (0-255 범위 내에서)
function adjustColorValue(value, difference) {
    // 색상 값을 증가/감소 시킬지 랜덤으로 결정
    const direction = Math.random() > 0.5 ? 1 : -1;
    const newValue = value + (difference * direction);
    
    // 0-255 범위 내로 조정
    return Math.min(255, Math.max(0, newValue));
}

// 블록 클릭 이벤트 핸들러
function handleBlockClick(event) {
    if (!isGameStarted) return;
    
    const isCorrect = event.target.dataset.correct === 'true';
    
    if (isCorrect) {
        // 정답인 경우
        handleCorrectAnswer();
    } else {
        // 오답인 경우: 게임을 종료하지 않고 시각적 피드백만 제공
        applyWrongFeedback(event.target);
    }
}

// 정답 처리 함수
function handleCorrectAnswer() {
    currentLevel++;
    
    if (currentLevel > MAX_LEVEL) {
        // 게임 클리어
        showGameCompleteMessage();
        clearTimer();
    } else {
        // 다음 레벨로 진행
        clearTimer();
        generateLevel(currentLevel);
        startTimer();
    }
}

// 오답 클릭 시 시각적 피드백 함수
function applyWrongFeedback(element) {
    // 이미 애니메이션 중인지 확인
    if (element.classList.contains('wrong-click')) return;
    
    element.classList.add('wrong-click');
    
    // 애니메이션 종료 후 클래스 제거
    setTimeout(() => {
        element.classList.remove('wrong-click');
    }, 500); // 애니메이션 지속 시간과 일치
}

// 게임 완료 메시지 표시 함수
function showGameCompleteMessage() {
    messageArea.innerHTML = `
        <div class="complete-message">
            🏆 축하합니다! 시력 마스터! 🏆<br>
            모든 ${MAX_LEVEL}단계를 완료했습니다!
        </div>
    `;
    messageArea.classList.remove('hidden');
    gameContainer.innerHTML = '';
    currentLevel = MAX_LEVEL; // 최대 레벨로 설정
    updateLevelDisplay();
    isGameStarted = false;
    resetButton.classList.remove('hidden');
}

// 레벨 표시 업데이트 함수
function updateLevelDisplay() {
    levelDisplay.textContent = `레벨: ${currentLevel} / ${MAX_LEVEL}`;
} 