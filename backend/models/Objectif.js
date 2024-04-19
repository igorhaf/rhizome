const mongoose = require('mongoose');

const ObjectifSchema = new mongoose.Schema({
    objectName: String,
    conditionals: [{
        variable: String,
        comparison: String,
        value: String
    }],
    complexConditional: String,
    localLog: Boolean,
    globalLog: Boolean,
    alertEmails: [String]
});

module.exports = mongoose.model('Objectif', ObjectifSchema);
