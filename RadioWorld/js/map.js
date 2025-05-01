// 지도 초기화 변수
let map;
let markers = [];
let currentContinent = 'all';
let radioData = [];
let activeMarker = null;
let currentPlayingStation = null;

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadRadioData();
    setupEventListeners();
});

// 지도 초기화 함수
function initMap() {
    // 초기 지도 설정 (전세계가 보이는 중심점과 확대 레벨)
    map = L.map('map').setView([30, 0], 2);
    
    // 다크 모드 감지하여 지도 스타일 설정
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // 타일 레이어 (지도 스타일) 설정
    if (isDarkMode) {
        // 다크 모드용 타일
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19
        }).addTo(map);
    } else {
        // 라이트 모드용 타일
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
    }
}

// 라디오 데이터 로드 함수
function loadRadioData() {
    fetch('data/stations.json')
        .then(response => response.json())
        .then(data => {
            radioData = data.stations;
            createMarkers(radioData);
            renderStationList(radioData);
        })
        .catch(error => {
            console.error('라디오 데이터를 불러오는데 실패했습니다:', error);
        });
}

// 마커 생성 함수
function createMarkers(stations) {
    // 기존 마커 제거
    clearMarkers();
    
    // 각 방송국에 마커 생성
    stations.forEach(station => {
        // 현재 선택된 대륙이거나 '전체보기'인 경우만 마커 표시
        if (currentContinent === 'all' || station.continent === currentContinent) {
            createMarker(station);
        }
    });
}

