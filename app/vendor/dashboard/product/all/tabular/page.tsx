"use client";

import ProductsDataTable from "@/components/vendor/dashboard/data.products.table";
import { getVendorProducts } from "@/lib/database/actions/vendor/products/products.actions";
import { getVendorCookiesandFetchVendor } from "@/lib/database/actions/vendor/vendor.actions";
import { useState, useEffect } from "react";
const AllProductsPage = () => {
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
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
    const fetchAllProducts = async () => {
      try {
        await getVendorProducts(vendor)
          .then((res) => {
            setProducts(res);
          })
          .catch((err) => alert(err));
      } catch (error: any) {
        console.log(error);
      }
    };
    if (vendor) {
      fetchAllProducts();
    }
  }, [vendor]);
  return (
    <div className="container">
      <div className="mb-[1rem] titleStyle">All Products</div>
      {Array.isArray(products) && products.length > 0 ? (
        <ProductsDataTable products={products} />
      ) : (
        <p>No Products Found!!!</p>
      )}
    </div>
  );
};

export default AllProductsPage;
