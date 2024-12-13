import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getOutOfStockProducts } from "@/lib/database/actions/vendor/dashboard/dashboard.actions";
const OutOfStockProducts = async () => {
  const products = await getOutOfStockProducts().catch((err) =>
    console.log(err)
  );
  return (
    <div className="w-full container">
      <div className="SecondaryTitleStyle">Out of Stock Products</div>
      <div className="">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Stock Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.outOfStockProducts?.length > 0 ? (
                products?.outOfStockProducts.map((product: any) =>
                  product.subProducts?.map((subProduct: any) =>
                    subProduct.sizes?.map((size: any) => {
                      if (size && size.qty < 2) {
                        return (
                          <TableRow key={size._id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{size.size}</TableCell>
                            <TableCell>{size.qty}</TableCell>
                          </TableRow>
                        );
                      }
                      return null;
                    })
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No out of stock products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default OutOfStockProducts;
