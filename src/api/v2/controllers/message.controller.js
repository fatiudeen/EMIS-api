import requestService from '../services/request.service.js';
import { SuccessResponse } from '../helpers/response.js';
import mailService from '../services/mail.service.js';
import metadataService from '../services/metadata.Service.js';
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
export const sendRequest = async (req, res, next) => {
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
  (data.title = req.body.title),
    (data.message = {
      body: req.body.text,
      attachment: path,
    });

  try {
    let result = await requestService.createRequest(data, req.user);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get one requests
export const getOneRequest = async (req, res, next) => {
  let id = req.params.requestId;
  try {
    let result = await requestService.getRequest({ _id: id });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get all requests
export const getAllRequests = async (req, res, next) => {
  let data1 = {};
  let data2 = {};
  if (req.user.role == 'Admin' || req.user.role == 'Registry') {
    data1.to = req.user.department;
    data2.from = req.user.department;
  } else {
    data1 = { 'metaData.forward': req.user._id, to: req.user.department };
    data2 = { 'metaData.forward': req.user._id, from: req.user.department };
  }
  let data =
    req.query.ref === 'sent'
      ? data2
      : req.params.ref === 'received'
      ? data1
      : { data1, data2 };
  try {
    let result = await requestService.getMyRequest(data);
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
export const sendMail = async (req, res, next) => {
  let data = {};
  let path = [];

  data.from = req.user._id;
  data.title = req.body.title;
  if (req.files != null) {
    req.files.map((file) => {
      path.push(file.path);
    });
  }
  data.message = {
    body: req.body.text,
    attachment: path,
  };
  data.to = req.body.to;
  try {
    let result = await mailService.createMail(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get one incoming mail
export const getOneMail = async (req, res, next) => {
  let id = req.params.mailId;
  try {
    let result = await mailService.getMail({ _id: id });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

// get all incoming mails
export const getAllMails = async (req, res, next) => {
  try {
    let data1 = { to: req.user._id };
    let data2 = { form: req.user._id };
    let data =
      req.query.ref === 'sent'
        ? data2
        : req.params.ref === 'received'
        ? data1
        : { data1, data2 };
    let result = await mailService.getMyMail(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const supportMail = async (req, res, next) => {
  let data = {};
  data.from = req.user._id;
  data.title = req.body.title;

  data.message = {
    body: req.body.text,
  };
  try {
    let result = await mailService.supportMail(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Logs returns the list of all the requests associated with a given department
 */

//LOGS

export const logs = async (req, res, next) => {
  try {
    let query = { 'metaData.status': 'Completed' };
    let result = await requestService.getAllRequests(query);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * metadata
 */

export const forwardRequest = async (req, res, next) => {
  try {
    let data = {};
    data.id = req.params.id;
    data.user = req.user;
    data.requestId = req.params.requestId;

    let result = await metadataService.forwardRequest(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const seen = async (req, res, next) => {
  try {
    let data = {};
    //data.id = req.params.id;
    data.user = req.user;
    data.requestId = req.params.requestId;

    let result = await metadataService.seen(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const minute = async (req, res, next) => {
  try {
    let data = {};
    data.comment = req.body.comment;
    data.user = req.user;
    data.requestId = req.params.requestId;
    let result = await metadataService.minute(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const status = async (req, res, next) => {
  try {
    let data = {};
    data.requestId = req.params.requestId;
    data.status = req.params.status;

    let result = await metadataService.status(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  try {
    let id = req.params.requestId;

    let result = await requestService.approveRequest(id);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};
