const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/** Routes */
const routes = require("./routes/index");
const users = require("./routes/users");

app.get("/", routes);
app.get("/users", users.index);
app.get("/users/:name", users.show);

/***********/

/** bizNode Server Setting */
const configList = require("./biznode.config").configList;
const bizmob3 = require("./routes/bizMob3");

configList.map((config) => {
    bizmob3.setting(app, config);
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