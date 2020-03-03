exports.setting = (app, { folder, dir, option }) => {
    const express = require("express");
    const path = require("path");
    const fs = require("fs");
    const debug = require("debug")(`bizNode:${dir}`);

    const dirPath = path.join(`${__dirname}\\..\\..\\`, folder);
    const contentPath = path.join(dirPath, "WebContent");
    const emulatorPath = path.join(contentPath, option.emulator || "webemulator/html/emulator.html");
    const folderPath = `/${folder}`;

    // Get 파일 요청 셋팅
    app.use(folderPath, express.static(contentPath));

    // 루트경로(에뮬레이터) 설정
    app.get(folderPath, (req, res) => {
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

    // Post 파일요청
    app.post(`${folderPath}/*`, (req, res) => {
        const filePath = path.join(contentPath, req.url.replace(folderPath, ""));

        fs.exists(filePath, (isExisits) => {
            if (isExisits) {
                res.sendFile(filePath);
            }
            else {
                const logMsg = `Not found: ${filePath}`;

                debug(logMsg);
                res.status(404).send(logMsg);
            }
        });
    });

    // TODO: -ing
    app.get(`${folderPath}/:json`, (req, res) => {
        console.log(req.query);
    });
};