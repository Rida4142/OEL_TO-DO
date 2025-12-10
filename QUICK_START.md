# Quick Start Guide - Frontend & Backend Connection

## ✅ What Was Done

Your application now has full frontend-backend integration with:

1. **REST API Service Layer** (`client/src/lib/api.ts`)
   - All backend endpoints wrapped in clean functions
   - TypeScript types for tasks, settings, and stats
   - Centralized API configuration

2. **React Query Hooks** (`client/src/hooks/use-api.ts`)
   - `useGetTasks()` - Fetch tasks
   - `useCreateTask()` - Create new tasks
   - `useUpdateTask()` - Edit tasks
   - `useCompleteTask()` - Mark tasks complete
   - `useDeleteTask()` - Remove tasks
   - `useToggleReminder()` - Toggle reminders
   - `useGetStats()` - Get statistics

3. **Updated GameContext** (`client/src/contexts/GameContext.jsx`)
   - Now uses API hooks instead of local state only
   - Syncs tasks with MongoDB
   - Calculates XP/Level from backend stats
   - All actions (add/edit/delete) persist to database

4. **Environment Configuration**
   - `client/.env.local` - Frontend API URL
   - `server/.env` - Backend MongoDB and port settings

5. **NPM Scripts**
   - `npm run dev` - Run both servers together
   - `npm run server` - Run backend only
   - `npm run client` - Run frontend only
   - `npm run install-all` - Install all dependencies

## 🚀 To Get Started

### Step 1: Install Dependencies
```powershell
cd "C:\Users\HP\OneDrive\Desktop\WEB-OEL\OEL_TO-DO"
npm run install-all
```

### Step 2: Start MongoDB
MongoDB must be running locally or use MongoDB Atlas. If local:
```powershell
mongod
```

### Step 3: Run Both Servers
```powershell
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## 🔄 How Data Flows

```
User adds task in Frontend
        ↓
TaskInput calls addTask()
        ↓
GameContext addTask mutation runs
        ↓
API POST request to http://localhost:5000/tasks
        ↓
Backend Express receives request
        ↓
Saves to MongoDB database
        ↓
Returns saved task with _id
        ↓
React Query updates cache
        ↓
Frontend state syncs with new task
        ↓
UI re-renders with new task
```

## 📋 Files Created/Modified

### New Files:
- `client/src/lib/api.ts` - API service
- `client/src/hooks/use-api.ts` - React Query hooks
- `client/.env.local` - Frontend environment
- `server/.env` - Backend environment
- `BACKEND_FRONTEND_SETUP.md` - Detailed documentation
- `QUICK_START.md` - This file

### Modified Files:
- `client/src/contexts/GameContext.jsx` - Now integrated with API
- `package.json` - Added dev scripts and concurrently

## 🔌 Testing the Connection

1. Open http://localhost:5173 in browser
2. Open DevTools (F12) → Network tab
3. Add a new task
4. You should see a POST request to `http://localhost:5000/tasks` ✅
5. Complete a task
6. You should see a PATCH request to `http://localhost:5000/tasks/:id/complete` ✅

## ⚙️ Configuration

**Change MongoDB Connection:**
Edit `server/.env`:
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/todoDB
```

**Change API URL:**
Edit `client/.env.local`:
```
VITE_API_URL=http://your-backend-url.com
```

## 📚 Architecture

```
┌─────────────────────────────────────┐
│       React Frontend                │
│  http://localhost:5173              │
├─────────────────────────────────────┤
│ Components (TaskCard, TaskList)     │
│         ↓                           │
│ GameContext (useGame hook)          │
│         ↓                           │
│ API Hooks (useGetTasks, etc)       │
│         ↓                           │
│ React Query (caching + syncing)    │
│         ↓                           │
│ API Service (api.ts)               │
└─────────────┬───────────────────────┘
              │ HTTP REST
              ↓
┌─────────────────────────────────────┐
│  Express Backend                    │
│  http://localhost:5000              │
├─────────────────────────────────────┤
│ Routes (/tasks, /settings, /stats) │
│         ↓                           │
│ Mongoose Models (Task, Settings)   │
│         ↓                           │
│ MongoDB Database                   │
│ (todoDB)                           │
└─────────────────────────────────────┘
```

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to database" | Make sure MongoDB is running (`mongod` or check service) |
| "Network error in browser" | Check backend is running on port 5000 and VITE_API_URL is correct |
| "Port 5000 already in use" | Change PORT in `server/.env` |
| "Port 5173 already in use" | Vite will auto-increment port or change in `client/vite.config.js` |
| Tasks not persisting | Check MongoDB connection and server console for errors |

## 📖 Next Steps

1. **Test the app** - Add, complete, and delete tasks
2. **Check browser console** - Look for any errors
3. **Check server logs** - Terminal should show requests
4. **Add more features** - The API is ready for new endpoints
5. **Deploy** - See `BACKEND_FRONTEND_SETUP.md` for deployment instructions

## 💡 Tips

- React Query automatically caches and invalidates data
- All API calls show toast notifications for feedback
- Loading states are available via `isLoading` in hooks
- Errors are handled gracefully with error messages
- Network requests are visible in browser DevTools

---

**Ready to go!** Your frontend and backend are fully connected and synced. 🎉
