# Primetrade.ai Backend API

A secure and scalable RESTful API built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ User registration and login
- ✅ Protected routes
- ✅ CRUD operations on tasks
- ✅ Search and filter functionality
- ✅ Input validation
- ✅ Error handling
- ✅ MongoDB integration
- ✅ Scalable architecture

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Environment Variables**: dotenv

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Software Developer",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Task Routes (All Protected)

#### Get All Tasks
```http
GET /api/tasks?status=pending&priority=high&search=keyword&sortBy=createdAt&order=desc
Authorization: Bearer <token>
```

#### Get Single Task
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the frontend developer task",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-02-20",
  "tags": ["work", "urgent"]
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Get Task Statistics
```http
GET /api/tasks/stats
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── taskController.js     # Task CRUD logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Error handling middleware
│   └── validation.js        # Input validation rules
├── models/
│   ├── User.js              # User model
│   └── Task.js              # Task model
├── routes/
│   ├── auth.js              # Auth routes
│   └── tasks.js             # Task routes
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # This file
```

## Security Features

- Password hashing using bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected routes with middleware
- Input validation on all endpoints
- Error handling without exposing sensitive data
- CORS configuration
- MongoDB injection prevention

## Scalability Considerations

1. **Modular Architecture**: Separated concerns (models, controllers, routes, middleware)
2. **Database Indexing**: Email field indexed for faster queries
3. **Query Optimization**: Efficient MongoDB queries with filtering and sorting
4. **Error Handling**: Centralized error handling for consistency
5. **Environment Configuration**: Easy deployment with environment variables
6. **Stateless Authentication**: JWT tokens for horizontal scaling
7. **API Versioning Ready**: Routes structured for easy versioning

## Future Enhancements

- Rate limiting
- Redis caching
- File upload support
- Email verification
- Password reset functionality
- Refresh tokens
- API documentation with Swagger
- Unit and integration tests
- Docker containerization
- CI/CD pipeline

## License

ISC
