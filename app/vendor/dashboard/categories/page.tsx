"use client";
import CreateCategory from "@/components/vendor/dashboard/categories/create";
import ListAllCategories from "@/components/vendor/dashboard/categories/list";
import { getAllCategories } from "@/lib/database/actions/vendor/category/category.actions";
import { useEffect, useState } from "react";

const VendorCategories = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        await getAllCategories()
          .then((res) => {
            setData(res);
          })
          .catch((err) => alert(err));
      } catch (error: any) {
        alert(error);
      }
    };
    fetchAllCategories();
  }, []);
  return (
    <div>
      <CreateCategory setCategories={setData} />
      <ListAllCategories categories={data} setCategories={setData} />
    </div>
  );
};

export default VendorCategories;
