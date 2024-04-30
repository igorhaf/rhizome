"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
const dbConfig = config_1.default[process.env.NODE_ENV || 'development'];
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(`mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}?authSource=admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected...');
    }
    catch (err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(1);
    }
});
exports.default = connectDB;
