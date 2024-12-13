"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Order from "@/lib/database/models/order.model";
import Product from "@/lib/database/models/product.model";
import User from "@/lib/database/models/user.model";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

type DateRange =
  | "today"
  | "yesterday"
  | "2d"
  | "7d"
  | "15d"
  | "30d"
  | "2m"
  | "5m"
  | "10m"
  | "12m"
  | "all"
  | "today_and_yesterday";
type PaymentStatus = "paid" | "unPaid" | "-";
type PaymentMethod = "cash" | "RazorPay" | "-";

interface Order {
  products: { vendorId: string }[];
  createdAt: Date;
  isPaid?: boolean;
  paymentMethod?: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
}

// get all orders for vendor
export const getAllOrders = async (
  vendorId: string,
  range: DateRange,
  isPaid: PaymentStatus,
  paymentMethod: PaymentMethod
) => {
  try {
    await connectToDatabase();
    const now = new Date();
    const dateRanges: { [key in DateRange]: Date } = {
      today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      yesterday: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
      "2d": new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      "7d": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      "15d": new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      "30d": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      "2m": new Date(new Date().setMonth(new Date().getMonth() - 2)),
      "5m": new Date(new Date().setMonth(new Date().getMonth() - 5)),
      "10m": new Date(new Date().setMonth(new Date().getMonth() - 10)),
      "12m": new Date(new Date().setMonth(new Date().getMonth() - 12)),
      all: new Date(0),
      today_and_yesterday: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      ),
    };
    let fromDate: Date;
    let toDate: Date = now;
    if (range === "today_and_yesterday") {
      fromDate = dateRanges["yesterday"];
    } else if (range === "all") {
      fromDate = dateRanges["all"];
      toDate = new Date();
    } else {
      fromDate = dateRanges[range] || new Date(0);
    }
    const isPaidValue = (): boolean | undefined => {
      if (isPaid === "paid") {
        return true;
      } else if (isPaid === "unPaid") {
        return false;
      }
      return undefined;
    };
    const paymentMethodValue = (): string | undefined => {
      if (paymentMethod === "cash") {
        return "cash";
      } else if (paymentMethod === "RazorPay") {
        return "RazorPay";
      }
      return undefined;
    };
    // construct the query object dynamically

    const query: any = {
      products: {
        $elemMatch: { "vendor._id": vendorId },
      },
      createdAt: { $gte: fromDate, $lte: toDate },
    };
    const paidStatus = isPaidValue();
    if (paidStatus !== undefined) {
      query.isPaid = paidStatus;
    }
    const paymentMethodStatus = paymentMethodValue();
    if (paymentMethodStatus !== undefined) {
      query.paymentMethod = paymentMethodStatus;
    }
    const orders = await Order.find(query)
      .populate({
        path: "user",
        model: User,
        select: "name email image",
      })
      .sort({ createdAt: -1 })
      .lean();
    orders.map((order) =>
      console.log(order.products.map((item: any) => item.vendor))
    );
    const filteredOrders = orders.map((order: any) => ({
      ...order,
      products: order.products.filter(
        (product: any) => product.vendor?._id === vendorId.toString()
      ),
    }));
    return JSON.parse(JSON.stringify(filteredOrders));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

// update product order status
export const updateProductOrderStatus = async (
  orderId: string,
  productId: string,
  status: string
) => {
  try {
    await connectToDatabase();
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        message: "Order not found with this Id!",
        success: false,
      };
    }
    let productUpdated = false;
    order.products = await Promise.all(
      order.products.map(async (product: any) => {
        if (product._id.toString() === productId) {
          product.status = status.toString();
          if (status.toString() === "Completed") {
            product.productCompletedAt = new Date();
            const mainProduct = await Product.findById(product.product);
            if (mainProduct) {
              const subProduct = mainProduct.subProducts[0];

              const size = subProduct.sizes.find(
                (s: any) => s.size === product.size
              );
              if (size) {
                if (
                  typeof size.qty !== "number" ||
                  typeof size.sold !== "number"
                ) {
                  throw new Error("Invalid size.qty or size.sold");
                }
                // Ensure product.qty is a number
                if (typeof product.qty !== "number") {
                  throw new Error("Invalid product.qty");
                }
                size.qty = size.qty - product.qty;
                if (typeof subProduct.sold !== "number") {
                  throw new Error("Invalid subProduct.sold");
                }
                subProduct.sold = subProduct.sold + 1;
                size.sold = size.sold + 1;
                await mainProduct.save();
              }
            }
          }
          productUpdated = true;
        }
        return product;
      })
    );
    if (!productUpdated) {
      return { message: "Product not found in order", success: false };
    }
    await order.save();
    return {
      message: "Successfully updated product order status",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// updating order to old
export const updateOrdertoOldOrder = async (id: string) => {
  try {
    await connectToDatabase();
    await Order.findByIdAndUpdate(id, { isNew: false });
    return {
      message: "Order successfully changed to old order",
    };
  } catch (error: any) {
    console.log(error);
  }
};

// get all new orders for vendor
export const getAllNewOrders = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const vendorObjectId = new ObjectId(vendorId);

    const newOrders = await Order.find({
      products: {
        $elemMatch: {
          "vendor._id": vendorObjectId,
        },
        isNew: true,
      },
    });
    return JSON.parse(
      JSON.stringify({
        newOrders,
      })
    );
  } catch (error: any) {
    console.log(error);
  }
};
