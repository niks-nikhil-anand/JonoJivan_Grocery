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
     subSubcategory: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubSubCategory',
          },
        ],
  },
  {
    timestamps: true,
  }
);

// Export the models with default export
export default mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);

