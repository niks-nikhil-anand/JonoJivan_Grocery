import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    vendorId: {
        type: String,
    },
    adhaarCard: {
        type: String,
    },
    panCard: {
        type: String,
    },
    bankPassbook: {
        type: String,
    },
    msmsCertificate: {
        type: String,
    },
    gstCertificate: {
        type: String,
    },
    tradeLicence: {
        type: String,
    },
    shopPhoto: {
        type: String,
    },
    dob: {
        type: Date,
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
        lowercase: true,
        trim: true,
    },
    mobileNumber: {
        type: String,
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    profilePic: {
        type: String,
        default: '',
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    }],
    status: {
        type: String,
        enum: ['Blocked', 'Pending', 'inReview', 'Active'],
        default: 'Pending',
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
    gender: {
        type: String,
    },
    numberOfEmployees: {
        type: Number,
        min: [1, 'There must be at least 1 employee'],
    },
    businessName: {
        type: String,
    }
}, {
    timestamps: true
});

export default mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
