# 🌍 RadioWorld

**RadioWorld**는 전 세계 여러 국가의 대표 라디오 채널을 한 곳에서 스트리밍할 수 있는 웹사이트입니다.  
HTML, CSS, JavaScript만을 이용해 제작되었으며, 버튼 클릭을 통해 각국 라디오를 간편하게 재생할 수 있습니다.

---

## 🚀 주요 기능

- ✅ 국가별 대표 라디오 채널 버튼 제공
- ✅ 버튼 클릭 시 오디오 스트리밍 시작
- ✅ 현재 재생 중인 라디오 방송 및 국가 정보 표시
- ✅ 볼륨 조절 및 재생/일시정지 버튼 제공

---

## 🖼️ 스크린샷

> 예시  
> ![RadioWorld Screenshot](./screenshots/main.png)

---

## 📁 파일 구조

RadioWorld/ ├── index.html # 메인 페이지 ├── css/ │ └── style.css # 전체 스타일 정의 ├── js/ │ └── main.js # 기능 구현용 JavaScript ├── assets/ │ ├── images/ # 배경 및 버튼 이미지 │ └── audio/ # (필요 시) 샘플 오디오 파일 └── stations.json # 방송국 정보 목록 (URL 포함)

yaml
코드 복사

---

## ⚠️ 주의사항

- 일부 라디오 스트리밍 URL은 CORS 정책이나 서버 정책에 따라 **재생이 되지 않을 수 있습니다**.
- SBS Love FM 등의 국내 방송은 보안 제한 또는 DRM으로 인해 브라우저에서 직접 스트리밍이 불가능한 경우가 있습니다.
- 실시간으로 정상 재생되는 방송국 링크를 원활하게 유지하려면 `stations.json`을 수시로 갱신해야 합니다.

---

## 💡 커스터마이징 가이드

1. `stations.json` 파일을 열고 원하는 라디오 방송국의 이름, 국가, 스트리밍 URL을 추가하거나 수정합니다.
2. `main.js` 내에서 JSON 데이터를 파싱하여 자동으로 버튼 및 스트리밍 기능을 생성합니다.
3. 이미지나 UI 구성은 `css/style.css`에서 자유롭게 커스터마이징 가능합니다.

---

## 👩‍💻 기술 스택

- HTML5
- CSS3
- Vanilla JavaScript (ES6)

---

## 📌 TODO (계획 중 기능)

- [ ] 라디오 즐겨찾기 기능
- [ ] 국가별 검색 기능
- [ ] 사용자 언어 자동 감지 및 UI 다국어 지원
- [ ] 라디오 방송이 유효한지 주기적 검증 기능

---

## 📜 라이선스

본 프로젝트는 MIT 라이선스를 따릅니다. 자유롭게 사용 및 수정하세요.
