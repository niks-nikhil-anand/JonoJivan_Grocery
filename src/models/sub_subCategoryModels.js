const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for SubSubCategory
const subSubCategorySchema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Export the models with default export
export default mongoose.models.SubSubCategory || mongoose.model('SubSubCategory', subSubCategorySchema);
