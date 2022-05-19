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
  expire_at: {
    type: Date,
    default: Date.now,
    expires: 600,
  },

});

module.exports = mongoose.model("temp", tempSchema);
