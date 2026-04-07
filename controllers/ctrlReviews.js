const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req,res) => {

        let listing = await Listing.findById(req.params.id);
        console.log(req.params.id);
        const newReview = new Review({
            rating: Number(req.body.review.rating),
            comment: req.body.review.comment
        });

        newReview.author = req.user._id;
    
        console.log(newReview);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", " New Review  Added !"); // flash messages

        res.redirect(`/listings/${req.params.id}`);
    

}

module.exports.deleteReview = async (req, res, next) => {
    let { id, reviewId } = req.params;

    // Remove review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });// pull means remove reviewId from reviews array

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review  Deleted Successfully !"); // flash messages

    res.redirect(`/listings/${id}`);
}