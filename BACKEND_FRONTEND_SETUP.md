# Frontend-Backend Connection Setup

Your backend and frontend are now connected! Here's what has been set up:

## 📁 Project Structure

- **Backend (Express + MongoDB)**: `./server/` - API server running on port 5000
- **Frontend (React + Vite)**: `./client/` - React app running on port 5173
- **Connection**: Frontend communicates with backend via REST API

## 🔧 How It Works

### Backend (server/server.js)
The Express server provides these REST API endpoints:
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get a specific task
- `PUT /tasks/:id` - Update a task
- `PATCH /tasks/:id/complete` - Mark task as complete
- `PATCH /tasks/:id/reminder` - Toggle reminder
- `DELETE /tasks/:id` - Delete a task
- `GET /settings` - Get app settings
- `PUT /settings` - Update settings
- `GET /stats` - Get statistics

### Frontend (client/src/)
New files created for API integration:
- **`lib/api.ts`** - API service functions and TypeScript types
- **`hooks/use-api.ts`** - React Query hooks for all API calls
- **`contexts/GameContext.jsx`** - Updated to use API hooks and sync with backend

## 🚀 Getting Started

### 1. Install Dependencies

From the root directory:
```powershell
npm run install-all
```

This will install dependencies for both the root, client, and server.

### 2. Start MongoDB

Make sure MongoDB is running locally:
```powershell
# Windows - if installed as service
net start MongoDB

# Or start manually
mongod
```

Or use MongoDB Atlas cloud:
- Update `server/.env` with your MongoDB URI

### 3. Run Both Servers

From the root directory:
```powershell
npm run dev
```

This runs both servers concurrently:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Alternative: Run Servers Separately

**Terminal 1 - Backend:**
```powershell
cd server
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

## 📋 Task Management Flow

1. **User adds a task** via the frontend UI
2. **Frontend** sends POST request to `http://localhost:5000/tasks`
3. **Backend** saves task to MongoDB
4. **Backend** returns saved task with MongoDB `_id`
5. **Frontend** updates local state with response
6. **UI** displays the new task
7. User can complete, edit, or delete tasks
8. All changes sync with the backend database

## 🎮 Gamification Features

The app tracks:
- **Total tasks completed** → Used to calculate level and XP
- **Points earned** → Calculated from completed tasks
- **Badges unlocked** → Based on achievements
- **Current level & XP** → Displayed in the Header

All data is stored in MongoDB and synced in real-time.

## 🔌 Configuration

### Frontend Environment Variables
File: `client/.env.local`
```
VITE_API_URL=http://localhost:5000
```

### Backend Environment Variables
File: `server/.env`
```
MONGO_URI=mongodb://localhost:27017/todoDB
PORT=5000
```

## ✅ Testing the Connection

1. Open http://localhost:5173 in your browser
2. Open browser DevTools → Network tab
3. Add a new task
4. You should see a POST request to `http://localhost:5000/tasks`
5. Complete a task
6. You should see a PATCH request to `http://localhost:5000/tasks/:id/complete`

## 🛠️ Troubleshooting

**MongoDB Connection Error?**
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `server/.env`

**API Connection Error?**
- Check backend is running on port 5000
- Check `VITE_API_URL` in `client/.env.local`
- Look at browser console and server logs for errors

**Port Already in Use?**
- Change `PORT` in `server/.env` or Vite config in `client/vite.config.js`

## 📦 Dependencies

**New packages installed:**
- **React Query** (`@tanstack/react-query`) - For server state management
- **Concurrently** - For running multiple npm scripts together

## 🚀 Next Steps

- Deploy backend to a server (e.g., Heroku, Railway)
- Update `VITE_API_URL` for production
- Build frontend: `npm run build`
- Deploy frontend to hosting (e.g., Vercel, Netlify)
