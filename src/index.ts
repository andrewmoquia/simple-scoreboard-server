import http from 'node:http';
import path from 'node:path';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import express from 'express';

import { connect } from './database';
import { config } from './config';
import userRouter from './routers/user.router';

const __dirname = path.dirname(__filename);
const port = config.port || 8181;

const startServer = async () => {
    await connect();

    const app = express();

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: false,
        },
    });

    app.set('trust-proxy', 1);

    app.use(cors({ origin: '*', credentials: true }));

    app.use(express.json());

    app.use(express.urlencoded({ extended: false }));

    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'script-src': ["'self'", 'https://cdn.socket.io'],
                    'script-src-elem': ["'self'", 'https://cdn.socket.io', "'unsafe-inline'"],
                    'connect-src': [
                        "'self'",
                        'ws://localhost:8181',
                        'http://localhost:8181',
                        'https://cdn.socket.io',
                    ],
                },
            },
        }),
    );

    app.use(morgan('dev'));

    // Serve static files
    app.use(express.static(path.join(__dirname, '../public')));

    // Attach io to req
    app.use((req, res, next) => {
        req.io = io;
        next();
    });

    // Routers
    app.use('/user', userRouter);

    // Socket.IO connection
    io.on('connection', (socket) => {
        console.log('🚀 User connected: ', socket.id);

        socket.on('disconnect', (reason) => {
            console.log('❌ User disconnected:', socket.id, 'reason:', reason);
        });
    });

    io.engine.on('connection_error', (err) => {
        console.log('❌ Socket.IO CORS error:', err.req.headers.origin);
    });

    // Use server.listen for Socket.IO to work properly
    server.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
    });
};

startServer();
