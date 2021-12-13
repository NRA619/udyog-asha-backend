const express = require("express");
const router = express.Router();
const serviceCtrl = require("../controllers/serviceCtrl");

router.post("/apply", serviceCtrl.apply);


module.exports = router;
