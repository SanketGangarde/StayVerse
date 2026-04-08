if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");   // here express is function that help to create app.
const app = express();     // this express funtion is access using the  app variable, this app variable help to create server side app.
// console.dir(app);
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Routers
const listingsRoute = require("./routes/appListing.js");
const reviewsRoute = require("./routes/appReview.js");
const usersRoute = require("./routes/appUser.js");
const footerRoute = require("./routes/appFooter.js");
const searchRoute = require("./routes/appSearch.js");
const paymentRoute = require("./routes/appPayment.js");
const bookingRoutes = require("./routes/appBooking.js");
const createAdminIfNotExists = require("./utils/admin.js");

async function main() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("MongoDB connected successfully");

    await createAdminIfNotExists();

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.log(err);
  }
}

main();
// EJS and static files
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Body parsers ( important: before routes & passport)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));



const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  
};
app.use(session(sessionOptions));




app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom middleware for templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  res.locals.currUser = req.user || null;
  res.locals.currentPath = req.path;
  
  
  next();
});



// // Basic route to confirm backend is up
// app.get("/", wrapAsync(async (req, res) => {
//   res.send("Backend is working successfully");
// }));

// Routes
app.use("/", usersRoute); // Login, signup — needs passport and express.urlencoded
app.use("/", footerRoute);
app.use("/listings", listingsRoute); // Later you’ll use express-formidable *inside* listingsRoute when needed
app.use("/listings/:id/book", paymentRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/search",searchRoute);
app.use("/bookings", bookingRoutes);




// 404 handler- if page not found then only this line will execute.
app.use((req, res) => {
  res.status(404).render("error.ejs", { message: "Page not found" });
});

// Default Error handlig middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Server
app.listen(8080, () => {
  console.log("Backend is listening on port 8080");
});
