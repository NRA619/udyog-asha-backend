const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  
  result : {
    type: Array,
    required: true,
  },
  product_array : {
    type: Array,
  },
  status : {
    type: String,
  }

});

module.exports = mongoose.model("Order", orderSchema);
