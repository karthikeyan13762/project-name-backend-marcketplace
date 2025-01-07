const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      default: [],
      required: true,
    },
    billAavailable: {
      type: Boolean,
      default: false,
      required: true,
    },
    warrantyAavailable: {
      type: Boolean,
      default: false,
      required: true,
    },
    accessoriesAavailable: {
      type: Boolean,
      default: false,
      required: true,
    },
    boxAavailable: {
      type: Boolean,
      default: false,
      required: true,
    },
    seller: {
      // seller is the reference of the user
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
    //Admin will approve or rejectet this project based on details
    // What ever details exepting form the frontend those things should required true
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
