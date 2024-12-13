"use client";

import { useState } from "react";

import {
  Button,
  FileInput,
  TextInput,
  Image,
  SimpleGrid,
  Box,
  LoadingOverlay,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const fletobase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
import { createSubCategory } from "@/lib/database/actions/vendor/subCategories/subcategories.actions";

const CreateSubCategory = ({
  setSubCategories,
  categories,
}: {
  setSubCategories?: any;
  categories?: any;
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      name: "",
      parent: "",
    },
    validate: {
      name: (value) =>
        value.length < 3 || value.length > 30
          ? "Category name must be between 3 to 30 characters."
          : null,
    },
  });
  const handleImageChange = async (files: File[]) => {
    const base64Images = await Promise.all(files.map(fletobase64));
    setImages(base64Images);
  };
  const submitHandler = async (values: typeof form.values) => {
    try {
      setLoading(true);
      await createSubCategory(values.name, values.parent, images).then(
        (res) => {
          if (res?.success) {
            setSubCategories(res?.subCategories);
            form.reset();
            setImages([]);
            alert(res?.message);
            setLoading(false);
          } else {
            setLoading(false);
            alert(res?.message);
          }
        }
      );
    } catch (error: any) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="titleStyle">Create a Sub Category</div>
      <Box pos={"relative"}>
        {loading && (
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        )}
        <form onSubmit={form.onSubmit(submitHandler)}>
          <TextInput
            label="Name"
            placeholder="SubCategory name"
            {...form.getInputProps("name")}
            required
          />
          <FileInput
            label="Upload Images for Category"
            placeholder="Choose files"
            multiple
            accept="image/*"
            onChange={(files) => handleImageChange(files)}
            required
          />
          <Select
            label="Parent"
            placeholder="Select parent"
            data={categories?.map((category: any) => ({
              value: category._id,
              label: category.name,
            }))}
            {...form.getInputProps("parent")}
            required
          />
          <SimpleGrid cols={4} spacing={"md"} mt={"md"}>
            {images.map((image, index) => (
              <Box key={index}>
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  width={"100%"}
                  height={"auto"}
                  fit="cover"
                />
              </Box>
            ))}
          </SimpleGrid>
          <div className="mt-[1rem]">
            <Button type="submit" className="text-white">
              Add Sub Category
            </Button>
          </div>
        </form>
      </Box>
    </div>
  );
};

export default CreateSubCategory;
