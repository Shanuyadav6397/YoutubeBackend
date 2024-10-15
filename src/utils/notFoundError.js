import AppError from './appError.js';
class NotFoundError extends AppError {
    constructor(resource) {
        super(`Not abel to find ${resource}`, 404);
    }
}

export { NotFoundError };