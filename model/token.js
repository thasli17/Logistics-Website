const mongoose = require('mongoose')

const resetTokenSchema = new mongoose.Schema({
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
    },
    token: String,
    expiresAt: Date,
  });
  
  const ResetToken = mongoose.model('ResetToken', resetTokenSchema);
  module.exports = ResetToken
  