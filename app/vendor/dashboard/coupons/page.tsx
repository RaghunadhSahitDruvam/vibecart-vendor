"use client";

import CreateCoupon from "@/components/vendor/dashboard/coupons/create";
import ListAllVendorCoupons from "@/components/vendor/dashboard/coupons/list";
import CouponListItem from "@/components/vendor/dashboard/coupons/list.item";
import { getAllCoupons } from "@/lib/database/actions/vendor/coupon/coupon.actions";
import { getVendorCookiesandFetchVendor } from "@/lib/database/actions/vendor/vendor.actions";
import { useEffect, useState } from "react";

const VendorCouponsPage = () => {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    try {
      const fetchVendorDetails = async () => {
        try {
          await getVendorCookiesandFetchVendor().then((res) => {
            if (res.success) {
              setVendor(res.vendor);
              setLoading(false);
            }
          });
        } catch (error: any) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchVendorDetails();
    } catch (error: any) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    const fetchAllCoupons = async () => {
      if (vendor) {
        try {
          await getAllCoupons(vendor._id).then((res) => {
            console.log(vendor._id);
            if (res?.success) {
              setData(res?.coupons);
              console.log(res?.coupons);
            } else {
              alert(res?.message);
              console.log(res?.message);
            }
          });
        } catch (error: any) {
          console.log(error);
        }
      }
    };
    fetchAllCoupons();
  }, [vendor]);
  return (
    <div className="container">
      <CreateCoupon setCoupons={setData} />
      <ListAllVendorCoupons coupons={data} setCoupons={setData} />
    </div>
  );
};
export default VendorCouponsPage;
