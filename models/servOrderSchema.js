const mongoose = require("mongoose");

const servOrderSchema = new mongoose.Schema({
  
  result : {
    type: Array,
    required: true,
  },
  product_array : {
    type: Array,
  },
  status : {
    type: String,
  },
  expire_at: {
    type: Date,
    default: Date.now,
    expires: 15768000,
  },

});

module.exports = mongoose.model("ServOrders", servOrderSchema);
