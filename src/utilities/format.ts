import type { Response } from 'express';

export type ApiResponseError = {
    message: string;
};

export type ApiResponseSuccess = {
    message: string;
    data: Record<string, unknown>;
};

export const formatApiResponse = {
    internalServerError: (res: Response, { message }: ApiResponseError) => {
        return res.status(500).json({
            status: false,
            message,
            data: null,
        });
    },
    ok: (res: Response, { message, data }: ApiResponseSuccess) => {
        return res.status(200).json({
            status: true,
            message,
            data,
        });
    },
    notFound: (res: Response, { message }: ApiResponseError) => {
        return res.status(404).json({
            status: false,
            message,
            data: null,
        });
    },
    badRequest: (res: Response, { message }: ApiResponseError) => {
        return res.status(400).json({
            status: false,
            message,
            data: null,
        });
    },
    unauthorized: (res: Response, { message }: ApiResponseError) => {
        return res.status(401).json({
            status: false,
            message,
            data: null,
        });
    },
};
