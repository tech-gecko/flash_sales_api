import { expect } from "chai";
import sinon from "sinon";
import { getActiveSale, createPurchase } from "../src/controllers/salesController.js";
import FlashSale from "../src/models/FlashSale.js";
import Purchase from "../src/models/Purchase.js";

describe("Sales Controller", () => {
  let flashSaleFindOneStub, flashSaleFindOneAndUpdateStub, purchaseSaveStub;

  beforeEach(() => {
    flashSaleFindOneStub = sinon.stub(FlashSale, "findOne");
    flashSaleFindOneAndUpdateStub = sinon.stub(FlashSale, "findOneAndUpdate");
    purchaseSaveStub = sinon.stub(Purchase.prototype, "save");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getActiveSale", () => {
    it("should return active sale details", async () => {
      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();
      const mockSale = { 
        _id: "1", 
        startTime: new Date(), 
        endTime: new Date(), 
        currentStock: 100 
      };
      flashSaleFindOneStub.resolves(mockSale);

      await getActiveSale(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ 
        success: true, 
        message: "Active sale returned successfully",
        data: {
          saleId: mockSale._id,
          startTime: mockSale.startTime,
          endTime: mockSale.endTime,
          currentStock: mockSale.currentStock
        }
      })).to.be.true;
    });

    it("should return 404 if no active sale exists", async () => {
      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();
      flashSaleFindOneStub.resolves(null);

      await getActiveSale(req, res, next);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: "No active sale found" })).to.be.true;
    });
  });

  describe("createPurchase", () => {
    it.skip("should create a purchase and update stock", async () => {
      const req = { body: { saleId: "1", quantity: 1 }, user: { id: "123" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();
      const io = { emit: sinon.stub() };
      const mockSale = { 
        _id: "1", 
        currentStock: 100, 
        status: "active",
        startTime: new Date(), 
        endTime: new Date(), 
        originalStock: 200 
      };
      flashSaleFindOneAndUpdateStub.resolves(mockSale);
      purchaseSaveStub.resolves();
      
      await createPurchase(req, res, io, next);
      
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ 
        success: true,
        message: "Purchase successful",
        data: {
          purchaseId: sinon.match.string,
          quantity: 1,
          remainingStock: 100,
          timestamp: sinon.match.date
        }
      })).to.be.true;
      expect(io.emit.calledWith("stock-update", { saleId: "1", stock: 100 })).to.be.true;
    });

    it.skip("should reject if sale is not active", async () => {
      const req = { 
        body: { saleId: "1", quantity: 1 }, 
        user: { id: "123" } 
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const io = { emit: sinon.stub() };
      const next = sinon.stub();
      const mockSale = { _id: "1", status: "pending" }; // Sale not active
      flashSaleFindOneAndUpdateStub.resolves(null);
      flashSaleFindOneStub.resolves(mockSale);

      await createPurchase(req, res, io, next);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Sale is not active" })).to.be.true;
    });

    it.skip("should reject if stock is insufficient", async () => {
      const req = { 
        body: { saleId: "1", quantity: 10 }, 
        user: { id: "123" } 
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();
      const io = { emit: sinon.stub() };
      const mockSale = { _id: "1", status: "active", currentStock: 5 }; // Insufficient stock
      flashSaleFindOneAndUpdateStub.resolves(null);
      flashSaleFindOneStub.resolves(mockSale);

      await createPurchase(req, res, next, io);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Insufficient stock" })).to.be.true;
    });

    it("should reject if sale ID is invalid", async () => {
      const req = { 
        body: { saleId: "invalid", quantity: 1 }, 
        user: { id: "123" } 
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const io = { emit: sinon.stub() };
      flashSaleFindOneAndUpdateStub.resolves(null);
      flashSaleFindOneStub.resolves(null);

      await createPurchase(req, res, io);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Sale not found" })).to.be.true;
    });
  });
});
