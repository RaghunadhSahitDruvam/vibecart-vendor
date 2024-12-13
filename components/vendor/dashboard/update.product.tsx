"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  NumberInput,
  Textarea,
  TextInput,
  LoadingOverlay,
  Box,
  Group,
  Text,
  ColorInput,
  Code,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import JoditEditor from "jodit-react";
import { MdDelete } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Alert } from "@mantine/core";
import { IoIosInformationCircle } from "react-icons/io";
import {
  getParentsandCategories,
  updateProduct,
} from "@/lib/database/actions/vendor/products/products.actions";

interface FormValues {
  name: string;
  description: string;
  brand: string;
  sku: string;
  discount: number;
  longDescription: string;
  color: {
    color: string;
  };
  sizes: { size: string; qty: string; price: string }[];
  benefits: { name: string }[];
  ingredients: { name: string }[];
  questions: { question: string; answer: string }[];
  details: { name: string; value: string }[];
}

const UpdateProductComponent: React.FC<{ data: any; setOpen: any }> = ({
  data,
  setOpen,
}) => {
  const { _id: productId } = data;
  useEffect(() => {
    console.log(data);
    setSeller(data && data?.vendor?._id);
  }, [data]);

  const [seller, setSeller] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const editor = useRef(null);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      brand: "",
      sku: "",
      discount: 0,
      longDescription: "",
      color: {
        color: "",
      },
      sizes: [{ size: "", qty: "", price: "" }],
      benefits: [{ name: "" }],
      ingredients: [{ name: "" }],
      questions: [{ question: "", answer: "" }],
      shippingFee: "",
      details: [{ name: "", value: "" }],
    },
    validate: {
      name: hasLength({ min: 10, max: 100 }, "Must be at least 10 characters"),
      description: hasLength(
        { min: 10, max: 100 },
        "Must be at least 10 characters"
      ),
      longDescription: (value) =>
        value.length < 20
          ? "Long description must be at least 20 characters"
          : null,

      color: {
        color: (value: string) =>
          value === "" ? "You must select a color" : null,
      },
    },
  });

  useEffect(() => {
    setDataLoaded(true);
  }, [data]);

  // Update form values when data changes
  useEffect(() => {
    if (typeof data !== "undefined" && dataLoaded) {
      // Product Sizes

      form.setValues({
        name: data.name,
        description: data.description || "",
        brand: data.brand || "",
        sku: data?.sku || "",
        discount: data.discount || 0,
        longDescription: data?.longDescription,
        color: {
          color: data?.color?.color || "",
        },
        sizes: data?.sizes?.sizes?.length
          ? data?.sizes?.sizes?.map((size: any) => ({
              size: size.size,
              qty: size.qty,
              price: size.price,
            }))
          : [{ size: "", qty: "", price: "" }],
        benefits: data.benefits || [{ name: "" }],
        ingredients: data.ingredients || [{ name: "" }],
        questions: data.questions || [{ question: "", answer: "" }],
        shippingFee: data.shippingFee || "",
        details: data.details || [{ name: "", value: "" }],
      });
    }
    console.log(data);
  }, [data]);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);

    const updateProductHandler = async () => {
      try {
        // Prepare the product details for submission
        const productDetails = {
          sku: values.sku,
          color: {
            color: values.color.color,
          },
          sizes: values.sizes,
          discount: values.discount,
          name: values.name,
          description: values.description,
          brand: values.brand,
          details: values.details,
          questions: values.questions,
          benefits: values.benefits,
          ingredients: values.ingredients,
        };

        const response = await updateProduct(
          productId as string,
          seller,
          productDetails.sku,
          productDetails.color.color,
          productDetails.sizes,
          productDetails.discount,
          productDetails.name,
          productDetails.description,
          productDetails.brand,
          productDetails.details,
          productDetails.questions,
          productDetails.benefits,
          productDetails.ingredients,
          values.longDescription
        ).then((res) => {
          if (res?.success) {
            setLoading(false);
            alert(res?.message);
            setOpen(false);
          }
        });

        alert("Product updated successfully!");
      } catch (error: any) {
        console.error("Error updating product:", error); // Debugging: Log errors
        alert(`Error: ${error.message}`);
        setLoading(false);
      }
    };

    await updateProductHandler(); // Ensure this is awaited properly
  };

  return (
    <div>
      <Alert
        variant="light"
        color="red"
        radius="xs"
        withCloseButton
        title="Alert"
        icon={<IoIosInformationCircle />}
      >
        Due to some of the restrictions, you cannot change product images,
        category, sub categories, product style images.
      </Alert>
      <div>
        <Box pos="relative">
          {loading && (
            <LoadingOverlay
              visible={loading}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          )}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            {/* General Information */}
            <Box mb="md">
              <TextInput
                label="Product Name"
                placeholder="Enter product name"
                {...form.getInputProps("name")}
              />
            </Box>

            <Box mb="md">
              <Textarea
                label="Description"
                placeholder="Enter product description"
                {...form.getInputProps("description")}
              />
            </Box>

            <Box mb="md">
              <TextInput
                label="Brand"
                placeholder="Enter product brand"
                {...form.getInputProps("brand")}
              />
            </Box>

            <Box mb="md">
              <TextInput
                label="SKU"
                placeholder="Enter product SKU"
                {...form.getInputProps("sku")}
              />
            </Box>

            <Box mb="md">
              <NumberInput
                label="Discount"
                placeholder="Enter product discount"
                {...form.getInputProps("discount")}
              />
            </Box>

            <Box mb="md">
              <JoditEditor
                ref={editor}
                value={form.values.longDescription}
                onChange={(content) =>
                  form.setFieldValue("longDescription", content)
                }
              />
            </Box>

            <Box mb="md">
              <ColorInput
                label="Select Color"
                {...form.getInputProps("color.color")}
              />
            </Box>

            {/* Product Sizes */}
            <Box mb="md">
              <Text>Product Sizes</Text>
              {form.values.sizes.map((size, index) => {
                console.log("adfa", size);
                return (
                  <Group key={index}>
                    <TextInput
                      placeholder="Size"
                      {...form.getInputProps(`sizes.${index}.size`)}
                    />
                    <TextInput
                      placeholder="Quantity"
                      {...form.getInputProps(`sizes.${index}.qty`)}
                    />
                    <TextInput
                      placeholder="Price"
                      {...form.getInputProps(`sizes.${index}.price`)}
                    />
                    <Button
                      color="red"
                      onClick={() => form.removeListItem("sizes", index)}
                    >
                      <MdDelete />
                    </Button>
                  </Group>
                );
              })}
              <Button
                variant="outline"
                onClick={() =>
                  form.insertListItem("sizes", { size: "", qty: "", price: "" })
                }
              >
                <IoAdd />
              </Button>
            </Box>

            {/* Product Benefits */}
            <Box mb="md">
              <Text>Product Benefits</Text>
              {form.values.benefits.map((benefit, index) => (
                <Group key={index}>
                  <TextInput
                    placeholder="Benefit"
                    {...form.getInputProps(`benefits.${index}.name`)}
                  />
                  <Button
                    color="red"
                    onClick={() => form.removeListItem("benefits", index)}
                  >
                    <MdDelete />
                  </Button>
                </Group>
              ))}
              <Button
                variant="outline"
                onClick={() => form.insertListItem("benefits", { name: "" })}
              >
                <IoAdd />
              </Button>
            </Box>

            {/* Product Ingredients */}
            <Box mb="md">
              <Text>Product Ingredients</Text>
              {form.values.ingredients.map((ingredient, index) => (
                <Group key={index}>
                  <TextInput
                    placeholder="Ingredient"
                    {...form.getInputProps(`ingredients.${index}.name`)}
                  />
                  <Button
                    color="red"
                    onClick={() => form.removeListItem("ingredients", index)}
                  >
                    <MdDelete />
                  </Button>
                </Group>
              ))}
              <Button
                variant="outline"
                onClick={() => form.insertListItem("ingredients", { name: "" })}
              >
                <IoAdd />
              </Button>
            </Box>

            {/* Product Questions */}
            <Box mb="md">
              <Text>Product Questions</Text>
              {form.values.questions.map((question, index) => (
                <Group key={index}>
                  <TextInput
                    placeholder="Question"
                    {...form.getInputProps(`questions.${index}.question`)}
                  />
                  <TextInput
                    placeholder="Answer"
                    {...form.getInputProps(`questions.${index}.answer`)}
                  />
                  <Button
                    color="red"
                    onClick={() => form.removeListItem("questions", index)}
                  >
                    <MdDelete />
                  </Button>
                </Group>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  form.insertListItem("questions", {
                    question: "",
                    answer: "",
                  })
                }
              >
                <IoAdd />
              </Button>
            </Box>

            {/* Product Details */}
            <Box mb="md">
              <Text>Product Details</Text>
              {form.values.details.map((detail, index) => (
                <Group key={index}>
                  <TextInput
                    placeholder="Detail Name"
                    {...form.getInputProps(`details.${index}.name`)}
                  />
                  <TextInput
                    placeholder="Detail Value"
                    {...form.getInputProps(`details.${index}.value`)}
                  />
                  <Button
                    color="red"
                    onClick={() => form.removeListItem("details", index)}
                  >
                    <MdDelete />
                  </Button>
                </Group>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  form.insertListItem("details", { name: "", value: "" })
                }
              >
                <IoAdd />
              </Button>
            </Box>

            <Group mt="md">
              <Button type="submit">Update Product</Button>
            </Group>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default UpdateProductComponent;
