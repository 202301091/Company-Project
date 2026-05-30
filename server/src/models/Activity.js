import mongoose from 'mongoose';
const ActivitySchema = new mongoose.Schema({
  type: {
    type: String, // 'join', 'leave', 'reaction', 'drag', 'counter', 'vote', 'music', 'theme'
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
export default Activity;