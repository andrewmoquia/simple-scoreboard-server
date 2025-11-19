import mongoose from 'mongoose';

import { config } from './config';

export const connect = async () => {
    try {
        const db = await mongoose.connect(config.mongoURI, {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`✅ Database '${db.connection.name}' connected.`);

        mongoose.connection.on('error', (err) => console.error(`MongoDB connection error: ${err}`));
        mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB disconnected.'));

        return db;
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};
