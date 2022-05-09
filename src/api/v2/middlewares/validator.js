import { validationResult } from 'express-validator';
import { ErrorResponse } from '../helpers/response.js';
import constants from '../../../config/constants.js';
import fs from 'fs';

export const validator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let error = errors.array();
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw new ErrorResponse(
            err,
            constants.RESPONSE_STATUS_CODES.BAD_REQUEST
          );
        }
      });
    }
    console.log(error);
    throw new ErrorResponse('Input Validation Error', 400);
  }
  next();
};
