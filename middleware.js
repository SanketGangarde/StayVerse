const mongoose = require("mongoose");
const Review = require('./models/review');
const Listing = require('./models/listing'); 
const { listingSchema ,reviewSchema} = require("./schema.js"); // required listing schema
const ExpressError = require("./utils/ExpressError.js");

// module.exports.isLoggedIn = (req,res,next) => {
    
//     if(!req.isAuthenticated()) {
//         //redirect Url
//         req.session.redirectUrl = req.originalUrl; // if user not login get it url from req 
//         req.flash("error", "you must be logged in !");
//         return res.redirect("/login");//then signup or login
//     }
//     next();
// }


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};



module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};



module.exports.saveBookingIntent = (req, res, next) => {
  if (!req.isAuthenticated() && req.cookies.searchData) {
    req.session.bookingIntent = req.cookies.searchData;
    console.log("💾 Booking intent saved in session:", req.session.bookingIntent);
    req.session.redirectUrl = req.originalUrl; // e.g., /listings/:id/book
    res.redirect(req.session.redirectUrl);
    return;
  }
  
};



module.exports.isOwner = async (req,res,next) => {
     const { id } = req.params;
    
        const listing = await Listing.findById(id);
    
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }

        if (!listing.owner || !listing.owner._id || !res.locals.currUser || !res.locals.currUser._id) {
        req.flash("error", "ACCESS DENIED, Owner information missing!");
        return res.redirect(`/listings/${id}`);
    }

        if (!listing.owner._id.equals(res.locals.currUser._id)) {//if you are not owner of listing you can you cant perform crud oprations
            req.flash("error", "ACCESS DENIED, You are not owner of this listing !");
            return res.redirect(`/listings/${id}`);
        }

        next();
}


/* Joi Middleware to perform server validation */

module.exports.validateListing = (req,res,next) => {
    let { error } = listingSchema.validate(req.body); // this line checks that, the listing data that comes from frountend to server is in correct format,if yes call next(),else throw error

    if(error) {
        let  errMsg = error.details.map( (ele) => ele.message).join(",");
        throw new ExpressError(400, errMsg);
        
    }else {
        next();
    }

}

// middleware : it  validates listing object id length is correct
module.exports.validateObjectId = function(req, res, next) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid ID format.");
        return res.redirect("/listings");
    }
    next();
}


/* Joi Middleware to perform server validation */

module.exports.validateReview = (req,res,next) => {
    // console.log(req.params.id);
    console.log('Incoming review:', req.body);
    let { error } = reviewSchema.validate(req.body);// this line checks that, the review data that comes from frountend to server is in correct format,if yes call next(),else throw error 

    if(error) {
        let  errMsg = error.details.map( (ele) => ele.message).join(",");
        throw new ExpressError(400, errMsg);
        
    }else {
        next();
    }

}

module.exports.isReviewAuthor = async (req,res,next) => {
     const { id,reviewId } = req.params;
    
        const review = await Review.findById(reviewId);
    
        

    if (!review.author.equals(res.locals.currUser._id)) {//if you are not owner of listing you can you cant perform crud oprations
        req.flash("error", "ACCESS DENIED, You are not author  this review !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}