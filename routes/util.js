exports.getErrorJson = (trcode, message) => {
    return {
        "header": {
            "result": false,
            "error_code": "",
            "error_text": message,
            "info_text": "",
            "message_version": "",
            "login_session_id": "",
            "trcode": trcode.replace(".json", "")
        },
        "body": {
        }
    };
};

// https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
exports.getLocalDate = function() {
    const date = new Date(); // Or the date you'd like converted.

    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split(".")[0];
};

// https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
exports.getLocalIP = function() {
    const interfaces = require("os").networkInterfaces();

    for (const devName in interfaces) {
        const iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {

            var alias = iface[i];
            if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
                return alias.address;
            }
        }
    }

    return "0.0.0.0";
};

// https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
exports.getRequestIP = function(request) {
    let ip = request.headers["x-forwarded-for"] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;

    ip = ip.split(",")[0];
    ip = ip.split(":").slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"

    if (ip == 1) {
        ip = "127.0.0.1";
    }
    else {
        ip = ip.join("");
    }

    return ip;
};