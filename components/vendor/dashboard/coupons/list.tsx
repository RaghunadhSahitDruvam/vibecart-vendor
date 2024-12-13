import React from "react";
import CouponListItem from "./list.item";

const ListAllVendorCoupons = ({
  coupons,
  setCoupons,
}: {
  coupons: any;
  setCoupons: React.Dispatch<React.SetStateAction<any>>;
}) => {
  return (
    <div>
      <ul className="mt-[1rem]">
        {coupons?.map((coupon: any) => (
          <CouponListItem
            coupon={coupon}
            key={coupon._id}
            setCoupons={setCoupons}
          />
        ))}
      </ul>
    </div>
  );
};

export default ListAllVendorCoupons;
