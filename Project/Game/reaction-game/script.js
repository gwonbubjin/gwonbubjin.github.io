const gameArea = document.getElementById("gameArea");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const resultContainer = document.getElementById("result-container");
const gameInstructions = document.getElementById("game-instructions");

let waiting = false;
let startTime;
let timeoutId;
let currentRound = 0;
let totalRounds = 5;
let reactionTimes = [];
let isGameStarted = false;

// 상수 추가
const PENALTY_TIME = 1000; // 페널티 시간 (ms)

// 반응 속도에 따른 평가 함수 추가
function getReactionRating(time) {
    if (time <= 200) {
        return "⚡ 치타급 반응속도! 번개처럼 빠르네요!";
    } else if (time <= 350) {
        return "🐈 고양이처럼 날렵합니다!";
    } else if (time <= 500) {
        return "🦊 여우급 반응! 평균 이상이에요!";
    } else if (time <= 700) {
        return "🐢 거북이 수준입니다. 조금 더 연습해봐요!";
    } else {
        return "🦥 나무늘보...? 괜찮아요, 다시 도전해봐요!";
    }
}

// 시작 버튼 클릭 이벤트
startButton.addEventListener("click", () => {
    if (!isGameStarted) {
        startGame();
    }
});

// 다시하기 버튼 클릭 이벤트
resetButton.addEventListener("click", () => {
    resetGame();
});

// 게임 영역 클릭 이벤트
gameArea.addEventListener("click", (event) => {
    // 버튼 클릭은 무시
    if (event.target === startButton || event.target === resetButton) {
        return;
    }
    
    if (!isGameStarted) {
        return; // 게임이 시작되지 않았으면 클릭 무시
    }

    if (waiting === "waiting") {
        // 너무 빨랐음
        clearTimeout(timeoutId);
        
        // 페널티 적용
        const penaltyTime = PENALTY_TIME;
        reactionTimes.push(penaltyTime);
        currentRound++;
        
        message.textContent = `너무 빨랐어요! 페널티: ${penaltyTime}ms`;
        resultContainer.innerHTML += `<p>라운드 ${currentRound}: ${penaltyTime}ms (페널티)</p>`;
        
        gameArea.classList.remove("ready", "go");
        waiting = false;
        
        if (currentRound < totalRounds) {
            // 다음 라운드 준비
            setTimeout(startRound, 1500);
        } else {
            // 모든 라운드 완료
            finishGame();
        }
    } else if (waiting === true) {
        // 정상 클릭
        const reactionTime = new Date().getTime() - startTime;
        reactionTimes.push(reactionTime);
        currentRound++;
        
        message.textContent = `반응 속도: ${reactionTime}ms`;
        resultContainer.innerHTML += `<p>라운드 ${currentRound}: ${reactionTime}ms</p>`;
        
        gameArea.classList.remove("go");
        waiting = false;
        
        if (currentRound < totalRounds) {
            // 다음 라운드 준비
            setTimeout(startRound, 1500);
        } else {
            // 모든 라운드 완료
            finishGame();
        }
    }
});

function startGame() {
    isGameStarted = true;
    currentRound = 0;
    reactionTimes = [];
    resultContainer.innerHTML = "";
    message.textContent = "테스트를 시작합니다";
    
    // 안내 문구 숨기기
    gameInstructions.style.display = "none";
    
    // 시작 버튼 비활성화
    startButton.disabled = true;
    
    // 첫 번째 라운드 시작
    setTimeout(startRound, 1000);
}

function startRound() {
    message.textContent = "준비하세요...";
    gameArea.classList.remove("go");
    gameArea.classList.add("ready");

    const randomTime = Math.random() * 2000 + 2000; // 2~4초 후 시작

    timeoutId = setTimeout(() => {
        gameArea.classList.remove("ready");
        gameArea.classList.add("go");
        message.textContent = "지금 클릭!";
        startTime = new Date().getTime();
        waiting = true;
    }, randomTime);

    waiting = "waiting";
}

function finishGame() {
    // 평균 계산
    const sum = reactionTimes.reduce((acc, time) => acc + time, 0);
    const average = Math.round(sum / totalRounds);
    
    // 결과 표시 - 평균 반응속도와 동물 평가 표시
    const averageRating = getReactionRating(average);
    message.textContent = `완료! 평균 반응 속도: ${average}ms`;
    resultContainer.innerHTML += `<p><strong>평균: ${average}ms<br>${averageRating}</strong></p>`;
    gameArea.classList.remove("go", "ready");
    
    // 시작 버튼 다시 활성화
    startButton.disabled = false;
    
    waiting = false;
    isGameStarted = false;
}

function resetGame() {
    // 진행 중인 타이머 초기화
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    
    // 게임 상태 초기화
    isGameStarted = false;
    waiting = false;
    currentRound = 0;
    reactionTimes = [];
    
    // UI 초기화
    gameArea.classList.remove("ready", "go");
    message.textContent = "반응 속도 테스트";
    resultContainer.innerHTML = "";
    startButton.disabled = false;
    
    // 안내 문구 다시 표시
    gameInstructions.style.display = "block";
}
