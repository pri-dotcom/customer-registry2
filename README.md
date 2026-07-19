# Customer Care Registry

A centralized MERN Stack enterprise system designed to record, track, and manage customer interactions, support tickets, and feedback logs. Built with role-based access control, real-time message communication, customizable fields, and administrative dashboards.

## Project Overview

The Customer Care Registry enables support organizations to streamline ticket queues, log complaints, maintain communication histories, and derive data-driven insights through analytics dashboards. It is structured to foster collaboration between Customers, support Agents, and Administrators.

## Team Members

*   **Priyanka Degala** (Team Lead)
*   **Chandrakala Marri** (Member)
*   **Eswarasai Marre** (Member)
*   **Triloka Pavani Mandhapati** (Member)
*   **Santhosh Nikhil Moka** (Member)

## Project Statistics

*   **Total Epics:** 6
*   **Total Tasks:** 19
*   **Total Subtasks:** 0

---

## Technology Stack

### Frontend (Client)
*   **Core:** React.js (v19)
*   **Routing:** React Router DOM (v7)
*   **Styles:** TailwindCSS (v4) & Custom Vanilla CSS
*   **Charts:** Responsive SVG Charts & Aggregations
*   **Icons:** React Icons

### Backend (Server)
*   **Core Engine:** Node.js & Express.js
*   **Database:** MongoDB Atlas & Mongoose ODM
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs hashing
*   **Development Tools:** nodemon

---

## System Requirements

*   **Operating System:** Windows 10/11, macOS, or Linux
*   **Node.js Version:** v16.0.0 or above
*   **npm Version:** v8.0.0 or above
*   **Database:** MongoDB Instance (Local or Atlas Cluster URI)

### Hardware Requirements
*   **Processor:** Intel Core i5 (8th Gen or above) / AMD Ryzen 5 or better
*   **Memory:** Minimum 8 GB RAM (16 GB Recommended)
*   **Storage:** Minimum 1 GB Free Space
*   **Resolution:** 1366 × 768 or higher

---

## Folder Structure

```
customer-registry-main/
├── client/
│   ├── src/
│   │   ├── components/       # Layouts, tables, sidebars
│   │   ├── context/          # Authentication contexts
│   │   ├── pages/            # Page view controllers
│   │   │   ├── admin/        # Admin panel pages
│   │   │   └── agent/        # Agent workspace pages
│   │   ├── services/         # Axios API connection layers
│   │   ├── styles/           # CSS modules
│   │   ├── App.jsx           # Routing & application entry
│   │   ├── config.js         # Environment bindings
│   │   └── main.jsx          # React bootstrapping
│   ├── .env.example
│   └── package.json
└── server/
    ├── src/
    │   ├── config/           # DB connection configuration
    │   ├── controllers/      # Route controllers (Admin, Agent, Auth, etc.)
    │   ├── middleware/       # JWT auth, role validation, error handlers
    │   ├── models/           # Mongoose schemas (Customer, Agent, Complaint, etc.)
    │   ├── routes/           # Express router endpoints
    │   └── app.js            # Express app assembly
    ├── .env.example
    ├── server.js             # Main server execution hook
    └── package.json
```

---

## Functional Requirements Status

1.  **Customer Profile Creation:** Fully Implemented. Customers can register, upload photos, and update details.
2.  **Contact Management:** Fully Implemented. Phone, email, address, and preferences are fully supported.
3.  **Customizable Fields:** Fully Implemented. Admins can create dynamic custom fields (text, number, date), which are editable by Customers/Admins/Agents on customer records.
4.  **User Registration:** Fully Implemented. Secure bcrypt hashing and token signing for all three roles.
5.  **Admin Dashboard:** Fully Implemented. Summary metrics and interactive overview line charts.
6.  **Agent Accounts:** Fully Implemented. Dedicated agent profiles, case queues, and chat workspaces.
7.  **Customer Information Management:** Fully Implemented. Admin and Agent modals to edit personal details and custom fields.
8.  **Communication Channels:** Fully Implemented. In-app live chat rooms between customers and assigned agents.
9.  **Communication History:** Fully Implemented. Chat histories and status logs are saved inside MongoDB.

---

## API Endpoints

### Authentication (`/api/auth`)
*   `POST /register` - Register a new user (Customer, Agent, Admin).
*   `POST /login` - Login for Customers and Admins.
*   `POST /agent-login` - Login for support Agents.
*   `GET /me` - Get current authenticated user details.

### Profile (`/api/profile`)
*   `GET /` - Fetch current user's profile details.
*   `PUT /` - Update current user's profile details.
*   `PATCH /change-password` - Update current user's password.
*   `PATCH /update-email` - Update user email.
*   `DELETE /` - Delete current customer account.

### Admin Operations (`/api/admin`)
*   `GET /statistics` - Fetch total user and complaint counts.
*   `GET /recent-complaints` - List the 10 most recent complaints.
*   `GET /customers` - Get list of registered customers.
*   `GET /customer/:id` - Fetch details of a specific customer (accessible to Admin & Agent).
*   `PUT /customer/:id` - Update details of a customer (accessible to Admin & Agent).
*   `DELETE /customer/:id` - Delete a customer account.
*   `GET /custom-fields` - Fetch admin-configured custom fields.
*   `POST /custom-fields` - Define a new customizable field template.
*   `DELETE /custom-fields/:id` - Delete a configured custom field template.

### Support Complaints (`/api/complaints`)
*   `POST /` - Raise a new complaint (Customer).
*   `GET /my` - List complaints raised by the logged-in customer.
*   `GET /` - List all system complaints (Admin).
*   `GET /:id` - Get complaint details by ID.
*   `PUT /:id` - Update complaint title, category, priority (Customer).
*   `DELETE /:id` - Delete a complaint record (Customer).
*   `PATCH /:id/assign` - Assign an agent to a ticket (Admin).
*   `GET /assigned/list` - List complaints assigned to the logged-in agent.
*   `PATCH /:id/resolve` - Update ticket status and save resolution description (Agent/Admin).

### Live Chat Messages (`/api/messages`)
*   `POST /` - Send a message to a ticket chat room.
*   `GET /:complaintId` - Fetch the chat history for a specific complaint ticket.

---

## Installation & Setup

### 1. Clone & Set Environment variables
*   Navigate into `server/` and create `.env` using `.env.example`.
*   Navigate into `client/` and create `.env` using `.env.example`.

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
Starts backend API on `http://localhost:5001`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Starts frontend application on `http://localhost:5173`.
