import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    invoiceNo:{
        type: String,
        required: [true, 'Invoice number is required'],
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: [true, 'Shipping address is required'],
    },
    paymentMethod: {
        type: String,
        enum: ['Cash on Delivery' , 'Online'],
        required: [true, 'Payment method is required'],
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'UnPaid'],
        default: 'UnPaid',
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'OrderPlaced', 'Processing', 'PickedUp', 'OutForDelivery' , 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    deliveryDate: {
        type: Date,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    razorpay_order_id: {
        type: String, // Changed from Boolean to String
    },
    razorpay_payment_id: {
        type: String, // Changed from Boolean to String
    },
}, {
    timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
