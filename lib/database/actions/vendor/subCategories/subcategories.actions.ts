"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Category from "@/lib/database/models/category.model";
import SubCategory from "@/lib/database/models/subCategory.model";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import slugify from "slugify";
// config our Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const base64ToBuffer = (base: any) => {
  const base64String = base.split(";base64,").pop();
  return Buffer.from(base64String, "base64");
};

// get all sub categories and categories for vendor
export const getAllSubCategoriesandCategories = async () => {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ updatedAt: -1 }).lean();
    const subCategories = await SubCategory.find()
      .populate({
        path: "parent",
        model: Category,
      })
      .sort({ updatedAt: -1 })
      .lean();
    return {
      success: true,
      categories: JSON.parse(JSON.stringify(categories)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
    };
  } catch (error: any) {
    console.log(error);
  }
};

// get single sub category for vendor
export const getSingleSubCategory = async (category?: string) => {
  try {
    if (!category) {
      return {
        message: "No Category provided!",
        subCategories: [],
        success: false,
      };
    }
    await connectToDatabase();
    const results = await SubCategory.find({ parent: category }).select("name");
    return results;
  } catch (error: any) {
    console.log(error);
  }
};

// create sub category for vendor
export const createSubCategory = async (
  name: string,
  parent: string,
  images: any[]
) => {
  try {
    await connectToDatabase();
    const test = await SubCategory.findOne({ name });
    if (test) {
      return {
        success: false,
        message: "Sub Category already exists, try a different name.",
      };
    }
    const uploadImagesToCloudinary = images.map(async (base64Image: any) => {
      const buffer = base64ToBuffer(base64Image);
      const formData = new FormData();
      formData.append("file", new Blob([buffer], { type: "image/jpeg" }));
      formData.append("upload_preset", "website");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      return response.json();
    });
    const cloudinaryImages = await Promise.all(uploadImagesToCloudinary);
    const imageUrls = cloudinaryImages.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));
    await new SubCategory({
      name,
      parent,
      slug: slugify(name),
      images: imageUrls,
    }).save();
    const subCategories = await SubCategory.find().sort({ updatedAt: -1 });
    return {
      success: true,
      message: `Sub Category ${name} has been successfully created.`,
      subCategories: JSON.parse(JSON.stringify(subCategories)),
    };
  } catch (error: any) {
    console.log(error);
  }
};

// delete sub Category for vendor
export const deleteSubCategory = async (id: string) => {
  try {
    await connectToDatabase();
    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) {
      return {
        success: false,
        message: "Sub Category not found with this Id!",
      };
    }
    const imagePublicIds = subCategory.images.map(
      (image: any) => image.public_id
    );
    const deleteImagePromises = imagePublicIds.map((publicId: string) =>
      cloudinary.v2.uploader.destroy(publicId)
    );
    await Promise.all(deleteImagePromises);
    const subCategories = await SubCategory.find().sort({ updatedAt: -1 });

    return {
      success: true,
      message: "Sub Category was successfully deleted.",
      subCategories: JSON.parse(JSON.stringify(subCategories)),
    };
  } catch (error: any) {
    console.log(error);
  }
};

// update subCategory for vendor
export const updateSubCategory = async (
  id: string,
  name: string,
  parent: string | null
) => {
  try {
    await connectToDatabase();
    const updatedParent: mongoose.Types.ObjectId | null =
      parent && mongoose.Types.ObjectId.isValid(parent)
        ? new mongoose.Types.ObjectId(parent)
        : null;
    await SubCategory.findByIdAndUpdate(id, { name, parent: updatedParent });
    const subCategories = await SubCategory.find().sort({ updatedAt: -1 });

    return {
      success: true,
      message: "Sub Category successfully updated.",
      subCategories: JSON.parse(JSON.stringify(subCategories)),
    };
  } catch (error: any) {
    console.log(error);
  }
};

// get sub categories by category parent for vendor
export const getSubCategoriesByCategoryParent = async (category: string) => {
  try {
    if (!category) {
      return {
        message: "No Category was provided.",
        subCategories: [],
        success: false,
      };
    }
    await connectToDatabase();

    const results = await SubCategory.find({ parent: category }).select("name");
    return {
      results: JSON.parse(JSON.stringify(results)),
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};
