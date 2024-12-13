"use server";
import mongoose from "mongoose";
import { Document, Model } from "mongoose";
const jwt = require("jsonwebtoken");
import { cookies } from "next/headers";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MonthsData<T extends Document>(
  model: Model<T>,
  type: string
): Promise<{ last12Months: MonthData[] }> {
  const nextCookies = await cookies();
  const vendor_token = nextCookies.get("vendor_token");
  const decode = jwt.verify(vendor_token?.value, process.env.JWT_SECRET);
  const { ObjectId } = mongoose.Types;
  const vendorObjectId = new ObjectId(decode.id);

  const last12Months: MonthData[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 1 * 28
    );
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );
    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    if (type === "order") {
      const count = await model.countDocuments({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
        "products.vendorId": vendorObjectId,
      });
      last12Months.push({ month: monthYear, count });
    } else if (type === "product") {
      const count = await model.countDocuments({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
        "vendor._id": vendorObjectId,
      });
      last12Months.push({ month: monthYear, count });
    }
  }
  return { last12Months };
}
