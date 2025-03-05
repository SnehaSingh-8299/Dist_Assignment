**# Overview

This project provides a RESTful API built using Node.js, Express.js, and MongoDB to handle CSV file uploads, store product data, and allow users to retrieve and manage products with filtering and pagination.

# Features

- User Authentication: Register and login using JWT authentication with password hashing via bcrypt.

- CSV Upload & Processing: Users can upload CSV files containing product data, which will be validated and stored in MongoDB.

- Product Management: Create, read (with filters & pagination), update (owner only), and delete (owner only) products.

- Filtering & Pagination: Retrieve products based on category and price range with pagination support.

- Security: JWT authentication and input validation to prevent malicious data.

-CSV download feature to export products.

# Tech Stack

- Node.js @v22.14.0

- Express.js

- MongoDB (Mongoose)

- JWT Authentication

- Multer (File Upload Handling)

- CSV-Parser (CSV Processing)

- @fast-csv/format (CSV Download)

- bcrypt.js (Password Hashing)

# Installation & Setup

# Prerequisites

Ensure you have Node.js and MongoDB installed.

# Steps to Run the Project

-  Clone the repository

 git clone <repository-url>  https://github.com/SnehaSingh-8299/Dist_Assignment.git 

 cd Dist_Assignment

- Install dependencies

  npm install

# Set up environment variables
Create a .env file in the root directory and add the following:

- MONGO_URI="mongodb://127.0.0.1:27017/Dist_Upload_Db"
- JWT_SECRET="ksdjfdksaslkdmjfdkslakdsfmjkdsljfdksjfdksfh"

# Run the server

nodemon run dev

The server will start on http://localhost:5000 (or the specified port in .env).

# API Endpoints

# Authentication

- Register: POST /api/auth/register

- Login: POST /api/auth/login

# Product Management

- Upload CSV: POST /api/products/csv (Requires JWT Auth, Multipart File Upload)

- Download CSV Product: get /api/products/exportCSV

- Get Products: GET /api/products/list (Supports filters & pagination)

- Create Product: POST /api/products/addProduct

- Update Product: PUT /api/products/:id 

- Delete Product: DELETE /api/products/:id 

- Query Parameters for Filtering & Pagination

- Filter by Category: ?category=Electronics

- Filter by Price Range: ?minPrice=100&maxPrice=500

- Pagination: ?page=1&limit=10

# Sample CSV Format

product_name,category,price,stock
Laptop,Electronics,800,10
Phone,Electronics,500,20

# License

This project is licensed under the MIT License.

**