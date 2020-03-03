var tempUserList = [{
    name: "Chris",
}, {
    name: "Sam"
}];

// GET users listing
exports.index = function(req, res) {
    res.json(tempUserList);
};

// Find a user by name
exports.show = function(req, res) {
    if (!req.params.name) {
        return res.send(400);
    }

    var findUser = tempUserList.find((user) => {
        return user.name === req.params.name;
    });

    if (findUser) {
        res.json(findUser);
    }
    else {
        res.send(404);
    }
};
