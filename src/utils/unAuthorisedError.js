import AppError from './AppError.js';
class UnAuthorisedError extends AppError {
    constructor() {
        super("User is not authorised properly", 401);
    }
}

export { UnAuthorisedError };