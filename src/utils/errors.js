class SaleNotActiveError extends Error {
  constructor() {
    super("Sale is not active");
    this.name = "SaleNotActiveError";
    this.statusCode = 400;
  }
}
  
class InsufficientStockError extends Error {
  constructor() {
    super("Item out of stock");
    this.name = "InsufficientStockError";
    this.statusCode = 400;
  }
}

export { SaleNotActiveError, InsufficientStockError };
