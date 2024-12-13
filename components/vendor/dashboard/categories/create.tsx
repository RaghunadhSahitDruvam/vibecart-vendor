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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createCategory } from "@/lib/database/actions/vendor/category/category.actions";

const fletobase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CreateCategory = ({ setCategories }: { setCategories?: any }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      name: "",
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
      await createCategory(values.name, images).then((res) => {
        if (res?.success) {
          setCategories(res?.categories);
          form.reset();
          setImages([]);
          alert(res?.message);
          setLoading(false);
        } else {
          setLoading(false);
          alert(res?.message);
        }
      });
    } catch (error: any) {
      alert(error);
    }
  };
  return (
    <div>
      <div className="titleStyle">Create a Category</div>
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
            placeholder="Category name"
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
              Add Category
            </Button>
          </div>
        </form>
      </Box>
    </div>
  );
};

export default CreateCategory;
