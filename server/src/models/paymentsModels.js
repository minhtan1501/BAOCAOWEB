const mongoose = require("mongoose");

const paymentsSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  paymentID: {
    type: String,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  cart: {
    type: Array,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
},{
    timestamps:true
});

module.exports = mongoose.model("Payments", paymentsSchema);
