document.addEventListener('DOMContentLoaded', function() {
    // 페이지 확인 및 적절한 데이터 로드
    const currentPage = getCurrentPage();
    
    // 각 페이지별 기능 초기화
    switch(currentPage) {
        case 'rules':
            initRulesPage();
            break;
        case 'kbo':
            initKboPage();
            break;
        case 'npb':
            initNpbPage();
            break;
        case 'mlb':
            initMlbPage();
            break;
        default:
            // 홈페이지 또는 다른 페이지
            break;
    }
});

// 현재 페이지 확인 함수
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'rules.html') return 'rules';
    if (page === 'kbo.html') return 'kbo';
    if (page === 'npb.html') return 'npb';
    if (page === 'mlb.html') return 'mlb';
    
    return 'home';
}

// 규칙 페이지 초기화
function initRulesPage() {
    loadRulesData()
        .then(renderRules)
        .catch(error => {
            console.error('규칙 데이터를 로드하는 중 오류가 발생했습니다:', error);
            document.getElementById('rules-container').innerHTML = `
                <div class="error-message">
                    <p>데이터를 불러오는 중 오류가 발생했습니다. 새로고침을 시도해 주세요.</p>
                </div>
            `;
        });
    
    // 필터 버튼 이벤트 리스너 등록
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 활성 버튼 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 필터링 실행
            filterRules(category);
        });
    });
    
    // 검색 기능 이벤트 리스너 등록
    const searchInput = document.getElementById('rule-search');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', function() {
        searchRules(searchInput.value);
    });
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchRules(searchInput.value);
        }
    });
}

// 규칙 데이터 로드 (실제로는 fetch를 사용하여 JSON 파일을 불러옴)
function loadRulesData() {
    // 임시 데이터 (실제 구현에서는 fetch로 data/rules.json 파일 로드)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: "스트라이크",
                    description: "투수가 던진 공이 스트라이크 존(타자의 무릎부터 가슴까지, 홈 플레이트의 너비)에 들어오거나 타자가 헛스윙했을 때 스트라이크로 판정됩니다.",
                    category: "basic"
                },
                {
                    id: 2,
                    title: "볼",
                    description: "투수가 던진 공이 스트라이크 존을 벗어났고, 타자가 치지 않았을 때 볼로 판정됩니다.",
                    category: "basic"
                },
                {
                    id: 3,
                    title: "삼진 아웃",
                    description: "타자가 세 번의 스트라이크를 당하면 아웃됩니다. 이를 삼진 아웃이라고 합니다.",
                    category: "basic"
                },
                {
                    id: 4,
                    title: "포볼",
                    description: "타자가 네 개의 볼을 얻으면 1루로 출루할 수 있습니다. 이를 포볼(base on balls) 또는 사구라고 합니다.",
                    category: "basic"
                },
                {
                    id: 5,
                    title: "파울 볼",
                    description: "타자가 친 공이 1, 3루 베이스 바깥쪽 라인(파울 라인)을 넘어가면 파울 볼로 판정됩니다. 파울 볼은 스트라이크 카운트가 2개 미만일 때만 스트라이크로 인정됩니다.",
                    category: "bat"
                },
                {
                    id: 6,
                    title: "타자의 아웃",
                    description: "타자는 세 가지 방법으로 아웃될 수 있습니다: 삼진, 플라이 아웃(타구를 수비수가 땅에 닿기 전에 잡음), 그라운드 아웃(타구가 땅에 닿은 후 수비수가 1루에 공을 던져 타자보다 먼저 도착).",
                    category: "bat"
                },
                {
                    id: 7,
                    title: "안타",
                    description: "타자가 친 공이 야수에게 잡히지 않고 페어 지역에 떨어진 후, 타자가 1루 이상의 베이스에 안전하게 도달했을 때 안타로 인정됩니다.",
                    category: "bat"
                },
                {
                    id: 8,
                    title: "홈런",
                    description: "타자가 친 공이 페어 지역으로 외야 담장을 넘어가는 경우, 타자는 모든 베이스를 돌아 득점할 수 있는 홈런으로 인정됩니다.",
                    category: "bat"
                },
                {
                    id: 9,
                    title: "인필드 플라이",
                    description: "무사 또는 1사 주자 1, 2루 또는 만루 상황에서 내야에 뜬 공이 쉽게 잡힐 수 있다고 판단될 때 타자는 자동으로 아웃 처리됩니다.",
                    category: "field"
                },
                {
                    id: 10,
                    title: "더블 플레이",
                    description: "수비팀이 한 플레이에서 두 명의 주자를 아웃시키는 것을 더블 플레이라고 합니다. 가장 흔한 형태는 타자가 친 공을 내야수가 잡아 2루수에게 던지고, 다시 1루수에게 던져 타자와 주자 모두 아웃시키는 것입니다.",
                    category: "field"
                },
                {
                    id: 11,
                    title: "볼크",
                    description: "투수가 규칙을 위반하는 투구 동작을 하면 볼크가 선언되며, 모든 주자는 한 베이스씩 진루합니다.",
                    category: "pitch"
                },
                {
                    id: 12,
                    title: "와일드 피치",
                    description: "투수가 던진 공이 포수가 잡기 어려울 정도로 빗나갔을 때 와일드 피치로 판정되며, 주자들은 진루할 기회를 얻습니다.",
                    category: "pitch"
                }
            ]);
        }, 1000);
    });
}

