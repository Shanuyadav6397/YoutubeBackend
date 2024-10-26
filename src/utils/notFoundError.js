import AppError from './AppError.js';
class NotFoundError extends AppError {
    constructor(resource) {
        super(`Not abel to find ${resource}`, 404);
    }
}

export { NotFoundError };