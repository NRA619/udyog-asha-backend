const express = require("express");
const paymentControler = require("../controllers/paymentControler");
const router = express.Router();

router.post("/createorder", paymentControler.createOrder);
router.get("/payment/callback/", paymentControler.paymentCallback);
router.post("/payments/:paymentId", paymentControler.getPayment);
router.post("/Courses", paymentControler.Enrolled_Courses);
router.post("/check_pending", paymentControler.check_pending_products);
router.post("/pending_products", paymentControler.pending_products);
router.post("/check_inprogress", paymentControler.check_in_progress);
router.post("/inprogress_service", paymentControler.in_progress_services);

module.exports = router;
