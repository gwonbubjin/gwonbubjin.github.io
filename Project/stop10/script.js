// DOM 요소 가져오기
const messageElement = document.getElementById('message');
const elapsedTimeElement = document.getElementById('elapsed-time');
const timeValueElement = document.getElementById('time-value');
const timeDifferenceElement = document.getElementById('time-difference');
const differenceValueElement = document.getElementById('difference-value');
const accuracyMessageElement = document.getElementById('accuracy-message');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const historyList = document.getElementById('history-list');

// 게임 변수
let startTime = 0;
let endTime = 0;
let timeDifference = 0;
let elapsedTime = 0;
let isGameRunning = false;
let attemptCount = 0;
const TARGET_TIME = 10; // 목표 시간(10초)

// 시작 버튼 클릭 이벤트
startButton.addEventListener('click', startGame);

// 정지 버튼 클릭 이벤트
stopButton.addEventListener('click', stopGame);

// 다시 시작 버튼 클릭 이벤트
resetButton.addEventListener('click', resetGame);

// 게임 시작 함수
function startGame() {
    // 게임 상태 및 UI 초기화
    isGameRunning = true;
    startTime = Date.now();
    
    // 버튼 상태 변경
    startButton.disabled = true;
    stopButton.disabled = false;
    
    // 메시지 업데이트
    messageElement.textContent = '정확히 10초가 지났다고 생각되면 정지 버튼을 누르세요!';
    
    // 결과 영역 숨기기
    elapsedTimeElement.classList.add('hidden');
    timeDifferenceElement.classList.add('hidden');
    accuracyMessageElement.classList.add('hidden');
}

// 게임 정지 함수
function stopGame() {
    if (!isGameRunning) return;
    
    // 게임 종료 시각 기록
    endTime = Date.now();
    isGameRunning = false;
    attemptCount++;
    
    // 경과 시간 및 오차 계산
    elapsedTime = (endTime - startTime) / 1000; // 초 단위로 변환
    timeDifference = Math.abs(elapsedTime - TARGET_TIME);
    
    // 소수점 둘째 자리까지 표시
    const formattedElapsedTime = elapsedTime.toFixed(2);
    const formattedDifference = timeDifference.toFixed(2);
    
    // UI 업데이트
    timeValueElement.textContent = formattedElapsedTime;
    differenceValueElement.textContent = formattedDifference;
    
    elapsedTimeElement.classList.remove('hidden');
    timeDifferenceElement.classList.remove('hidden');
    accuracyMessageElement.classList.remove('hidden');
    
    // 정확도 메시지 설정
    setAccuracyMessage(timeDifference);
    
    // 이전 기록에 추가
    addToHistory(formattedElapsedTime, formattedDifference);
    
    // 버튼 상태 변경
    stopButton.disabled = true;
    resetButton.classList.remove('hidden');
    
    // 메시지 업데이트
    messageElement.textContent = '다시 도전하시겠습니까?';
}

// 게임 재설정 함수
function resetGame() {
    // 게임 변수 초기화
    startTime = 0;
    endTime = 0;
    elapsedTime = 0;
    timeDifference = 0;
    isGameRunning = false;
    
    // 버튼 상태 변경
    startButton.disabled = false;
    stopButton.disabled = true;
    resetButton.classList.add('hidden');
    
    // 메시지 및 결과 영역 초기화
    messageElement.textContent = '준비되셨나요?';
    elapsedTimeElement.classList.add('hidden');
    timeDifferenceElement.classList.add('hidden');
    accuracyMessageElement.classList.add('hidden');
}

// 정확도 메시지 설정 함수
function setAccuracyMessage(difference) {
    let message = '';
    let className = '';
    
    // 오차에 따른 메시지 설정
    if (difference < 0.1) {
        message = '🎯 완벽! 타이밍의 달인이시군요!';
        className = 'excellent';
    } else if (difference < 0.3) {
        message = '🥇 거의 완벽해요! 대단합니다!';
        className = 'excellent';
    } else if (difference < 0.5) {
        message = '🥈 아주 좋아요! 감각이 뛰어나시네요!';
        className = 'good';
    } else if (difference < 1) {
        message = '🥉 좋은 감각이에요!';
        className = 'good';
    } else if (difference < 2) {
        message = '👍 나쁘지 않아요. 더 해보세요!';
        className = 'average';
    } else if (difference < 3) {
        message = '😊 조금 더 집중해보세요!';
        className = 'average';
    } else {
        message = '😅 다시 도전해보세요!';
        className = 'poor';
    }
    
    // 메시지 및 클래스 적용
    accuracyMessageElement.textContent = message;
    accuracyMessageElement.className = className;
    accuracyMessageElement.classList.remove('hidden');
}

// 이전 기록에 추가하는 함수
function addToHistory(elapsedTime, difference) {
    const li = document.createElement('li');
    
    const attemptSpan = document.createElement('span');
    attemptSpan.textContent = `시도 ${attemptCount}`;
    attemptSpan.className = 'history-attempt';
    
    const timeSpan = document.createElement('span');
    timeSpan.textContent = `${elapsedTime}초`;
    timeSpan.className = 'history-time';
    
    const differenceSpan = document.createElement('span');
    differenceSpan.textContent = `오차: ${difference}초`;
    differenceSpan.className = 'history-difference';
    
    // 오차에 따라 색상 클래스 적용
    if (parseFloat(difference) < 0.3) {
        differenceSpan.classList.add('excellent');
    } else if (parseFloat(difference) < 1) {
        differenceSpan.classList.add('good');
    } else if (parseFloat(difference) < 2) {
        differenceSpan.classList.add('average');
    } else {
        differenceSpan.classList.add('poor');
    }
    
    li.appendChild(attemptSpan);
    li.appendChild(timeSpan);
    li.appendChild(differenceSpan);
    
    // 가장 최근 기록을 맨 위에 표시
    historyList.insertBefore(li, historyList.firstChild);
} 