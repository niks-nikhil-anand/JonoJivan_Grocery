const mongoose = require('mongoose');
const { Schema } = mongoose;


// Define the schema for Category
const subCategorySchema = new Schema(
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
export default mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);

