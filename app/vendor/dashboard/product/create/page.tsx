"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  NumberInput,
  Textarea,
  TextInput,
  LoadingOverlay,
  Box,
  Group,
  Text,
  SimpleGrid,
  Image,
  FileInput,
  ColorInput,
  Code,
  Select,
  MultiSelect,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import JoditEditor from "jodit-react";
import {
  createProduct,
  getParentsandCategories,
  getSingleProductById,
} from "@/lib/database/actions/vendor/products/products.actions";
import { getSubCategoriesByCategoryParent } from "@/lib/database/actions/vendor/subCategories/subcategories.actions";
import { getVendorCookiesandFetchVendor } from "@/lib/database/actions/vendor/vendor.actions";
import { MdDelete } from "react-icons/md";
import { IoAdd } from "react-icons/io5";

interface FormValues {
  name: string;
  description: string;
  brand: string;
  sku: string;
  discount: number;
  imageFiles: File[];
  longDescription: string;
  color: {
    color: string;
    image: File | null;
  };
  parent: string;
  category: string;
  subCategories: string[];
  sizes: { size: string; qty: string; price: string }[];
  benefits: { name: string }[];
  ingredients: { name: string }[];
  questions: { question: string; answer: string }[];
  shippingFee: string;
  details: { name: string; value: string }[];
}
const CreateProductPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [parents, setParents] = useState<{ _id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [subs, setSubs] = useState<any>([]);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const editor = useRef(null);

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
  // initialize mantine form

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      description: "",
      brand: "",
      sku: "",
      discount: 0,
      imageFiles: [],
      longDescription: "",
      color: {
        color: "",
        image: null,
      },
      parent: "",
      category: "",
      subCategories: [],
      sizes: [{ size: "", qty: "", price: "" }],
      benefits: [{ name: "" }],
      ingredients: [{ name: "" }],
      questions: [{ question: "", answer: "" }],
      shippingFee: "",
      details: [{ name: "", value: "" }],
    },
    validate: {
      name: hasLength({ min: 10, max: 100 }, "Must be at least 10 characters."),
      description: hasLength(
        { min: 10, max: 100 },
        "Must be at least 10 characters."
      ),

      imageFiles: (value) =>
        value.length === 0 ? "You must upload at least one image." : null,
      color: {
        color: (value: string) =>
          value === "" ? "You must select a color" : null,
        image: (value: File | null) =>
          value === null ? "You must upload an image for the color." : null,
      },
    },
  });
  const handleImageChange = useCallback(
    (files: File[]) => {
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setImages(previewUrls);
      form.setFieldValue("imageFiles", files);
    },
    [form]
  );
  const handleColorImageChange = useCallback(
    (file: File | null) => {
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        form.setFieldValue("color.image", file);
        setImages([previewUrl]);
      }
    },
    [form]
  );
  // handle Submit function:
  const handleSubmit = async (values: FormValues) => {
    const createProductHandler = async () => {
      const array = [];
      let style_img = "";
      let uploaded_images: any = "";
      setLoading(true);

      // check if any images were uploaded
      if (!values.imageFiles.length) {
        alert("No image files are selected");
        setLoading(false);
        return;
      }
      // upload images to cloudinary
      for (let i = 0; i < values.imageFiles.length; i++) {
        const formData = new FormData();
        formData.append("file", values.imageFiles[i]);
        formData.append("upload_preset", "website");
        try {
          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/dtxh3ew7s/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          const uploadedImagesData = await uploadResponse.json();
          array.push(uploadedImagesData);
        } catch (error: any) {
          console.log("Error uploading images:", error);
          setLoading(false);
          return;
        }
      }

      // Prepare the uploaded images for submission
      uploaded_images = array.map((i) => ({
        url: i.secure_url,
        public_id: i.public_id,
      }));

      // Handle color image upload if applicable
      if (values.color.image) {
        const colorFormData = new FormData();
        colorFormData.append("file", values.color.image);
        colorFormData.append("upload_preset", "website");

        try {
          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/dtxh3ew7s/image/upload`,
            {
              method: "POST",
              body: colorFormData,
            }
          );
          const uploadedImageData = await uploadResponse.json();
          style_img = uploadedImageData.secure_url;
        } catch (error) {
          console.error("Error uploading color image:", error);
          setLoading(false);
          return;
        }
      }

      // Prepare the product details for submission
      const productDetails = {
        parent: values.parent,
        sku: values.sku,
        color: {
          image: style_img,
          color: values.color.color,
        },
        images: uploaded_images,
        sizes: values.sizes,
        discount: values.discount,
        name: values.name,
        description: values.description,
        brand: values.brand,
        details: values.details,
        questions: values.questions,
        category: values.category,
        subCategories: values.subCategories,
        benefits: values.benefits,
        ingredients: values.ingredients,
        longDescription: values.longDescription,
      };

      try {
        await createProduct(
          vendor._id,
          productDetails.sku,
          productDetails.color,
          productDetails.images,
          productDetails.sizes,
          productDetails.discount,
          productDetails.name,
          productDetails.description,
          productDetails.longDescription,

          productDetails.brand,
          productDetails.details,
          productDetails.questions,
          productDetails.category,
          productDetails.subCategories,
          productDetails.benefits,
          productDetails.ingredients,
          productDetails.parent
        ).then((res) => {
          if (res.success) {
            setLoading(false);

            alert(res.message || "Product created Successfully");
          } else {
            setLoading(false);

            alert(res.message || "An error occurred.");
          }
        });
      } catch (error) {
        console.error("Error while creating the product:", error);
        setLoading(false);
        alert(error);
      }
    };
    await createProductHandler();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getParentsandCategories()
          .then((res) => {
            if (res?.success) {
              setParents(res?.parents || []);
              setCategories(res?.categories || []);
            }
          })
          .catch((err) => alert(err));
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const getSubs = async () => {
      try {
        await getSubCategoriesByCategoryParent(
          form.values.category.length > 1
            ? form.values.category
            : form.values.category[0]
        )
          .then((res) => {
            if (res?.success) {
              setSubs(res?.results);
            }
          })
          .catch((err) => alert(err));
      } catch (error) {
        alert(error);
      }
    };

    if (form.values.category !== "") {
      getSubs();
    }
  }, [form.values.category]);

  // Functions to handle dynamic addition of fields
  const addSize = () =>
    form.insertListItem("sizes", { size: "", qty: "", price: "" });
  const addBenefit = () => form.insertListItem("benefits", { name: "" });
  const addDetail = () =>
    form.insertListItem("details", { name: "", value: "" });

  useEffect(() => {
    const fetchParentData = async () => {
      if (form.values.parent) {
        try {
          const data = await getSingleProductById(form.values.parent, 0, 0);
          form.setValues({
            ...form.values,
            name: data.name,
            description: data.description,
            brand: data.brand,
            category: data.category,
            subCategories: data.subCategories,
            questions: data.questions,
            details: data.details,
            benefits: data.benefits,
            ingredients: data.ingredients,
          });
        } catch (error) {
          console.error("Error fetching parent data:", error);
        }
      }
    };

    fetchParentData();
  }, [form.values.parent]);
  return (
    <div>
      <div className="titleStyle">Create a Product</div>
      <Box pos="relative">
        {loading && (
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        )}

        <form
          onSubmit={form.onSubmit((values: any) => {
            handleSubmit(values);
          })}
          className="w-[80%]"
        >
          <TextInput
            {...form.getInputProps("name")}
            mt="md"
            label="Name"
            placeholder="Name"
            required
          />
          <Textarea
            {...form.getInputProps("description")}
            placeholder="Description"
            label="Description"
            required
          />
          <TextInput
            {...form.getInputProps("brand")}
            placeholder="Brand"
            label="Brand"
          />
          <TextInput
            {...form.getInputProps("sku")}
            placeholder="SKU"
            label="SKU"
            required
          />

          <NumberInput
            {...form.getInputProps("discount")}
            label="Discount"
            placeholder="Discount"
            mt="md"
            required
          />

          <ColorInput
            {...form.getInputProps("color.color")}
            label="Select Color"
            description="Pick a color for the product"
            placeholder="Choose color"
            required
            error={form.errors.color}
          />

          <FileInput
            label="Pick a Product Color image"
            placeholder="Choose file"
            accept="image/*"
            onChange={(file) => handleColorImageChange(file as File)}
            required
            error={form.errors.color}
          />

          {parents.length > 0 && (
            <Select
              {...form.getInputProps("parent")}
              label="Parent"
              placeholder="Select a parent"
              data={parents.map((parent) => ({
                value: parent._id,
                label: parent.name,
              }))}
            />
          )}

          {categories.length > 0 && (
            <Select
              {...form.getInputProps("category")}
              label="Category"
              placeholder="Select a category"
              data={categories.map((category) => ({
                value: category._id,
                label: category.name,
              }))}
              required
              error={form.errors.category}
            />
          )}
          <MultiSelect
            {...form.getInputProps("subCategories")}
            label="Sub Categories"
            placeholder="Pick one of the category to select Sub Categories "
            data={subs.map((sub: any) => ({
              value: sub._id,
              label: sub.name,
            }))}
            required
          />
          <div>
            <Text size="md" mb="xs">
              Sizes
            </Text>
            {form.values.sizes.map((item, index) => (
              <Group key={index} mt="xs">
                <TextInput
                  placeholder="Size"
                  {...form.getInputProps(`sizes.${index}.size`)}
                  required
                />
                <NumberInput
                  placeholder="Quantity"
                  {...form.getInputProps(`sizes.${index}.qty`)}
                  required
                />
                <NumberInput
                  placeholder="Price"
                  {...form.getInputProps(`sizes.${index}.price`)}
                  required
                />
                <Button variant="outline" onClick={addSize}>
                  <IoAdd size={20} color="blue" />
                </Button>
                <Button
                  color="red"
                  variant="outline"
                  onClick={() => form.removeListItem("sizes", index)}
                >
                  <MdDelete color="red" size={20} />
                </Button>
              </Group>
            ))}
          </div>

          {/* Repeat similar blocks for Benefits, Ingredients, Questions, and Details */}
          {/* Benefits Section */}
          <div>
            <Text size="md" mb="xs">
              Benefits
            </Text>
            {form.values.benefits.map((item, index) => (
              <Group key={index} mt="xs">
                <TextInput
                  placeholder="Benefit"
                  {...form.getInputProps(`benefits.${index}.name`)}
                  required
                />
                <Button variant="outline" onClick={addBenefit}>
                  <IoAdd size={20} color="blue" />
                </Button>
                <Button
                  color="red"
                  variant="outline"
                  onClick={() => form.removeListItem("benefits", index)}
                >
                  <MdDelete color="red" size={20} />
                </Button>
              </Group>
            ))}
          </div>

          {/* Similarly add Ingredients, Questions, and Details sections */}
          <div>
            <Text size="md" mb="xs">
              Details
            </Text>
            {form.values.details.map((item, index) => (
              <Group key={index} mt="xs">
                <TextInput
                  placeholder="Name"
                  {...form.getInputProps(`details.${index}.name`)}
                  required
                />
                <TextInput
                  placeholder="Value"
                  {...form.getInputProps(`details.${index}.value`)}
                  required
                />
                <Button variant="outline" onClick={addDetail}>
                  <IoAdd size={20} color="blue" />
                </Button>
                <Button
                  color="red"
                  variant="outline"
                  onClick={() => form.removeListItem("details", index)}
                >
                  <MdDelete color="red" size={20} />
                </Button>
              </Group>
            ))}
          </div>

          <div className="mb-[30px]">
            <Text size="md" mb="xs">
              Long Description
            </Text>
            <JoditEditor
              ref={editor}
              value={form.values.longDescription}
              onBlur={(newContent) =>
                form.setFieldValue("longDescription", newContent)
              }
            />
          </div>

          <FileInput
            label="Upload images"
            placeholder="Choose files"
            multiple
            accept="image/*"
            onChange={(files) => handleImageChange(files as File[])}
            required
            error={form.errors.imageFiles}
          />

          <SimpleGrid cols={4} spacing="md" mt="md">
            {images.map((image, index) => (
              <Box key={index}>
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  width="100%"
                  height="auto"
                  fit="cover"
                />
              </Box>
            ))}
          </SimpleGrid>

          <Button type="submit" mt="md">
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default CreateProductPage;
