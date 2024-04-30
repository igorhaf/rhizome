"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Objectif.ts
const mongoose_1 = require("mongoose");
const ObjectifSchema = new mongoose_1.Schema({
    objectName: { type: String, default: '' },
    conditionals: [{
            variable: { type: String, default: '' },
            comparison: { type: String, default: '' },
            value: { type: String, default: '' }
        }],
    complexConditional: { type: String, default: '' },
    localLog: { type: Boolean, default: false },
    globalLog: { type: Boolean, default: false },
    alertEmails: [{ type: String }]
});
const Objectif = (0, mongoose_1.model)('Objectif', ObjectifSchema);
exports.default = Objectif;
