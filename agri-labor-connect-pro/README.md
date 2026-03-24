# Agri Labor Connect Pro

A full-stack platform connecting farmers with nearby laborers using React, Node.js, MongoDB, and Socket.io.

## Features
- **Smart Matching**: AI-assisted (basic logic) wage suggestions and location filtering.
- **Real-time Notifications**: Instant updates for job posts and applications.
- **Secure Auth**: JWT-based authentication for Farmers and Workers.
- **Premium UI**: Modern glassmorphism design with dark mode support.
- **Chat System**: Real-time communication between farmers and workers.

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file (copied from `.env.example` or provided)
4. `node server.js` (Ensure MongoDB is running locally on port 27017)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on http://localhost:3000)

## Folder Structure
- `/backend`: Express server, Mongoose models, and API routes.
- `/frontend`: Vite React app with premium CSS design system.
