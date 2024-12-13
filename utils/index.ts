import { cookies } from "next/headers";
const jwt = require("jsonwebtoken");
import mongoose from "mongoose";

export const verify_vendor = async () => {
  try {
    const nextCookies = await cookies();
    const vendor_token = nextCookies.get("vendor_token");
    const decode = jwt.verify(vendor_token?.value, process.env.JWT_SECRET);
    const { ObjectId } = mongoose.Types;
    const vendorObjectId = new ObjectId(decode.id);
    return { id: vendorObjectId };
  } catch (error: any) {
    console.log(error);
  }
};
export const base64ToBuffer = (base: any) => {
  const base64String = base.split(";base64,").pop();
  return Buffer.from(base64String, "base64");
};
