const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const {  saveRedirectUrl } = require("../middleware");
const passport = require("passport");
const { isLoggedIn, isOwner, validateListing, validateObjectId } = require("../middleware.js");

const multer  = require('multer');//it helps in file or image encoding
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/ctrlAppListings.js");//connects to ctrlAppListings.js



// ---------------------- CREATE routes ----------------------
router
  .route("/")
  .get(
    
    wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.array('images', 25),// ← 🔹 THIS is where Multer kicks in // // image upload middleware
    // upload.array('images', 25):
    // Multer middleware that processes up to 25 files from the images input.
    // These files are passed to Cloudinary for storage.
    // The metadata (file.path, file.filename) is stored in req.files.
    // ✅ At this point, the images are already uploaded to Cloudinary.
    wrapAsync(listingController.submitNewListingForm)// when listingController.submitNewListingForm execute in that the image path is added to mongodb
  );

// Form to create new listing
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewListingForm));



// ---------------------- UPDATE routes ----------------------

// Show edit form (just renders page – no upload yet)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditListingForm));

// Handle update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  upload.fields([
    { name: 'replaceImages', maxCount: 10 },//replaceImages: Images to replace old ones (max 10 files)
    { name: 'images', maxCount: 25 }        //images: Additional new images to append (max 25 files)
  ]),
  wrapAsync(listingController.updateListing)
);


// ---------------------- SHOW + DELETE ----------------------
router
  .route("/:id")
  .get(validateObjectId, wrapAsync(listingController.showSpecificListing))
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );




module.exports = router;


