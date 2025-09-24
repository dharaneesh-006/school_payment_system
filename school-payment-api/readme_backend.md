# 🎓 School Payments Backend API

This repository contains the backend service for the **School Payments Application**.  
It is built with **NestJS** and uses **MongoDB** for data storage.  
The API provides endpoints for **user authentication**, **school data management**, and **payment transactions**.

---

## ✨ Key Features

- **User Authentication**: Secure registration & login with JWT (JSON Web Tokens).
- **Transaction Management**: Create payment orders, handle webhook notifications, list & filter transactions.
- **Dynamic Filtering**: Pagination, sorting, filtering by status, school, and search query.
- **School Data**: Retrieve a list of all schools.
- **Database Seeding**: Populates dummy school data automatically on first run.

---

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with JWT Strategy
- **Language**: TypeScript

---

## 📋 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn
- MongoDB
- Git

---

## 🚀 Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd <repository-folder-name>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # OR
   yarn install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your values (see below).

4. **Run the Application**
   ```bash
   npm run start:dev
   ```
   The server will start at **http://localhost:4000**.

---

## ⚙️ Environment Variables

The `.env` file stores sensitive credentials and config settings.

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/school_payments

# JWT Secret Key (use a long, random string)
JWT_SECRET=YOUR_SUPER_SECRET_KEY_HERE

# Payment Gateway API Credentials
PG_KEY=YOUR_PAYMENT_GATEWAY_KEY
PG_API_KEY=YOUR_PAYMENT_GATEWAY_API_KEY

# Default School ID
SCHOOL_ID=65b0e6293e9f76a9694d84b4
```

---

## 📖 API Usage

All endpoints are prefixed with `/api`.  
Protected routes require a **Bearer Token** in the `Authorization` header.

---

### 🔑 Authentication

#### 1. Register a New User
**POST** `/auth/register`
```json
{
  "email": "testuser@example.com",
  "password": "strongpassword123"
}
```

#### 2. Login to Get JWT Token
**POST** `/auth/login`
```json
{
  "email": "testuser@example.com",
  "password": "strongpassword123"
}
```

✅ Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

---

### 🏫 Schools

#### 1. Get All Schools
**GET** `/schools`  
🔒 Auth Required

Returns a list of all schools.

---

### 💳 Transactions

#### 1. Get All Transactions (with Filtering)
**GET** `/transactions`  
🔒 Auth Required

Query Parameters:
- `page` (number) → Page number (default: 1)
- `limit` (number) → Results per page (default: 10)
- `status` (string) → e.g., Success, Pending
- `school_id` (string) → Filter by school
- `q` (string) → Search query (Order ID, Student Name, etc.)
- `sort_by` (string) → e.g., createdAt
- `sort_order` (string) → asc / desc

📌 Example:
```
/transactions?page=1&limit=10&status=Success
```

#### 2. Check Transaction Status
**GET** `/check-status?custom_order_id=ORD-1758592871930`  
🔒 Auth Required

---

## 🧪 Testing with Postman

1. **Download Collection**  
   Export your Postman collection and add the link here:  
   👉 [Postman Collection](postman_collection.json)

2. **Setup**
   - Import the collection into Postman
   - Create an environment with:
     ```
     baseURL = http://localhost:4000/api
     ```

3. **Test Auth**
   - Register & Login to get a JWT token
   - Copy `access_token`
   - Set collection **Authorization → Bearer Token** with the token

4. **Use Endpoints**
   - Now you can test `/transactions`, `/schools`, etc.

---

## 📌 Notes
- The database auto-seeds school data on first run.
- Always keep your `.env` file private and never commit it.

---

## 📜 License
This project is licensed under the MIT License.

