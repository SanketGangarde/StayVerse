const User = require('../models/user.js');
const Listing = require("../models/listing.js");
const BookListing = require("../models/bookListing.js");
const { bookingSchema } = require("../schema.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports.getSignupPage = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    let { username, email, password } = req.body;

    try {
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        // Auto-login after signup
        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", `Welcome here ${username} !`);
            return res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", "This user is already registered");
        res.redirect("/signup");
    }
}

module.exports.getLoginPage = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.redirectAfterSubmittingLoginForm = async (req, res) => {
    


        // check if user is admin
    if (req.user.role === "admin") {

        const allBookings = await BookListing
            .find()
            .populate({ path: "user", select: "username" })
            .populate({ path: "listing", select: "title roomNumber" });

        const today = new Date();
        today.setHours(0,0,0,0);   // normalize date

        allBookings.forEach(booking => {
            const checkin = new Date(booking.checkin);
            const checkout = new Date(booking.checkout);

            if (today < checkin) {
            booking.status = "Upcoming";
            } else if (today >= checkin && today <= checkout) {
            booking.status = "Ongoing";
            } else {
            booking.status = "Completed";
            }
        });

      return res.render("users/admin.ejs", { allBookings });
    }

    const redirectUrl = res.locals.redirectUrl || "/listings";
  
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.userDashboard = async (req, res) => {
    try {
        let userId = req.user._id;
        let user = await User.findById(userId);

    

        if (user.role === "host") {
            return handleHostDashboard(req, res, user);
        } else if(user.role === "guest"){
            return handleGuestDashboard(req, res, user);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Dashboard loading error");
    }
};

// controllers/dashboard.js
async function handleGuestDashboard(req, res, user) {
    try {
        // 1. Get bookings made by user
        const bookingsRaw = await BookListing.find({
            guest: user._id
        })
        .populate("listing")
        .sort({ createdAt: -1 });

        // 2. Remove bookings where listing is deleted (IMPORTANT FIX)
        const bookings = bookingsRaw.filter(b => b.listing);

        // 3. Render dashboard
        res.render("users/guestDashboard.ejs", {
            user,
            role: "guest",
            bookings
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Guest dashboard error");
    }
}
async function handleHostDashboard(req, res, user) {
    try {
        // 1. Host listings
        const listings = await Listing.find({ owner: user._id });

        // 2. Bookings ON host listings
        const hostBookingsRaw = await BookListing.find({
            listing: { $in: listings.map(l => l._id) }
        }).populate("listing user");

        //  Remove bookings where listing is deleted
        const hostBookings = hostBookingsRaw.filter(b => b.listing);

        // 3. Bookings MADE by host
        const myBookingsRaw = await BookListing.find({
            user: user._id
        }).populate("listing");

        const myBookings = myBookingsRaw.filter(b => b.listing);

        // 4. Total revenue
        let totalRevenue = 0;
        hostBookings.forEach(b => {
            totalRevenue += b.amountPaid || 0;
        });

        let totalSpent = 0;
        myBookings.forEach(b => {
            totalSpent += b.amountPaid || 0;
        });

        res.render("users/hostDashboard.ejs", {
            user,
            role: "host",
            listings,
            hostBookings,
            myBookings,
            totalRevenue,
            totalSpent
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Host dashboard error");
    }
}
   




module.exports.confirmPaymentPage = async(req,res) => {
 
        
       if (req.cookies.saveBookingData) {

            //step i : parse cookie of saveBookingDate created at ctrlAppListing.js inside module.exports.bookListing
                
                const { id, checkin, checkout, userId } = JSON.parse(req.cookies.saveBookingData);// here in terminal  id is listing id, and userId is customer id


            //step ii: add booking to booking schema
               
                try {
                    const newBooking = new BookListing({
                        listing: id,
                        guest: userId,
                        checkin: new Date(checkin),
                        checkout: new Date(checkout)
                    });

                    

                    await newBooking.save();

                    console.log(" Booking saved:", newBooking);

                } catch (err) {
                    console.error(" Error saving booking:", err);
                }

        }
            

    res.render("listings/confirmPaymentPage");
}


module.exports.getForgotPasswordPage = (req,res) => {
    res.render("users/forgot_password.ejs");
}


module.exports.handleForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            req.flash("error", "If you have an account with that email, you will receive a password reset link shortly.");
            return res.redirect("/forgot-password");
        }

        // Generate secure token
        const token = crypto.randomBytes(32).toString("hex");

        // Save token and expiry (15 minutes)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        //  Create reset URL
        const resetURL = `${process.env.BASE_URL}/reset/${token}`;

        //  Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // false for TLS 587
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Send the email
        await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            text: `Hello ${user.username || ""},

You requested a password reset for your account.

Click the link below to reset your password:

${resetURL}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.`
        });

        //  Success feedback
        req.flash("success", "If you have an account with that email, you will receive a password reset link shortly.");
        res.redirect("/login");

    } catch (err) {
        console.error("Error handling forgot password:", err);
        req.flash("error", "An error occurred. Please try again.");
        res.redirect("/forgot-password");
    }
};


module.exports.getResetPasswordPage = async (req,res) => {
    const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash("error", "Token expired or invalid");
    return res.redirect("/forgot-password");
  }

  res.render("users/resetPassword", { token: req.params.token });

}

module.exports.updateResetPassord = async (req,res) => {

  // Check password match first
  if(req.body.password !== req.body.confirmPassword){
    req.flash("error","Passwords do not match");
    return res.redirect("back");
  }

  // Then check token validity
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash("error", "Token expired");
    return res.redirect("/forgot-password");
  }

  //  Update password
  await user.setPassword(req.body.password);

  // Remove reset token
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  req.flash("success", "Password updated successfully");
  res.redirect("/login");
};


module.exports.getUpdateUserProfileForm = async (req,res) => {
    try {

      

        return res.render("users/updateProfile", { user: req.user });

    }catch (err) {
        console.error(err);
        res.status(500).send("Error updating profile");
    }    
}


module.exports.updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { username, email } = req.body;

        // security check
        if (req.user._id.toString() !== userId) {
            req.flash("error", "Unauthorized");
            return res.redirect("/listings");
        }

        if (!username || !email) {
            req.flash("error", "All fields are required");
            return res.redirect(`/users/${userId}`);
        }

        // update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        );

        
        req.login(updatedUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Profile updated successfully");
            res.redirect("/listings");
        });

    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            req.flash("error", "Email already exists");
            return res.redirect(`/users/${req.params.id}`);
        }

        req.flash("error", "Something went wrong");
        res.redirect(`/users/${req.params.id}`);
    }
};





module.exports.logout = (req,res,next) => {
    req.logout((err) => {// req.logout is passport middleware that help in logout session
        if(err) {
            return next();
        }
        req.flash("success", "You have logout successfully!");
        res.redirect("/listings");
    })
}