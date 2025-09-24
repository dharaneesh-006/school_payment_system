# School Payments - Fullstack Application

This repository contains both the **Frontend Dashboard** and the **Backend API** for the **School Payments Application**.

* The **Frontend** is built with **React (Vite)** and provides a responsive dashboard for managing transactions.
* The **Backend** is built with **NestJS** and **MongoDB**, providing APIs for authentication, school data, and payment transactions.

---

## 🌟 Features

### Frontend

* Modern responsive UI with Tailwind CSS
* Secure authentication (JWT)
* Dynamic data table with filtering, sorting, pagination
* Dark/Light mode support
* Mobile-friendly navigation

### Backend

* JWT Authentication
* Payment transaction management
* Webhook handling
* School data retrieval
* Database seeding

---

## 🛠 Tech Stack

* **Frontend**: React, Vite, Tailwind CSS, React Router, Axios
* **Backend**: NestJS, MongoDB (Mongoose), Passport.js JWT
* **Language**: TypeScript

---

## ✅ Prerequisites

* Node.js v16+
* npm or yarn
* MongoDB instance running locally or in the cloud
* Git

---

## 🚀 Setup & Installation

Since this repo contains both **frontend** and **backend**, follow the steps below:

### 1. Clone the Repository

```bash
git clone https://github.com/dharaneesh-006/school_payment_system.git
cd school_payment_system
```

### 2. Setup Backend

```bash
cd backend
npm install   # or yarn install
cp .env.example .env
```

Update `.env` with MongoDB URI, JWT secret, and Payment Gateway keys.

Run the backend server:

```bash
npm run start:dev
```

The backend will start at **[http://localhost:4000](http://localhost:4000)**.

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install   # or yarn install
cp .env.example .env.local
```

Update `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Run the frontend:

```bash
npm run dev
```

The frontend will start at **[http://localhost:5173](http://localhost:5173)**.

---

## 📄 Pages & Functionality

### Frontend Pages

* **Login & Register** (`/login`, `/register`)
* **Transactions Dashboard** (`/transactions`)
* **Check Status Page** (`/check-status`)
* **Header Component** with theme toggle and logout

### Backend Endpoints

* **Auth**: `/auth/register`, `/auth/login`
* **Schools**: `/schools`
* **Transactions**: `/transactions` (filterable, paginated)
* **Check Status**: `/check-status?custom_order_id=...`

---

## 🌍 Environment Variables

### Backend `.env`

```env
MONGO_URI=mongodb://localhost:27017/school_payments
JWT_SECRET=YOUR_SUPER_SECRET_KEY
PG_KEY=YOUR_PAYMENT_GATEWAY_KEY
PG_API_KEY=YOUR_PAYMENT_GATEWAY_API_KEY
SCHOOL_ID=65b0e6293e9f76a9694d84b4
```

### Frontend `.env.local`

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## 🧪 Testing with Postman

* Import the provided Postman collection: `/postman/SchoolPayments.postman_collection.json`
* Set environment variable: `baseURL=http://localhost:4000/api`
* Register/Login to obtain JWT
* Use the token for testing `/transactions`, `/schools`, etc.

---

## 📜 License

This project is licensed under the **MIT License**.
