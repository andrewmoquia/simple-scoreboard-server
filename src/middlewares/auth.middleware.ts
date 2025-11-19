import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { config } from '../config';
import { formatApiResponse } from '../utilities/format';

interface UserPayload extends JwtPayload {
    id: string;
    username: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return formatApiResponse.unauthorized(res, { message: 'Invalid token!' });

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
        req.user = decoded;
        return next();
    } catch (error) {
        const ex = error as Error;
        return formatApiResponse.internalServerError(res, {
            message: ex.message || 'Internal server error!',
        });
    }
};
