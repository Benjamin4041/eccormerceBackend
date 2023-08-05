const { default: mongoose } = require("mongoose");

let address = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
  },
  lga: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    maxlength: 14,
    minlength: 14,
  },
  postalCode: {
    type: String,
    required: true,
  },
  deliveryInstruction: {
    type: String,
    required: true,
  },
});
let newAddress = mongoose.model("newAddress", address);
module.exports = newAddress;
