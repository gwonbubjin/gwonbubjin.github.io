// 게임 상수 정의
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const EMPTY_CELL = 'empty';
const GAME_SPEED = 500; // 기본 게임 속도(ms)

// 테트리스 블록 타입 및 모양 정의
const TETROMINOS = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        className: 'I'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        className: 'O'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        className: 'T'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        className: 'S'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        className: 'Z'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        className: 'J'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        className: 'L'
    }
};

// DOM 요소 가져오기
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const restartButton = document.getElementById('restart-button');
const gameOverMessage = document.getElementById('game-over-message');
const nextBlockDisplay = document.getElementById('next-block');

// 게임 변수 초기화
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY_CELL));
let score = 0;
let currentBlock = null;
let nextBlock = null;
let gameInterval = null;
let isPaused = false;
let isGameOver = false;

// 게임 보드 초기화
function initializeBoard() {
    gameBoard.innerHTML = '';
    
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('tetris-cell', EMPTY_CELL);
            gameBoard.appendChild(cell);
        }
    }
}

// Next 블록 표시 영역 초기화
function initializeNextBlockDisplay() {
    nextBlockDisplay.innerHTML = '';
    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            cell.classList.add('tetris-cell', EMPTY_CELL);
            nextBlockDisplay.appendChild(cell);
        }
    }
}

// 게임 보드 업데이트
function updateBoard() {
    // 모든 셀을 빈 셀로 초기화
    const cells = gameBoard.querySelectorAll('.tetris-cell');
    cells.forEach(cell => {
        cell.className = 'tetris-cell empty';
    });
    
    // 보드에 고정된 블록 표시
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== EMPTY_CELL) {
                const index = row * COLS + col;
                cells[index].classList.remove(EMPTY_CELL);
                cells[index].classList.add(board[row][col]);
            }
        }
    }
    
    // 현재 움직이는 블록 표시
    if (currentBlock) {
        const { shape, pos, className } = currentBlock;
        
        shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value) {
                    const boardRow = pos.y + rowIndex;
                    const boardCol = pos.x + colIndex;
                    
                    if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
                        const index = boardRow * COLS + boardCol;
                        cells[index].classList.remove(EMPTY_CELL);
                        cells[index].classList.add(className);
                    }
                }
            });
        });
    }
}

// Next 블록 표시 영역 업데이트
function updateNextBlockDisplay() {
    const cells = nextBlockDisplay.querySelectorAll('.tetris-cell');
    cells.forEach(cell => {
        cell.className = 'tetris-cell empty';
    });
    
    if (nextBlock) {
        const { shape, className } = nextBlock;
        
        shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value) {
                    const index = rowIndex * 4 + colIndex;
                    cells[index].classList.remove(EMPTY_CELL);
                    cells[index].classList.add(className);
                }
            });
        });
    }
}

// 랜덤 블록 생성
function getRandomBlock() {
    const types = Object.keys(TETROMINOS);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const tetromino = TETROMINOS[randomType];
    
    return {
        shape: tetromino.shape,
        className: tetromino.className,
        pos: { x: Math.floor(COLS / 2) - Math.floor(tetromino.shape[0].length / 2), y: 0 }
    };
}

// 블록 충돌 검사
function isCollision(block, pos = { x: 0, y: 0 }) {
    const { shape, pos: blockPos } = block;
    
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newRow = blockPos.y + row + pos.y;
                const newCol = blockPos.x + col + pos.x;
                
                // 게임 보드 경계 체크
                if (newRow >= ROWS || newCol < 0 || newCol >= COLS) {
                    return true;
                }
                
                // 이미 채워진 셀과 충돌 체크 (보드 범위 내의 경우만)
                if (newRow >= 0 && board[newRow][newCol] !== EMPTY_CELL) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// 블록 이동
function moveBlock(direction) {
    if (!currentBlock || isPaused || isGameOver) return;
    
    const pos = { x: 0, y: 0 };
    
    switch (direction) {
        case 'left':
            pos.x = -1;
            break;
        case 'right':
            pos.x = 1;
            break;
        case 'down':
            pos.y = 1;
            break;
    }
    
    if (!isCollision(currentBlock, pos)) {
        currentBlock.pos.x += pos.x;
        currentBlock.pos.y += pos.y;
        updateBoard();
        return true;
    }
    
    // 아래로 이동할 수 없는 경우 블록을 고정
    if (direction === 'down') {
        lockBlock();
        return false;
    }
    
    return false;
}

// 블록 회전
function rotateBlock() {
    if (!currentBlock || isPaused || isGameOver) return;
    
    const rotatedShape = [];
    const originalShape = currentBlock.shape;
    
    // 원래 모양 배열 깊은 복사
    originalShape.forEach(row => {
        rotatedShape.push([...row]);
    });
    
    // 시계 방향으로 90도 회전
    const rows = rotatedShape.length;
    const cols = rotatedShape[0].length;
    
    // 새로운 회전된 모양 생성
    const newShape = Array.from({ length: cols }, () => Array(rows).fill(0));
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            newShape[col][rows - 1 - row] = rotatedShape[row][col];
        }
    }
    
    // 임시로 현재 블록의 모양을 회전된 모양으로 변경하고 충돌 검사
    const originalBlockShape = currentBlock.shape;
    currentBlock.shape = newShape;
    
    // 회전 후 충돌이 발생하면 원래 모양으로 복원
    if (isCollision(currentBlock)) {
        currentBlock.shape = originalBlockShape;
    } else {
        updateBoard();
    }
}

