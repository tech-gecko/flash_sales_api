const routeNotFound = (_, res) => {
  return res
    .status(404)
    .json({ error: "The route you are looking for does not exist" });
  };

export default routeNotFound;
