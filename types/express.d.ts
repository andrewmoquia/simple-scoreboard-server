import { Server } from 'socket.io';

type UserPayload = {
    id: string;
    username: string;
};

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
            io?: Server;
        }
    }
}