// 규칙 렌더링 함수
function renderRules(rules) {
    const rulesContainer = document.getElementById('rules-container');
    
    // 로딩 표시 제거
    rulesContainer.innerHTML = '';
    
    // 규칙 카드 생성
    rules.forEach(rule => {
        const ruleCard = document.createElement('div');
        ruleCard.className = `rule-card ${rule.category}`;
        
        ruleCard.innerHTML = `
            <div class="rule-card-header">
                <span class="rule-card-number">#${rule.id}</span>
                <h3>${rule.title}</h3>
            </div>
            <div class="rule-card-body">
                <p>${rule.description}</p>
            </div>
        `;
        
        rulesContainer.appendChild(ruleCard);
    });
}

// 규칙 필터링 함수
function filterRules(category) {
    const ruleCards = document.querySelectorAll('.rule-card');
    
    ruleCards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 규칙 검색 함수
function searchRules(searchTerm) {
    const ruleCards = document.querySelectorAll('.rule-card');
    const term = searchTerm.toLowerCase();
    
    ruleCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(term) || description.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // 모든 필터 버튼 비활성화, '전체' 버튼만 활성화
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === 'all') {
            btn.classList.add('active');
        }
    });
}

// KBO 페이지 초기화
function initKboPage() {
    loadKboData()
        .then(renderKboTeams)
        .catch(error => {
            console.error('KBO 데이터를 로드하는 중 오류가 발생했습니다:', error);
            document.getElementById('team-grid').innerHTML = `
                <div class="error-message">
                    <p>데이터를 불러오는 중 오류가 발생했습니다. 새로고침을 시도해 주세요.</p>
                </div>
            `;
        });
}

// KBO 데이터 로드 (임시 데이터)
function loadKboData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    name: "SSG 랜더스",
                    location: "인천",
                    founded: "1982년 (SK 와이번스의 전신인 인천 쌍방울)",
                    stadium: "인천 SSG 랜더스필드",
                    mascot: "랜디, 린디, 찬디",
                    logo: "images/ssg.jpg"
                },
                {
                    name: "키움 히어로즈",
                    location: "서울",
                    founded: "2008년 (우리 히어로즈로 창단)",
                    stadium: "고척 스카이돔",
                    mascot: "터키, 허로, 제로",
                    logo: "images/kiwoom.jpg"
                },
                {
                    name: "LG 트윈스",
                    location: "서울",
                    founded: "1982년 (MBC 청룡으로 창단)",
                    stadium: "잠실야구장",
                    mascot: "응원단장 럭키, 응원단장 제리",
                    logo: "images/lg.jpg"
                },
                {
                    name: "KT 위즈",
                    location: "수원",
                    founded: "2013년 (2015년 1군 참가)",
                    stadium: "수원 KT 위즈 파크",
                    mascot: "빅토, 쏘니",
                    logo: "images/kt.jpg"
                },
                {
                    name: "NC 다이노스",
                    location: "창원",
                    founded: "2011년 (2013년 1군 참가)",
                    stadium: "창원 NC 파크",
                    mascot: "단디, 쎄리",
                    logo: "images/nc.jpg"
                },
                {
                    name: "KIA 타이거즈",
                    location: "광주",
                    founded: "1982년 (해태 타이거즈로 창단)",
                    stadium: "광주-기아 챔피언스 필드",
                    mascot: "호걸이, 호돌이, 챔피",
                    logo: "images/kia.jpg"
                },
                {
                    name: "두산 베어스",
                    location: "서울",
                    founded: "1982년 (OB 베어스로 창단)",
                    stadium: "잠실 야구장",
                    mascot: "뚜뚜, 베어",
                    logo: "images/doosan.jpg"
                },
                {
                    name: "롯데 자이언츠",
                    location: "부산",
                    founded: "1975년 (일본 프로야구 참가 후 1982년 KBO 참가)",
                    stadium: "사직 야구장",
                    mascot: "거인, 아라",
                    logo: "images/lotte.jpg"
                },
                {
                    name: "삼성 라이온즈",
                    location: "대구",
                    founded: "1982년",
                    stadium: "대구 삼성 라이온즈 파크",
                    mascot: "블루, 레오",
                    logo: "images/samsung.jpg"
                },
                {
                    name: "한화 이글스",
                    location: "대전",
                    founded: "1986년 (빙그레 이글스로 창단)",
                    stadium: "대전 한화생명 이글스 파크",
                    mascot: "수리, 단",
                    logo: "images/hanwha.jpg"
                }
            ]);
        }, 1000);
    });
}

