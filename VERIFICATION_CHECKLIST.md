# Backend-Frontend Connection Verification Checklist

## ✅ Pre-Setup Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB installed locally OR MongoDB Atlas account ready
- [ ] Visual Studio Code with this workspace open
- [ ] Terminal access (PowerShell)

---

## ✅ Installation Checklist

- [ ] Run `npm run install-all` successfully
- [ ] No critical npm errors (warnings are OK)
- [ ] `client/node_modules` created
- [ ] `server/node_modules` created
- [ ] Root `node_modules` created with `concurrently`

---

## ✅ Configuration Checklist

- [ ] `client/.env.local` exists with:
  ```
  VITE_API_URL=http://localhost:5000
  ```

- [ ] `server/.env` exists with:
  ```
  MONGO_URI=mongodb://localhost:27017/todoDB
  PORT=5000
  ```

- [ ] MongoDB is running:
  - [ ] Local: `mongod` running in terminal
  - [ ] OR Atlas: Connection string updated in `server/.env`

---

## ✅ Code Verification Checklist

### Frontend Files
- [ ] `client/src/lib/api.ts` exists and contains:
  - [ ] `API_BASE_URL` configuration
  - [ ] `Task`, `Settings`, `Stats` TypeScript interfaces
  - [ ] `taskAPI` object with 7 methods
  - [ ] `settingsAPI` object
  - [ ] `statsAPI` object

- [ ] `client/src/hooks/use-api.ts` exists and contains:
  - [ ] `useGetTasks()` hook
  - [ ] `useCreateTask()` hook
  - [ ] `useUpdateTask()` hook
  - [ ] `useCompleteTask()` hook
  - [ ] `useDeleteTask()` hook
  - [ ] `useToggleReminder()` hook
  - [ ] `useGetSettings()` hook
  - [ ] `useUpdateSettings()` hook
  - [ ] `useGetStats()` hook

- [ ] `client/src/contexts/GameContext.jsx` updated:
  - [ ] Imports API hooks at top
  - [ ] Calls `useGetTasks()` hook
  - [ ] Calls `useGetStats()` hook
  - [ ] `addTask()` uses mutation
  - [ ] `updateTask()` uses mutation
  - [ ] `completeTask()` uses mutation
  - [ ] `deleteTask()` uses mutation
  - [ ] `toggleTaskReminder()` function exists

### Backend Files
- [ ] `server/server.js` has all endpoints working
- [ ] `server/.env` configured with MongoDB URI
- [ ] `server/models/Task.js` has correct schema
- [ ] `server/models/Settings.js` exists

### Root Files
- [ ] `package.json` has npm scripts:
  - [ ] `npm run dev` command
  - [ ] `npm run server` command
  - [ ] `npm run client` command
  - [ ] `npm run install-all` command
- [ ] `concurrently` is in devDependencies

---

## ✅ Runtime Checklist

### Starting the Application

1. **Start MongoDB**
   ```powershell
   mongod
   ```
   - [ ] MongoDB service starts successfully
   - [ ] See "waiting for connections" message

2. **Start Both Servers**
   ```powershell
   cd C:\Users\HP\OneDrive\Desktop\WEB-OEL\OEL_TO-DO
   npm run dev
   ```
   - [ ] Frontend server starts: "http://localhost:5173"
   - [ ] Backend server starts: "Server running on port 5000"
   - [ ] No errors in console

3. **Open Frontend**
   - [ ] Navigate to http://localhost:5173 in browser
   - [ ] App loads without errors
   - [ ] Header renders
   - [ ] Task input visible
   - [ ] Task list visible

---

## ✅ Functional Verification Checklist

### Creating a Task
1. [ ] Open http://localhost:5173
2. [ ] Open DevTools (F12) → Network tab
3. [ ] Type "Test task" in task input
4. [ ] Click "Add Task" button
5. [ ] Verify:
   - [ ] Network request shows: `POST http://localhost:5000/tasks`
   - [ ] Response status: 201
   - [ ] Task appears in UI immediately
   - [ ] Console has no errors

