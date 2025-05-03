// DOM 요소 가져오기
const messageElement = document.getElementById('message');
const lastIntervalElement = document.getElementById('last-interval');
const intervalValueElement = document.getElementById('interval-value');
const errorDisplayElement = document.getElementById('error-display');
const errorValueElement = document.getElementById('error-value');
const resultMessageElement = document.getElementById('result-message');
const progressTextElement = document.getElementById('progress-text');
const successRateElement = document.getElementById('success-rate');
const averageErrorElement = document.getElementById('average-error');
const startButton = document.getElementById('start-button');
const clickButton = document.getElementById('click-button');
const resetButton = document.getElementById('reset-button');
const historyList = document.getElementById('history-list');

// 게임 상수
const TARGET_INTERVAL = 1000; // 목표 간격 (1초 = 1000ms)
const ERROR_MARGIN = 200; // 오차 범위 (±200ms)
const MAX_ATTEMPTS = 10; // 최대 시도 횟수

// 게임 변수
let lastClickTime = 0;
let currentClickTime = 0;
let isFirstClick = true;
let isGameRunning = false;
let attemptCount = 0;
let successCount = 0;
let totalError = 0;
let intervals = []; // 클릭 간격 기록

// 시작 버튼 클릭 이벤트
startButton.addEventListener('click', startGame);

// 클릭 버튼 클릭 이벤트
clickButton.addEventListener('click', handleClick);

// 다시 시작 버튼 클릭 이벤트
resetButton.addEventListener('click', resetGame);

// 게임 시작 함수
function startGame() {
    // 게임 상태 및 UI 초기화
    isGameRunning = true;
    isFirstClick = true;
    lastClickTime = 0;
    
    // 버튼 상태 변경
    startButton.disabled = true;
    clickButton.disabled = false;
    resetButton.classList.add('hidden');
    
    // 메시지 업데이트
    messageElement.textContent = '첫 번째 클릭을 하세요!';
    
    // 결과 영역 숨기기
    lastIntervalElement.classList.add('hidden');
    errorDisplayElement.classList.add('hidden');
    resultMessageElement.classList.add('hidden');
}

// 클릭 처리 함수
function handleClick() {
    if (!isGameRunning) return;
    
    currentClickTime = Date.now();
    
    if (isFirstClick) {
        // 첫 번째 클릭인 경우
        lastClickTime = currentClickTime;
        isFirstClick = false;
        messageElement.textContent = '1초 간격으로 다시 클릭하세요!';
        return;
    }
    
    // 간격 및 오차 계산
    const interval = currentClickTime - lastClickTime;
    const error = Math.abs(interval - TARGET_INTERVAL);
    
    // 기록 업데이트
    attemptCount++;
    totalError += error;
    intervals.push(interval);
    
    // 성공 여부 판단
    const isSuccess = error <= ERROR_MARGIN;
    if (isSuccess) {
        successCount++;
    }
    
    // UI 업데이트
    updateUI(interval, error, isSuccess);
    
    // 다음 클릭을 위한 시간 업데이트
    lastClickTime = currentClickTime;
    
    // 최대 시도 횟수 도달 여부 확인
    if (attemptCount >= MAX_ATTEMPTS) {
        endGame();
    }
}

// UI 업데이트 함수
function updateUI(interval, error, isSuccess) {
    // 간격 및 오차 표시
    intervalValueElement.textContent = interval;
    errorValueElement.textContent = error;
    
    lastIntervalElement.classList.remove('hidden');
    errorDisplayElement.classList.remove('hidden');
    resultMessageElement.classList.remove('hidden');
    
    // 결과 메시지 설정
    setResultMessage(interval, error, isSuccess);
    
    // 진행 상황 업데이트
    progressTextElement.textContent = `시도: ${attemptCount} / ${MAX_ATTEMPTS}`;
    const currentSuccessRate = Math.round((successCount / attemptCount) * 100);
    successRateElement.textContent = `성공률: ${currentSuccessRate}%`;
    
    const currentAverageError = Math.round(totalError / attemptCount);
    averageErrorElement.textContent = `평균 오차: ${currentAverageError}ms`;
    
    // 기록에 추가
    addToHistory(attemptCount, interval, error, isSuccess);
}

