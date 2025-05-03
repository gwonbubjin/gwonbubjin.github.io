// DOM 요소 선택
const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const gameOver = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const finalLevelDisplay = document.getElementById('final-level');
const tryAgainButton = document.getElementById('try-again-button');

// 게임 변수
let currentWord = '';
let score = 0;
let level = 1;
let time = 5;
let isPlaying = false;
let timer = null;

// 단어 목록 (단어 길이에 따라 정렬됨: 짧은 단어부터 긴 단어까지)
const words = [
    // 레벨 1-2 (3-4글자)
    'dog', 'cat', 'run', 'jump', 'code', 'java', 'html', 'game', 'book', 'love',
    'fire', 'time', 'play', 'duck', 'food', 'cold', 'warm', 'sand', 'desk', 'cafe',
    // 레벨 3-4 (5-6글자)
    'table', 'chair', 'phone', 'music', 'happy', 'party', 'beach', 'water', 'tiger', 'snake',
    'mouse', 'mouse', 'pizza', 'pasta', 'sushi', 'candy', 'apple', 'lemon', 'mango', 'panda',
    // 레벨 5-6 (7-8글자)
    'elephant', 'computer', 'keyboard', 'monitor', 'program', 'internet', 'website', 'student', 'teacher', 'practice',
    'control', 'windows', 'android', 'library', 'message', 'america', 'england', 'weekend', 'example', 'twitter',
    // 레벨 7-8 (9-10글자)
    'chocolate', 'hamburger', 'developer', 'programmer', 'algorithm', 'interface', 'challenge', 'butterfly', 'crocodile', 'restaurant',
    'dictionary', 'blackboard', 'volleyball', 'basketball', 'washington', 'california', 'strawberry', 'university', 'worldwide', 'javascript',
    // 레벨 9-10 (11글자 이상)
    'photography', 'information', 'engineering', 'application', 'independence', 'notification', 'intelligence', 'encyclopedia', 'transmission', 'professional',
    'architecture', 'construction', 'communication', 'understanding', 'refrigerator', 'certification', 'thanksgiving', 'relationship', 'administration', 'extraordinary'
];

// 이벤트 리스너
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
tryAgainButton.addEventListener('click', restartGame);
wordInput.addEventListener('input', checkMatch);
wordInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        checkWord();
    }
});

// 게임 시작 함수
function startGame() {
    score = 0;
    level = 1;
    isPlaying = true;
    wordInput.disabled = false;
    wordInput.value = '';
    wordInput.focus();
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
    gameOver.classList.add('hidden');
    
    // 첫 단어 선택
    getWordForLevel();
    
    // 타이머 시작
    time = getTimeForLevel();
    timerDisplay.textContent = time;
    timerDisplay.classList.remove('warning');
    startTimer();
}

// 게임 재시작 함수
function restartGame() {
    // 같은 설정으로 게임 다시 시작
    startGame();
}

// 레벨에 따른 단어 선택
function getWordForLevel() {
    let wordPool = [];
    
    // 레벨에 따라 단어 길이 결정
    if (level <= 2) {
        // 레벨 1-2: 3-4글자 단어
        wordPool = words.slice(0, 20);
    } else if (level <= 4) {
        // 레벨 3-4: 5-6글자 단어
        wordPool = words.slice(20, 40);
    } else if (level <= 6) {
        // 레벨 5-6: 7-8글자 단어
        wordPool = words.slice(40, 60);
    } else if (level <= 8) {
        // 레벨 7-8: 9-10글자 단어
        wordPool = words.slice(60, 80);
    } else {
        // 레벨 9-10 이상: 11글자 이상
        wordPool = words.slice(80);
    }
    
    // 랜덤 단어 선택
    const randomIndex = Math.floor(Math.random() * wordPool.length);
    currentWord = wordPool[randomIndex];
    wordDisplay.textContent = currentWord;
    
    // 애니메이션 효과 초기화
    wordDisplay.classList.remove('wrong', 'correct');
}

// 레벨에 따른 시간 설정
function getTimeForLevel() {
    // 기본 시간 5초에서 레벨이 올라갈수록 줄어듦 (최소 2초)
    return Math.max(5 - Math.floor((level - 1) / 2), 2);
}

// 타이머 시작 함수
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        time--;
        timerDisplay.textContent = time;
        
        // 남은 시간이 3초 이하면 경고 애니메이션
        if (time <= 3) {
            timerDisplay.classList.add('warning');
        }
        
        // 시간 초과 시 게임 종료
        if (time <= 0) {
            endGame();
        }
    }, 1000);
}

// 입력 일치 여부 확인 (실시간)
function checkMatch() {
    if (!isPlaying) return;
    
    const inputValue = wordInput.value.toLowerCase();
    const targetWord = currentWord.toLowerCase();
    
    if (inputValue === targetWord) {
        // 정확히 일치하면 다음 단어로
        wordInput.classList.add('correct');
        wordDisplay.classList.add('correct');
        setTimeout(() => {
            wordSuccess();
        }, 200);
    } else if (targetWord.startsWith(inputValue)) {
        // 타이핑 중인 상태 (정상)
        wordInput.classList.remove('wrong');
    } else {
        // 잘못된 타이핑
        wordInput.classList.add('wrong');
    }
}

// 단어 검증 및 엔터 키 처리
function checkWord() {
    if (!isPlaying) return;
    
    const inputValue = wordInput.value.toLowerCase();
    const targetWord = currentWord.toLowerCase();
    
    if (inputValue === targetWord) {
        // 정확히 일치
        wordSuccess();
    } else {
        // 불일치 - 벌점 (시간 감소)
        wordFail();
    }
}

// 단어 성공 처리
function wordSuccess() {
    // 점수 증가
    score++;
    scoreDisplay.textContent = score;
    
    // 레벨 업 체크
    checkLevelUp();
    
    // 다음 단어 준비
    getWordForLevel();
    
    // 시간 리셋
    time = getTimeForLevel();
    timerDisplay.textContent = time;
    timerDisplay.classList.remove('warning');
    
    // 입력창 초기화
    wordInput.value = '';
    wordInput.classList.remove('correct', 'wrong');
    wordInput.focus();
    
    // 타이머 재시작
    startTimer();
}

// 단어 실패 처리
function wordFail() {
    // 시간 감소 (벌점)
    time = Math.max(time - 1, 0);
    timerDisplay.textContent = time;
    
    // 시각적 피드백
    wordDisplay.classList.add('wrong');
    wordInput.classList.add('wrong');
    
    // 효과음 추가할 수 있음 (추후 확장)
    
    // 시간 소진 시 게임 종료
    if (time <= 0) {
        endGame();
        return;
    }
    
    // 0.5초 후 시각적 피드백 제거
    setTimeout(() => {
        wordDisplay.classList.remove('wrong');
        wordInput.classList.remove('wrong');
    }, 500);
}

// 레벨업 체크 함수
function checkLevelUp() {
    // 5점마다 레벨업
    if (score > 0 && score % 5 === 0) {
        level++;
        levelDisplay.textContent = level;
        
        // 레벨업 애니메이션
        levelDisplay.classList.add('level-up');
        setTimeout(() => {
            levelDisplay.classList.remove('level-up');
        }, 1000);
    }
}

// 게임 종료 함수
function endGame() {
    isPlaying = false;
    clearInterval(timer);
    
    // 게임 오버 화면 표시
    finalScoreDisplay.textContent = score;
    finalLevelDisplay.textContent = level;
    gameOver.classList.remove('hidden');
    
    // 입력창 비활성화
    wordInput.disabled = true;
    
    // 버튼 상태 업데이트
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
} 