// 블록 고정
function lockBlock() {
    if (!currentBlock) return;
    
    const { shape, pos, className } = currentBlock;
    
    shape.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (value) {
                const boardRow = pos.y + rowIndex;
                const boardCol = pos.x + colIndex;
                
                if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
                    board[boardRow][boardCol] = className;
                }
            }
        });
    });
    
    // 완성된 줄 체크 및 제거
    clearLines();
    
    // 다음 블록 가져오기
    currentBlock = nextBlock;
    nextBlock = getRandomBlock();
    updateNextBlockDisplay();
    
    // 게임 오버 체크
    if (isCollision(currentBlock)) {
        gameOver();
    }
}

// 완성된 줄 제거
function clearLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== EMPTY_CELL)) {
            // 줄 제거 및 위의 줄 내리기
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(EMPTY_CELL));
            linesCleared++;
            
            // 제거된 줄이 있으면 같은 줄을 다시 검사 (여러 줄이 동시에 제거될 수 있음)
            row++;
        }
    }
    
    // 점수 업데이트
    if (linesCleared > 0) {
        // 한 번에 여러 줄 제거 시 보너스 점수
        const points = [0, 100, 300, 500, 800];
        score += points[linesCleared] || 1000;
        scoreElement.textContent = score;
    }
}

// 게임 오버 처리
function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    finalScoreElement.textContent = score;
    gameOverMessage.classList.remove('hidden');
}

// 게임 시작
function startGame() {
    if (gameInterval || isGameOver) return;
    
    isPaused = false;
    pauseButton.textContent = '일시정지';
    
    // 첫 번째 블록 및 다음 블록 생성
    currentBlock = getRandomBlock();
    nextBlock = getRandomBlock();
    updateNextBlockDisplay();
    updateBoard();
    
    // 블록 자동 하강 타이머 설정
    gameInterval = setInterval(() => {
        moveBlock('down');
    }, GAME_SPEED);
}

// 게임 일시정지/재개
function togglePause() {
    if (isGameOver || !gameInterval) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        clearInterval(gameInterval);
        gameInterval = null;
        pauseButton.textContent = '계속하기';
    } else {
        pauseButton.textContent = '일시정지';
        gameInterval = setInterval(() => {
            moveBlock('down');
        }, GAME_SPEED);
    }
}

// 게임 리셋
function resetGame() {
    clearInterval(gameInterval);
    gameInterval = null;
    
    // 변수 초기화
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY_CELL));
    score = 0;
    currentBlock = null;
    nextBlock = null;
    isPaused = false;
    isGameOver = false;
    
    // UI 업데이트
    scoreElement.textContent = '0';
    pauseButton.textContent = '일시정지';
    gameOverMessage.classList.add('hidden');
    
    // 보드 초기화
    initializeBoard();
    initializeNextBlockDisplay();
}

// 키보드 입력 처리
function handleKeyDown(event) {
    if (isGameOver) return;
    
    switch (event.key) {
        case 'ArrowLeft':
            moveBlock('left');
            break;
        case 'ArrowRight':
            moveBlock('right');
            break;
        case 'ArrowDown':
            moveBlock('down');
            break;
        case 'ArrowUp':
            rotateBlock();
            break;
        case ' ': // 스페이스바 (하드 드롭)
            while (moveBlock('down')) {}
            break;
        case 'p':
            togglePause();
            break;
    }
}

// 이벤트 리스너 등록
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);
resetButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', () => {
    resetGame();
    startGame();
});
document.addEventListener('keydown', handleKeyDown);

// 게임 초기화
initializeBoard();
initializeNextBlockDisplay(); 