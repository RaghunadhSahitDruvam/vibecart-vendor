import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
  images: [
    {
      url: String,
      public_url: String,
    },
  ],
  vendor: {
    type: Object,
  },
  parent: {
    type: ObjectId,
    ref: "Category",
    required: true,
  },
});
const SubCategory =
  mongoose.models.SubCategory ||
  mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
