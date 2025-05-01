// 오디오 플레이어 요소 및 제어 변수
let audioPlayer;
let playPauseBtn;
let volumeSlider;
let currentStationDisplay;
let currentCountryDisplay;
let isPlaying = false;
let currentStation = null;

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 오디오 플레이어 요소 참조
    audioPlayer = document.getElementById('radio-player');
    playPauseBtn = document.querySelector('.play-pause-btn');
    volumeSlider = document.querySelector('.volume-slider');
    currentStationDisplay = document.querySelector('.current-station');
    currentCountryDisplay = document.querySelector('.current-country');
    
    // 이벤트 리스너 설정
    setupPlayerControls();
});

// 플레이어 컨트롤 설정
function setupPlayerControls() {
    // 재생/일시정지 버튼 클릭 이벤트
    playPauseBtn.addEventListener('click', () => {
        if (!currentStation) {
            alert('먼저 라디오 방송국을 선택해주세요.');
            return;
        }
        
        togglePlayPause();
    });
    
    // 볼륨 슬라이더 변경 이벤트
    volumeSlider.addEventListener('input', (e) => {
        setVolume(e.target.value);
    });
    
    // 오디오 플레이어 이벤트
    // 재생 시작 이벤트
    audioPlayer.addEventListener('play', () => {
        updatePlayPauseIcon(true);
        isPlaying = true;
        updateStationsList();
    });
    
    // 일시정지 이벤트
    audioPlayer.addEventListener('pause', () => {
        updatePlayPauseIcon(false);
        isPlaying = false;
        updateStationsList();
    });
    
    // 오류 발생 이벤트
    audioPlayer.addEventListener('error', (e) => {
        console.error('오디오 재생 오류:', e);
        alert('방송국 연결 중 오류가 발생했습니다. 다른 방송국을 선택해주세요.');
        updatePlayPauseIcon(false);
        isPlaying = false;
        updateStationsList();
    });
    
    // 볼륨 초기값 설정
    setVolume(volumeSlider.value);
}

// 라디오 방송국 재생 함수
function playRadioStation(station) {
    // 현재 재생 중인 동일 방송국이면 일시정지/재생 토글
    if (currentStation && currentStation.stream === station.stream) {
        togglePlayPause();
        return;
    }
    
    // 새 방송국 설정
    currentStation = station;
    
    // 오디오 소스 설정
    audioPlayer.src = station.stream;
    
    // 재생 시작
    try {
        audioPlayer.load();
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 재생 성공
                isPlaying = true;
                updatePlayPauseIcon(true);
                
                // 현재 재생 중인 방송국 정보 업데이트
                currentStationDisplay.textContent = station.name;
                currentCountryDisplay.textContent = `${station.country} · ${station.genre}`;
                
                // 방송국 목록 업데이트
                updateStationsList();
            }).catch(error => {
                // 재생 실패
                console.error('재생 오류:', error);
                isPlaying = false;
                updatePlayPauseIcon(false);
                alert('방송국 연결에 실패했습니다. 다른 방송국을 선택해주세요.');
                updateStationsList();
            });
        }
    } catch (e) {
        console.error('재생 오류:', e);
        alert('방송국 연결에 실패했습니다. 다른 방송국을 선택해주세요.');
        updateStationsList();
    }
}

// 재생/일시정지 토글 함수
function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayPauseIcon(false);
        updateStationsList();
    } else {
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updatePlayPauseIcon(true);
                updateStationsList();
            }).catch(error => {
                console.error('재생 오류:', error);
                isPlaying = false;
                updatePlayPauseIcon(false);
                updateStationsList();
            });
        }
    }
}

// 볼륨 설정 함수
function setVolume(volume) {
    audioPlayer.volume = volume;
    
    // 볼륨 아이콘 변경
    const volumeIcon = document.querySelector('.volume-control i');
    
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// 재생/일시정지 아이콘 업데이트 함수
function updatePlayPauseIcon(isPlaying) {
    const icon = playPauseBtn.querySelector('i');
    
    if (isPlaying) {
        icon.className = 'fas fa-pause';
    } else {
        icon.className = 'fas fa-play';
    }
}

// 방송국 목록 업데이트 함수
function updateStationsList() {
    // map.js의 renderStationList 함수 호출
    if (typeof renderStationList === 'function' && typeof radioData !== 'undefined') {
        renderStationList(radioData);
    }
}

// 전역 함수로 노출
window.playRadioStation = playRadioStation; 