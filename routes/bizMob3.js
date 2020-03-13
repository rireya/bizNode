exports.setting = (app, { context, dirname, option }) => {
    const express = require("express");
    const path = require("path");
    const fs = require("fs");
    const request = require("axios");
    const qs = require("querystring");
    const debug = require("debug")(`bizNode:${context}`);
    const util = require("./util");

    const dirPath = path.join(`${__dirname}\\..\\..\\`, dirname);
    const contentPath = path.join(dirPath, "WebContent");
    const emulatorPath = path.join(contentPath, option.emulator || "webemulator/html/emulator.html");
    const contextPath = `/${context}`;

    // Log 미들웨어
    app.use(contextPath, (req, res, next) => {
        const reqPath = req.path;
        const type = reqPath.split(".").pop();
        const traceLog = `${util.getLocalDate()} | ${util.getRequestIP(req).padEnd(15, " ")} | ${util.getLocalIP().padEnd(15, " ")} | ${req.method} ${req.path}`;
        
        // HTML
        if (type === "html") {
            debug(traceLog);
        }
        // Trcode Request
        else if (type === "json") {
            debug(traceLog);

            switch (req.method) {
                case "GET": {
                    if (req.query.message) {
                        debug(`Request: ${JSON.stringify(JSON.parse(req.query.message), null, "    ")}`);
                    }
                    break;
                }

                default: {
                    if (req.body.message) {
                        debug(`Request: ${JSON.stringify(JSON.parse(req.body.message), null, "    ")}`);
                    }
                    break;
                }
            }
        }

        next();
    });

    // Get 파일 요청 셋팅
    app.use(contextPath, express.static(contentPath));

    // 루트경로(에뮬레이터) 라우터
    app.get(contextPath, (req, res) => {
        fs.exists(emulatorPath, (isExisits) => {
            if (isExisits) {
                res.sendFile(emulatorPath);
            }
            else {
                const logMsg = `Emulator not found: ${emulatorPath}`;

                debug(logMsg);
                res.status(404).send(logMsg);
            }
        });
    });

    // 에뮬레이터 기타 Post 파일요청 라우터
    app.post(`${contextPath}/*`, (req, res, next) => {
        const filePath = path.join(contentPath, req.url.replace(contextPath, ""));

        fs.exists(filePath, (isExisits) => {
            if (isExisits) {
                res.sendFile(filePath);
            }
            else {
                if (filePath.split(".").pop() === "json") {
                    next();
                }
                else {
                    const logMsg = `Not found: ${filePath}`;
    
                    debug(logMsg);
                    res.status(404).send(logMsg);
                }
            }
        });
    });

    /**
     * 에뮬레이터에서 요청한 전문 라우터
     */
    app.get(`${contextPath}/:trcode`, (req, res) => {
        const trcode = req.params.trcode;
        const message = JSON.parse(req.query.message);
        const callback = req.query.callback;

        // 테스트 코드일 경우 Mock 데이터 전달
        if (trcode.indexOf("test-") === 0)  {
            const mockFilePath = path.join(`${__dirname}/../`, "public/mock");
            const jsonFilePath = path.join(mockFilePath, `${context}/${trcode.replace("test-", "")}`);

            fs.exists(jsonFilePath, (isExisits) => {
                const jsonFile = isExisits
                    ? JSON.parse(fs.readFileSync(jsonFilePath))
                    : util.getErrorJson(trcode, `${jsonFilePath} 파일을 찾을 수가 없습니다.`);

                debug(`test-Response: ${JSON.stringify(jsonFile, null, "    ")}`);
                res
                    .set("Content-Type", "application/json;charset=UTF-8")
                    .send(`${callback}(${JSON.stringify(jsonFile, null, "    ")})`);
            });
        }
        else {
            const serverUrl = option.server || "";

            // 전문요청 서버를 지정한 경우에만 전송
            if (serverUrl) {
                const requestUrl = `${serverUrl}/${trcode}`;
                const requestData = qs.stringify({ message: JSON.stringify(message) });
                
                request
                    .post(requestUrl, requestData, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })
                    .then((result) => {
                        if (result.status === 200) {
                            debug(`Response: ${JSON.stringify({ header: result.data.header, body: result.data.body }, null, "    ")}`);
                            res
                                .set("Content-Type", "application/json;charset=UTF-8")
                                .send(`${callback}(${JSON.stringify(result.data, null, "    ")})`);
                        }
                        else {
                            res.status(500).end();
                        }
                    });
            }
            else {
                const jsonFile = util.getErrorJson(trcode, "설정된 전문요청 서버 정보가 없습니다.");

                res
                    .set("Content-Type", "application/json;charset=UTF-8")
                    .send(`${callback}(${JSON.stringify(jsonFile, null, "    ")})`);
            }
        }
    });

    /**
     * Native에서 요청한 전문 라우터
     */
    app.post(`${contextPath}/:trcode`, (req, res) => {
        const trcode = req.params.trcode;
        const message = JSON.parse(req.body.message);

        // 테스트 코드일 경우 Mock 데이터 전달
        if (trcode.indexOf("test-") === 0)  {
            const mockFilePath = path.join(`${__dirname}/../`, "public/mock");
            const jsonFilePath = path.join(mockFilePath, `${context}/${trcode.replace("test-", "")}`);

            fs.exists(jsonFilePath, (isExisits) => {
                const jsonFile = isExisits
                    ? JSON.parse(fs.readFileSync(jsonFilePath))
                    : util.getErrorJson(trcode, `${jsonFilePath} 파일을 찾을 수가 없습니다.`);

                debug(`test-Response: ${JSON.stringify(jsonFile, null, "    ")}`);
                res
                    .set("Content-Type", "application/json;charset=UTF-8")
                    .send(JSON.stringify(jsonFile, null, "    "));
            });
        }
        else {
            const serverUrl = option.server || "";
    
            // 전문요청 서버를 지정한 경우에만 전송
            if (serverUrl) {
                const requestUrl = `${serverUrl}/${trcode}`;
                const requestData = qs.stringify({ message: JSON.stringify(message) });
                
                // TODO 롯데칠성 암호화통신 ZZ0008을 통과하지 못하여 다른 프로젝트로 테스트 필요
                request
                    .post(requestUrl, requestData, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })
                    .then((result) => {
                        if (result.status === 200) {
                            debug(`Response: ${JSON.stringify({ header: result.data.header, body: result.data.body }, null, "    ")}`);
                            res
                                .set("Content-Type", "application/json;charset=UTF-8")
                                .send(JSON.stringify(result.data));
                        }
                        else {
                            res.status(500).end();
                        }
                    });
            }
            else {
                const jsonFile = util.getErrorJson(trcode, "설정된 전문요청 서버 정보가 없습니다.");
    
                res
                    .set("Content-Type", "application/json;charset=UTF-8")
                    .send(JSON.stringify(jsonFile));
            }
        }
    });
};