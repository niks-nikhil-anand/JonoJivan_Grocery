import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    mobileNumber: {
        type: String,
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isVerifiedExpires:{
        type: Date,
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    profilePic: {
        type: String,
        default: ''
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    }],
    role: {
        type: String,
        enum: ['User', 'SuperAdmin' , 'Vendor'],
        default: 'User'
    },
    status: {
        type: String,
        enum: ['Blocked', 'Pending', 'inReview', 'Active'],
        default: 'Active'
    },
    isToken: {
        type: String,
        default: ''
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist',
    }],
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor', 
    }
}, {
    timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);
