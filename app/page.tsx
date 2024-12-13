"use client";
import Navbar from "@/components/navbar";
import { getVendorCookiesandFetchVendor } from "@/lib/database/actions/vendor/vendor.actions";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [vendor, setVendor] = useState<any>(null);
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
    <div>
      <Navbar />
      {vendor && !vendor?.verified && (
        <div className="flex items-center justify-center bg-red-100">
          <b>Note:</b> You're not yet verified by an admin, so you do'nt have
          access to Dashboard!
        </div>
      )}
    </div>
  );
};

export default HomePage;
