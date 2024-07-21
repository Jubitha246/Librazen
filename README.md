# Librazen
Librazen is a full-stack web application designed to manage a library's book lending system. It provides an efficient platform for users to borrow and return books while allowing administrators to manage the library's inventory.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Key Functionalities](#key-functionalities)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used

- **Frontend**: React, Axios, daisyUI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Testing**: Postman, MongoDB Compass
- **Deployment**: Heroku

## Key Functionalities

1. **User Authentication and Authorization**
   - Secure login/logout functionality
   - Role-based access control for users (borrow books) and admins (manage inventory)
   
2. **Admin Portal**
   - Add, update, and delete books
   - Manage book categories
   - View borrowed book details including borrow date, due date, return date, status, user ID, and book title

3. **User Profile and Book Management**
   - View profile with book borrowing history, dues, and deadlines
   - Borrow and return books with real-time status updates
   - Browse books by category and view detailed information

4. **Responsive Frontend and RESTful Backend**
   - Dynamic UI using React and daisyUI
   - Efficient data handling with Node.js, Express, and MongoDB
   - Tested with Postman and MongoDB Compass
   - Deployed on Heroku

## Setup and Installation

1. **Clone the repository:**
   git clone https://github.com/your-username/librazen.git
   cd librazen
2. **Backend Setup:**
   - Navigate to the backend directory and install dependencies:
     cd backend
     npm install
   - Create a `.env` file in the backend directory and add your MongoDB URI and other environment variables:
     MongoDBURI=your_mongodb_connection_string
     NODE_ENV=development
     PORT=4001
3. **Frontend Setup:**
   - Navigate to the frontend directory and install dependencies:
     cd frontend
     npm install
   - Build the frontend:
     npm run build
4. **Run the application:**
   - Start the backend server:
     cd backend
     npm run dev
   - The application will be available at `http://localhost:4001`.

## Usage

- Access the application in your web browser at `http://localhost:4001`.
- Log in as a user to browse and borrow books.
- Log in as an admin to manage the library's inventory.

## Testing

- Use Postman to test API endpoints.
- Use MongoDB Compass to verify database entries and operations.

## Deployment

- The application is deployed on Heroku.
- The deployment script (`heroku-postbuild`) installs dependencies and builds the frontend.
- Ensure your Heroku environment variables are set correctly:
  heroku config:set MongoDBURI=your_mongodb_connection_string NODE_ENV=production

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

---

Feel free to customize this README file to better match your project's specifics and your preferences.
