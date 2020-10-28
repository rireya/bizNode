# bizNode

## 설치 및 실행

1. [node.js](https://nodejs.org/ko/) 설치

2. ```biznode.config.js``` 파일의 설정값 수정

3. ```app.bat``` 파일 실행

## 트러블 슈팅

* 실행시 ```Error: listen EADDRINUSE :::<Input Port Number>``` 오류 발생: 포트값 수정

* 접속시 ```ERR_CONNECTION_RESET``` 오류가 발생: 포트값 수정

* 에뮬레이터 경로가 올바르지 않다고 오류가 발생: 에뮬레이터 경로값을 option 정보에 입력

## Mock 서버 기능

1. ```public/mock``` 경로에 ```biznode.config.js```에 설정한 context와 동일한 폴더명 생성

2. 생성한 폴더내부에 테스트용 JSON을 trcode 명칭으로 생성 (Ex. TMP0000.json)

3. Client에서 요청서버 정보를 자신의 bizNode 서버정보로 변경

4. Client에서 JSON 데이터 요청시 앞에 ```test-``` 붙이기 (Ex. _sTrcode: "TMP0000" -> _sTrcode: "test-TMP0000")

## 파일 공유 서버 기능

1. ```public/share``` 경로에 공유할 폴더 이동

2. ```{LOCAL IP}:{PORT}/share/{파일 PATH}```로 접근 가능

## 기타

* 참고소스: https://jeonghwan-kim.github.io/%ec%9d%b5%ec%8a%a4%ed%94%84%eb%a0%88%ec%8a%a4-api-%ec%84%9c%eb%b2%84-%ed%85%8c%ec%8a%a4%ed%8a%b8-%ec%bd%94%eb%93%9c-%ec%9e%91%ec%84%b1%ed%95%98%ea%b8%b0/
