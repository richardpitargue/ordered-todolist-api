const mongoose = require('mongoose');

const schema = mongoose.Schema({
  collectionName: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  currentSequence: Number,
});

const model = mongoose.model('Counter', schema);

model.createIndexes();

module.exports = model;
