// DOM 요소 선택
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultMessage = document.getElementById('result-message');
const attemptsLeft = document.getElementById('attempts-left');
const attemptsCount = document.getElementById('attempts-count');
const guessHistory = document.getElementById('guess-history');
const progressFill = document.getElementById('progress-fill');
const restartBtn = document.getElementById('restart-btn');
const gameOverModal = document.getElementById('game-over-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const correctAnswer = document.getElementById('correct-answer');
const modalRestartBtn = document.getElementById('modal-restart-btn');

// 게임 변수
let randomNumber;       // 정답 숫자
let attempts;           // 현재까지 시도 횟수
let maxAttempts;        // 최대 시도 가능 횟수
let isGameOver;         // 게임 종료 여부
let guessedNumbers;     // 이미 추측한 숫자들

// 게임 초기화 함수
function initGame() {
    // 1~100 사이의 랜덤 숫자 생성
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    maxAttempts = 10;
    isGameOver = false;
    guessedNumbers = [];
    
    // UI 초기화
    userInput.value = '';
    userInput.disabled = false;
    checkBtn.disabled = false;
    resultMessage.textContent = '게임을 시작하려면 숫자를 입력하세요.';
    resultMessage.className = '';
    attemptsLeft.textContent = maxAttempts;
    attemptsCount.textContent = attempts;
    guessHistory.innerHTML = '';
    progressFill.style.width = '0%';
    
    // 모달 숨기기
    gameOverModal.classList.add('hidden');
    
    // 입력 필드에 포커스
    userInput.focus();
    
    console.log(`게임 초기화: 정답은 ${randomNumber}`); // 개발 목적으로 콘솔에 정답 표시
}

// 사용자 입력 처리 함수
function handleGuess() {
    if (isGameOver) return;
    
    // 입력값 가져오기 및 검증
    const guess = parseInt(userInput.value);
    
    // 입력값 검증
    if (isNaN(guess) || guess < 1 || guess > 100) {
        alert('1부터 100 사이의 유효한 숫자를 입력해주세요.');
        userInput.value = '';
        userInput.focus();
        return;
    }
    
    // 이미 추측한 숫자인지 확인
    if (guessedNumbers.includes(guess)) {
        alert('이미 입력한 숫자입니다. 다른 숫자를 입력해주세요.');
        userInput.value = '';
        userInput.focus();
        return;
    }
    
    // 시도 횟수 증가
    attempts++;
    guessedNumbers.push(guess);
    
    // UI 업데이트
    attemptsLeft.textContent = maxAttempts - attempts;
    attemptsCount.textContent = attempts;
    progressFill.style.width = `${(attempts / maxAttempts) * 100}%`;
    
    // 입력값과 정답 비교
    if (guess === randomNumber) {
        // 정답인 경우
        handleCorrectGuess();
    } else if (attempts >= maxAttempts) {
        // 모든 기회를 사용한 경우
        handleGameOver();
    } else {
        // 오답인 경우
        handleWrongGuess(guess);
    }
    
    // 입력 필드 초기화
    userInput.value = '';
    userInput.focus();
}

// 정답 처리 함수
function handleCorrectGuess() {
    isGameOver = true;
    resultMessage.textContent = '🎉 정답입니다!';
    resultMessage.className = 'result-correct';
    
    // 히스토리에 추가
    addToHistory(guessedNumbers[guessedNumbers.length - 1], 'correct');
    
    // 입력 비활성화
    userInput.disabled = true;
    checkBtn.disabled = true;
    
    // 성공 모달 표시
    modalTitle.textContent = '축하합니다!';
    modalTitle.className = 'success';
    modalMessage.textContent = `${attempts}번 만에 정답을 맞혔습니다!`;
    correctAnswer.textContent = randomNumber;
    gameOverModal.classList.remove('hidden');
}

// 오답 처리 함수
function handleWrongGuess(guess) {
    const result = guess < randomNumber ? 'up' : 'down';
    
    // 결과 메시지 업데이트
    if (result === 'up') {
        resultMessage.textContent = 'UP! 더 큰 숫자를 입력하세요.';
        resultMessage.className = 'result-up';
    } else {
        resultMessage.textContent = 'DOWN! 더 작은 숫자를 입력하세요.';
        resultMessage.className = 'result-down';
    }
    
    // 히스토리에 추가
    addToHistory(guess, result);
}

// 게임 오버 처리 함수
function handleGameOver() {
    isGameOver = true;
    resultMessage.textContent = '모든 기회를 사용했습니다. 게임 오버!';
    
    // 히스토리에 추가
    addToHistory(guessedNumbers[guessedNumbers.length - 1], 'wrong');
    
    // 입력 비활성화
    userInput.disabled = true;
    checkBtn.disabled = true;
    
    // 게임 오버 모달 표시
    modalTitle.textContent = '게임 오버!';
    modalTitle.className = '';
    modalMessage.textContent = '모든 기회를 사용했습니다.';
    correctAnswer.textContent = randomNumber;
    gameOverModal.classList.remove('hidden');
}

// 히스토리에 추가하는 함수
function addToHistory(number, result) {
    const li = document.createElement('li');
    
    const guessNumber = document.createElement('span');
    guessNumber.textContent = `${attempts}번째 시도: ${number}`;
    guessNumber.className = 'guess-number';
    
    const guessResult = document.createElement('span');
    
    if (result === 'up') {
        guessResult.textContent = 'UP';
        guessResult.className = 'guess-up';
    } else if (result === 'down') {
        guessResult.textContent = 'DOWN';
        guessResult.className = 'guess-down';
    } else if (result === 'correct') {
        guessResult.textContent = '정답!';
        guessResult.className = 'result-correct';
    } else {
        guessResult.textContent = '틀림';
    }
    
    li.appendChild(guessNumber);
    li.appendChild(guessResult);
    
    guessHistory.prepend(li); // 가장 최근 시도를 맨 위에 표시
}

// 이벤트 리스너 등록
checkBtn.addEventListener('click', handleGuess);
userInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        handleGuess();
    }
});

restartBtn.addEventListener('click', initGame);
modalRestartBtn.addEventListener('click', initGame);

// 게임 시작
initGame(); 