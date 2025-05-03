document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 참조
    const gradientBox = document.getElementById('gradientBox');
    const twoColorBtn = document.getElementById('twoColorBtn');
    const threeColorBtn = document.getElementById('threeColorBtn');
    const cssCode = document.getElementById('cssCode');
    const copyBtn = document.getElementById('copyBtn');
    const directionSelect = document.getElementById('directionSelect');
    const useAngleCheckbox = document.getElementById('useAngleCheckbox');
    const angleSlider = document.getElementById('angleSlider');
    const angleValue = document.getElementById('angleValue');
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');
    const color3Input = document.getElementById('color3');
    const applyCustomColorsBtn = document.getElementById('applyCustomColorsBtn');
    const copyNotification = document.getElementById('copyNotification');
    const historyList = document.getElementById('historyList');

    // 현재 상태 관리를 위한 변수들
    let currentColors = [];
    let currentDirection = 'to bottom';
    let currentAngle = 180;
    let isUsingAngle = false;
    let isThreeColors = false;
    let gradientHistory = loadHistoryFromLocalStorage() || [];

    // 페이지 로드시 초기 그라데이션(2색) 생성 및 히스토리 로드
    generateTwoColorGradient();
    renderHistoryList();

    // 이벤트 리스너들
    twoColorBtn.addEventListener('click', generateTwoColorGradient);
    threeColorBtn.addEventListener('click', generateThreeColorGradient);
    
    // 방향 선택 이벤트
    directionSelect.addEventListener('change', () => {
        currentDirection = directionSelect.value;
        applyCurrentGradient();
    });
    
    // 각도 체크박스 이벤트
    useAngleCheckbox.addEventListener('change', () => {
        isUsingAngle = useAngleCheckbox.checked;
        angleSlider.disabled = !isUsingAngle;
        applyCurrentGradient();
    });
    
    // 각도 슬라이더 이벤트
    angleSlider.addEventListener('input', () => {
        currentAngle = angleSlider.value;
        angleValue.textContent = `${currentAngle}°`;
        applyCurrentGradient();
    });
    
    // 직접 색상 설정 이벤트
    applyCustomColorsBtn.addEventListener('click', applyCustomColors);
    
    // 복사 버튼 클릭 이벤트
    copyBtn.addEventListener('click', () => {
        const textToCopy = cssCode.textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showCopyNotification();
            })
            .catch(err => {
                console.error('복사 실패: ', err);
            });
    });

    // 복사 알림 표시 함수
    function showCopyNotification() {
        copyNotification.classList.remove('hidden');
        copyNotification.classList.add('show');
        
        setTimeout(() => {
            copyNotification.classList.remove('show');
            copyNotification.classList.add('hidden');
        }, 2000);
    }

    // 사용자 지정 색상 적용 함수
    function applyCustomColors() {
        const colors = [color1Input.value, color2Input.value];
        if (isThreeColors) {
            colors.push(color3Input.value);
        }
        
        currentColors = colors;
        applyCurrentGradient();
    }

    // 랜덤 색상 생성 함수
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // 랜덤 각도 생성 함수 (0-360도)
    function getRandomAngle() {
        return Math.floor(Math.random() * 361);
    }

    // 2색 그라데이션 생성 함수
    function generateTwoColorGradient() {
        isThreeColors = false;
        currentColors = [getRandomColor(), getRandomColor()];
        applyCurrentGradient();
    }

    // 3색 그라데이션 생성 함수
    function generateThreeColorGradient() {
        isThreeColors = true;
        currentColors = [getRandomColor(), getRandomColor(), getRandomColor()];
        applyCurrentGradient();
    }

    // 현재 설정된 그라데이션 적용 함수
    function applyCurrentGradient() {
        let gradientCSS;
        
        if (isUsingAngle) {
            gradientCSS = `linear-gradient(${currentAngle}deg, ${currentColors.join(', ')})`;
        } else {
            gradientCSS = `linear-gradient(${currentDirection}, ${currentColors.join(', ')})`;
        }
        
        gradientBox.style.background = gradientCSS;
        cssCode.textContent = gradientCSS;
        
        // 그라데이션 히스토리에 저장
        addToHistory(gradientCSS);
        
        // 애니메이션 효과
        animateGradientBox();
    }

    // 히스토리에 추가
    function addToHistory(gradientCSS) {
        // 중복 방지
        const existingIndex = gradientHistory.findIndex(item => item === gradientCSS);
        if (existingIndex !== -1) {
            gradientHistory.splice(existingIndex, 1);
        }
        
        // 최신 항목을 맨 앞에 추가
        gradientHistory.unshift(gradientCSS);
        
        // 최대 5개 항목 유지
        if (gradientHistory.length > 5) {
            gradientHistory.pop();
        }
        
        // 로컬스토리지에 저장
        saveHistoryToLocalStorage();
        
        // UI 갱신
        renderHistoryList();
    }

    // 히스토리 목록 렌더링
    function renderHistoryList() {
        historyList.innerHTML = '';
        
        gradientHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.style.background = item;
            historyItem.title = item;
            historyItem.dataset.index = index;
            
            historyItem.addEventListener('click', () => {
                applyGradientFromHistory(index);
            });
            
            historyList.appendChild(historyItem);
        });
    }

    // 히스토리에서 그라데이션 적용
    function applyGradientFromHistory(index) {
        const gradientCSS = gradientHistory[index];
        gradientBox.style.background = gradientCSS;
        cssCode.textContent = gradientCSS;
        
        // 히스토리 항목을 최상단으로 이동
        addToHistory(gradientCSS);
        
        // 애니메이션 효과
        animateGradientBox();
    }

    // 로컬 스토리지에 히스토리 저장
    function saveHistoryToLocalStorage() {
        localStorage.setItem('gradientHistory', JSON.stringify(gradientHistory));
    }

    // 로컬 스토리지에서 히스토리 로드
    function loadHistoryFromLocalStorage() {
        const savedHistory = localStorage.getItem('gradientHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    }

    // 그라데이션 박스 애니메이션 효과
    function animateGradientBox() {
        gradientBox.style.transform = 'scale(0.98)';
        setTimeout(() => {
            gradientBox.style.transform = 'scale(1)';
        }, 200);
    }
}); 