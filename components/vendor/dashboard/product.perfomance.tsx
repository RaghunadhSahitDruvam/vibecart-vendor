"use client";

import {
  getTopSellingProducts,
  sizeAnalytics,
} from "@/lib/database/actions/vendor/analytics/analytics.actions";
import { useEffect, useState } from "react";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];
const ProductData = () => {
  const [sizeData, setSizeData] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  useEffect(() => {
    async function fetchSizeDataForProduct() {
      await sizeAnalytics()
        .then((res) => setSizeData(res))
        .catch((err) => console.log(err));
    }
    fetchSizeDataForProduct();
    async function topSellingProducts() {
      await getTopSellingProducts()
        .then((res) => setTopSellingProducts(res))
        .catch((err) => console.log(err));
    }
    topSellingProducts();
  }, []);
  return (
    <div className="">
      <div className="SecondaryTitleStyle">Product Performance</div>
      <div className="flex gap-[10px] my-[20px]">
        <div className="shadow-xl bg-gray-200 rounded-xl w-[50%]">
          <p className="px-[20px] py-[20px] text-2xl font-bold">
            Size Performance for the product:
          </p>
          {sizeData?.length > 0 ? (
            <PieChart width={800} height={400} className="ml-[-100px]">
              <Pie
                data={sizeData}
                cx={400}
                cy={200}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {sizeData?.length > 0 &&
                  sizeData?.map((entry: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <div className="flex justify-center items-center">
              No Data Found
            </div>
          )}
        </div>
        <div className="shadow-xl bg-gray-200 rounded-xl w-[50%]">
          <p className="px-[20px] py-[20px] text-2xl font-bold">
            Top Selling Products:
          </p>
          {topSellingProducts?.length > 0 ? (
            <PieChart width={700} height={400} className="ml-[100px]">
              <Pie
                data={topSellingProducts}
                cx={200}
                cy={200}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {topSellingProducts?.length > 0 &&
                  topSellingProducts?.map((entry: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <div className="flex justify-center items-center">
              No Data Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductData;
