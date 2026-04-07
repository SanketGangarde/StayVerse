const express = require("express");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");

const ExpressError = require("../utils/ExpressError.js");

const router = express.Router( {mergeParams : true});

const { isLoggedIn,validateReview, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/ctrlReviews.js");


//reviews
router.post("/",
    isLoggedIn,
    validateReview,
     wrapAsync ( reviewController.createReview));

//delete reviewisting
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor, 
    wrapAsync(reviewController.deleteReview));


module.exports = router;