import { expect } from "chai";
import sinon from "sinon";
import getLeaderboard from "../src/controllers/leaderboardController.js";
import Purchase from "../src/models/Purchase.js";

describe.skip("Leaderboard Controller", () => {
  let purchaseFindStub;

  beforeEach(() => {
    purchaseFindStub = sinon.stub(Purchase, "find");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return leaderboard with default limit", async () => {
    const req = { query: {} }; // No query params
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();
    const mockPurchases = [
      { _id: "1", userId: "123", saleId: "456", quantity: 1, timestamp: new Date() },
      { _id: "2", userId: "456", saleId: "789", quantity: 2, timestamp: new Date() }
    ];

    const queryChain = {
        sort: sinon.stub().returnsThis(),
        populate: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        skip: sinon.stub().returnsThis(),
        exec: sinon.stub().resolves(mockPurchases)
    };
    purchaseFindStub.returns(queryChain);

    await getLeaderboard(req, res, next);

    // Assertions
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({
      success: true,
      message: "Purchase leaderboard generated successfully",
      data: { purchases: mockPurchases }
    })).to.be.true;
    expect(purchaseFindStub.calledOnce).to.be.true;
    expect(purchaseFindStub.returnValues[0].limit.calledWith(50)).to.be.true; // Default limit
    expect(purchaseFindStub.returnValues[0].skip.calledWith(0)).to.be.true; // Default page
  });

  it("should paginate correctly with custom limit and page", async () => {
    const req = { query: { limit: "10", page: "2" } }; // Custom limit and page
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();
    const mockPurchases = [
      { _id: "3", userId: "789", quantity: 3, timestamp: new Date() }
    ];

    const queryChain = {
      sort: sinon.stub().returnsThis(),
      populate: sinon.stub().returnsThis(),
      limit: sinon.stub().returnsThis(),
      skip: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(mockPurchases)
    };
    purchaseFindStub.returns(queryChain);

    await getLeaderboard(req, res, next);

    // Assertions
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({
      success: true,
      message: "Purchase leaderboard generated successfully",
      data: { purchases: mockPurchases }
    })).to.be.true;
    expect(queryChain.limit.calledWith(10)).to.be.true; // Custom limit
    expect(queryChain.skip.calledWith(10)).to.be.true; // Page 2: (2 - 1) * 10 = 10
  });

  it("should return 404 if no purchases exist", async () => {
    const req = { query: {} }; // No query params
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();
    const mockPurchases = [];

    purchaseFindStub.returns({
      sort: sinon.stub().returnsThis(),
      populate: sinon.stub().returnsThis(),
      limit: sinon.stub().returnsThis(),
      skip: sinon.stub().resolves(mockPurchases)
    });

    await getLeaderboard(req, res, next);

    // Assertions
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ error: "No purchases found" })).to.be.true;
  });
});
