export type AppError = Error & {
    status?: number;
};

export const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

export function createAppError(message: string, status?: number): AppError {
    const error = new Error(
        status ? `[APP_STATUS:${status}] ${message}` : message
    ) as AppError;

    error.status = status;

    return error;
}
