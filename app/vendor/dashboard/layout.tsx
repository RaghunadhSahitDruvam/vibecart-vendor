"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../globals.css";
import "@mantine/core/styles.css";
import { AppShell, Burger, Group, MantineProvider, Text } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { MdOutlineCategory, MdSpaceDashboard } from "react-icons/md";
import { IoListCircleSharp } from "react-icons/io5";
import { FaTable } from "react-icons/fa";
import { BsPatchPlus } from "react-icons/bs";
import { RiCoupon3Fill } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import { logout } from "@/lib/database/actions/vendor/auth/logout";
import { getVendorCookiesandFetchVendor } from "@/lib/database/actions/vendor/vendor.actions";
import { modals, ModalsProvider } from "@mantine/modals";
import Logo from "@/components/Logo";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    try {
      const fetchVendorDetails = async () => {
        try {
          await getVendorCookiesandFetchVendor().then((res) => {
            if (res?.success) {
              setVendor(res?.vendor);
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
    if (vendor && !vendor.verified) {
      router.push("/");
    }
  }, [vendor]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <MantineProvider>
      <ModalsProvider>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}
          padding={"md"}
        >
          <AppShell.Header>
            <Group h={"100%"} px={"md"}>
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size={"sm"}
              />
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size={"sm"}
              />
              <Logo />
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p={"md"}>
            <div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/vendor/dashboard"}>
                  <MdSpaceDashboard size={20} />
                </Link>
                <Link href={"/vendor/dashboard"}>
                  <div className="">Vendor Dashboard</div>
                </Link>
              </div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/vendor/dashboard/coupons"}>
                  <RiCoupon3Fill size={20} />
                </Link>
                <Link href={"/vendor/dashboard/coupons"}>
                  <div className="">Coupons</div>
                </Link>
              </div>
              <div className="">Orders:</div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/vendor/dashboard/orders"}>
                  <IoListCircleSharp size={20} />
                </Link>
                <Link href={"/vendor/dashboard/orders"}>
                  <div className="">Orders</div>
                </Link>
              </div>
              <div className="">Products:</div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/vendor/dashboard/product/all/tabular"}>
                  <FaTable size={20} />
                </Link>
                <Link href={"/vendor/dashboard/product/all/tabular"}>
                  <div className="">All Products</div>
                </Link>
              </div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/vendor/dashboard/product/create"}>
                  <BsPatchPlus size={20} />
                </Link>
                <Link href={"/vendor/dashboard/product/create"}>
                  <div className="">Create product</div>
                </Link>
              </div>
              <div className="">Categories:</div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/vendor/dashboard/categories"}>
                  <MdOutlineCategory size={20} />
                </Link>
                <Link href={"/vendor/dashboard/categories"}>
                  <div className="">Categories</div>
                </Link>
              </div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/vendor/dashboard/subCategories"}>
                  <MdOutlineCategory
                    size={20}
                    style={{ transform: "rotate(180deg)" }}
                  />
                </Link>
                <Link href={"/vendor/dashboard/subCategories"}>
                  <div className="">Sub Categories</div>
                </Link>
              </div>
              <div className="">Analytics:</div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/vendor/dashboard/analytics/order"}>
                  <VscGraph size={20} />
                </Link>
                <Link href={"/vendor/dashboard/analytics/order"}>
                  <div className="">Order Analytics</div>
                </Link>
              </div>
              <div
                onClick={() => {
                  modals.openConfirmModal({
                    title: "Logout",
                    centered: true,
                    children: <Text size="sm">Do you want to log out?</Text>,
                    labels: {
                      confirm: "Yes, Logout",
                      cancel: "Cancel",
                    },
                    confirmProps: { color: "red" },
                    onCancel: () => console.log("Cancel"),
                    onConfirm: () => logout(),
                  });
                }}
                className="cursor-pointer flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100 "
              >
                <IoIosLogOut size={20} />
                <div className="">Logout</div>
              </div>
            </div>
          </AppShell.Navbar>
          <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
}
