import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true },
        password: { type: String, required: true, minlength: 4, maxlength: 128 },
        score: { type: Number, required: true, min: 0, default: 0 },
    },
    { timestamps: true },
);

export const UserModel = model<IUser>('User', UserSchema, 'users');
