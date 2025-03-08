export function authenticate(req, res, next) {
  const userId = req.headers["user-id"];
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  req.user = { id: userId };
  next();
}
