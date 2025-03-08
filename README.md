# **Flash Sale System**

A high-performance, real-time flash sale system built with **Node.js**, **Express**, and **MongoDB**. This system handles high-concurrency flash sale events, ensuring accurate inventory management, real-time stock updates, and a leaderboard for successful purchases.  
---

## **Features**

* **Real-Time Inventory Management**: Tracks stock levels in real-time during flash sales.  
* **Concurrency Control**: Prevents over-purchasing and ensures data consistency under high traffic.  
* **Leaderboard**: Displays successful purchases in chronological order. 
* **Scalable Architecture**: Designed for high performance and scalability.  
* **Security**: Includes rate limiting, input validation, and a simple header authentication.

---

## **Technologies Used**

* **Backend**: Node.js, Express  
* **Database**: MongoDB (with Mongoose ODM)  
* **Real-Time Updates**: Socket.IO  
* **Authentication**: Simple header authentication  
* **Validation**: express-validator

---

## **System Design**

### **Architecture**

The system follows a **layered architecture**:

1. **Routes**: Handle incoming HTTP requests.  
2. **Controllers**: Process requests and return responses.  
3. **Services**: Contain business logic (e.g., inventory management).  
4. **Models**: Define database schemas and interact with MongoDB.
5. **Middleware**: Contains authentication, validation and error handling middleware.

### **Database Schema**

1. **FlashSale**:  
   * `startTime`: When the sale starts. 
   * `endTime`: When the sale ends. 
   * `originalStock`: Total units available (default: 200).  
   * `currentStock`: Remaining units.  
   * `status`: `pending`, `active`, or `completed`.  
2. **Purchase**:  
   * `userId`: ID of the purchasing user.  
   * `saleId`: ID of the flash sale.  
   * `timestamp`: When the purchase was made.  
   * `quantity`: Number of units purchased (default: 1). 
3. **User**:  
   * `name`: User's name.
   * `email`: User's email.  
   * `password`: Hashed password.
---

## **API Endpoints**

### **User Management**

* `POST /api/v1/auth/register`: Register a new user.
* `POST /api/v1/auth/login`: Login a user.


### **Flash Sale Management**

* `GET /api/v1/flashsales/active`: Get the currently active flash sale (requires authentication).

### **Purchases**

* `POST /api/v1/flashsales/purchase`: Create a purchase (requires authentication).

### **Leaderboard**

* `GET /api/v1/leaderboard`: Fetch the leaderboard of successful purchases in chronological order.

---

## **Installation**

### **Prerequisites**

* MongoDB Atlas account (Free Tier)

### **Steps**

1. Clone the repository:  
 - git clone https://github.com/tech-gecko/flash_sales_api.git
2. cd flash_sales_api 
3. Install dependencies: 
 - npm install  
4. Set up environment variables:  
 - Create a `.env` file in the root directory:
   MONGODB\_URI=your\_mongodb\_connection\_string,
   PORT=3000,
   MAX\_PURCHASE\_QUANTITY=your\_max\_quantity\_per\_purchase
5. Start the server:  
 - npm start  
6. Access the API at `http://localhost:3000`.

---

## **Key Implementation Details**

### **Concurrency Control**

* **Optimistic Concurrency Control**: Uses MongoDB's `version` field to prevent race conditions.  
* **Atomic Operations**: Uses `findOneAndUpdate` with `$inc` to ensure stock updates are atomic.

### **Real-Time Updates**

* **Socket.IO**: Broadcasts stock updates to all connected clients in real-time.

### **Validation**

* **express-validator**: Validates incoming requests (e.g., saleId must be a valid MongoDB ObjectId).

### **Error Handling**

* Custom error classes (e.g., `InsufficientStockError`, `SaleNotActiveError`).  
* Global error handler for consistent error responses.

---

## **Testing**

### **Essential Tests**

1. **Timing Validation**:  
   * Attempt purchase before sale starts.  
   * Verify rejection.  
2. **Leaderboard**:  
   * Create test purchases with known timestamps.  
   * Verify sorting order.

### **Tools**

* **Postman**: For manual API testing.   
* **Mocha**: For unit tests.

---

## **Dependencies**

### **Core Dependencies**

* `express`: Web framework.  
* `mongoose`: MongoDB ODM.  
* `dotenv`: Environment variable management.

### **Additional Dependencies**

* `cors`: Cross-Origin Resource Sharing.  
* `helmet`: HTTP security headers.  
* `morgan`: Request logging.    
* `socket.IO`: Real-time updates.    
* `express-validator`: Input validation.  
* `express-rate-limit`: Rate limiting.  

---

## **Contributing**

1. Fork the repository.  
2. Create a new branch:  
 - git checkout \-b feature/your-feature-name  
3. Commit your changes:  
 - git commit \-m "Add your feature"  
4. Push to the branch:  
 - git push origin feature/your-feature-name  
5. Open a pull request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](https://github.com/tech-gecko/flash_sales_api/LICENSE) file for details.  
---

## **Acknowledgments**

* MongoDB Atlas for free database hosting.  
* Socket.IO for real-time communication.

---

## **Contact**

For questions or feedback, reach out to:  
**Ikechukwu Ashimonye**  
**Email**: [techgecko.dev@gmail.com](https://mailto:techgecko.dev@gmail.com/)  
**GitHub**: [tech-gecko](https://github.com/tech-gecko)  
---