### Completing a Task
1. [ ] Click the checkbox on a task
2. [ ] Verify:
   - [ ] Network request shows: `PATCH http://localhost:5000/tasks/{id}/complete`
   - [ ] Task marked as complete in UI
   - [ ] Strikethrough applied to task text
   - [ ] Toast notification shows (optional)

### Deleting a Task
1. [ ] Hover over a task
2. [ ] Click trash icon
3. [ ] Verify:
   - [ ] Network request shows: `DELETE http://localhost:5000/tasks/{id}`
   - [ ] Task removed from UI
   - [ ] Completed task count updates

### Checking Data Persistence
1. [ ] Complete the above actions (create 2-3 tasks)
2. [ ] Refresh the page (F5)
3. [ ] Verify:
   - [ ] Tasks still visible after refresh
   - [ ] Completed status preserved
   - [ ] No tasks re-fetched message in console

### Checking Statistics
1. [ ] With several tasks created:
2. [ ] Look for XP/Level display in Header
3. [ ] Verify:
   - [ ] Completes a task
   - [ ] XP value increases
   - [ ] Level calculation is correct

---

## ✅ API Connection Verification Checklist

### Network Requests
Using DevTools Network tab:

- [ ] POST /tasks - Create task (Status: 201)
- [ ] GET /tasks - Fetch all tasks (Status: 200)
- [ ] PUT /tasks/{id} - Update task (Status: 200)
- [ ] PATCH /tasks/{id}/complete - Complete task (Status: 200)
- [ ] PATCH /tasks/{id}/reminder - Toggle reminder (Status: 200)
- [ ] DELETE /tasks/{id} - Delete task (Status: 200)
- [ ] GET /stats - Fetch statistics (Status: 200)

### Response Data
Each response should include:
- [ ] Task objects have `_id` property
- [ ] Task objects have `text`, `completed`, `points`
- [ ] Stats response has `total`, `completed`, `totalPoints`
- [ ] Responses are valid JSON

### Console Logs
- [ ] No 404 errors
- [ ] No 500 server errors
- [ ] No CORS errors
- [ ] No "Cannot POST /tasks" errors

---

## ✅ Error Handling Checklist

### If MongoDB Connection Fails
1. [ ] Error message in server console
2. [ ] Frontend shows loading or blank state
3. [ ] Check `MONGO_URI` in `server/.env`
4. [ ] Ensure MongoDB is running (`mongod`)

### If API Requests Fail
1. [ ] Check backend server is running on port 5000
2. [ ] Check `VITE_API_URL` in `client/.env.local`
3. [ ] Check browser console for network errors
4. [ ] Check server console for error messages

### If Port Already in Use
1. [ ] Change `PORT=5000` to different port in `server/.env`
2. [ ] Or kill process using port:
   ```powershell
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

---

## ✅ Final Verification

- [ ] All checkboxes above are checked
- [ ] No critical errors in console
- [ ] Can create tasks and they persist
- [ ] Can complete tasks
- [ ] Can delete tasks
- [ ] Stats update when tasks complete
- [ ] Page refresh preserves all data

---

## 🎉 Success Criteria

Your backend-frontend connection is successful when:

✅ Tasks created in UI appear in MongoDB  
✅ Tasks can be edited and changes persist  
✅ Tasks can be completed with XP awarded  
✅ Tasks can be deleted  
✅ Page refresh shows all data intact  
✅ No console errors or warnings (except 3rd party)  
✅ All Network requests succeed (200-201 status codes)  

---

## 📞 Support

If something isn't working:

1. **Check the logs**
   - Terminal where backend is running
   - Browser DevTools Console
   - Browser DevTools Network tab

2. **Verify configuration**
   - Is MongoDB running?
   - Is VITE_API_URL correct?
   - Is MONGO_URI correct?
   - Are ports 5000 and 5173 available?

3. **Check the files**
   - Does `client/.env.local` exist?
   - Does `server/.env` exist?
   - Are all new files present?

4. **Restart**
   - Stop both servers
   - Stop MongoDB
   - Clear browser cache
   - Start again

---

**Good luck! 🚀**
