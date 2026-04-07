const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const BookListing = require("../models/bookListing.js");

router.route("/")
  .get(async (req, res) => {
    const { where, checkin, checkout, guestCount } = req.query;

    // Store search in cookie
    res.cookie('searchData', JSON.stringify({ checkin, checkout, guestCount }), {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'Lax',
      secure: false
    });

    // Parse dates
    const reqCheckin = new Date(checkin);
    const reqCheckout = new Date(checkout);


    //checkout should not be less than or equal to checkin date
    if (reqCheckout <= reqCheckin) {
      req.flash("error", "Checkout date must be greater than check-in date.");
      return res.redirect("/"); 
    }


    // Step 1: Find listings already booked in the selected date range
    const bookedListings = await BookListing.find({
      $or: [
        {
          checkin: { $lt: reqCheckout },
          checkout: { $gt: reqCheckin }
        }
      ]
    }).select("listing");

    // Extract booked listing IDs
    const bookedListingIds = bookedListings.map(b => b.listing.toString());

    // Step 2: Find available listings not in bookedListingIds
    const availableListings = await Listing.find({
      location: { $regex: where, $options: 'i' },
      _id: { $nin: bookedListingIds }
    });

    res.render("listings/index", { allListings: availableListings });
  });

module.exports = router;
