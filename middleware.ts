import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const vendor_token = req.cookies.get("vendor_token");
  // unauthorized vendor cannot go to starting "/vendor" route.
  if (pathname.startsWith("/vendor")) {
    if (typeof vendor_token === "undefined") {
      return NextResponse.json(
        {
          message: "Please login to continue",
        },
        {
          status: 401,
        }
      );
    }
  }
  if (pathname === "/signin") {
    if (vendor_token) {
      return NextResponse.json(
        {
          message: "You're already logged in, just go to dashboard.",
        },
        { status: 401 }
      );
    }
  }
  if (pathname === "/signup") {
    if (vendor_token) {
      return NextResponse.json(
        {
          message: "You're already logged in, just go to dashboard.",
        },
        { status: 401 }
      );
    }
  }
  if (pathname.startsWith("/vendor/shop")) {
    if (typeof vendor_token === "undefined") {
      return NextResponse.json(
        {
          message: "Please login to continue",
        },
        { status: 401 }
      );
    }
  }
}
