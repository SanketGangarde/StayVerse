const Listing = require("../models/listing");
const Booking = require("../models/bookListing");
const { createRazorpayInstance } = require("../config/razorpayConfig");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// CREATE ORDER
module.exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (!req.cookies.searchData) return res.status(400).json({ error: "Booking data missing" });
    const searchData = JSON.parse(req.cookies.searchData);

    const checkinDate = new Date(searchData.checkin);
    const checkoutDate = new Date(searchData.checkout);
    checkinDate.setUTCHours(0,0,0,0);
    checkoutDate.setUTCHours(0,0,0,0);

    const MS_PER_DAY = 1000*60*60*24;
    const nights = Math.round((checkoutDate.getTime() - checkinDate.getTime()) / MS_PER_DAY);
    if (nights < 1) return res.status(400).json({ error: "Invalid dates" });

    const baseAmount = listing.price * nights;
    const gstAmount = Math.round(baseAmount * 0.18);
    const totalAmount = baseAmount + gstAmount;

    const razorpay = createRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `bk_${Date.now()}`,
      payment_capture: 1
    });

    // return res.json({
    //   orderId: order.id,
    //   amount: order.amount,
    //   currency: order.currency,
    //   nights,
    //   baseAmount,
    //   gstAmount,
    //   totalAmount,
    //   razorpayKey: process.env.RAZORPAY_KEY_ID,
    //   listingId: listing._id,
    //   userId
    // });

    res.render("bookings/checkout", {
    listing,
    order,
    searchData,
    razorpayKey: process.env.RAZORPAY_KEY_ID
  });

    

  } catch(err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// VERIFY PAYMENT



module.exports.verifyPayment = async (req, res) => {
  console.log("Verify Payment hit");

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const listingId = req.params.id; // ✅ get from URL
    const userId = req.user._id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing Razorpay fields" });
    }

    // ✅ Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");


    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Fetch listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // ✅ Read booking data from cookie
    const searchData = JSON.parse(req.cookies.searchData);
    const checkin = new Date(searchData.checkin);
    const checkout = new Date(searchData.checkout);
    const nights = (checkout - checkin) / (1000 * 60 * 60 * 24);

    const baseAmount = listing.price * nights;
    const gstAmount = Math.round(baseAmount * 0.18);
    const totalAmount = baseAmount + gstAmount;

    // ✅ Save booking
    const booking = new Booking({
      user: userId,
      listing: listingId,
      checkin,
      checkout,
      guests: searchData.guestCount,
      nights,
      amountPaid: totalAmount,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    });

    await booking.save();

    //send confirmation email here to user
    // Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const checkinDate = new Date(checkin).toDateString();
const checkoutDate = new Date(checkout).toDateString();

// Send email
await transporter.sendMail({
  from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
  to: req.user.email,
  subject: "Booking Confirmation",
  text: `Hello ${req.user.username || ""},

Your booking has been successfully confirmed!

Booking Details
------------------------
Property: ${listing.title}
Check-in: ${checkinDate}
Check-out: ${checkoutDate}
Guests: ${searchData.guestCount}

Total Paid: ₹${totalAmount}

Thank you for booking with us!

Best Regards,
${process.env.MAIL_FROM_NAME}`
});


    res.clearCookie("searchData");

    return res.json({ 
      success: true, 
      bookingId: booking._id,
      redirectUrl: `/listings/${listingId}` 
    });

  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ success: false });
  }
};
