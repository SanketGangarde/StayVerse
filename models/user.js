//user represent hostUser that have permission to perform crud opration on listings
const mongoose =  require("mongoose");

const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  isHost: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ["guest", "host", "admin"],
    default: "guest"
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing"
    }
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    }
  ]
});

userSchema.plugin(passportLocalMongoose);//it implement automatically username,password,hashing,salting we dont want to build it by scratch

/*
// This adds username, hash, salt fields + methods for password auth
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email" // use email as the login instead of username
});
*/

module.exports = mongoose.model('User', userSchema);

