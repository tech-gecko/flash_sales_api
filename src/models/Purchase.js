import { Schema, model } from "mongoose";

const purchaseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  saleId: { type: Schema.Types.ObjectId, ref: "FlashSale", required: true },
  timestamp: { type: Date, required: true, default: new Date() },
  quantity: { type: Number, required: true, default: 1, min: 1 }
});

purchaseSchema.index({ timestamp: 1 }); // For leaderboard

const Purchase = model("Purchase", purchaseSchema);

export default Purchase;
