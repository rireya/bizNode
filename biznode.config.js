module.exports = {
    /**
     * Open할 포트 번호
     */
    "port": 3000,

    /**
     * Local Web 서버 Open 정보
     */
    "configList": [{
        /** 웹 서버 정보 */
        "context": "test",
        "dirname": "testFolder",
        "option": {
            /**
             * 전문요청 서버 정보
             */
            "server": "",

            /**
             * 기타 설정 정보
             * emulator.html 경로가 기본값과 다를경우 셋팅 (경로는 /WebContent 이후 경로작성)
             *   Ex. webemulator/html/emulator.html
             */
            "emulator": "",
        }
    }]
};