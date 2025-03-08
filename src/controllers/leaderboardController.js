import Purchase from "../models/Purchase.js";

const getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const purchases = await Purchase.find()
      .sort({ timestamp: 1 })
      .populate("userId", "name")
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    if (!purchases) return res.status(404).json({ error: "No purchases found" });

    return res.status(200).json({
      success: true,
      message: "Purchase leaderboard generated successfully",
      count: `${purchases.length} (${limit * (page - 1) + 1}-${limit * page})`,
      data: { purchases }
    });
  } catch (err) {
    next(err);
  }
};

export default getLeaderboard;
