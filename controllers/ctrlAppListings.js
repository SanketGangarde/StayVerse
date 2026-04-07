const { response } = require("express");
const Listing = require("../models/listing.js");
const cloudinary = require("cloudinary").v2;
const User = require('../models/user.js');
const { saveRedirectUrl } = require("../middleware.js");
const BookListing = require("../models/bookListing.js");






// map box 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding( { accessToken : mapToken} );


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});

  if (allListings.length === 0) {
    req.flash("error", "No listings found");
    // return res.redirect("/"); //STOP here
    res.render("listings/index.ejs", { allListings });
  }

  res.render("listings/index.ejs", { allListings });
};



module.exports.renderNewListingForm = async (req,res) => {  
   res.render("listings/newListing.ejs");
}

module.exports.submitNewListingForm = async (req, res, next) => {
  try {
    // 1. Get coordinates from Mapbox
    let coordinates = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    // 2. Create new listing from form input
    const newListing = new Listing(req.body.listing);

    console.log(newListing);

    // 3. Set owner
    newListing.owner = req.user._id;

    

    // 4. Set image array from uploaded files
    newListing.images = req.files.map(file => ({ // here the path of image get added to mongodb
      url: file.path,
      filename: file.filename,
    }));

    // 5. Add location coordinates from Mapbox result
    newListing.geometry = coordinates.body.features[0].geometry;

    // 6. Update user to host
    await User.findByIdAndUpdate(req.user._id, {
      isHost: true,
      role: 'host',
    });

    // 7. Save the listing
    let savedListing = await newListing.save();
    console.log("Listing saved:", savedListing);

    // 8. Success and redirect
    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');

  } catch (err) {
    next(err);
  }






    // (req, res) => {
    //             if (!req.files || req.files.length === 0) {
    //                 return res.status(400).send('No files were uploaded.');
    //             }
    
    //             console.log("Files received:", req.files.map(f => f.originalname));
    //             res.send({
    //                 message: 'Files uploaded successfully!',
    //                 files: req.files
    //             });
    //             }



















    /* 
   
    // no need to validate like this using ExpressError.ejs

    if (!req.body || !req.body.listing) {
        next(new ExpressError(400, "send valid data to create listing"));
        return;
    }
    


    const newListing = new Listing(req.body.listing);
    
    
    // if(!newListing.title) {
    //     next(new ExpressError(400, "title is missing"));
    //     return;
    // }
    //  if(!newListing.description) {
    //     next(new ExpressError(400, "description is missing"));
    //     return;
    // }
    
    await newListing.save();
    response.redirect("/listings");

    
    */

    // OR

    // let { title, description, image, price, country, location} = req.body;

    // console.log(title);
    // console.log(description);
    // console.log(image);
    // console.log(price);
    // console.log(country);
    // console.log(location);

    // try {
    //     const newListing = new Listing( {
    //         title : title,
    //         description : description,
    //         image : image,
    //         price : price,
    //         country : country,
    //         location : location,
              
    //     });

    //     newListing.save()
    //     .then((res) => {
    //         console.log(res);
    //         response.redirect("/listings");
    //     })
    // } catch (error) {
    //     console.log(error);
    // }
    

}


// 

// module.exports.showSpecificListing = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const listing = await Listing.findById(id)
//       .populate({
//         path: "reviews",
//         populate: { path: "author" },
//       })
//       .populate("owner");

//     if (!listing) {
//       req.flash("error", "Listing Not Found!");
//       return res.redirect("/listings");
//     }

//     // Fetch bookings
//     const bookings = await BookListing.find({ listing: id }).select(
//       "checkin checkout"
//     );

//     const blockedDates = [];

//     bookings.forEach((booking) => {
//       // Parse dates and ensure they're in local timezone
//       const checkin = new Date(booking.checkin);
//       const checkout = new Date(booking.checkout);

//       // Set to start of day in local timezone
//       checkin.setHours(0, 0, 0, 0);
//       checkout.setHours(0, 0, 0, 0);

//       // ✅ Block from checkin (inclusive) to checkout (exclusive)
//       let current = new Date(checkin);

//       while (current < checkout) {
//         // Use toISOString().split("T")[0] to get YYYY-MM-DD format
//         blockedDates.push(current.toISOString().split("T")[0]);
//         current.setDate(current.getDate() + 1);
//       }
//     });

