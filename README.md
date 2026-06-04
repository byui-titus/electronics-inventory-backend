# Electronics Inventory Management System

## Overview

The Electronics Inventory Management System is a full-stack application designed to help electronics businesses manage products, track inventory, record sales, and monitor business performance.

The system provides a RESTful API built with Node.js, Express, and MongoDB, allowing users to perform inventory operations, search products, manage stock levels, and analyze sales data.

## Features

### Product Management

* Create products
* View all products
* View a single product
* Update product information
* Delete products

### Search Functionality

* Search by product name
* Search by brand
* Search by category

### Inventory Tracking

* Monitor stock quantities
* Identify low-stock products
* Update inventory automatically after sales

### Sales Management

* Record product sales
* Calculate revenue
* Calculate profit
* Store sales history

### Analytics Dashboard

* Total products
* Low stock products
* Total revenue
* Total profit

### API Documentation

* Swagger/OpenAPI documentation

## Technologies Used

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Swagger UI
* dotenv

### Deployment

* Render
* MongoDB Atlas

## API Endpoints

### Products

GET /api/products

GET /api/products/:id

POST /api/products

PUT /api/products/:id

DELETE /api/products/:id

GET /api/products/search?q=value

### Sales

POST /api/sales/sell/:id

GET /api/sales/profit

GET /api/sales/today

GET /api/sales/dashboard

## Installation

Clone the repository:

git clone <repository-url>

Install dependencies:

npm install

Create a .env file:

MONGODB_URI=your_mongodb_connection_string

PORT=3000

Run the project:

npm start

## Deployment

Backend deployed on Render.

Database hosted on MongoDB Atlas.

## Future Improvements

* User authentication
* Role-based access control
* Frontend dashboard
* Data visualization
* Business reports
* AI-powered sales forecasting

## Author

Ssebude Titus

Software Development Student | Web Developer | Future Data Scientist
