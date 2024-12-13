import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { SlEye } from "react-icons/sl";
import { HiCurrencyRupee } from "react-icons/hi";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  calculateTotalOrders,
  getDashboardData,
} from "@/lib/database/actions/vendor/dashboard/dashboard.actions";
import DashboardCard from "@/components/vendor/dashboard/dashboardCard";
import ProductData from "@/components/vendor/dashboard/product.perfomance";
import LowStockProducts from "@/components/vendor/dashboard/low-stock-products";
import OutOfStockProducts from "@/components/vendor/dashboard/out-of-stock-products";

const VendorDashboardPage = async () => {
  const data = await getDashboardData().catch((err) => console.log(err));
  const allOrdersData = await calculateTotalOrders().catch((err) =>
    console.log(err)
  );

  return (
    <div className="container">
      <div className="my-[20px]">
        <DashboardCard data={data} />
      </div>
      <div className="titleStyle">Orders</div>
      <div className="flex justify-evenly items-center my-[20px]">
        <div className="h-[100px] gap-[10px] border-2 border-gray-400 p-[10px] w-[200px] shadow-2xl flex items-center justify-center rounded-3xl">
          <HiCurrencyRupee size={100} /> ₹ {allOrdersData?.totalSales} Total
          Sales
        </div>
        <div className="h-[100px] gap-[10px] border-2 border-gray-400 p-[10px] w-[200px] shadow-2xl flex items-center justify-center rounded-3xl">
          <HiCurrencyRupee size={100} /> ₹ {allOrdersData?.lastMonthSales} Last
          Month Sales
        </div>{" "}
        <div className="h-[100px] gap-[10px] border-2 border-gray-400 p-[10px] w-[200px] shadow-2xl flex items-center justify-center rounded-3xl">
          <HiCurrencyRupee size={100} /> ₹ {allOrdersData?.growthPercentage}{" "}
          Growth Percentage
        </div>
      </div>
      <div className="my-[20px]">
        <div className="">
          <div className="SecondaryTitleStyle">Recent Orders</div>
        </div>
        <div className="w-full">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ border: "2px solid black" }}>
                    Name
                  </TableCell>
                  <TableCell style={{ border: "2px solid black" }}>
                    Total
                  </TableCell>
                  <TableCell style={{ border: "2px solid black" }}>
                    Payment
                  </TableCell>
                  <TableCell style={{ border: "2px solid black" }}>
                    View
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.orders?.map((order: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell style={{ border: "2px solid black" }}>
                      {order?.user?.email}
                    </TableCell>
                    <TableCell style={{ border: "2px solid black" }}>
                      ₹ {order.total}
                    </TableCell>
                    <TableCell style={{ border: "2px solid black" }}>
                      {order.isPaid ? (
                        <FaCheckCircle size={23} color="green" />
                      ) : (
                        <IoIosCloseCircle size={25} color="red" />
                      )}
                    </TableCell>
                    <TableCell style={{ border: "2px solid black" }}>
                      <Link href={`/order/${order._id}`}>
                        <SlEye />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <ProductData />
      <LowStockProducts />
      <OutOfStockProducts />
    </div>
  );
};

export default VendorDashboardPage;
