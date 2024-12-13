"use client";
import { Button, Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/database/actions/vendor/auth/logout";
import { useEffect, useState } from "react";
import { getVendorCookiesandFetchVendor } from "@/lib/database/actions/vendor/vendor.actions";

import React from "react";
import Logo from "./Logo";

const Navbar = () => {
  const [vendor, setVendor] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    try {
      const fetchVendorDetails = async () => {
        try {
          await getVendorCookiesandFetchVendor().then((res) => {
            if (res?.success) {
              setVendor(res?.vendor);
            }
          });
        } catch (error: any) {
          console.log(error);
        }
      };
      fetchVendorDetails();
    } catch (error: any) {
      console.log(error);
    }
  }, []);
  return (
    <header className="p-[1rem] border-b-[1px] border-b-[#eaeaea]">
      <nav className="flex justify-between items-center">
        <Logo />
        <Group>
          {vendor && vendor.name ? (
            <div className="flex gap-[10px]">
              <Button
                variant="outline"
                onClick={() => router.push("/vendor/dashboard")}
              >
                Vendor Dashboard
              </Button>
              <Button
                onClick={() => {
                  logout();
                  router.refresh();
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-[10px]">
              <Button variant="outline" onClick={() => router.push("/signin")}>
                Sign in
              </Button>
              <Button onClick={() => router.push("/signup")}>Sign Up</Button>
            </div>
          )}
        </Group>
      </nav>
    </header>
  );
};

export default Navbar;
