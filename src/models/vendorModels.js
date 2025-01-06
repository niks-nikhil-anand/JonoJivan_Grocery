import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    vendorId: {
        type: String,
        required: [true, 'Vendor Id is required']
    },
    addharCard: {
        type: String,
        required: [true, 'Aadhaar Card is required']
    },
    bankPassbook: {
        type: String,
        required: [true, 'Bank Passbook is required']
    },
    msmsCertificate: {
        type: String,
        required: [true, 'MSMS Certificate is required']
    },
    gstCertificate: {
        type: String,
        required: [true, 'GST Certificate is required']
    },
    tradeLicence: {
        type: String,
        required: [true, 'Trade Licence is required']
    },
    shopPhoto: {
        type: String,
        required: [true, 'Shop Photo is required']
    },
    dob: {
        type: Date,
        required: [true, 'Date of Birth is required']
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
    profilePic: {
        type: String,
        default: ''
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    }],
    status: {
        type: String,
        enum: ['Blocked', 'Pending', 'inReview', 'Active'],
        default: 'Active'
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Gender is required']
    },
    numberOfEmployees: {
        type: Number,
        required: [true, 'Number of employees is required'],
        min: [1, 'There must be at least 1 employee']
    },
    businessName: {
        type: String,
        required: [true, 'Business name is required']
    }
}, {
    timestamps: true
});

export default mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
