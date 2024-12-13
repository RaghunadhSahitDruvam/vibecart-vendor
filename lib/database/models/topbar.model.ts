import mongoose from "mongoose";
const topBarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  button: {
    title: String,
    color: String,
    link: String,
  },
  color: String,
});
const TopBar = mongoose.models.TopBar || mongoose.model("TopBar", topBarSchema);
export default TopBar;
