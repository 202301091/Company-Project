import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    default: null,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
