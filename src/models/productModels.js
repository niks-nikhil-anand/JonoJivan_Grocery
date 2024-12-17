import mongoose from "mongoose";
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
                values: ['ML', 'Gm', 'kg'],
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category.subcategories', 
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
    isFanFavourites: {
        type: Boolean,
        default: false,
    },
    isOnSale: {
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
        enum: ['active', 'inactive', 'out of stock'],
        default: 'inactive',  
    }
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
