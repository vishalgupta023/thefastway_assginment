# AdonisJS UPI Transactions API

## Overview
This project is a **backend API** built using **AdonisJS v6**, designed to handle **UPI transactions** securely. It includes user authentication, balance management, fund transfers, and transaction history retrieval.

## Features
- **User Authentication** (Register, Login, Logout)
- **Fund Management** (Add funds, Check balance)
- **UPI Transactions** (Transfer funds, View transaction history, Check transaction status)
- **User Profile & Contacts**
- **Middleware Protection** using authentication
- **Request Validation** using Vine.js

## Technologies Used
- **AdonisJS v6** (Node.js framework)
- **PostgreSQL** (Database)
- **TypeScript** (For type safety)
- **JWT Authentication** (For secure access)
- **Vine.js** (For input validation)

## API Endpoints

### **Authentication APIs**
| Method | Endpoint       | Description       | Middleware |
|--------|--------------|------------------|------------|
| POST   | `/api/v1/register`  | User registration | Guest |
| POST   | `/api/v1/login`     | User login        | Guest |
| GET    | `/api/v1/logout`    | User logout       | Auth  |

### **User APIs**
| Method | Endpoint            | Description          | Middleware |
|--------|--------------------|----------------------|------------|
| POST   | `/api/v1/add-funds`    | Add funds to wallet | Auth |
| GET    | `/api/v1/check-balance` | Check account balance | Auth |
| GET    | `/api/v1/contacts`  | Get UPI contacts     | Auth |
| GET    | `/api/v1/my-profile` | View user profile   | Auth |

### **Transaction APIs**
| Method | Endpoint                          | Description              | Middleware |
|--------|----------------------------------|--------------------------|------------|
| POST   | `/api/v1/transfer-funds`         | Transfer money via UPI   | Auth |
| GET    | `/api/v1/transactions`           | Get transaction history  | Auth |
| GET    | `/api/v1/transaction-status/:transaction_id` | Get transaction status | Auth |

## Request Validations
All requests are validated using **Vine.js** to ensure data integrity.

- **Register (`/api/v1/register`)**
  - `name`: **string**, min 3 characters
  - `email`: **valid email format**
  - `upi_id`: **string**, must end with `@fastway.in`
  - `password`: **string**, min 6 characters

- **Login (`/api/v1/login`)**
  - `email`: **valid email format**
  - `password`: **string**, min 6 characters

- **Add Funds (`/api/v1/add-funds`)**
  - `amount`: **positive number**

## Postman Collection  
To test the API using Postman, use the collection below:  
[👉 Postman Collection for UPI API](https://www.postman.com/jgswdhs/workspace/thefastway/collection/43257483-33fcdb53-5331-41fb-bcd7-9a908172a05d?action=share&source=copy-link&creator=43257483)

## Installation & Setup
1. **Clone the repository**
   ```sh
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
indtall dependencies:
npm install


run database migration
node ace migration:run

start server :
node ace serve --watch
or
npm run dev

