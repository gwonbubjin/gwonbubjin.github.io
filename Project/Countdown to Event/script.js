document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 선택
    const eventDateInput = document.getElementById('event-date');
    const eventNameInput = document.getElementById('event-name');
    const calculateBtn = document.getElementById('calculate-btn');
    const countdownResult = document.getElementById('countdown-result');
    const eventTitle = document.getElementById('event-title');
    const daysDisplay = document.getElementById('days-display');
    const messageDisplay = document.getElementById('message-display');
    const countdownElement = document.querySelector('.countdown');

    // 오늘 날짜를 기본값으로 설정
    const today = new Date();
    const formattedDate = formatDate(today);
    eventDateInput.value = formattedDate;
    eventDateInput.min = formattedDate; // 과거 날짜 비활성화

    // 계산하기 버튼 클릭 이벤트
    calculateBtn.addEventListener('click', calculateDaysRemaining);

    // 날짜 및 엔터키 입력 이벤트
    eventDateInput.addEventListener('change', calculateDaysRemaining);
    eventDateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateDaysRemaining();
    });
    eventNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateDaysRemaining();
    });

    // 날짜 포맷 함수 (YYYY-MM-DD)
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // D-day 계산 함수
    function calculateDaysRemaining() {
        const eventDate = new Date(eventDateInput.value + 'T00:00:00');
        const currentDate = new Date();
        
        // 시간 차이 계산을 위해 시간, 분, 초, 밀리초 제거
        currentDate.setHours(0, 0, 0, 0);
        
        // 두 날짜 간의 차이 계산 (밀리초)
        const timeDifference = eventDate - currentDate;
        
        // 밀리초를 일 단위로 변환
        const daysDifference = Math.round(timeDifference / (1000 * 60 * 60 * 24));
        
        // 이벤트 이름 가져오기
        const eventName = eventNameInput.value.trim();
        
        // 결과 표시
        displayResult(daysDifference, eventName);
    }

    // 결과 표시 함수
    function displayResult(daysDifference, eventName) {
        // 결과 영역 표시
        countdownResult.classList.remove('hidden');
        countdownResult.classList.add('show');
        
        // 상태 클래스 초기화
        countdownElement.classList.remove('urgent', 'today', 'passed');
        
        // 이벤트 제목 설정
        if (eventName) {
            eventTitle.textContent = eventName;
        } else {
            eventTitle.textContent = 'D-DAY';
        }
        
        // 날짜에 따른 결과 메시지 및 스타일 설정
        if (daysDifference > 0) {
            daysDisplay.textContent = `D-${daysDifference}`;
            messageDisplay.textContent = `${daysDifference}일 남았습니다`;
            
            // 7일 이내라면 긴급 스타일 적용
            if (daysDifference <= 7) {
                countdownElement.classList.add('urgent');
            }
        } else if (daysDifference === 0) {
            daysDisplay.textContent = 'D-DAY';
            messageDisplay.textContent = '오늘이 바로 그 날입니다!';
            countdownElement.classList.add('today');
        } else {
            const passedDays = Math.abs(daysDifference);
            daysDisplay.textContent = `D+${passedDays}`;
            messageDisplay.textContent = `이미 ${passedDays}일 지났습니다`;
            countdownElement.classList.add('passed');
        }
        
        // 애니메이션 효과를 위한 리셋
        daysDisplay.style.animation = 'none';
        daysDisplay.offsetHeight; // 리플로우 강제
        daysDisplay.style.animation = null;
    }

    // 페이지 로드시 초기 계산
    calculateDaysRemaining();
}); 