import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import { UserPayload } from 'types/express';

import * as userService from '../services/user.service';
import { formatApiResponse } from '../utilities/format';
import { config } from '../config';
import { UserModel } from '../models/user.model';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const user = await userService.findUserInDB(username);

        if (user) {
            return formatApiResponse.notFound(res, { message: 'Username already exist!' });
        }

        await userService.createUserInDB(req, res);

        return await userService.updateLiveScoreboard(req);
    } catch (error) {
        const ex = error as Error;
        return formatApiResponse.internalServerError(res, {
            message: ex.message || 'Internal server error!',
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const user = await userService.findUserInDB(username);
        if (!user) {
            return formatApiResponse.notFound(res, { message: 'Invalid username or password!' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return formatApiResponse.badRequest(res, { message: 'Invalid username or password!' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, config.jwtSecret, {
            expiresIn: '24h',
        });

        return formatApiResponse.ok(res, {
            message: 'User successfully logged in.',
            data: { token },
        });
    } catch (error) {
        const ex = error as Error;
        return formatApiResponse.internalServerError(res, {
            message: ex.message || 'Internal server error!',
        });
    }
};

export const updateUserScore = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user as unknown as UserPayload;

        if (!userPayload) {
            return formatApiResponse.unauthorized(res, { message: 'User is not authenticated!' });
        }

        const increment = 1;
        const user = await UserModel.findOne({ username: userPayload.username });

        if (!user) {
            return formatApiResponse.notFound(res, { message: 'User not found!' });
        }

        user.score += increment;

        await user.save();

        await userService.updateLiveScoreboard(req);

        return formatApiResponse.ok(res, {
            message: 'Score updated!',
            data: { score: user.score },
        });
    } catch (error) {
        const ex = error as Error;
        return formatApiResponse.internalServerError(res, {
            message: ex.message || 'Internal server error!',
        });
    }
};
