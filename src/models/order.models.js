import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema({
    submissionId: { type: Schema.Types.ObjectId, ref: "Submission", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    totalAmount: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Order = mongoose.model("Order", OrderSchema);