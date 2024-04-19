const mongoose = require('mongoose');

const tabSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: Number, required: true, default: 0 },
    status: { type: String, default: 'open' }  // Assuming status can be 'open', 'closed', etc.
});

module.exports = mongoose.model('Tab', tabSchema);
