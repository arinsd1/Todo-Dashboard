# Primetrade.ai Frontend

A modern, responsive React application with authentication and task management built with React, TailwindCSS, and Vite.

## Features

- ✅ Modern UI with TailwindCSS
- ✅ Glassmorphism and gradient effects
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ User authentication (login/register)
- ✅ Protected routes
- ✅ Task management (CRUD operations)
- ✅ Search and filter functionality
- ✅ Real-time statistics
- ✅ Profile management
- ✅ Form validation (client-side)
- ✅ Loading states and error handling
- ✅ Smooth animations and transitions

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: React Icons

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   └── ProtectedRoute.jsx
│   ├── context/         # React context providers
│   │   └── AuthContext.jsx
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── utils/          # Utility functions
│   │   └── api.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Dependencies
├── tailwind.config.js  # TailwindCSS config
├── postcss.config.js   # PostCSS config
└── vite.config.js      # Vite config
```

## Features Breakdown

### Authentication
- User registration with validation
- User login with JWT tokens
- Token persistence in localStorage
- Automatic token refresh
- Protected routes

### Dashboard
- Task statistics (total, pending, in-progress, completed)
- Create, read, update, delete tasks
- Search tasks by title/description
- Filter by status and priority
- Task tags
- Due date management
- Profile editing

### UI/UX
- Dark theme with gradient accents
- Glassmorphism effects
- Smooth animations
- Responsive design
- Loading states
- Error handling
- Form validation with visual feedback
- Password strength indicator

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
