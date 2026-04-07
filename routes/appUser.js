const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/ctrlAppUsers.js");

// SIGNUP
router.route("/signup")
  .get(userController.getSignupPage)
  .post(wrapAsync(userController.signup));

// LOGIN
router.route("/login")
  .get(userController.getLoginPage)
  .post(
    
  
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userController.redirectAfterSubmittingLoginForm
  );

// LOGOUT
router.get("/logout", userController.logout);

// Confirm payment page for guests after booking a listing
router.get("/confirm-payment", userController.confirmPaymentPage);

router.get("/forgot-password", userController.getForgotPasswordPage)
      .post("/forgot-password", wrapAsync(userController.handleForgotPassword));

router.route("/reset/:token")
  .get(userController.getResetPasswordPage)
  .post(userController.updateResetPassord);


router.get("/dashboard", userController.userDashboard);

router.get("/users/:id", userController.getUpdateUserProfileForm);
router.post("/users/:id", userController.updateUserProfile);


module.exports = router;
