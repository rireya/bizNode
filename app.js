const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const debug = require("debug")("bizNode:www");

const app = express();

app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/** bizNode Server Setting */
const config = require("./biznode.config");
const bizmob2 = require("./routes/bizMob2");
const bizmob3 = require("./routes/bizMob3");
const util = require("./routes/util");

const port = config.port;
const configList = config.configList;

configList.map((config) => {
    switch (config.version) {
        case "3": { // bizMOB 3.x
            bizmob3.setting(app, config);
            debug(`Setting on bizMOB 3.0 ${util.getLocalIP()}:${port}/${config.context}`);
            break;
        }

        case "2": { // bizMOB 2.5
            bizmob2.setting(app, config);
            debug(`Setting on bizMOB 2.5 ${util.getLocalIP()}:${port}/${config.context}`);
            break;
        }
    }
});
/***************************/

app.use((req, res, next) => {
    var error = new Error(`Not Found: ${req.url}`);
    error.status = 404;

    next(error);
});

app.use((err, req, res) => {
    res.status(err.status || 500).send(err.message);
});

module.exports = app;