import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    vendor: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
