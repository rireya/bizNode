module.exports = {
    /**
     * Open할 포트 번호
     */
    "port": 8080,

    /**
     * Local Web 서버 Open 정보
     */
    "configList": [{
        /**
         * bizMOB 3.0 정보
         */
        "version": "3", // bizMOB Client 버전 정보 ("3")
        "context": "test",
        "dirname": "/testFolder", // 역슬래시는 슬래시 변경 (Ex. /testFolder, C:/workspace/testFolder)
        "option": {
            /**
             * 전문요청 서버 정보
             * 입력시 Client에서 전달받은 전문 요청을 바이패스 해서 Client에 Response 전달
             *   Ex. http://10.6.9.173:8080/test.server
             */
            "server": "",

            /**
             * 기타 설정 정보
             * emulator.html 경로가 기본값과 다를경우 셋팅 (경로는 /WebContent 이후 경로작성)
             *   Ex. webemulator/html/emulator.html
             */
            "emulator": "",
        }
    }, {
        /**
         * bizMOB 2.5 정보
         */
        "version": "2", // bizMOB Client 버전 정보 ("2")
        "context": "test2",
        "dirname": "/testFolder2", // 역슬래시는 슬래시 변경 (Ex. /testFolder, C:/workspace/testFolder)
        "server": {
            // 해당 파라미터의 Value값을 Key로 해서 서버를 선택 (Ex. selector가 dev일 경우 server.dev의 주소를 서버로 셋팅)
            "selector": "dev",

            // selector의 value를 key값으로 가지는 서버 목록
            "real": "https://127.0.0.1:8090/bizNode",
            "dev": "https://127.0.0.1:8090/bizNode",
            "sample": "https://127.0.0.1:8090/bizNode"
        }
    }]
};