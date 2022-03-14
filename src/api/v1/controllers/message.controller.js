import requestService from '../services/request.service.js';
import { SuccessResponse } from '../helpers/response.js';
import mailService from '../services/mail.service.js';
/**
 * there a to types of messages
 *
 * requests: are messages sent on a departmental level, includes file dispatch and other
 * departmental requests
 *
 * mails: are messages sent from one user to another
 */

/**
 * REQUESTS
 */

//post requests
export const sendRequest = (req, res, next) => {
  let data = {};
  let path = [];

  if (req.files != null) {
    req.files.map((file) => {
      path.push(file.path);
    });
  }
  data.to = req.body.to;
  data.from = req.user.department;
  data.reference = req.body.reference;
  data.message = {
    title: req.body.title,
    message: { body: req.body.text, attachment: path },
  };

  try {
    let result = requestService.createRequest(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get one requests
export const getOneRequest = (req, res, next) => {
  let id = req.pramas.requestId;
  try {
    let result = requestService.getRequest(id);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get all requests
export const getAllRequests = async (req, res, next) => {
  try {
    let result = requestService.getAllRequests({ to: req.user.department });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * MAILS
 *
 * in addition, mails can only be sent to members of the same department
 */

//post outgoing mail
export const sendMail = (req, res) => {
  let data = {};
  let path = [];

  if (req.files != null) {
    req.files.map((file) => {
      path.push(file.path);
    });
  }
  data.from = req.user._id;
  data.to = req.body.to;
  data.message = {
    title: req.body.title,
    message: { body: req.body.text, attachment: path },
  };
  try {
    let result = mailService.createMail(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get one incoming mail
export const getOneMail = async (req, res, next) => {
  let id = req.pramas.mailId;
  try {
    let result = mailService.getMail(id);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

// get all incoming mails
export const getAllMails = (req, res, next) => {
  try {
    let result = mailService.getAllMails({ to: req.user._id });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Logs returns the list of all the requests associated with a given department
 */

//LOGS

export const logs = (req, res, next) => {
  try {
    let result = requestService.getAllRequests({});
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};
