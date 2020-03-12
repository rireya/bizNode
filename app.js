const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const debug = require("debug")("bizNode:www");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/** Views Routes */
const routes = require("./routes/index");

app.get("/", routes);
/***********/

/** bizNode Server Setting */
const config = require("./biznode.config");
const bizmob3 = require("./routes/bizMob3");
const util = require("./routes/util");

const port = config.port;
const configList = config.configList;

configList.map((config) => {
    bizmob3.setting(app, config);

    debug(`Setting on ${util.getLocalIP()}:${port}/${config.context}`);
});
/***************************/

app.use((req, res, next) => {
    var error = new Error(`Not Found: ${req.url}`);
    error.status = 404;

    next(error);
});

app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: err
    });
});

module.exports = app;