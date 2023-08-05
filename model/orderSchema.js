const mongoose = require("mongoose");

let orderSchema = new mongoose.Schema(
  {
    userId:{
      type:String,
      required:true,
    },
    customerName: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["physical", "online"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["delivered", "pending", "processing", "cancel"],
      required: true,
    },
    orderedItems:{
      type:Array,
      required:true
    },
    deliveryDate:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

const  OrderSchema = mongoose.model("OrderSchema", orderSchema);

module.exports = OrderSchema;
