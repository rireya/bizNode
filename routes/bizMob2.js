exports.setting = (app, { context, dirname, server }) => {
    const express = require("express");
    const path = require("path");
    const debug = require("debug")(`bizNode:${context}`);
    const util = require("./util");

    const dirPath = dirname.indexOf(":/") !== -1 ? dirname : path.join(`${__dirname}\\..\\..\\`, dirname);
    const contentPath = path.join(dirPath, "WebContent");
    const contextPath = `/${context}`;

    var cookie = {}; // 2.5 서버 쿠키 저장용 변수

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
        }

        next();
    });

    // Get 파일 요청 셋팅
    app.use(contextPath, express.static(contentPath));

    app.post(`${contextPath}/emulator/:json`, function(_req, _res) {
        var url = server[server.selector];
        var serverHost = url.split(":").slice(0, 2).join(":").split("://").pop();
        var serverPort = Number(url.split(":").pop().split("/").shift());
        var serverPath = "/" + url.split(":").pop().split("/").pop();
        var protocol = null;

        // 통신 프로토콜 셋팅
        switch (url.split("://")[0]) {
            case "http" :
                protocol = require("http");
                break;

            case "https" :
                protocol = require("https");
                break;

            default :
                return false;
        }

        /**
         * 데이터 통신
         */
        var jsonReqData = JSON.parse(decodeURIComponent(_req.body.message));
        var data = "message=" + JSON.stringify(jsonReqData);
        var opt = {
            host: serverHost,
            port: serverPort,
            path: serverPath + "/" + _req.params.json,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Content-Length": Buffer.byteLength(data)
            }
        };

        // TODO 로그인전문의 Cookie 정보가 유지되는지 테스트 필요
        // Set Cookie
        if (_req.params.json !== "LOGIN.json" && cookie[url]) {
            opt.headers["Cookie"] = cookie[url];
        }

        // show request message
        debug(`${util.getLocalDate()} | Request ${url}`);
        debug(JSON.stringify(jsonReqData));

        // 데이터 통신
        const creq = protocol.request(opt, function(cres) {
            var strResData = "";

            // Set local cookie
            if (cres.headers["set-cookie"]) {
                cookie[url] = cres.headers["set-cookie"];
            }

            // response encoding
            cres.setEncoding("utf8");

            // get chunk data
            cres.on("data", function(chunk) {
                strResData += chunk;
            });

            // return response
            cres.on("end", function() {
                // show response message
                debug(`${util.getLocalDate()} | Response ${url}`);
                debug(strResData);

                _res.writeHead(cres.statusCode, {"Content-Type": "application/json"});
                _res.end(strResData);
            });
        });

        // set error catch
        creq.on("error", function(e) {
            debug(`problem with request:: ${e.message}`);
            _res.writeHead(500);
            _res.end();
        });

        // request message
        creq.write(data);
        creq.end();
    });
};