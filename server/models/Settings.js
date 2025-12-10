const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  appMode: {
    type: String,
    enum: ['minimal', 'engaging'],
    default: 'minimal'
  },
  // optional future settings
  gamificationEnabled: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
