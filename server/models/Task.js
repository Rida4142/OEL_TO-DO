const mongoose = require('mongoose'); 

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  day: {
    type: String,
    default: ''
  },
  reminder: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 0
  },

  // NEW FIELD → Stores selected date + time
  dueDate: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
