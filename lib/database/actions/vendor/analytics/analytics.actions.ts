"use server";

import Order from "@/lib/database/models/order.model";
import { generateLast12MonthsData } from "./analytics.generator";
import Product from "@/lib/database/models/product.model";
import { connectToDatabase } from "@/lib/database/connect";
import { verify_vendor } from "@/utils";
const jwt = require("jsonwebtoken");
import { cookies } from "next/headers";
import mongoose from "mongoose";

// get Order analytics fro vendor
export const getOrderAnalytics = async () => {
  try {
    const orders = await generateLast12MonthsData(Order, "order");
    return { orders };
  } catch (error: any) {
    console.log(error);
  }
};

// get Product analytics fro vendor
export const getProductAnalytics = async () => {
  try {
    const products = await generateLast12MonthsData(Product, "product");
    return { products };
  } catch (error: any) {
    console.log(error);
  }
};

// get product size analytics for vendor
export const sizeAnalytics = async () => {
  try {
    await connectToDatabase();
    const vendor = await verify_vendor();
    const products = await Product.find({
      "vendor._id": vendor?.id,
    });
    if (!products) {
      return {
        message: "Vendor Id is invalid!",
        success: false,
      };
    }
    const individualSizeAnalytics = products.reduce(
      (acc: any, product: any) => {
        product.subProducts.forEach((subProduct: any) => {
          subProduct.sizes.forEach((size: any) => {
            if (acc[size.size]) {
              acc[size.size] += size.sold;
            } else {
              acc[size.size] = size.sold;
            }
          });
        });
        return acc;
      }
    );
    const sizeData = Object.keys(individualSizeAnalytics).map((size) => ({
      name: size,
      value: individualSizeAnalytics[size],
    }));
    return JSON.parse(JSON.stringify(sizeData));
  } catch (error: any) {
    console.log(error);
  }
};

// get top selling products for vendor
export const getTopSellingProducts = async () => {
  try {
    await connectToDatabase();
    const nextCookies = await cookies();
    const vendor_token = nextCookies.get("vendor_token");
    const decode = jwt.verify(vendor_token?.value, process.env.JWT_SECRET);
    const { ObjectId } = mongoose.Types;
    const vendorObjectId = new ObjectId(decode.id);
    let topSellingProducts = await Product.find({
      "vendor._id": vendorObjectId,
    })
      .sort({ "subProducts.sold": -1 })
      .limit(5)
      .lean();
    const pieChartData = topSellingProducts.map((product) => ({
      name: product.name,
      value: product.subProducts[0].sold,
    }));
    return JSON.parse(JSON.stringify(pieChartData));
  } catch (error: any) {
    console.log(error);
  }
};
