const mongoose = require('mongoose');

const schema = mongoose.Schema({
  details: String,
  position: Number,
});

module.exports = mongoose.model('TodoListItem', schema);
