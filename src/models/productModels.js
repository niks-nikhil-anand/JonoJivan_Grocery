import mongoose from "mongoose";
import Category from "./categoryModels";
import SubCategory from "./subCategoryModels";
import SubSubCategory from "./sub_subCategoryModels";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    stock: {
        type: Number,
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
    weight: {
        value: {
            type: Number,
            required: [true, 'Weight value is required'],
            min: [0, 'Weight cannot be negative'],
        },
        unit: {
            type: String,
            required: [true, 'Weight unit is required'],
            enum: {
                values: ['ML', 'Gm', 'kg' , 'Pieces'],
                message: 'Weight unit must be either ML, Gm, or kg',
            },
        },
    },
    description: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Product description is required'],
    },
    salePrice: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
    },
    featuredImage: {
        type: String,
        required: [true, 'Featured image URL is required'],
    },
    images: [{
        type: String
    }],
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot be more than 5'],
        },
        numberOfRatings: {
            type: Number,
            default: 0,
        }
    },
    isFeaturedSale: {
        type: Boolean,
        default: false,
    },
    isOnSale: {
        type: Boolean,
        default: false,
    },
    isClearance:{
        type: Boolean,
        default: false,
    },
    isHotDeal:{
        type: Boolean,
        default: false,
    },
    tags: [{
        type: String,
    }],
    users: [{
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Out of stock' , 'inReview'],
        default: 'inReview',  
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'SubCategory', 
    },
    subSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'SubSubCategory',
    },
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
