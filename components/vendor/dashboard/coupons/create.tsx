"use client";

import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

import {
  TextInput,
  NumberInput,
  Button,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { DatePicker } from "@mantine/dates";
import { getVendorCookiesandFetchVendor } from "@/lib/database/actions/vendor/vendor.actions";
import { createCoupon } from "@/lib/database/actions/vendor/coupon/coupon.actions";
const CreateCoupon = ({ setCoupons }: { setCoupons: any }) => {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
  const form = useForm({
    initialValues: {
      name: "",
      discount: 0,
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      name: (value) =>
        value.length < 5 || value.length > 10
          ? "Coupon name must be between 5 to 10 characters."
          : null,
      discount: (value) =>
        value < 1 || value > 99 ? "Discount must be between 1% to 99%." : null,
      dateRange: ([startDate, endDate]) => {
        if (!startDate || !endDate) {
          return "Both start and end dates are required.";
        }
        if (startDate.getTime() === endDate.getTime()) {
          return "You can't pick same dates!";
        }
        if (endDate.getTime() < startDate.getTime()) {
          return "Start Date cannot be later than End Date!";
        }
        return null;
      },
    },
  });
  const submitHandler = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const [startDate, endDate] = values.dateRange;
      await createCoupon(
        values.name,
        values.discount,
        startDate,
        endDate,
        vendor._id
      )
        .then((res) => {
          if (res?.success) {
            setCoupons(res?.coupon);
            form.reset();
            alert(res?.message);
            setLoading(false);
          } else {
            alert(res?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          alert("Error" + err);
          setLoading(false);
        });
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div>
      <Box pos={"relative"}>
        {loading && (
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        )}
        <form onSubmit={form.onSubmit(submitHandler)}>
          <div className="titleStyle">Create a Coupon</div>
          <TextInput
            label="name"
            placeholder="Coupon name"
            {...form.getInputProps("name")}
          />

          <NumberInput
            label="Discount"
            placeholder="Discount"
            {...form.getInputProps("discount")}
            min={1}
            max={99}
          />
          <DatePicker
            type="range"
            value={form.values.dateRange}
            minDate={new Date()}
            onChange={(val: any) => form.setFieldValue("dateRange", val)}
          />
          <Button type="submit">Add Coupon</Button>
        </form>
      </Box>
    </div>
  );
};
export default CreateCoupon;
