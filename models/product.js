const mongoose = require("mongoose");
//schema
const productSchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  }
});

module.exports = mongoose.model("products", productSchema);
