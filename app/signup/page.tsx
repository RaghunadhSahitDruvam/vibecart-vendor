"use client";
import React, { useState } from "react";
import {
  Button,
  NumberInput,
  PasswordInput,
  Textarea,
  TextInput,
  Notification,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { registerVendor } from "@/lib/database/actions/vendor/auth/register";

const SignUpPage = () => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      description: "",
      address: "",
      phoneNumber: 0,
      zipCode: 0,
    },
    validate: {
      name: hasLength({ min: 8 }, "Must be at least 8 characters long."),
      email: isEmail("Invalid Email."),
      password: hasLength(
        { min: 10 },
        "Password must be at least 10 characters long."
      ),
      address: hasLength({ min: 15 }, "Must be at least 15 characters long."),
    },
  });
  const [successMessage, setSuccessMessage] = useState(false);
  const [failureMessage, setFailureMessage] = useState<{
    visible: boolean;
    message: string | undefined;
  }>({ visible: false, message: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      await registerVendor(
        values.name,
        values.email,
        values.password,
        values.address,
        values.phoneNumber,
        values.zipCode
      )
        .then((res) => {
          if (res?.success) {
            setSuccessMessage(true);
            setFailureMessage({ visible: false, message: "" });
            setTimeout(() => {
              router.push("/vendor/dashboard");
            }, 3000);
          } else if (!res?.success) {
            setSuccessMessage(false);
            setFailureMessage({ visible: true, message: res?.message });
          }
        })
        .catch((err) => {
          setFailureMessage({ visible: true, message: err.toString() });
        });
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <div className="">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          {failureMessage.visible && (
            <Notification color="red" title="Error!" mt={"md"}>
              {failureMessage.message}
            </Notification>
          )}
          {successMessage && (
            <Notification
              color="teal"
              title="Successfully sent verification request to an admin."
              mt={"md"}
            >
              You&apos;re being redirected to the dashboard
            </Notification>
          )}
          <Box pos={"relative"}>
            {loading && (
              <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
            )}
            <form
              onSubmit={form.onSubmit((values) => {
                handleSubmit(values);
              })}
              className="w-[500px]"
            >
              <TextInput
                {...form.getInputProps("email")}
                mt={"md"}
                label="Email"
                placeholder="Email"
                required
              />
              <TextInput
                {...form.getInputProps("name")}
                label="Name"
                placeholder="Name"
                required
              />
              <PasswordInput
                {...form.getInputProps("password")}
                label="Password"
                placeholder="Password"
                required
              />
              <NumberInput
                {...form.getInputProps("phoneNumber")}
                label="Phone Number"
                placeholder="Phone Number"
                required
                mt={"md"}
              />
              <NumberInput
                {...form.getInputProps("zipCode")}
                label="Zip Code"
                placeholder="Zip Code"
                required
                mt={"md"}
              />
              <Textarea
                {...form.getInputProps("address")}
                placeholder="Address"
                label="Address"
                required
              />
              <Textarea
                {...form.getInputProps("description")}
                placeholder="Description"
                label="Description"
              />
              <Button type="submit" mt={"md"}>
                {loading ? "Loading..." : "Submit"}
              </Button>
            </form>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
