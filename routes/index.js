const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { title: "bizNode" });
});

module.exports = router;