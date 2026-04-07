const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");

// Success page
router.get("/success", isLoggedIn, (req, res) => {
  res.render("bookings/bookingSuccess");
});

module.exports = router;
