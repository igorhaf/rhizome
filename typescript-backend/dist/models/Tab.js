"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tabSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    position: { type: Number, required: true, default: 0 },
    status: { type: String, default: 'open' }
});
const Tab = (0, mongoose_1.model)('Tab', tabSchema);
exports.default = Tab;
