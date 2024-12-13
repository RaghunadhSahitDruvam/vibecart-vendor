"use client";

import AllOrdersTable from "@/components/vendor/dashboard/orders/data-table";
import { getAllOrders } from "@/lib/database/actions/vendor/orders/orders.actions";
import { getVendorCookiesandFetchVendor } from "@/lib/database/actions/vendor/vendor.actions";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  type DateRange =
    | "today"
    | "yesterday"
    | "2d"
    | "7d"
    | "15d"
    | "30d"
    | "2m"
    | "5m"
    | "10m"
    | "12m"
    | "all"
    | "today_and_yesterday";
  type PaymentStatus = "paid" | "unPaid" | "-";
  type PaymentMethod = "cash" | "RazorPay" | "-";
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<any>();
  const [range, setRange] = useState<DateRange>("today");
  const [isPaid, setIsPaid] = useState<PaymentStatus>("-");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("-");

  useEffect(() => {
    try {
      const fetchVendorDetails = async () => {
        try {
          await getVendorCookiesandFetchVendor().then((res) => {
            if (res?.success) {
              setVendor(res?.vendor._id);
              setLoading(false);
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
  useEffect(() => {
    async function getOrdersForVendor() {
      try {
        if (vendor) {
          await getAllOrders(vendor, range, isPaid, paymentMethod)
            .then((res) => {
              setOrders(res);
              console.log(res);
            })
            .catch((err) => alert(err));
        }
      } catch (error: any) {
        console.log(error);
        alert(error);
      }
    }
    getOrdersForVendor();
  }, [vendor, range, isPaid, paymentMethod]);
  return (
    <div>
      <AllOrdersTable
        rows={orders}
        range={range}
        setRange={setRange}
        setIsPaid={setIsPaid}
        isPaid={isPaid}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    </div>
  );
};

export default OrdersPage;
