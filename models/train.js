const mongoose = require("mongoose");
//schema
const trainSchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required:true,
  },
  featured: {
    type: Boolean,
  },
  img: {
    type: String,
  },
  details:{
    type: Array,
  },
  discription: {
    type: String,
  },
  invigilator:{
    type: String,
  },
  materials:{
    type: Array,
  },
});

module.exports = mongoose.model("aliens", trainSchema);
