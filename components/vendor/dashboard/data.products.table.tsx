"use client";
import {
  deleteProduct,
  getSingleProductById,
} from "@/lib/database/actions/vendor/products/products.actions";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { FaEdit, FaSearchPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Drawer, Text } from "@mantine/core";
import { useState } from "react";
import UpdateProductComponent from "./update.product";
import { modals } from "@mantine/modals";

const ProductsDataTable = ({ products }: { products: any }) => {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const [data, setData] = useState({});

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId).then((res) => {
        if (res?.success) {
          alert(res?.message);
          router.refresh();
        }
      });
    } catch (error: any) {
      alert(error);
    }
  };
  const getProductDetails = async (id: string) => {
    try {
      await getSingleProductById(id)
        .then((res) => {
          if (res?.success) {
            setData(res);
          }
        })
        .catch((err) => alert(err));
    } catch (error: any) {
      alert(error);
    }
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "image",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="product"
          style={{ width: "70%", height: "100%", borderRadius: "100%" }}
        />
      ),
    },
    { field: "product_id", headerName: "Product ID", width: 200 },
    { field: "productname", headerName: "Product Name", width: 150 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "sizes", headerName: "Sizes", width: 50 },
    {
      field: "view",
      headerName: "View",
      width: 50,
      renderCell: () => (
        <div className="mt-[10px]">
          <FaSearchPlus size={20} />
        </div>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 50,
      renderCell: (params) => (
        <div className="mt-[10px] ">
          <Drawer
            opened={opened}
            position="right"
            onClose={() => {
              setOpened(false);
            }}
            title="Update Product"
            size={"lg"}
          >
            <UpdateProductComponent data={data} setOpen={setOpened} />
          </Drawer>
          <FaEdit
            size={20}
            onClick={() => {
              setOpened(true);
              getProductDetails(params.row.product_id);
            }}
            className="cursor-pointer"
          />
        </div>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 50,
      renderCell: (params) => (
        <div
          className="mt-[10px] cursor-pointer"
          onClick={() => {
            modals.openConfirmModal({
              title: "Delete product",
              centered: true,
              children: (
                <Text size="sm">
                  Are you sure you want to delete product? This action is
                  irreversible.
                </Text>
              ),
              labels: {
                confirm: "Delete product",
                cancel: "No don't delete it",
              },
              confirmProps: { color: "red" },
              onCancel: () => console.log("Cancel"),
              onConfirm: () => handleDeleteProduct(params.row.product_id),
            });
          }}
        >
          <RiDeleteBin6Fill size={20} />
        </div>
      ),
    },
  ];
  const createRows = (products: any[]) => {
    return products.map((product: any, index: any) => {
      const subProduct = product.subProducts[0] || {};
      const sizes = subProduct.sizes || [];

      const sizePrices = sizes
        .map((size: any) => `${size.size}: ₹${size.price}`)
        .join(", ");
      const sizeLabels = sizes.map((size: any) => size.size).join(", ");

      return {
        id: index + 1,
        productname: product.name,
        product_id: product._id,
        image: product.subProducts[0].images[0].url,
        category: product.category.name,
        price: sizePrices,
        sizes: sizeLabels,
        view: "-",
        edit: "-",
        delete: "-",
      };
    });
  };
  const rows = createRows(products);
  return (
    <div className="h-[400px] w-full">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default ProductsDataTable;
