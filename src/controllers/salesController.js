import FlashSale from "../models/FlashSale.js";
import Purchase from "../models/Purchase.js";
import { SaleNotActiveError, InsufficientStockError } from "../utils/errors.js";

export const getActiveSale = async (req, res, next) => {
  try {
    const activeSale = await FlashSale.findOne({ status: "active" });
    if (!activeSale) {
      return res.status(404).json({ error: "No active sale found" });
    }

    return res.status(200).json({
      success: true,
      message: "Active sale returned successfully",
      data: {
        saleId: activeSale._id,
        startTime: activeSale.startTime,
        endTime: activeSale.endTime,
        currentStock: activeSale.currentStock
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createPurchase = async (req, res, next, io) => {
  const { saleId, quantity } = req.body;

  try {
    const sale = await FlashSale.findOneAndUpdate(
      { 
        _id: saleId,
        status: "active",
        currentStock: { $gte: quantity }
      },
      { $inc: { currentStock: -quantity } },
      { new: true }
    );

    if (!sale) {
      const activeSale = await FlashSale.findOne({ _id: saleId });
      if (!activeSale) return res.status(404).json({ error: "Sale not found" });
      if (activeSale.status !== "active") throw new SaleNotActiveError();
      if (activeSale.currentStock < quantity) throw new InsufficientStockError();
    }

    const purchase = new Purchase({
      userId: JSON.parse(req.user.id),
      saleId: sale._id,
      quantity: quantity
    });

    await purchase.save();

    // Emit real-time stock update
    io.emit("stock-update", { 
      saleId: sale._id, 
      stock: sale.currentStock 
    });

    return res.status(201).json({
      success: true,
      message: "Purchase successful",
      data: {
        purchaseId: purchase._id,
        quantity: purchase.quantity,
        remainingStock: sale.currentStock,
        timestamp: purchase.timestamp
      }
    });
  } catch (err) {
    next(err);
  }
};