// 개별 마커 생성 함수
function createMarker(station) {
    // 사용자 정의 마커 아이콘 생성 (빨간색 원형 마커)
    const markerIcon = L.divIcon({
        className: 'map-marker',
        html: `<div style="background-color: #e74c3c; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
    
    // 마커 생성 및 지도에 추가
    const marker = L.marker([station.lat, station.lng], { icon: markerIcon })
        .addTo(map);
    
    // 마커 클릭 이벤트
    marker.on('click', () => {
        // 팝업 내용 생성
        const popupContent = `
            <div class="station-popup-content">
                <h3>${station.name}</h3>
                <p>${station.country} · ${station.genre}</p>
                <div class="station-popup-controls">
                    <button class="play-btn" onclick="playStationFromPopup('${station.stream}', '${station.name}', '${station.country}', '${station.genre}')">
                        <i class="fas fa-play"></i> 재생
                    </button>
                </div>
            </div>
        `;
        
        // 팝업 생성 및 열기
        marker.bindPopup(popupContent, {
            className: 'station-marker-popup',
            maxWidth: 300
        }).openPopup();
        
        // 활성 마커 스타일 변경
        if (activeMarker) {
            // 이전 활성 마커 스타일 초기화
            const prevIcon = L.divIcon({
                className: 'map-marker',
                html: `<div style="background-color: #e74c3c; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });
            activeMarker.setIcon(prevIcon);
        }
        
        // 현재 마커를 활성 마커로 설정
        activeMarker = marker;
        
        // 활성 마커 스타일 변경 (크기만 키우고 애니메이션 없음)
        const activeIcon = L.divIcon({
            className: 'map-marker active',
            html: `<div style="background-color: #3498db; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        marker.setIcon(activeIcon);
    });
    
    // 마커에 툴팁 추가 (hover 시 방송국 이름 표시)
    marker.bindTooltip(station.name);
    
    // 마커 배열에 추가
    markers.push(marker);
}

// 마커 제거 함수
function clearMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
    activeMarker = null;
}

// 대륙 필터 적용 함수
function filterContinent(continentName) {
    currentContinent = continentName;
    createMarkers(radioData);
    renderStationList(radioData);
    
    // 지도 뷰 조정
    if (continentName !== 'all') {
        // 특정 대륙이 선택된 경우, 해당 대륙의 방송국들을 포함하는 경계로 지도 이동
        const continentStations = radioData.filter(station => station.continent === continentName);
        if (continentStations.length > 0) {
            const bounds = [];
            continentStations.forEach(station => {
                bounds.push([station.lat, station.lng]);
            });
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    } else {
        // 전체보기인 경우 초기 뷰로 복귀
        map.setView([30, 0], 2);
    }
}

// 방송국 리스트 렌더링 함수
function renderStationList(stations) {
    const stationListContainer = document.getElementById('station-list-container');
    if (!stationListContainer) return;
    
    stationListContainer.innerHTML = '';
    
    // 대륙별로 그룹화
    const continentsMap = new Map();
    
    stations.forEach(station => {
        // 현재 선택된 대륙이거나 '전체보기'인 경우만 표시
        if (currentContinent === 'all' || station.continent === currentContinent) {
            if (!continentsMap.has(station.continent)) {
                continentsMap.set(station.continent, []);
            }
            
            continentsMap.get(station.continent).push(station);
        }
    });
    
    // 대륙별 이모지 매핑
    const continentEmoji = {
        'Asia': '🌏',
        'Europe': '🌍',
        'North America': '🌎',
        'South America': '🌎',
        'Africa': '🌍',
        'Oceania': '🌏'
    };
    
    // 대륙 순서 정의
    const continentOrder = [
        'Asia', 
        'Europe', 
        'North America', 
        'South America', 
        'Africa', 
        'Oceania'
    ];
    
    // 정렬된 대륙 순서로 리스트 생성
    continentOrder.forEach(continent => {
        if (continentsMap.has(continent)) {
            const stations = continentsMap.get(continent);
            
            // 대륙별 섹션 생성
            const continentSection = document.createElement('div');
            continentSection.className = 'stations-by-continent';
            
            // 대륙 제목
            const continentTitle = document.createElement('h3');
            continentTitle.className = 'continent-title';
            continentTitle.innerHTML = `<span class="continent-emoji">${continentEmoji[continent] || '🌍'}</span> ${continent}`;
            
            continentSection.appendChild(continentTitle);
            
            // 방송국 목록 생성
            stations.forEach(station => {
                const isPlaying = currentPlayingStation && 
                                 currentPlayingStation.name === station.name && 
                                 currentPlayingStation.stream === station.stream;
                
                const stationItem = document.createElement('div');
                stationItem.className = `station-item ${isPlaying ? 'playing' : ''}`;
                
                stationItem.innerHTML = `
                    <div class="station-info">
                        <div class="station-name">
                            ${station.name}
                            ${isPlaying ? '<span class="playing-badge">재생중</span>' : ''}
                        </div>
                        <div class="station-country-genre">${station.country} · ${station.genre}</div>
                    </div>
                    <button class="station-play-btn">
                        <i class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                `;
                
                // 방송국 클릭 이벤트
                stationItem.addEventListener('click', () => {
                    playStationFromList(station);
                });
                
                continentSection.appendChild(stationItem);
            });
            
            // 컨테이너에 섹션 추가
            stationListContainer.appendChild(continentSection);
        }
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 대륙 필터 버튼 클릭 이벤트
    document.querySelectorAll('.continent-filter button').forEach(button => {
        button.addEventListener('click', (e) => {
            // 활성 버튼 클래스 변경
            document.querySelectorAll('.continent-filter button').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // 필터 적용
            const continent = e.target.getAttribute('data-continent');
            filterContinent(continent);
        });
    });
    
    // 다크 모드 토글 버튼 클릭 이벤트
    document.querySelector('.theme-toggle').addEventListener('click', toggleDarkMode);
}

// 다크 모드 토글 함수
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // 지도 스타일 변경을 위해 지도 재초기화
    map.remove();
    initMap();
    createMarkers(radioData);
}

// 팝업에서 방송국 재생 함수
function playStationFromPopup(streamUrl, name, country, genre) {
    // 방송국 정보 객체 생성
    const station = {
        name: name,
        country: country,
        stream: streamUrl,
        genre: genre
    };
    
    // 현재 재생 중인 방송국 업데이트
    currentPlayingStation = station;
    
    // 라디오 재생 함수 호출
    playRadioStation(station);
    
    // 리스트 업데이트
    renderStationList(radioData);
}

// 리스트에서 방송국 재생 함수
function playStationFromList(station) {
    // 현재 재생 중인 방송국 업데이트
    currentPlayingStation = station;
    
    // 라디오 재생 함수 호출
    playRadioStation(station);
    
    // 리스트 업데이트
    renderStationList(radioData);
    
    // 해당 방송국의 마커 찾기
    const marker = markers.find(m => {
        const pos = m.getLatLng();
        return pos.lat === station.lat && pos.lng === station.lng;
    });
    
    // 마커가 있으면 활성화
    if (marker) {
        // 지도 뷰 이동
        map.setView([station.lat, station.lng], 5);
        
        // 활성 마커 스타일 변경
        if (activeMarker) {
            // 이전 활성 마커 스타일 초기화
            const prevIcon = L.divIcon({
                className: 'map-marker',
                html: `<div style="background-color: #e74c3c; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });
            activeMarker.setIcon(prevIcon);
        }
        
        // 현재 마커를 활성 마커로 설정
        activeMarker = marker;
        
        // 활성 마커 스타일 변경
        const activeIcon = L.divIcon({
            className: 'map-marker active',
            html: `<div style="background-color: #3498db; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        marker.setIcon(activeIcon);
    }
}

// 전역 함수로 노출
window.playStationFromPopup = playStationFromPopup; 