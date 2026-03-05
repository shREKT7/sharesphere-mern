# ShareSphere – MERN Stack Rebuild Specification

## Project Goal

Transform this incomplete project into a **fully functional MERN stack application** called **ShareSphere**.

ShareSphere is a **Community Resource Sharing Platform** where users can share resources such as tools, books, equipment, and study materials with other community members.

Users should be able to:

• Register and login  
• Add items they are willing to share  
• Browse items listed by others  
• Request to borrow items  
• Approve or reject borrow requests  
• Track borrowing history  

This system encourages **community collaboration and sustainable resource usage**.

The finished project must be **portfolio-ready and suitable for inclusion in a developer resume**.

---

# Current Repository State

The current project structure:

sphere/
├── node_modules/
├── public/
├── style/
├── db.js
├── server.js
├── package.json

Problems with current project:

• Not using MERN architecture  
• No modular backend structure  
• No authentication system  
• No REST API design  
• No React frontend  
• No scalable database schema  

This repository must be **restructured completely**.

---

# Final Architecture Required

The project must be converted into the following structure:

sharesphere/

backend/
│
├── config/
│   └── db.js
│
├── models/
│   ├── User.js
│   ├── Resource.js
│   ├── BorrowRequest.js
│
├── controllers/
│   ├── authController.js
│   ├── resourceController.js
│   ├── borrowController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── resourceRoutes.js
│   ├── borrowRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│
├── server.js
└── package.json

frontend/

├── public/
├── src/
│
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│
│   ├── App.js
│   └── index.js
│
└── package.json

---

# Technology Stack

Frontend

React.js  
React Router  
Axios  
TailwindCSS (preferred)

Backend

Node.js  
Express.js  

Database

MongoDB  
Mongoose ODM

Authentication

JWT Authentication  
bcrypt password hashing

---

# Database Models

## User Model

Fields:

name  
email  
password  
role  
createdAt  

email must be unique.

Passwords must be hashed.

---

## Resource Model

Fields:

title  
description  
category  
condition  
owner (reference User)  
availability (boolean)  
createdAt  

Represents an item shared by a user.

Examples:

book  
tool  
bicycle  
study material

---

## BorrowRequest Model

Fields:

resourceId  
borrowerId  
ownerId  
startDate  
endDate  
status  

Status values:

Pending  
Approved  
Rejected  
Returned  

---

# Backend API Requirements

## Authentication APIs

POST /api/auth/register

Registers a new user.

POST /api/auth/login

Authenticates a user and returns JWT token.

GET /api/auth/me

Returns the currently authenticated user.

---

## Resource APIs

GET /api/resources

Returns list of available resources.

POST /api/resources

Creates a new resource listing.

GET /api/resources/:id

Returns details of a specific resource.

DELETE /api/resources/:id

Deletes a resource (only owner can delete).

---

## Borrow APIs

POST /api/borrow/request

Create borrow request.

PATCH /api/borrow/approve/:id

Owner approves request.

PATCH /api/borrow/reject/:id

Owner rejects request.

PATCH /api/borrow/return/:id

Mark item returned.

---

# Frontend Pages

The React frontend must include:

Home Page  
Login Page  
Register Page  
Dashboard  
Add Resource Page  
Resource Listing Page  
Borrow Requests Page  
My Borrowed Items Page  

---

# Frontend Features

Users must be able to:

Browse resources

Create new resource listings

Request items

Approve or reject requests

View their shared items

View borrowed items

Track request status

---

# Authentication Flow

User registers

User logs in

Backend returns JWT token

Frontend stores token

Protected routes require authentication

Unauthorized users cannot access dashboard features.

---

# Security Requirements

Passwords must be hashed using bcrypt.

JWT tokens must be used for authentication.

Protected API routes must verify JWT.

Users must only modify their own resources.

Borrow approvals must only be performed by resource owner.

---

# Implementation Plan

Step 1

Analyze existing server.js and db.js

Extract any useful logic.

---

Step 2

Create new backend structure.

Implement:

MongoDB connection  
User model  
Resource model  
BorrowRequest model  

---

Step 3

Implement authentication system.

Register API  
Login API  
JWT middleware

---

Step 4

Implement resource APIs.

Create resource  
Fetch resources  
Delete resource

---

Step 5

Implement borrowing system.

Borrow request creation

Approve request

Reject request

Return item

---

Step 6

Create React frontend.

Implement pages and navigation.

---

Step 7

Connect frontend to backend using Axios.

---

Step 8

Test full workflow.

Register  
Login  
Add item  
Request item  
Approve request  
Return item

---

# Completion Criteria

The project is complete when:

Users can register and login

Users can list resources

Users can request resources

Owners can approve requests

Items can be marked returned

Frontend communicates with backend successfully

The application runs locally without errors.

---

# Development Instructions

Backend

cd backend  
npm install  
npm run dev

Frontend

cd frontend  
npm install  
npm start

MongoDB must be running locally or using MongoDB Atlas.

---

# Code Quality Requirements

Use clear variable names.

Use modular architecture.

Handle API errors properly.

Add comments where necessary.

Code should be readable and maintainable.

---

# Final Goal

Create a **clean, working MERN stack application** demonstrating:

Full-stack development

Authentication

REST APIs

Database integration

Frontend-backend communication

The result must be **good enough to include on a professional developer resume**.

# UI / UX Design Requirements

The website must NOT look like a generic CRUD dashboard.

Avoid template-style layouts that most AI systems generate.

The design should resemble modern startup products such as:

Airbnb  
Notion  
Linear  
Apple style minimal design  

The UI must feel modern, elegant and visually engaging.

---

# Design Requirements

Use:

TailwindCSS  
ShadCN UI component library  

Design must include:

• soft shadows  
• rounded cards  
• hover animations  
• gradient accents  
• responsive layouts  

Avoid default Bootstrap-style layouts.

---

# Required UI Features

Implement at least 3 of the following:

Animated landing hero section  
Interactive resource cards  
Dashboard widgets  
Floating action buttons  
Skeleton loading animations  
Smooth page transitions  
Dark mode toggle  

---

# Landing Page Requirements

Landing page should include:

Hero section introducing ShareSphere

Feature highlights:

Community sharing  
Sustainable resource usage  
Easy borrowing system  

Call-to-action buttons:

Get Started  
Browse Resources  

---

# Resource Browsing Experience

Resource listings should include:

Card-based layout  
Resource image  
Owner information  
Availability status badge  
Borrow button

Cards should animate on hover.

---

# Dashboard Design

User dashboard must include sections:

My Shared Items  
Borrow Requests  
My Borrowed Items  

Use a modern card-based layout.

---

# Interaction Design

Add micro-interactions such as:

Hover effects  
Animated buttons  
Smooth transitions  
Status badges

---

# User Experience Goal

The final UI must look like a real startup product rather than a simple academic project.