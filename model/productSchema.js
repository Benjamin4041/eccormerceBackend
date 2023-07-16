const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productDescription: { type: String },
    productImage: { type: String, required: true },
    producSKU: { type: String },
    productBarcode: { type: Number },
    category: { type: String },
    defaultCategory: { type: String },
    salePrice: { type: Number },
    productQuantity: { type: Number },
    productSlug: {},
    productTags: { type: Array },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = mongoose.model("productSchema", productSchema);

module.exports = ProductSchema;
