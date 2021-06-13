const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
  worker_id: { type: String,  required: true }
});

module.exports = mongoose.model('registy_worker', WorkerSchema);
