import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { formatApiResponse } from '../utilities/format';
import { UserModel } from '../models/user.model';

export type UserData = {
    _id: string;
    username: string;
    password: string;
    score: number;
};

export type FindUserResult = UserData | null;

export const createUserInDB = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({ username, password: hashed });

        return formatApiResponse.ok(res, {
            message: 'User successfully registered.',
            data: newUser as unknown as Record<string, unknown>,
        });
    } catch (error) {
        const ex = error as Error;
        return formatApiResponse.internalServerError(res, {
            message: ex.message || 'Internal server error',
        });
    }
};

export const findUserInDB = async (username: string): Promise<FindUserResult> => {
    const user = await UserModel.findOne({ username });
    return user
        ? {
              _id: user._id.toString(),
              username: user.username,
              score: user.score,
              password: user.password,
          }
        : null;
};

export const updateLiveScoreboard = async (req: Request) => {
    if (!req.io) {
        console.warn('Socket.IO server not initialized; cannot emit scoreboard');
        return;
    }

    const top10 = await UserModel.find().sort({ score: -1 }).limit(10).select('username score');

    req.io.emit('scoreboardUpdate', top10);
};
