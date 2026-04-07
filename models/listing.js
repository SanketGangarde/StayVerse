const mongoose = require("mongoose");
const Review = require("./review.js");
const { boolean } = require("joi");




const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    
  },
  roomNumber : {
    type : Number,
  },

  description: {
    type: String,
    
  },
  images: [ //array of images
    {
      url: String,
      filename: String
    }
  ],
  price: {
    type: Number,
    
  },
  location: {
    type: String,
  },
  country: {
    type: String,
    
  },

  reviews : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Review",
    }
  ],

  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
  },
  isBooked : {
    type : Boolean,
    default : false

  },

  geometry : {
     type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    
    
  },
  category : {
      type : {
        type : String,
        enum : ['mountains', 'rooms', 'camping', 'farmhouse', 'flats'],
        
      }
    }
  

});

//mongoose middleware when we delete listing related reviews should be deleted
listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
      await Review.deleteMany({_id : {$in : listing.reviews}});// all reviews in listing should be deleted
  }
})


const Listing = mongoose.model("Listing", listingSchema); // here it create listings named collection
module.exports = Listing;

