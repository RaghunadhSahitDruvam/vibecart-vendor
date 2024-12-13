import React, { useEffect, useRef, useState } from "react";
import { TextInput, NumberInput, Button, Group, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { modals } from "@mantine/modals";

import { getVendorCookiesandFetchVendor } from "@/lib/database/actions/vendor/vendor.actions";
import {
  deleteCoupon,
  updateCoupon,
} from "@/lib/database/actions/vendor/coupon/coupon.actions";

const CouponListItem = ({
  coupon,
  setCoupons,
}: {
  coupon: any;
  setCoupons: any;
}) => {
  const [vendorId, setVendorId] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    try {
      const fetchVendorDetails = async () => {
        try {
          await getVendorCookiesandFetchVendor().then((res) => {
            if (res.success) {
              setVendorId(res.vendor._id);
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
  const [open, setOpen] = useState<boolean>(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const form = useForm({
    initialValues: {
      name: coupon.coupon,
      discount: coupon.discount,
      dateRange: [new Date(coupon.startDate), new Date(coupon.endDate)] as [
        any,
        any
      ],
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
          return "You ca't pick same dates!";
        }
        if (endDate.getTime() < startDate.getTime()) {
          return "Start Date cannot be later than End Date!";
        }
        return null;
      },
    },
  });
  const handleRemoveCoupon = async (couponId: string) => {
    try {
      await deleteCoupon(couponId, vendorId)
        .then((res) => {
          if (res?.success) {
            setCoupons(res?.coupons);
            alert(res?.message);
          }
        })
        .catch((err) => alert(err));
    } catch (error: any) {
      alert(error);
    }
  };
  const handleUpdateCoupon = async (couponId: string) => {
    try {
      const { name, discount, dateRange } = form.values;
      const [startDate, endDate] = dateRange;
      await updateCoupon(name, couponId, discount, startDate, endDate, vendorId)
        .then((res) => {
          if (res?.success) {
            setCoupons(res?.coupons);
            setOpen(false);
            alert(res?.message);
          }
        })
        .catch((err) => alert(err));
    } catch (error: any) {
      alert(error);
    }
  };

  return (
    <div>
      <li className="flex p-[10px] bg-blue-400 mt-[10px] text-whit font-bold items-center justify-between  ">
        <TextInput
          value={form.values.name}
          onChange={(e) => form.setFieldValue("name", e.target.value)}
          disabled={!open}
          className={
            open ? "bg-white !text-black" : "text-white bg-transparent"
          }
        />
        {open && (
          <Group>
            <NumberInput
              value={form.values.discount}
              onChange={(val) => form.setFieldValue("discount", val)}
              min={1}
              max={99}
              className={
                open ? "!bg-white !text-black" : "text-white bg-transparent"
              }
            />
            <DatePicker
              type="range"
              value={form.values.dateRange}
              onChange={(val) => form.setFieldValue("dateRange", val)}
              minDate={new Date()}
            />
            <Button onClick={() => handleUpdateCoupon(coupon._id)}>Save</Button>
            <Button
              color="red"
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
          </Group>
        )}
        <div className="flex">
          {form.values.discount + "%"}
          {!open && (
            <AiTwotoneEdit
              className="w-[22px] h-[22px] cursor-pointer ml-[1rem] "
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            />
          )}
          <AiFillDelete
            className="w-[22px] h-[22px] cursor-pointer ml-[1rem] "
            onClick={() => {
              modals.openConfirmModal({
                title: "Delete coupon",
                centered: true,
                children: (
                  <Text size="sm">
                    Are you sure you want to delete coupon? This action is
                    irreversible.
                  </Text>
                ),
                labels: {
                  confirm: "Delete coupon",
                  cancel: "No don't delete it",
                },
                confirmProps: { color: "red" },
                onCancel: () => console.log("Cancel"),
                onConfirm: () => handleRemoveCoupon(coupon._id),
              });
            }}
          />
        </div>
      </li>
    </div>
  );
};

export default CouponListItem;
