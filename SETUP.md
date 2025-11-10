# Collaborative Code Editor - Setup Guide

This guide will help you set up and run the collaborative code editor application.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (running locally or MongoDB Atlas connection)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Install root dependencies (concurrently for running both servers)
npm install

# Install all dependencies (frontend + backend)
npm run install-all
```

### 2. Environment Setup

#### Backend Environment Variables

1. Copy the environment example file:
   ```bash
   cd backend
   cp env.example .env
   ```

2. Edit the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/collaborative-code-editor
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   NODE_ENV=development
   ```

   **Important:** 
   - Replace `your-super-secret-jwt-key-here-make-it-long-and-random` with a strong, random secret key
   - If using MongoDB Atlas, replace the `MONGODB_URI` with your Atlas connection string
   - If MongoDB is running on a different port, update the URI accordingly

### 3. Database Setup

#### Local MongoDB
If you're using a local MongoDB installation:

1. Make sure MongoDB is running:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Ubuntu/Debian
   sudo systemctl start mongod

   # On Windows
   net start MongoDB
   ```

2. The application will automatically create the database and collections when you first run it.

#### MongoDB Atlas (Cloud)
If you're using MongoDB Atlas:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update the `MONGODB_URI` in your `.env` file
4. Make sure to whitelist your IP address in Atlas

### 4. Running the Application

#### Development Mode (Recommended)
Run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Running Separately
If you prefer to run them separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### 5. Access the Application

1. Open your browser and go to `http://localhost:3000`
2. Create a new account or login
3. Start creating collaborative coding projects!

## Features Overview

### 🔐 User Authentication
- Sign up with username, email, and password
- Secure login with JWT tokens
- Password hashing with bcrypt

### 📁 Project Management
- Create coding projects with different programming languages
- Invite team members with different roles
- Role-based permissions (Owner, Editor, Viewer)

### 👥 Real-time Collaboration
- Live code editing with Monaco Editor
- Real-time cursor position sharing
- Auto-save functionality
- Multiple users can edit simultaneously

### 💬 Chat System
- Real-time messaging within projects
- Message history persistence
- Typing indicators
- Role-based chat permissions

### 🎯 Role Permissions
- **Owner**: Full access - edit code, manage members, delete project
- **Editor**: Can edit code and send messages
- **Viewer**: Read-only access - can only view code and read messages

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
- `PUT /api/projects/:id/members/:userId/role` - Update member role

### Messages
- `GET /api/messages/:id` - Get project messages
- `POST /api/messages/:id` - Send message to project

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify network access if using Atlas

2. **Port Already in Use**
   - Change the PORT in backend `.env` file
   - Kill processes using ports 3000 or 5000

3. **Socket.IO Connection Issues**
   - Check that both frontend and backend are running
   - Verify CORS settings in backend
   - Check browser console for errors

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend `.env`
   - Verify token expiration settings

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reloading in development
2. **Logs**: Check console logs for debugging information
3. **Database**: Use MongoDB Compass or similar tools to inspect your database
4. **Network**: Use browser dev tools to monitor WebSocket connections

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend `.env`
2. Build the frontend: `cd frontend && npm run build`
3. Serve the built files with your backend
4. Use a process manager like PM2 for the backend
5. Set up proper SSL certificates
6. Configure environment variables securely

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that MongoDB is accessible

Happy coding! 🚀
