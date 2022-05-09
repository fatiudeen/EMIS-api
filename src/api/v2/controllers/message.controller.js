import requestService from '../services/request.service.js';
import { SuccessResponse } from '../helpers/response.js';
import mailService from '../services/mail.service.js';
import metadataService from '../services/metadata.Service.js';
import sendService from '../services/send.service.js';
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
  // let data =
  //   req.query.ref === 'sent'
  //     ? data2
  //     : req.params.ref === 'received'
  //     ? data1
  //     : { data1, data2 };
  try {
    let result = await requestService.getMyRequest(data1, data2);
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
    // let data =
    //   req.query.ref === 'sent'
    //     ? data2
    //     : req.params.ref === 'received'
    //     ? data1
    //     : { data1, data2 };
    let result = await mailService.getMyMail(data1, data2);
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
    data.type = req.query.type === 'mail' ? true : false;

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
    data.type = req.query.type === 'mail' ? true : false;

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
    data.type = req.query.type === 'mail' ? true : false;

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
    data.type = req.query.type === 'mail' ? true : false;

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

// personal messages
export const send = async (req, res, next) => {
  try {
    let data = {};
    let path = [];

    if (req.files != null) {
      req.files.map((file) => {
        path.push(file.path);
      });
    }
    data.to = req.body.to;
    data.from = req.user._id;
    data.message = {
      body: req.body.text,
      attachment: path,
    };
    let result = await sendService.create(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    let data = {};
    // let path = [];
    let to = [];

    to = req.body.to;
    data.to = to;
    data.from = req.user._id;

    data.alias = req.body.alias;
    let result = await sendService.createGroup(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const sendGroup = async (req, res, next) => {
  try {
    let data = {};
    let path = [];

    if (req.files != null) {
      req.files.map((file) => {
        path.push(file.path);
      });
    }

    data.from = req.user._id;
    data.message = {
      body: req.body.text,
      attachment: path,
    };

    let id = req.params.groupConvoId;
    let result = await sendService.sendGroup(data, id);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    let id = req.user._id;

    let result = await sendService.getConversations(id);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    let convoId = req.params.convoId;

    let result = await sendService.getMessages(convoId);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const renameGroup = async (req, res, next) => {
  try {
    let convoId = req.params.convoId;
    let alias = req.body.name;

    let result = await sendService.renameGroup(convoId, alias);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const addUserToGroup = async (req, res, next) => {
  try {
    let convoId = req.params.convoId;
    let userId = req.params.userId;

    let result = await sendService.addToGroup(convoId, userId);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const removeFromGroup = async (req, res, next) => {
  try {
    let convoId = req.params.convoId;
    let userId = req.body.userId;

    let result = await sendService.removeFromGroup(convoId, userId);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (req, res, next) => {
  try {
    let convoId = req.params.convoId;
    let userId = req.user._id;

    let result = await sendService.removeFromGroup(convoId, userId);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};
