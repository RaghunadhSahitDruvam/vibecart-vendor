"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Coupon from "@/lib/database/models/coupon.model";
import Vendor from "@/lib/database/models/vendor.model";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

// create a coupon for vendor
export const createCoupon = async (
  coupon: string,
  discount: number,
  startDate: any,
  endDate: any,
  vendorId: string
) => {
  try {
    console.log(vendorId);
    await connectToDatabase();

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return {
        message: "Vendor Id is invalid!",
        success: false,
      };
    }
    const test = await Coupon.findOne({ coupon });
    if (test) {
      return {
        message: "Coupon already exits, try a different coupon name.",
        success: false,
      };
    }
    await new Coupon({
      coupon,
      discount,
      startDate,
      endDate,
      vendor,
    }).save();

    const vendorCoupons = await Coupon.find({
      "vendor._id": vendorId,
    }).sort({
      updateAt: -1,
    });
    return {
      message: `Coupon ${coupon} has been successfully created.`,
      coupon: JSON.parse(JSON.stringify(vendorCoupons)),
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// delete coupon for vendor
export const deleteCoupon = async (couponId: string, vendorId: string) => {
  try {
    await connectToDatabase();
    const vendorObjectId = new ObjectId(vendorId);

    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      return {
        message: "No Coupon found with this Id!",
        success: false,
      };
    }
    const vendor = await Vendor.findById(vendorObjectId);
    if (!vendor) {
      return {
        message: "Vendor Id is invalid!",
        success: false,
      };
    }
    const vendorCoupons = await Coupon.find({
      "vendor._id": vendorObjectId,
    }).sort({
      updateAt: -1,
    });
    return {
      message: "Successfully deleted!",
      coupons: vendorCoupons,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// update coupon for vendor
export const updateCoupon = async (
  coupon: string,
  couponId: string,
  discount: number,
  startDate: any,
  endDate: any,
  vendorId: string
) => {
  try {
    await connectToDatabase();
    const vendorObjectId = new ObjectId(vendorId);

    const foundCoupon = await Coupon.findByIdAndUpdate(couponId, {
      coupon,
      discount,
      startDate,
      endDate,
    });
    if (!foundCoupon) {
      return {
        message: "No Coupon found with this Id.",
        success: false,
      };
    }
    const vendorCoupons = await Coupon.find({
      "vendor._id": vendorObjectId,
    }).sort({
      updateAt: -1,
    });
    return {
      message: "Successfully updated!",
      coupons: vendorCoupons,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// get all coupons for vendor
export const getAllCoupons = async (vendorId: string) => {
  try {
    await connectToDatabase();

    const vendorObjectId = new ObjectId(vendorId);
    const coupons = await Coupon.find({ "vendor._id": vendorObjectId })
      .sort({ updatedAt: -1 })
      .lean();
    if (!coupons) {
      return {
        message: "No Vendor or created vendor coupon found with this Id!",
        success: false,
      };
    }
    return {
      coupons: JSON.parse(JSON.stringify(coupons)),
      message: "Successfully fetched vendor coupons",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};