//     // ✅ Add all past dates (before today) to blocked dates
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // Add dates from a reasonable past date (e.g., 1 year ago) up to yesterday
//     const startDate = new Date(today);
//     startDate.setFullYear(today.getFullYear() - 1);
    
//     let pastDate = new Date(startDate);
//     while (pastDate < today) {
//       blockedDates.push(pastDate.toISOString().split("T")[0]);
//       pastDate.setDate(pastDate.getDate() + 1);
//     }

//     const uniqueBlockedDates = [...new Set(blockedDates)];

//     // Debug logging
//     console.log("Bookings found:", bookings.length);
//     console.log("Blocked dates:", uniqueBlockedDates.sort());
    
//     let checkin = null;
//     let checkout = null;
//     let guestCount = null;

//     if (req.cookies.searchData) {
//       ({ checkin, checkout, guestCount } = JSON.parse(req.cookies.searchData));
//     }

//     res.render("listings/show.ejs", {
//       listing,
//       blockedDates: uniqueBlockedDates,
//       checkin,
//       checkout,
//       guestCount,
//       currUser: req.user || null,
//     });
//   } catch (err) {
//     console.error(err);
//     req.flash("error", "Something went wrong");
//     res.redirect("/listings");
//   }
// };

module.exports.showSpecificListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Populate images too (they're already in the document, but good practice)
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing Not Found!");
      return res.redirect("/listings");
    }

    // ── Bookings & blocked dates logic (improved with better consistency) ──
    const bookings = await BookListing.find({ listing: id })
      .select("checkin checkout")
      .sort({ createdAt: -1 }); // Get latest bookings first for consistency

    const blockedDates = [];

    bookings.forEach((booking) => {
      const checkin = new Date(booking.checkin);
      const checkout = new Date(booking.checkout);

      // Ensure consistent timezone handling
      checkin.setUTCHours(0, 0, 0, 0);
      checkout.setUTCHours(0, 0, 0, 0);

      let current = new Date(checkin);

      // Block check-in day to check-out day - 1 (exclusive)
      while (current < checkout) {
        blockedDates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    // Block all past dates (last 1 year)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    let past = new Date(oneYearAgo);
    while (past < today) {
      blockedDates.push(past.toISOString().split("T")[0]);
      past.setDate(past.getDate() + 1);
    }

    const uniqueBlockedDates = [...new Set(blockedDates)].sort();

    // ── Cookie / search data ──
    let checkin = null;
    let checkout = null;
    let guestCount = null;

    if (req.cookies.searchData) {
      try {
        ({ checkin, checkout, guestCount } = JSON.parse(req.cookies.searchData));
      } catch (e) {
        console.warn("Invalid searchData cookie", e);
      }
    }

    // ── Pass data to template ──
    res.render("listings/show.ejs", {
      listing,
      blockedDates: uniqueBlockedDates,
      checkin,
      checkout,
      guestCount,
      currUser: req.user || null,
    });

  } catch (err) {
    console.error("Show listing error:", err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
};

module.exports.renderEditListingForm = async (req,res) => {  

    let { id } = req.params;
    const listing = await Listing.findById(id);

              
    res.render("listings/edit.ejs", { listing });
              
}

/*

module.exports.updateListing = async(req,res) => {

            // if (!req.body || req.body.listing == null) {
            //     next(new ExpressError(400, "send valid data to create listing"));
            //     return;
            // }
            
            let { id } = req.params;
        
            await Listing.findByIdAndUpdate(id, {...req.body.listing});

            req.flash("success", " Listing Updated Successfully!"); // flash messages

            res.redirect(`/listings/${id}`);

}
*/


// module.exports.updateListing = async(req, res) => {
//     let { id } = req.params;
    
//     let newListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

//     for(let i=0; i<req.files.length; i++) {
//         console.log("hi",req.files[i]);
//     }

//     if (req.files && req.files.length > 0) {
//         const imgs = req.files.map(file => ({
//             url: file.path,
//             filename: file.filename
//         }));
//         newListing.images.push(...imgs); // add to existing images
//         await newListing.save();
//     }

//     req.flash("success", "Listing Updated Successfully!");
//     res.redirect(`/listings/${id}`);
// };

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const print =   req.body;
    console.log(print);
    console.log(id);
    const listing = await Listing.findById(id);


  
  //   DELETE IMAGES (BY INDEX)

if (req.body.deleteImageIndexes) {
    const raw = Array.isArray(req.body.deleteImageIndexes)
      ? req.body.deleteImageIndexes
      : [req.body.deleteImageIndexes];

    const indexes = [...new Set(
      raw
        .map((v) => parseInt(v, 10))
        .filter((n) => Number.isFinite(n))
        .filter((n) => n >= 0 && n < listing.images.length)
    )].sort((a, b) => b - a);

    await Promise.all(indexes.map((i) => {
      const img = listing.images[i];
      if (img && img.filename) {
        return cloudinary.uploader.destroy(img.filename).catch(() => null);
      }
      return null;
    }));

    for (const i of indexes) {
      listing.images.splice(i, 1);
    }
  }




    // Replacing existing images
if (req.files.replaceImages) {
    for (let i = 0; i < req.files.replaceImages.length; i++) {
        const file = req.files.replaceImages[i];
        if (listing.images[i]) {
            await cloudinary.uploader.destroy(listing.images[i].filename);
            listing.images[i] = {
                url: file.path,
                filename: file.filename
            };
        }
    }
}

    // 2. Add new images
    if (req.files.images) {
        const newImgs = req.files.images.map(file => ({
            url: file.path,
            filename: file.filename
        }));
        listing.images.push(...newImgs);
    }

    // 3. Update other listing data
    listing.set({ ...req.body.listing });

    // 4. Save updated listing
    await listing.save();

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};








module.exports.deleteListing = async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        
        const deletedListing = await Listing.findByIdAndDelete(id);
        // listing delete controller

        await Booking.deleteMany({ listing: req.params.id });
        

        const userId = req.user._id;

        // Check if user has any listings left
        const remainingListings = await Listing.find({ owner: userId });

        if (remainingListings.length === 0) {
            // If none left, update the user to not be a host
            await User.findByIdAndUpdate(userId, {
                isHost: false,
                role: "guest"
            });
        }

        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");    
}


// module.exports.bookListing = async (req, res) => {
//   let searchData = {};
//   let formattedRange = "";
//   let guestCount = 1;
//   let nightCount = 0;
//   const userId = req.user._id;
//   const { id } = req.params;
//   const listing = await Listing.findById(id).populate();

// if (req.cookies.searchData) {
//   try {
//     searchData = JSON.parse(req.cookies.searchData);

//     guestCount  = searchData.guestCount;

//     // Format the date range if checkin & checkout exist
//     if (searchData.checkin && searchData.checkout) {
//       formattedRange = formatDateRange(searchData);

//       const checkinDate = new Date(searchData.checkin);
//       const checkoutDate = new Date(searchData.checkout);

//       // ✅ Calculate night count
//       const diffTime = checkoutDate - checkinDate;

//       nightCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // ms → days

//       console.log("Date range:", formattedRange); // → e.g., "27 - 30 July"
//     }
//      let checkin = searchData.checkin;
//      let checkout = searchData.checkout;

//      // console.log(id);
//      // console.log(userId);

//      //  Set cookie with proper options
//       res.cookie('saveBookingData', JSON.stringify({ id, checkin, checkout, userId }), {// here id is listing id, and userId is customer id
//         httpOnly: false,
//         maxAge: 1000 * 60 * 60 * 24, // 1 day
//         sameSite: 'Lax',
//         secure: false
//       });

//   } catch (e) {
//     console.log("Failed to parse cookie:", e);
//   }
// }
// // Helper function
// function formatDateRange({ checkin, checkout }) {
//   const checkinDate = new Date(checkin);
//   const checkoutDate = new Date(checkout);

//   const checkinDay = checkinDate.getDate();
//   const checkoutDay = checkoutDate.getDate();

//   const checkinMonth = checkinDate.toLocaleString('en-US', { month: 'long' });
//   const checkoutMonth = checkoutDate.toLocaleString('en-US', { month: 'long' });

//   // If same month → "27 - 30 July"
//   if (checkinMonth === checkoutMonth) {
//     return `${checkinDay} - ${checkoutDay} ${checkinMonth}`;
//   }

//   // If different months → "27 July - 2 August"
//   return `${checkinDay} ${checkinMonth} - ${checkoutDay} ${checkoutMonth}`;
// }  

//   res.render("listings/bookListing", { formattedRange,guestCount,nightCount,listing, showSearchbar: false});
// }