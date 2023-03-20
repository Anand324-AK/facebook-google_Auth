const e = require("express");
const express = require("express");
const userController = require("../controller/user");
const router = express.Router();

router.get("/facebook",userController.login)

module.exports = router;