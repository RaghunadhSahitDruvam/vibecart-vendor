"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Vendor from "@/lib/database/models/vendor.model";
import { cookies } from "next/headers";

export const loginVendor = async (email: string, password: string) => {
  try {
    await connectToDatabase();
    if (!email || !password) {
      return {
        message: "Please fill in all fields",
        success: false,
      };
    }
    const vendor = await Vendor.findOne({ email }).select("+password");
    if (!vendor) {
      return {
        message: "Vendor does'nt exits.",
        success: false,
      };
    }
    const isPasswordValid = await vendor.comparePassword(password);
    if (!isPasswordValid) {
      return {
        message: "Password is incorrect.",
        success: false,
      };
    }
    const token = vendor.getJWTToken();
    const cookieStore = await cookies();
    cookieStore.set("vendor_token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    });
    return {
      message: "Login Successful.",
      vendor: JSON.parse(JSON.stringify(vendor)),
      token,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};
