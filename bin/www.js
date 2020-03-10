const app = require("../app");
const debug = require("debug")("bizNode:www");
const http = require("http");

// TODO: Port 번호를 설정한 config 파일에서 가져오도록 수정
const port = ((val) => {
    const port = parseInt(val, 10);
    
    if (isNaN(port)) {
        return val;
    }
    else if (port >= 0) {
        return port;
    }
    else {
        return false;
    }
})(require("../biznode.config").port);

app.set("port", port);

const server = http.createServer(app);

server.listen(port);

server.on("error", (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    switch (error.code) {
        case "EACCES": {
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        }
        case "EADDRINUSE": {
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        }
        default: {
            throw error;
        }
    }
});

server.on("listening", () => {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "Pipe " + addr
        : "Port " + addr.port;

    debug(`Listening on ${bind} Server`);
    debug("===============================================================");
});