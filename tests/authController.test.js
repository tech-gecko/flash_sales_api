import { expect } from "chai";
import sinon from "sinon";
import { registerUser, loginUser } from "../src/controllers/authController.js";
import User from "../src/models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

describe("Auth Controller", () => {
  let userSaveStub, userFindOneStub, hashStub, compareStub;

  beforeEach(() => {
    userSaveStub = sinon.stub(User.prototype, "save");
    userFindOneStub = sinon.stub(User, "findOne");
    hashStub = sinon.stub(bcrypt, "hash");
    compareStub = sinon.stub(bcrypt, "compare");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("registerUser", () => {
    it("should register a new user with valid data", async () => {
      const req = { body: { name: "John Doe", email: "john@example.com", password: "password123" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      hashStub.resolves("hashedPassword");
      userSaveStub.resolves();

      await registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ success: true, message: "Registration successful! Proceed to log in" })).to.be.true;
    });

    it("should reject duplicate email", async () => {
      const req = { body: { name: "John Doe", email: "john@example.com", password: "password123" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();
      userSaveStub.rejects({ code: 11000 }); // Simulate duplicate key error

      await registerUser(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Email already exists" })).to.be.true;
    });

    it("should reject invalid email format", async () => {
      const req = { body: { name: "John Doe", email: "invalid-email", password: "password123" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();
      userSaveStub.rejects(new Error("Validation failed: email")); // Mock validation error

      await registerUser(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0].message).to.match(/Validation failed/i);
    });

    it.skip("should reject missing required fields", async () => {
      const req = { body: { name: "John Doe" } }; // Missing email and password
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();
      
      // Mock express-validator errors
      const validationErrors = [
        { param: "email", msg: "Email is required" },
        { param: "password", msg: "Password is required" }
      ];
      sinon.stub(validationResult, "isEmpty").returns(false);
      sinon.stub(validationResult, "array").returns(validationErrors);

      await registerUser(req, res, next);
      
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ 
        errors: [
          { param: "email", msg: "Email is required" },
          { param: "password", msg: "Password is required" }
        ]
      })).to.be.true;
    });
  });

  describe("loginUser", () => {
    it.skip("should log in with valid credentials", async () => {
      const req = { body: { email: "john@example.com", password: "password123" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();
      const user = { 
        _id: "123", 
        name: "John Doe",
        email: "john@example.com", 
        password: "hashedPassword" 
      };
      userFindOneStub.resolves(user);
      compareStub.resolves(true);
      
      await loginUser(req, res, next);
      
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ 
        success: true,
        message: "Logged in successfully",
        data: { userId: "123" }
      })).to.be.true;
    });

    it("should reject invalid email", async () => {
      const req = { body: { email: "invalid@example.com", password: "password123" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      userFindOneStub.resolves(null);

      await loginUser(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: "User not found" })).to.be.true;
    });

    it("should reject incorrect password", async () => {
      const req = { body: { email: "john@example.com", password: "wrongpassword" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const user = { _id: "123", email: "john@example.com", password: "hashedPassword" };
      userFindOneStub.resolves(user);
      compareStub.resolves(false);

      await loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Invalid credentials" })).to.be.true;
    });

    it("should reject missing credentials", async () => {
      const req = { body: {} }; // Missing email and password
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();
      userFindOneStub.rejects(new Error("Validation failed: email, password"));

      await loginUser(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0].message).to.match(/validation failed/i);
    });
  });
});
