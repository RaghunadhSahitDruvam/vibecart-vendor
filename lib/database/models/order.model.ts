import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
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
          type: Number,
        },
        color: {
          color: String,
          image: String,
        },
        price: {
          type: Number,
        },
        status: {
          type: String,
          default: "Not Processed",
        },
        productCompletedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    shippingAddress: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    paymentMethod: {
      type: String,
    },
    paymentResult: {
      id: String,
      status: String,
      email: String,
    },
    total: {
      type: Number,
      required: true,
    },
    totalBeforeDiscount: {
      type: Number,
    },
    couponApplied: {
      type: String,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    totalSaved: {
      type: Number,
    },
    razorpay_order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
