import { validationResult } from 'express-validator';
import { ErrorResponse } from '../helpers/response.js';
import constants from '../../../config/constants.js';

export const validator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ErrorResponse(
      //constants.MESSAGES.INPUT_VALIDATION_ERROR,
      errors.array(),
      constants.RESPONSE_STATUS_CODES.BAD_REQUEST
    );
  }
  next();
};
