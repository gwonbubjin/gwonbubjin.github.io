// DOM 요소 선택
const gameBoard = document.getElementById('game-board');
const currentRoundElement = document.getElementById('current-round');
const timeLeftElement = document.getElementById('time-left');
const attemptsElement = document.getElementById('attempts');
const pairsFoundElement = document.getElementById('pairs-found');
const totalPairsElement = document.getElementById('total-pairs');
const messageContainer = document.getElementById('message-container');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const nextRoundBtn = document.getElementById('next-round-btn');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

// 게임 상태 변수
let currentRound = 1;
let timeLeft = 0;
let timerInterval = null;
let attempts = 0;
let pairsFound = 0;
let totalPairs = 0;
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;
let gameStarted = false;

// 카드에 사용할 이모지 배열
const cardSymbols = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🦁', '🐯', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗',
    '🦋', '🐛', '🐝', '🐞', '🦂', '🦑', '🐙', '🦀',
    '🐠', '🐡', '🐳', '🐬', '🦖', '🦕', '🐊', '🐢',
    '🦍', '🦓', '🦒', '🐘', '🦏', '🐪', '🐄', '🦌',
    '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭',
    '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅'
];

// 라운드별 설정
const roundConfigs = [
    { pairs: 4, timeLimit: 30 },   // Round 1
    { pairs: 5, timeLimit: 40 },   // Round 2
    { pairs: 6, timeLimit: 50 },   // Round 3
    { pairs: 7, timeLimit: 60 },   // Round 4
    { pairs: 8, timeLimit: 65 },   // Round 5
    { pairs: 9, timeLimit: 70 },   // Round 6
    { pairs: 10, timeLimit: 75 },  // Round 7
    { pairs: 11, timeLimit: 80 },  // Round 8
    { pairs: 12, timeLimit: 85 },  // Round 9
    { pairs: 13, timeLimit: 90 }   // Round 10
];

// 이벤트 리스너 설정
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
nextRoundBtn.addEventListener('click', startNextRound);
restartBtn.addEventListener('click', resetGame);

// 게임 초기화 함수
function initializeGame() {
    // 라운드 설정 가져오기
    const config = roundConfigs[currentRound - 1];
    totalPairs = config.pairs;
    timeLeft = config.timeLimit;
    
    // UI 업데이트
    currentRoundElement.textContent = currentRound;
    timeLeftElement.textContent = timeLeft;
    attemptsElement.textContent = attempts;
    pairsFoundElement.textContent = pairsFound;
    totalPairsElement.textContent = totalPairs;
    
    // 게임 보드의 라운드별 클래스 조정
    gameBoard.className = 'game-board';
    gameBoard.classList.add(`round-${currentRound}`);
    
    // 카드 생성
    createCards();
}

// 카드 생성 함수
function createCards() {
    // 게임 보드 초기화
    gameBoard.innerHTML = '';
    
    // 라운드에 맞는 카드 쌍 수 가져오기
    const pairsCount = roundConfigs[currentRound - 1].pairs;
    
    // 사용할 이모지 선택 (무작위로 필요한 수만큼)
    const selectedSymbols = [...cardSymbols]
        .sort(() => 0.5 - Math.random())
        .slice(0, pairsCount);
    
    // 각 이모지를 두 번씩 사용하여 카드 배열 생성
    cards = [...selectedSymbols, ...selectedSymbols]
        .sort(() => 0.5 - Math.random());
    
    // HTML에 카드 추가
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-index', index);
        card.setAttribute('data-symbol', symbol);
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// 카드 뒤집기 함수
function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;
    
    this.classList.add('flipped');
    
    if (!hasFlippedCard) {
        // 첫 번째 카드
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    // 두 번째 카드
    secondCard = this;
    hasFlippedCard = false;
    
    // 시도 횟수 증가
    attempts++;
    attemptsElement.textContent = attempts;
    
    // 매치 확인
    checkForMatch();
}

// 카드 매치 확인 함수
function checkForMatch() {
    const isMatch = firstCard.getAttribute('data-symbol') === secondCard.getAttribute('data-symbol');
    
    if (isMatch) {
        // 매치된 경우
        disableCards();
        pairsFound++;
        pairsFoundElement.textContent = pairsFound;
        
        // 모든 쌍을 찾았는지 확인
        if (pairsFound === totalPairs) {
            setTimeout(() => {
                roundComplete();
            }, 500);
        }
    } else {
        // 매치되지 않은 경우
        unflipCards();
    }
}

// 매치된 카드 비활성화
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoardState();
}

// 매치되지 않은 카드 다시 뒤집기
function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        
        resetBoardState();
    }, 1000);
}

// 보드 상태 초기화
function resetBoardState() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// 타이머 시작
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

// 게임 시작
function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    startBtn.disabled = true;
    attempts = 0;
    pairsFound = 0;
    
    initializeGame();
    startTimer();
}

// 라운드 완료 처리
function roundComplete() {
    clearInterval(timerInterval);
    
    if (currentRound === 10) {
        // 모든 라운드 클리어
        messageTitle.textContent = '게임 클리어!';
        messageText.textContent = `축하합니다! 모든 라운드를 클리어했습니다!\n총 시도 횟수: ${attempts}`;
        nextRoundBtn.style.display = 'none';
    } else {
        // 다음 라운드로
        messageTitle.textContent = '라운드 클리어!';
        messageText.textContent = `훌륭해요! Round ${currentRound}을(를) 클리어했습니다.\n시도 횟수: ${attempts}`;
        nextRoundBtn.style.display = 'inline-block';
    }
    
    messageContainer.classList.remove('hidden');
}

// 게임 오버 처리
function gameOver() {
    messageTitle.textContent = '게임 오버';
    messageText.textContent = `시간이 초과되었습니다.\n라운드 ${currentRound} - 찾은 쌍: ${pairsFound}/${totalPairs}`;
    nextRoundBtn.style.display = 'none';
    messageContainer.classList.remove('hidden');
}

// 다음 라운드 시작
function startNextRound() {
    currentRound++;
    attempts = 0;
    pairsFound = 0;
    
    messageContainer.classList.add('hidden');
    initializeGame();
    startTimer();
}

// 게임 리셋
function resetGame() {
    clearInterval(timerInterval);
    
    // 변수 초기화
    currentRound = 1;
    attempts = 0;
    pairsFound = 0;
    gameStarted = false;
    startBtn.disabled = false;
    
    // UI 초기화
    messageContainer.classList.add('hidden');
    
    // 게임 상태 초기화
    resetBoardState();
    
    // 게임 보드 초기화
    initializeGame();
} 