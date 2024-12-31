import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, 'Discount type is required'],
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount cannot be negative'],
    },
    description: {
        type: String,
        trim: true,
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    minimumOrderValue: {
        type: Number,
        min: [0, 'Minimum order value cannot be negative'],
    },
    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
    applicableSubCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',  // Assuming 'SubCategory' is a model separate from 'Category'
    }],
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    appliedByUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true
});

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
