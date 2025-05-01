// 오디오 플레이어 요소 및 제어 변수
let audioPlayer;
let playPauseBtn;
let volumeSlider;
let currentStationDisplay;
let currentCountryDisplay;
let isPlaying = false;
let currentStation = null;
let hlsPlayer = null;

// 방송국 데이터 변수
let radioStations = [];

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
    
    // 방송국 데이터 로드
    loadRadioStations();
});

// 방송국 데이터 로드 함수
function loadRadioStations() {
    fetch('data/stations.json')
        .then(response => response.json())
        .then(data => {
            radioStations = data.stations;
            console.log(`${radioStations.length}개의 방송국 데이터를 불러왔습니다.`);
            
            // map.js에 데이터 전달 (전역 변수 사용)
            if (typeof window.initializeMap === 'function') {
                window.initializeMap(radioStations);
            } else {
                console.error('map.js의 initializeMap 함수를 찾을 수 없습니다.');
            }
        })
        .catch(error => {
            console.error('방송국 데이터를 불러오는데 실패했습니다:', error);
        });
}

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
    
    // 이전에 실행 중인 HLS 인스턴스가 있다면 파괴
    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }
    
    try {
        // 스트림 URL이 HLS 프로토콜(.m3u8)인지 확인
        if (station.stream.includes('.m3u8') && Hls.isSupported()) {
            console.log('HLS 스트림 감지, HLS.js 사용');
            
            hlsPlayer = new Hls();
            hlsPlayer.loadSource(station.stream);
            hlsPlayer.attachMedia(audioPlayer);
            
            hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
                // HLS 매니페스트 파싱 완료, 재생 시작
                const playPromise = audioPlayer.play();
                handlePlayPromise(playPromise, station);
            });
            
            hlsPlayer.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS 오류:', data);
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('네트워크 오류');
                            alert('방송국 연결에 실패했습니다. 네트워크 상태를 확인하세요.');
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('미디어 오류');
                            alert('미디어 재생에 문제가 발생했습니다.');
                            break;
                        default:
                            console.error('HLS 치명적 오류');
                            alert('방송국 재생 중 오류가 발생했습니다.');
                            break;
                    }
                    isPlaying = false;
                    updatePlayPauseIcon(false);
                    updateStationsList();
                }
            });
        } else {
            // 일반 오디오 스트림
            console.log('일반 스트림 재생');
            audioPlayer.src = station.stream;
            audioPlayer.load();
            const playPromise = audioPlayer.play();
            handlePlayPromise(playPromise, station);
        }
    } catch (e) {
        console.error('재생 오류:', e);
        alert('방송국 연결에 실패했습니다. 다른 방송국을 선택해주세요.');
        updateStationsList();
    }
}

// 재생 약속 처리 함수
function handlePlayPromise(playPromise, station) {
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // 재생 성공
            isPlaying = true;
            updatePlayPauseIcon(true);
            
            // 현재 재생 중인 방송국 정보 업데이트
            currentStationDisplay.textContent = station.name;
            currentCountryDisplay.textContent = `${station.country} · ${station.genre}`;
            
            // 방송국 목록 업데이트 (map.js의 함수 호출)
            updateStationsList();
            
            // 재생 중인 방송국 정보를 map.js에 전달
            if (typeof window.updateCurrentPlayingStation === 'function') {
                window.updateCurrentPlayingStation(station);
            }
        }).catch(error => {
            // 재생 실패
            console.error('재생 오류:', error);
            isPlaying = false;
            updatePlayPauseIcon(false);
            alert('방송국 연결에 실패했습니다. 다른 방송국을 선택해주세요.');
            updateStationsList();
        });
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
    if (typeof window.renderStationList === 'function') {
        window.renderStationList(radioStations);
    }
}

// 전역 함수로 노출
window.playRadioStation = playRadioStation;
window.getRadioStations = () => radioStations; 
