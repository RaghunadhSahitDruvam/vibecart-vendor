import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
        },
        vendor: {
          type: Object,
        },
        image: {
          type: String,
        },
        size: {
          type: String,
        },
        qty: {
          type: String,
        },
        color: {
          color: String,
          image: String,
        },
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
