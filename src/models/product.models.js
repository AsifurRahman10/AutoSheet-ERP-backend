const { Schema, mongoose } = require("mongoose");

const ProductSchema = new Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    // store_id: { type: Schema.Types.ObjectId, ref: "Store", required: true },
}, { timestamps: true });

export const Product = mongoose.model("Product", ProductSchema);