// 결과 메시지 설정 함수
function setResultMessage(interval, error, isSuccess) {
    let message = '';
    let className = '';
    
    if (isSuccess) {
        message = '🎯 성공! 잘했어요!';
        className = 'success';
    } else {
        if (interval < TARGET_INTERVAL) {
            message = '⚡ 너무 빨랐어요!';
            className = 'too-fast';
        } else {
            message = '🐢 너무 느렸어요!';
            className = 'too-slow';
        }
    }
    
    resultMessageElement.textContent = message;
    resultMessageElement.className = className;
}

// 게임 종료 함수
function endGame() {
    isGameRunning = false;
    clickButton.disabled = true;
    resetButton.classList.remove('hidden');
    
    const finalSuccessRate = Math.round((successCount / MAX_ATTEMPTS) * 100);
    const finalAverageError = Math.round(totalError / MAX_ATTEMPTS);
    
    // 결과 메시지 업데이트
    messageElement.textContent = `게임 종료! 성공률: ${finalSuccessRate}%, 평균 오차: ${finalAverageError}ms`;
    
    // 결과에 따른 피드백 메시지
    let feedbackMessage = '';
    
    if (finalSuccessRate >= 80) {
        feedbackMessage = '🏆 탁월한 타이밍 감각을 가지고 있네요!';
    } else if (finalSuccessRate >= 60) {
        feedbackMessage = '👍 좋은 성적이에요! 더 연습하면 더 좋아질 거예요.';
    } else if (finalSuccessRate >= 40) {
        feedbackMessage = '😊 평균적인 성적이에요. 연습이 필요해요.';
    } else {
        feedbackMessage = '😅 타이밍 감각을 키우려면 더 많은 연습이 필요해요!';
    }
    
    resultMessageElement.textContent = feedbackMessage;
    resultMessageElement.className = 'success';
}

// 게임 재설정 함수
function resetGame() {
    // 게임 변수 초기화
    lastClickTime = 0;
    currentClickTime = 0;
    isFirstClick = true;
    isGameRunning = false;
    attemptCount = 0;
    successCount = 0;
    totalError = 0;
    intervals = [];
    
    // 버튼 상태 변경
    startButton.disabled = false;
    clickButton.disabled = true;
    resetButton.classList.add('hidden');
    
    // 메시지 및 결과 영역 초기화
    messageElement.textContent = '게임을 시작하려면 시작 버튼을 클릭하세요.';
    lastIntervalElement.classList.add('hidden');
    errorDisplayElement.classList.add('hidden');
    resultMessageElement.classList.add('hidden');
    
    // 진행 상황 초기화
    progressTextElement.textContent = `시도: 0 / ${MAX_ATTEMPTS}`;
    successRateElement.textContent = '성공률: 0%';
    averageErrorElement.textContent = '평균 오차: 0ms';
}

// 기록에 추가하는 함수
function addToHistory(attempt, interval, error, isSuccess) {
    const li = document.createElement('li');
    
    const attemptSpan = document.createElement('span');
    attemptSpan.textContent = `시도 ${attempt}`;
    attemptSpan.className = 'history-attempt';
    
    const intervalSpan = document.createElement('span');
    intervalSpan.textContent = `${interval}ms`;
    intervalSpan.className = 'history-interval';
    
    const errorSpan = document.createElement('span');
    errorSpan.textContent = `오차: ${error}ms`;
    errorSpan.className = 'history-error';
    
    // 성공 여부에 따라 색상 클래스 적용
    if (isSuccess) {
        errorSpan.classList.add('success');
    } else {
        if (interval < TARGET_INTERVAL) {
            errorSpan.classList.add('too-fast');
        } else {
            errorSpan.classList.add('too-slow');
        }
    }
    
    li.appendChild(attemptSpan);
    li.appendChild(intervalSpan);
    li.appendChild(errorSpan);
    
    // 가장 최근 기록을 맨 위에 표시
    historyList.insertBefore(li, historyList.firstChild);
} 