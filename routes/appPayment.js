const express = require("express");
const router = express.Router({ mergeParams: true }); // important to access :id from parent route

const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware");
const { isLoggedIn } = require("../middleware.js");
const RazorpayController = require("../controllers/ctrlRazorpay.js");

// ---------------------- CREATE ORDER ----------------------
// GET /listings/:id/book
router.get(
  "/",
  isLoggedIn,
  saveRedirectUrl,
  wrapAsync(RazorpayController.createOrder)
);

// ---------------------- VERIFY PAYMENT ----------------------
// POST /listings/:id/book/verify-payment
router.post(
  "/verify-payment",
  isLoggedIn,
  wrapAsync(RazorpayController.verifyPayment)
);

router.get("/success", isLoggedIn, (req, res) => {
  res.render("bookings/success");
});

module.exports = router;
