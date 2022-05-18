const mongoose = require("mongoose");

const tempSchema = new mongoose.Schema({
  
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
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '10m' },
  },

});

module.exports = mongoose.model("temp", tempSchema);
