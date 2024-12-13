"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import styles from "./styles.module.css";

import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
// import PopupModal from "@/components/PopupModal";
// import axios from "axios";
import { useRouter } from "next/navigation";

import { MenuItem, TextField } from "@mui/material";
import { Select } from "@mantine/core";
import {
  updateOrdertoOldOrder,
  updateProductOrderStatus,
} from "@/lib/database/actions/vendor/orders/orders.actions";

const options = [
  { value: "Not Processed", text: "Not Processed" },
  { value: "Processing", text: "Processing" },
  { value: "Dispatched", text: "Dispatched" },
  { value: "Cancelled", text: "Cancelled" },
  { value: "Completed", text: "Completed" },
];

function Row(props: any) {
  const router = useRouter();

  const { row } = props;
  const [open, setOpen] = React.useState(false);
  // const [loading, setLoading] = React.useState(false);
  const handleChange = async (e: any, productId: string, orderId: string) => {
    await updateProductOrderStatus(orderId, productId, e.target.value)
      .then((res) => {
        alert(res?.success ? res.message : "----");
        router.refresh();
      })
      .catch((err) => console.log(err));
  };

  const changeOrdertoOld = async (id: string) => {
    await updateOrdertoOldOrder(id)
      .then((res) => {
        alert(res ? res : "");
        router.refresh();
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row._id}
        </TableCell>
        <TableCell>{row.isNew ? "New Order" : "-"}</TableCell>
        <TableCell align="right">{row.paymentMethod}</TableCell>
        <TableCell align="left">
          {row.isPaid ? (
            <FaCheckCircle size={23} color="green" />
          ) : (
            <IoIosCloseCircle size={25} color="red" />
          )}
        </TableCell>
        <TableCell align="right">{row.couponApplied || "-"}</TableCell>
        <TableCell align="right">
          <b>Rs. {row.total}</b>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order for
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Change Order</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Shipping Informations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.user.id}>
                    <TableCell component="th" scope="row">
                      <img
                        src={row.user.image}
                        className={styles.table__img}
                        alt=""
                      />
                    </TableCell>
                    <TableCell>
                      {row.isNew ? (
                        <div>
                          I checked this order, change order to old <br />
                          <button
                            className="btn "
                            onClick={() => changeOrdertoOld(row._id)}
                          >
                            check
                          </button>
                        </div>
                      ) : (
                        <div>this is Old order</div>
                      )}
                    </TableCell>
                    <TableCell align="left">{row.user.email}</TableCell>
                    <TableCell align="right">
                      {row.shippingAddress.firstName}{" "}
                      {row.shippingAddress.lastName} <br />
                      {row.shippingAddress.address1} <br />
                      {row.shippingAddress.address2} <br />
                      {row.shippingAddress.state},{row.shippingAddress.city}{" "}
                      <br />
                      {row.shippingAddress.country} <br />
                      {row.shippingAddress.zipCode} <br />
                      {row.shippingAddress.phoneNumber} <br />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Vendor Id</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((p: any) => (
                    <TableRow key={p._id}>
                      <TableCell component="th" scope="row">
                        <div className="relative inline-block">
                          <img src={p.image} alt="" className="w-[100px]" />
                          {p.vendor && (
                            <div className="absolute top-0 right-0 bg-[#EB4F0C] text-white text-[10px] p-2">
                              {p.vendor.name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell align="left">{p.size}</TableCell>
                      <TableCell align="left">x{p.qty}</TableCell>
                      <TableCell align="left">₹ {p.price}</TableCell>

                      <TableCell align="left">
                        <b
                          className={`py-[2px] px-[5px] text-white ${
                            p.status == "Not Processed"
                              ? "bg-[#e6554191]"
                              : p.status == "Processing"
                              ? "bg-[#54b7d3]"
                              : p.status == "Dispatched"
                              ? "bg-[#1e91cf]"
                              : p.status == "Cancelled"
                              ? "bg-[#e3d4d4]"
                              : p.status == "Completed"
                              ? "bg-[#4cb64c]"
                              : p.status == "Processing Refund"
                              ? "bg-red-500 text-white rounded-md p-[5px]"
                              : ""
                          }`}
                        >
                          {p.status}
                        </b>
                        <br />
                        <br />
                        {/* <button
                          className="px-4 py-2 blue_col_bg text-white rounded "
                          onClick={toggleModal}
                        >
                          Change Status
                        </button>
                        <PopupModal
                          isOpen={isOpen}
                          onClose={toggleModal}
                          status={p.status}
                          productId={p._id}
                          orderId={row._id}
                        /> */}
                        <select
                          className="border border-black"
                          value={p.status}
                          onChange={(e) => handleChange(e, p._id, row._id)}
                        >
                          {options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.text}
                            </option>
                          ))}
                        </select>{" "}
                      </TableCell>
                      <TableCell align="left">
                        {p.vendor._id ? p.vendor._id : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow key={row._id}>
                    <TableCell component="th" scope="row" align="left">
                      TOTAL
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell
                      align="left"
                      style={{ padding: "20px 0 20px 18px" }}
                    >
                      <b style={{ fontSize: "20px" }}>₹ {row.total}</b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    order: PropTypes.number.isRequired,
    payment_method: PropTypes.string.isRequired,
    paid: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    coupon: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    user: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        shippingAddress: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default function AllOrdersTable({
  rows,
  range,
  setRange,
  isPaid,
  setIsPaid,
  paymentMethod,
  setPaymentMethod,
}: {
  rows: any[];
  range?: any;
  setRange?: any;
  isPaid?: any;
  setIsPaid?: any;
  paymentMethod?: any;
  setPaymentMethod?: any;
}) {
  const [searchOrderText, setSearchOrderText] = React.useState<string>("");
  const [filteredRowsByText, setFilteredRowsByText] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (searchOrderText.length === 24) {
      const filteredRows = rows?.filter(
        (item) => item._id.toString() === searchOrderText.toString()
      );
      setFilteredRowsByText(filteredRows);
    } else {
      setFilteredRowsByText([]);
    }
  }, [searchOrderText, rows]);

  return (
    <>
      <div className="">
        <h1 className="text-black font-bold text-2xl">
          Total Orders - {rows?.length}
        </h1>
        <div className="">
          <div className="flex gap-[10px]">
            <TextField
              id="outlined-basic"
              label="Search Order By ID"
              variant="outlined"
              className="w-[50%] flex justify-center bg-gray-100"
              onChange={(e) => setSearchOrderText(e.target.value)}
            />
            <Select
              label="Order Range"
              placeholder="Pick a range"
              value={range}
              onChange={setRange}
              data={[
                { value: "all", label: "All Orders" },
                { value: "today", label: "Today" },
                { value: "today_and_yesterday", label: "Today and Yesterday" },
                { value: "2d", label: "Last 2 Days" },
                { value: "7d", label: "Last 7 Days" },
                { value: "15d", label: "Last 15 Days" },
                { value: "30d", label: "Last 30 Days" },
                { value: "2m", label: "Last 2 Months" },
                { value: "5m", label: "Last 5 Months" },
                { value: "10m", label: "Last 10 Months" },
                { value: "12m", label: "Last 12 Months" },
              ]}
            />

            <Select
              label="Order Payment Status"
              placeholder="Pick a status"
              value={isPaid}
              onChange={setIsPaid}
              data={[
                { value: "-", label: "Order Payment Status" },
                { value: "paid", label: "Paid" },
                { value: "unPaid", label: "Not Paid" },
              ]}
            />

            <Select
              label="Order Payment Method"
              placeholder="Pick a method"
              value={paymentMethod}
              onChange={setPaymentMethod}
              data={[
                { value: "-", label: "Order Payment Method" },
                { value: "cash", label: "COD" },
                { value: "RazorPay", label: "RazorPay" },
              ]}
            />
          </div>
        </div>

        <TableContainer component={Paper}>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            paddingX="5px"
            id="tableTitle"
            component="div"
          >
            Orders
          </Typography>
          <Table aria-label="collapsible table" className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Order</TableCell>
                <TableCell>New</TableCell>
                <TableCell align="right">Payment Method</TableCell>
                <TableCell align="right">Paid</TableCell>
                <TableCell align="right">Coupon</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchOrderText.length === 24
                ? filteredRowsByText.map((row: any) => (
                    <Row key={row._id} row={row} />
                  ))
                : rows?.map((row: any) => <Row key={row._id} row={row} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
