# Librazen - Digital Library Management System

**Librazen** is a modern, full-stack digital library management system built using the MERN (MongoDB, Express.js, React, Node.js) stack. It includes user authentication, book management, borrowing functionality, and an advanced administrative dashboard with analytics.

## Live Demo

* Frontend: [https://librazen-7.onrender.com](https://librazen-7.onrender.com)
* Backend API: [https://librazen-7.onrender.com/api](https://librazen-7.onrender.com/api)

## Features

### User Features

* User registration and secure authentication
* Book catalog with search functionality
* Book borrowing and return system
* Personal user profile with borrowing history
* Leaderboard showcasing top readers and popular books
* Book filtering by category

### Admin Features

* Comprehensive administrative dashboard
* User management with view and control access
* Book management: add, edit, delete
* Real-time system statistics and analytics
* Borrowing and overdue tracking
* System configuration options

### UI/UX Features

* Fully responsive design compatible with all devices
* Clean, modern interface using React and Tailwind CSS
* Smooth animations and interactive elements
* Real-time toast notifications for user feedback
* Image upload support for book covers

## Technology Stack

### Frontend

* React 18
* Vite
* React Router DOM
* Tailwind CSS
* DaisyUI
* Axios
* React Hook Form
* Chart.js
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* Bcrypt for password hashing
* Multer for file uploads
* Nodemailer for email services
* CORS configuration

## Getting Started

### Prerequisites

* Node.js (version 14 or higher)
* MongoDB (local or cloud instance)
* Git

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Jubitha246/Librazen.git
   cd Librazen
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd Frontend
   npm install
   ```

4. Configure environment variables:

   In `backend/.env`:

   ```env
   PORT=4001
   MongoDBURI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

   In `backend/Frontend/.env`:

   ```env
   VITE_API_URL=http://localhost:4001
   ```

5. Run the application:

   **Backend** (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):

   ```bash
   cd backend/Frontend
   npm run dev
   ```

6. Access the application:

   * Frontend: [http://localhost:5173](http://localhost:5173)
   * Backend API: [http://localhost:4001](http://localhost:4001)

## Project Structure

```
Librazen/
├── backend/
│   ├── controller/          # Route controllers
│   ├── middlewares/         # Custom middleware functions
│   ├── model/               # Mongoose models
│   ├── route/               # API route definitions
│   ├── uploads/             # File storage
│   ├── Frontend/            # React frontend application
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── context/     # Global state management
│   │   │   ├── config/      # API configuration
│   │   │   └── home/        # Home page layout
│   │   └── dist/            # Production build output
│   └── index.js             # Server entry point
└── README.md
```

## API Endpoints

### Authentication

* `POST /user/signup` - Register a new user
* `POST /user/login` - User login
* `POST /user/login/admin` - Admin login

### Book Management

* `GET /book` - Retrieve all books
* `GET /book/category` - Filter books by category
* `POST /book` - Add a new book (Admin only)
* `PUT /book/:id` - Update book details (Admin only)
* `DELETE /book/:id` - Delete a book (Admin only)

### User Operations

* `GET /user/user/profile` - Retrieve user profile
* `PUT /user/user/profile` - Update user profile
* `POST /user/borrow` - Request to borrow a book
* `POST /user/book/return` - Return a borrowed book

### Admin Operations

* `GET /user/admin/profile` - Retrieve admin profile
* `GET /user/admin/users/borrowed` - View users with borrowed books
* `GET /user/admin/users/overdue` - View users with overdue books
* `GET /user/admin/statistics` - Retrieve system analytics

### Categories

* `GET /category` - Retrieve all categories
* `POST /category` - Create a new category (Admin only)

## Deployment

### Backend Deployment (Render)

1. Link your GitHub repository to Render.
2. Configure environment variables in the Render dashboard.
3. Enable automatic deployment on push to the main branch.

### Frontend Deployment

The frontend application is served by the backend in production mode after building the React app.

## Contributing

Contributions are welcome. Please follow the steps below:

1. Fork the repository.
2. Create a new feature branch:

   ```bash
   git checkout -b feature/FeatureName
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add FeatureName"
   ```
4. Push to your branch:

   ```bash
   git push origin feature/FeatureName
   ```
5. Open a pull request for review.
