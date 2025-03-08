import { Schema, model } from "mongoose";

const flashSaleSchema = new Schema(
  {
    startTime: { type: Date, required: true, default: new Date() },
    endTime: { type: Date, required: false },
    originalStock: { type: Number, required: true, default: 200 },
    currentStock: { type: Number, required: true, default: 200 },
    status: { 
        type: String, 
        enum: ["pending", "active", "completed"],
        default: "pending"
    },
    version: { type: Number, default: 0 } // For optimistic concurrency
  },
  { collection: "flashsales" }
);

flashSaleSchema.index({ status: 1, startTime: 1 });

const FlashSale = model("FlashSale", flashSaleSchema);

export default FlashSale;
