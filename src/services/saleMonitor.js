import FlashSale from "../models/FlashSale.js";
import mongoose from "mongoose";

const { connection } = mongoose;

async function initializeSaleSystem() {
  const activeSale = await FlashSale.findOne({ status: "active" });

  if (!activeSale) {
    await FlashSale.create({
      startTime: new Date(),
      status: "active",
      originalStock: 200,
      currentStock: 200
    });
  }

  // Set up change stream listener
  const flashSaleCollection = connection.collection("flashsales");
  const changeStream = flashSaleCollection.watch([{
    $match: {
      "updateDescription.updatedFields.currentStock": { $eq: 0 },
      "operationType": "update"
    }
  }]);

  changeStream.on("change", async (change) => {
    try {
      // Mark depleted sale as completed
      await FlashSale.updateOne(
        { _id: change.documentKey._id },
        { $set: { status: "completed", endTime: new Date() } }
      );

      // Create new sale with fresh stock
      await FlashSale.create({
        startTime: new Date(),
        status: 'active',
        originalStock: 200,
        currentStock: 200
      });

      console.log("New sale automatically started");
    } catch (err) {
      console.error("Sale transition error:", err);
    }
  });
}

export default initializeSaleSystem;
