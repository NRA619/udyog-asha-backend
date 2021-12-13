const mongoose = require("mongoose");


const serviceSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, "please enter your email"],
      trim: true,
      unique: true,
    },
    business_support: {
      type: Array,
    },
    registration: {
        type: Array,
    },
    print_media: {
        type: Array,
    },
    social_media_marketing: {
        type: Array,
    }
  });
  
  module.exports = mongoose.model("services", serviceSchema);