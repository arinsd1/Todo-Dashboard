# Quick Start Guide - Primetrade.ai Full Stack Application

This guide will help you get the application up and running in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)

## Installation Steps

### 1. Install MongoDB

#### Windows
1. Download MongoDB Community Server from the official website
2. Run the installer and follow the setup wizard
3. MongoDB will start automatically as a Windows service

To verify MongoDB is running:
```bash
mongosh
```

If MongoDB is not running, start it with:
```bash
net start MongoDB
```

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# The .env file is already configured with default values
# If you need to change MongoDB URI or other settings, edit backend/.env

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

### 3. Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (already done)
npm install

# The .env file is already configured
# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Access the Application

1. Open your browser and go to `http://localhost:5173`
2. You'll be redirected to the login page
3. Click "Sign up" to create a new account
4. Fill in the registration form:
   - Name: Your full name
   - Email: A valid email address
   - Password: At least 6 characters with uppercase, lowercase, and number
5. After registration, you'll be automatically logged in and redirected to the dashboard

## Testing the Application

### Create Your First Task

1. On the dashboard, click the "New Task" button
2. Fill in the task details:
   - Title: "Complete Primetrade.ai Assignment"
   - Description: "Build a scalable web app with authentication"
   - Status: In Progress
   - Priority: High
   - Due Date: Select a date
   - Tags: work, urgent, primetrade
3. Click "Create Task"
4. Your task will appear in the dashboard

### Test Search and Filters

1. Use the search bar to find tasks by title or description
2. Use the status filter to show only pending, in-progress, or completed tasks
3. Use the priority filter to show tasks by priority level

### Test Profile Management

1. Click the "Profile" button in the header
2. Update your name or bio
3. Click "Save Changes"

### Test Logout

1. Click the "Logout" button in the header
2. You'll be redirected to the login page
3. Log back in with your credentials

## API Testing with Postman

1. Import the Postman collection: `Primetrade_API_Collection.postman_collection.json`
2. The collection includes all API endpoints with examples
3. Start with "Register User" or "Login User" to get a token
4. The token will be automatically saved and used for subsequent requests

## Troubleshooting

### Backend won't start

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:27017`
**Solution**: MongoDB is not running. Start MongoDB:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Frontend can't connect to backend

**Problem**: Network errors or 404 responses
**Solution**: 
1. Make sure the backend is running on port 5000
2. Check that `frontend/.env` has `VITE_API_URL=http://localhost:5000/api`
3. Restart the frontend dev server

### Port already in use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`
**Solution**: 
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB connection issues

**Problem**: `MongoServerError: Authentication failed`
**Solution**: 
1. Check your MongoDB URI in `backend/.env`
2. For local MongoDB, use: `mongodb://localhost:27017/primetrade`
3. No authentication is needed for local development

## Default Configuration

### Backend (Port 5000)
- MongoDB: `mongodb://localhost:27017/primetrade`
- JWT Secret: (configured in .env)
- JWT Expiration: 7 days

### Frontend (Port 5173)
- API URL: `http://localhost:5000/api`
- Vite Dev Server: Hot Module Replacement enabled

## Next Steps

1. **Explore the Code**: Check out the well-organized project structure
2. **Read the Documentation**: See README.md for detailed information
3. **Review Scalability**: Read SCALABILITY.md for production deployment strategies
4. **Test the API**: Use the Postman collection to test all endpoints
5. **Customize**: Modify the code to add your own features

## Production Deployment

For production deployment instructions, see:
- `README.md` - Main documentation
- `SCALABILITY.md` - Scaling strategies
- `backend/README.md` - Backend-specific docs
- `frontend/README.md` - Frontend-specific docs

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages in the terminal
3. Check the browser console for frontend errors
4. Ensure all prerequisites are installed correctly

## Features to Try

✅ User Registration with validation
✅ User Login with JWT authentication
✅ Create, Read, Update, Delete tasks
✅ Search tasks by keywords
✅ Filter tasks by status and priority
✅ View task statistics
✅ Update user profile
✅ Responsive design (try on mobile)
✅ Dark theme with animations