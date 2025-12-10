const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config(); // optional: use .env for MONGO_URI and PORT

const Task = require('./models/Task');
const Settings = require('./models/Settings');

const app = express();

// Simple request logger to debug routing
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(cors());
app.use(express.json());

// Use env vars if available
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todoDB';
const PORT = process.env.PORT || 5000;

// Connect
mongoose
  .connect(MONGO_URI)  // remove options object
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


/*
  ROUTES
*/

// Get all tasks with optional query params: ?completed=true&sortBy=createdAt&limit=50
app.get('/tasks', async (req, res) => {
  try {
    const filter = {};
    if (req.query.completed !== undefined) filter.completed = req.query.completed === 'true';
    if (req.query.reminder !== undefined) filter.reminder = req.query.reminder === 'true';

    let query = Task.find(filter);

    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      const order = req.query.order === 'desc' ? -1 : 1;
      query = query.sort({ [sortBy]: order });
    }

    if (req.query.limit) query = query.limit(parseInt(req.query.limit));

    const tasks = await query.exec();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single task
app.get('/tasks/:id', async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Task not found' });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task({
      text: (req.body.text || '').trim(),
      day: (req.body.day || '').trim(),
      reminder: req.body.reminder ?? false,
      completed: req.body.completed ?? false,
      points: req.body.points ?? 0,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Full update: update text/day/reminder/completed/points
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only update fields if present in body
    ['text','day','reminder','completed','points','dueDate'].forEach(field => {
  if (req.body[field] !== undefined) {
    if (field === "dueDate") {
      task.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
    } else {
      task[field] = req.body[field];
    }
  }
});


    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle reminder (keeps previous behaviour)
app.patch('/tasks/:id/reminder', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.reminder = !!req.body.reminder;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark complete (awards points only if not already completed)
app.patch('/tasks/:id/complete', async (req, res) => {
  try {
    const awardPoints = parseInt(req.body.awardPoints || 10, 10); // default 10
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!task.completed) {
      task.completed = true;
      task.points = (task.points || 0) + awardPoints;
      await task.save();
      return res.json({ task, awarded: awardPoints });
    } else {
      // If un-completing
      if (req.body.uncomplete === true) {
        task.completed = false;
        task.points = Math.max(0, (task.points || 0) - awardPoints);
        await task.save();
        return res.json({ task, deducted: awardPoints });
      }
      return res.json({ task, message: 'Task was already completed' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
  SETTINGS endpoints (store the app mode: minimal or engaging)
*/

// Ensure single settings doc exists
async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
    await settings.save();
  }
  return settings;
}

app.get('/settings', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/settings', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    if (req.body.appMode && ['minimal','engaging'].includes(req.body.appMode)) {
      settings.appMode = req.body.appMode;
    }
    if (req.body.gamificationEnabled !== undefined) {
      settings.gamificationEnabled = !!req.body.gamificationEnabled;
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Simple stats endpoint: total tasks, completed count, total points
app.get('/stats', async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ completed: true });
    const agg = await Task.aggregate([
      { $group: { _id: null, totalPoints: { $sum: '$points' } } }
    ]);
    const totalPoints = agg[0]?.totalPoints || 0;
    res.json({ total, completed, totalPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
  Serve frontend if built and placed in ../client/build (adjust path to your frontend build)
*/

/*
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));
app.get('*', (req, res, next) => {
  // serve index.html for front-end routes but avoid API routes
  if (req.path.startsWith('/api') || req.path.startsWith('/tasks') || req.path.startsWith('/settings') || req.path.startsWith('/stats')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), err => {
    if (err) next();
  });
});
*/

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
