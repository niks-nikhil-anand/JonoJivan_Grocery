import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'], 
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'], 
    },
    address: { 
        type: String,
        required: [true, 'Address is required'],
    },
    apartment:{
        type: String,
        required: [true, 'apartment is required'],
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
        lowercase: true,
        trim: true,
    },
    mobileNumber:{
        type: String
    },
    state: {
        type: String,
        required: [true, 'State is required'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
    },
     
    landmark: {
        type: String,
    },
    typeOfAddress: {
        type: String,
        enum: ['Home', 'Work'],
        default: 'Home',
    },
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    pinCode: {
        type: Number,
        required: [true, 'Pincode is required'],
    },
}, {
    timestamps: true
});

export default mongoose.models.Address || mongoose.model('Address', addressSchema);
