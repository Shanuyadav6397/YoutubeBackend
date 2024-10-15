import AppError from './appError.js';
class BadRequestError extends AppError{
    constructor(invalidParms,){
        let message = '';
        invalidParms.forEach(Parms => message += `${Parms}\n`);

        super(`The request has the following invalid parameters \n ${invalidParms}`, 401);
    }
}

export  {BadRequestError};