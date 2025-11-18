# Calculation Tree – Full Stack Test Assignment

This project implements the "Calculation Tree" one-page application described in the Ellty Full Stack Developer test assignment (03.02.2024).  
Users communicate by publishing numbers and applying operations, forming a discussion-like tree of calculations.

## 🚀 Tech Stack
- **Next.js 14** (NodeJS + React + TypeScript in one unified environment)
- **In-memory server-side storage** (for simplicity of the test)
- **REST-style API routes** for communication protocol
- **Tailwind CSS** (optional enhancement)
- **Vitest** for basic test coverage
- **Docker & Docker Compose** included

## 🧩 Features (Matching the Business Scenarios)

### ✔ 1. Unregistered users can view the full calculation tree  
The home page displays all starting numbers and all derived calculations.

### ✔ 2. Unregistered users can create an account  
Usernames & passwords are handled through `/api/register`.

### ✔ 3. Unregistered users can authenticate  
A minimal login form sends credentials to `/api/login`.

### ✔ 4. Registered users can publish a starting number  
Creates a new root node in the tree.

### ✔ 5. Registered users can apply operations with custom right-hand numbers  
Users can select an operation (`+ - * /`) and a chosen number.

### ✔ 6. Registered users can respond to any calculation  
Each node allows creating new child calculations.

## 🗄 Storage Method
The project uses **simple in-memory arrays** (`users[]`, `nodes[]`) as allowed by the assignment.  
This keeps the implementation lightweight while demonstrating correct data modeling.

## 🔌 API Overview
- `POST /api/register` – Create user  
- `POST /api/login` – Authenticate user  
- `GET /api/nodes` – Fetch full node list  
- `POST /api/nodes/create` – Create starting number  
- `POST /api/nodes/reply` – Apply operation to any node  

All communication uses JSON.

## 🧪 Tests
Basic unit tests are provided using **Vitest**, covering:
- user registration  
- duplicate username validation  
- login success  
- login failure  

Run tests:
```bash
npm test

complete