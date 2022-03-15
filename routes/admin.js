const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl"); 

router.post("/login", adminCtrl.login);
router.post("/save_train", adminCtrl.savetrain);
router.post("/update_train", adminCtrl.update_train);
router.post("/delete_train", adminCtrl.delete_train);


module.exports = router;