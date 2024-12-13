"use server";
import { cookies } from "next/headers";

export const logout = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("vendor_token");
    return {
      message: "Successfully logged out!",
    };
  } catch (error: any) {
    console.log(error);
  }
};
