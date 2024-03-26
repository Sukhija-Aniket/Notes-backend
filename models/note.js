const mongoose = require("mongoose");

const noteSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Note = mongoose.model('Notes', noteSchema);
module.exports = Note;