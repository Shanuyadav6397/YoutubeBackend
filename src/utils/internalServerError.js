import AppError from './AppError.js';

class InternalServerError extends AppError{
    constructor(){
        super(`It's not you it's our server where something went wrong`);
    }
}

export {InternalServerError};