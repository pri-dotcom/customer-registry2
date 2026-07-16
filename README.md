# Customer Care Registry

## Project Description
Customer Care Registry is a full-stack web application developed using the MERN stack. It helps manage customer records with features such as adding, updating, viewing, and deleting customer details.

## Technologies Used
- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

```
customer-registry-main/
├── client/
├── server/
└── README.md
```

## Installation

### Clone the repository

```bash
git clone <your-github-repository-url>
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder with the following variables:

```env
PORT=5001
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<Your JWT Secret>
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

The backend will run on:

```
http://localhost:5001
```

## Features

- User Authentication
- Customer Registration
- View Customer Details
- Update Customer Information
- Delete Customer Records
- Responsive User Interface

## Note

The `.env` file is intentionally not included in this repository because it contains sensitive information such as the MongoDB connection string and JWT secret.
