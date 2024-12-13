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
import { loginVendor } from "@/lib/database/actions/vendor/auth/login";

const SignInPage = () => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Invalid Email."),
      password: hasLength(
        { min: 10 },
        "Password must be at least 10 characters long."
      ),
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
      await loginVendor(values.email, values.password)
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
          <h1 className="text-3xl font-bold">Sign In</h1>
          {failureMessage.visible && (
            <Notification color="red" title="Error!" mt={"md"}>
              {failureMessage.message}
            </Notification>
          )}
          {successMessage && (
            <Notification color="teal" title="Successfully logged in" mt={"md"}>
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

              <PasswordInput
                {...form.getInputProps("password")}
                label="Password"
                placeholder="Password"
                required
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

export default SignInPage;
