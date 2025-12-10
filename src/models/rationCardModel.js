import mongoose from "mongoose";

const rationCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    fatherName: {
        type: String,
        required: [true, "Father's Name is required"]
    },
    profilePicture:{
        type: String,
        
    },
    uniqueNumber: {
        type: String,
        required: [true, 'Unique Number is required'],
        unique: true
    },
    whatsappNo: {
        type: String,
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
        lowercase: true,
        trim: true,
    },
    aadhaarCardNumber: {
        type: String,
    },
    panCardNumber: {
        type: String,
    },
    dob: {
        type: Date,
    },
    bankDetails: {
        accountNumber: { type: String },
        ifscCode: { type: String },
        bankName: { type: String }
    },
    address: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: String,
    },
    dateOfIssue: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

if (mongoose.models.RationCard) {
    delete mongoose.models.RationCard;
}

export default mongoose.model('RationCard', rationCardSchema);
