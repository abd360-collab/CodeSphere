# Collaborative Code Editor

A real-time collaborative code editor with chat functionality built using the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Project Management**: Create and manage coding rooms with role-based access
- **Real-time Collaboration**: Live code editing using Monaco Editor and Socket.IO
- **Chat System**: Real-time messaging within projects
- **Role-based Permissions**: Owner, Editor, and Viewer roles with different access levels

## Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React with React Router
- Tailwind CSS for styling
- Monaco Editor for code editing
- Socket.IO client for real-time features
- React Toastify for notifications

## Project Structure

```
collaborative-code-editor/
├── backend/                 # Express server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── controllers/        # Route controllers
│   └── socket/             # Socket.IO handlers
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # React context
│   │   └── utils/          # Utility functions
└── package.json           # Root package.json with scripts
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Add your MongoDB connection string and JWT secret

4. Run the application:
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## Usage

1. Create an account or login
2. Create a new project or join an existing one
3. Start coding collaboratively with real-time sync
4. Use the chat feature to communicate with team members
5. Manage project members and their roles

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project

### Messages
- `GET /api/projects/:id/messages` - Get project messages
