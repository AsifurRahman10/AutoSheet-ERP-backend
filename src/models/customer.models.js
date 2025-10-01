const { Schema, mongoose } = require("mongoose");

const CustomerSchema = new Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
}, { timestamps: true });


export const Customer = mongoose.model("Customer", CustomerSchema);