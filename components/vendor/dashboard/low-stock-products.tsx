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
import { getLowStockProducts } from "@/lib/database/actions/vendor/dashboard/dashboard.actions";
const LowStockProducts = async () => {
  const products = await getLowStockProducts().catch((err) => console.log(err));
  return (
    <div className="w-full container">
      <div className="SecondaryTitleStyle">Low Stock Products</div>
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
              {products?.lowStockProducts?.length > 0 ? (
                products?.lowStockProducts.map((product: any) =>
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
                    No low stock products found.
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

export default LowStockProducts;
