// src/database.ts
import mongoose from 'mongoose';


interface DBConfig {
    username: string;
    password: string;
    host: string;
    database: string;
}

interface Config {
    development: DBConfig;
    production: DBConfig;
}

import config from './config/config.json';

const dbConfig: DBConfig = config[process.env.NODE_ENV as keyof Config || 'development'];

const uri = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log(
            'MongoDB connected...');
    } catch (err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(1);
    }
};

export default connectDB;