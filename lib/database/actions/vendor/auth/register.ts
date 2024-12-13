"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Vendor from "@/lib/database/models/vendor.model";
import { cookies } from "next/headers";
const bcrypt = require("bcrypt");

export const registerVendor = async (
  name: string,
  email: string,
  password: string,
  address: string,
  phoneNumber: number,
  zipCode: number
) => {
  try {
    await connectToDatabase();
    if (!name || !email || !password || !address || !phoneNumber || !zipCode) {
      return {
        message: "Please fill in all fields",
        success: false,
      };
    }
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return {
        message: "Vendor already exists.",
        success: false,
      };
    }
    if (password.length < 6) {
      return {
        message: "Password must be at least 6 characters long.",
        success: false,
      };
    }
    const cryptedPassword = await bcrypt.hash(password, 12);
    const vendor = await new Vendor({
      name,
      email,
      password: cryptedPassword,
      address,
      phoneNumber,
      zipCode,
    }).save();

    // Call the `getJWTToken` method on the saved `vendor`
    const token = vendor.getJWTToken();

    const cookieStore = await cookies();
    cookieStore.set("vendor_token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    });

    return {
      message: "Successfully registered new vendor.",
      vendor: JSON.parse(JSON.stringify(vendor)),
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "An error occurred during registration.",
      success: false,
    };
  }
};
