# Library Management System

This project is a full-stack Library Management System consisting of a backend API and a frontend web application.

## Project Overview

- **Backend:** A RESTful API built with Node.js, Express, TypeScript, and MongoDB for managing books, users, and authentication.
- **Frontend:** A React application built with TypeScript, Redux, React Query, and Tailwind CSS for managing the library interface.

## Technologies Used

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Helmet, CORS, Morgan for security and logging
- dotenv for environment variables

### Frontend
- React 18
- TypeScript
- Redux Toolkit
- React Query
- React Router DOM
- Tailwind CSS
- Vite as build tool
- Jest and React Testing Library for testing

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB instance (local or cloud)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd Library-Management-System/library-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `library-backend` directory with the following variables:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:

   - For development with auto-reload:

     ```bash
     npm run dev
     ```

   - For production:

     ```bash
     npm start
     ```

The backend server will run on `http://localhost:5000` by default.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd Library-Management-System/library-management-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

The frontend will be available at the URL shown in the terminal (usually `http://localhost:5173`).

### Running the Full System

- Start the backend server first.
- Then start the frontend server.
- The frontend communicates with the backend API to manage library data.

## Testing

- Frontend tests can be run with:

  ```bash
  npm test
  ```

- Linting can be run with:

  ```bash
  npm run lint
  ```

## Project Structure

- `library-backend/`: Backend API source code and configuration.
- `library-management-frontend/`: Frontend React application source code and configuration.