// KBO 팀 카드 렌더링 함수
function renderKboTeams(teams) {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;
    
    teamGrid.innerHTML = '';
    
    // 팀명과 파일명 매핑 테이블
    const teamFileMap = {
        'SSG 랜더스': 'ssg',
        'kt 위즈': 'kt',
        'KT 위즈': 'kt',
        '두산 베어스': 'doosan',
        'LG 트윈스': 'lg',
        '키움 히어로즈': 'kiwoom',
        'NC 다이노스': 'nc',
        'KIA 타이거즈': 'kia',
        '기아 타이거즈': 'kia',
        '롯데 자이언츠': 'lotte',
        '삼성 라이온즈': 'samsung',
        '한화 이글스': 'hanwha'
    };
    
    teams.forEach(team => {
        // 팀 이름을 사용하여 정확한 파일명 매핑 획득
        let teamId = teamFileMap[team.name] || team.name.split(' ')[0].toLowerCase();
        
        // 기아 타이거즈 우승 여부 확인
        const isRecentChampion = teamId === 'kia' || team.name.includes('기아') || team.name.includes('KIA');
        
        let teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <div class="team-logo">
                <img src="${team.logo}" alt="${team.name} 로고" onerror="this.src='images/default-logo.png'">
            </div>
            <div class="team-info">
                <h3>${team.name}</h3>
                <div class="team-location">${team.location}</div>
                ${isRecentChampion ? '<span class="champion-badge">2024 챔피언</span>' : ''}
                <div class="team-details">
                    <p><strong>창단:</strong> ${team.founded}</p>
                    <p><strong>구장:</strong> ${team.stadium}</p>
                    <p><strong>마스코트:</strong> ${team.mascot}</p>
                </div>
                <div class="team-link">
                    <a href="teams/${teamId}.html" class="btn btn-primary">팀 상세보기</a>
                </div>
            </div>
        `;
        
        teamGrid.appendChild(teamCard);
    });
}

// NPB 페이지 초기화
function initNpbPage() {
    // NPB 팀 데이터 로드 (여기서는 생략)
    const teamGrid = document.getElementById('npb-team-grid');
    if (teamGrid) {
        teamGrid.innerHTML = `
            <div class="team-card">
                <div class="team-logo">
                    <img src="images/yomiuri.jpg" alt="요미우리 자이언츠 로고" onerror="this.src='images/default-logo.png'">
                </div>
                <div class="team-info">
                    <h3>요미우리 자이언츠</h3>
                    <div class="team-location">도쿄</div>
                    <div class="team-details">
                        <p><strong>리그:</strong> 센트럴 리그</p>
                        <p><strong>구장:</strong> 도쿄 돔</p>
                        <p><strong>일본시리즈 우승:</strong> 22회</p>
                    </div>
                </div>
            </div>
            <div class="team-card">
                <div class="team-logo">
                    <img src="images/hanshin.jpg" alt="한신 타이거스 로고" onerror="this.src='images/default-logo.png'">
                </div>
                <div class="team-info">
                    <h3>한신 타이거스</h3>
                    <div class="team-location">오사카/효고</div>
                    <div class="team-details">
                        <p><strong>리그:</strong> 센트럴 리그</p>
                        <p><strong>구장:</strong> 한신 고시엔 구장</p>
                        <p><strong>일본시리즈 우승:</strong> 1회</p>
                    </div>
                </div>
            </div>
            <div class="team-card">
                <div class="team-logo">
                    <img src="images/softbank.jpg" alt="소프트뱅크 호크스 로고" onerror="this.src='images/default-logo.png'">
                </div>
                <div class="team-info">
                    <h3>소프트뱅크 호크스</h3>
                    <div class="team-location">후쿠오카</div>
                    <div class="team-details">
                        <p><strong>리그:</strong> 퍼시픽 리그</p>
                        <p><strong>구장:</strong> 후쿠오카 페이페이 돔</p>
                        <p><strong>일본시리즈 우승:</strong> 11회</p>
                    </div>
                </div>
            </div>
            <div class="team-card">
                <div class="team-logo">
                    <img src="images/carp.jpg" alt="히로시마 도요 카프 로고" onerror="this.src='images/default-logo.png'">
                </div>
                <div class="team-info">
                    <h3>히로시마 도요 카프</h3>
                    <div class="team-location">히로시마</div>
                    <div class="team-details">
                        <p><strong>리그:</strong> 센트럴 리그</p>
                        <p><strong>구장:</strong> 마쓰다 줌-줌 스타디움 히로시마</p>
                        <p><strong>일본시리즈 우승:</strong> 3회</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// MLB 페이지 초기화
function initMlbPage() {
    // MLB 관련 기능 초기화 (여기서는 생략)
} 