"use client";
import { GiTakeMyMoney } from "react-icons/gi";
import { SiProducthunt } from "react-icons/si";
import { SlHandbag } from "react-icons/sl";
import React from "react";

const DashboardCard = ({ data }: { data: any }) => {
  return (
    <div>
      <div className={"titleStyle"}>Dashboard</div>
      <div className="flex justify-evenly items-center">
        <div className="h-[200px] w-[200px] shadow-2xl bg-green-400 flex items-center rounded-3xl">
          <SlHandbag size={35} /> + {data.orders.length} Total Orders
        </div>
        <div className="h-[200px] w-[200px] shadow-2xl bg-orange-400  flex items-center rounded-3xl">
          <SiProducthunt size={35} /> + {data.products.length} Total Products
        </div>
        <div className="h-[200px] w-[200px] shadow-2xl bg-pink-400 flex items-center rounded-3xl">
          <GiTakeMyMoney size={35} />
          <div className="">
            + ${data.orders.reduce((a: any, val: any) => a + val.total, 0)}{" "}
            <span>
              - ${" "}
              {data.orders
                .filter((o: any) => !o.isPaid)
                .reduce((a: any, val: any) => a + val.total, 0)
                .toFixed(2)}{" "}
              Un paid yet.
            </span>
            Total Earnings.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
