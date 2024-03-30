const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
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

const Note = mongoose.model('Notes', NoteSchema);
module.exports = Note;