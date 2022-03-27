import { User as user } from '../models/user.js';
import { request as _request, mail } from '../models/messages.js';
import { Department } from '../models/dept.js';
import ErrorResponse from '../helpers/ErrorResponse.js';
import mongoose from 'mongoose';

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

  data.from = req.user.department;
  data.reference = req.body.reference;
  (data.title = req.body.title),
    (data.message = {
      body: req.body.text,
      attachment: path,
    });

  // console.log(data.message.attachment)
  _request
    .findOne({ reference: data.reference })
    .then((doc) => {
      if (doc) {
        throw new ErrorResponse('Request Exists', 409);
      }
      Department.findOne({ abbr: req.body.to })
        .then((doc) => {
          data.to = doc._id;
          if (!doc) {
            throw new ErrorResponse('Invalid Department', 404);
          }

          _request
            .create(data)
            .then((doc) => {
              res.status(201).json({ success: true, doc });
            })
            .catch((err) => {
              next(err);
            });
        })
        .catch((err) => {
          next(err);
        });

      if (data.to === data.from) {
        throw new ErrorResponse(
          'Forbbidden: cannot select this Department',
          403
        );
      }
    })
    .catch((err) => {
      next(err);
    });
};

//get one requests
export const getOneRequest = (req, res, next) => {
  _request
    .findOne({ _id: req.params.requestId })
    .populate({ path: 'from to', seleect: 'name abbr' })
    .exec((err, doc) => {
      if (err) {
        return next(new ErrorResponse(err.message));
      }
      res.status(201).json({ success: true, doc });
    });
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
  _request
    .find()
    .or([data1, data2])
    .populate({ path: 'from', select: 'name abbr' })
    //.select(['from', 'message.date', 'message.title', 'reference'])
    .then((doc) => {
      res.status(201).json({ success: true, doc });
    })
    .catch((err) => {
      return next(new ErrorResponse(err.message));
    });
};

export const forwardRequest = async (req, res, next) => {
  try {
    let _user = await user.find({ _id: req.params.id });
    let _req = await _request.findById(req.params.requestId);
    let file;
    const time = Date.now();

    if (!_user || !_req) {
      throw new ErrorResponse('user or dept error', 404);
    }
    let reg = _req.metaData.seen.find((val) => {
      return val.by.toString() == req.user._id.toString();
    });
    if (req.user.role == 'Registry' && reg == undefined) {
      _req.metaData.seen.push({
        by: req.user._id,
        date: time,
        read: true,
      });
    }
    let result = _req.metaData.seen.find((val) => {
      return val.by.toString() == req.params.id;
    });
    if (result == undefined) {
      _req.metaData.seen.push({
        by: req.params.id,
        date: time,
        read: false,
      });
      _req.metaData.forward.push(mongoose.Types.ObjectId(req.params.id));

      file = await _req.save();
    }
    res.status(201).json({ success: true, file });
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
export const sendMail = async (req, res) => {
  let data = {};
  data.from = req.user._id;
  data.title = req.body.title;
  let path = [];
  if (req.files != null) {
    req.files.map((file) => {
      path.push(file.path);
    });
  }
  data.message = {
    body: req.body.text,
    attachment: path,
  };
  user
    .findOne({ username: req.body.to })
    .then((doc) => {
      data.to = doc._id;
      if (!doc && doc.department != req.user.department) {
        throw new ErrorResponse('select a valid user in your department', 400);
      }

      mail
        .create(data)
        .then((file) => {
          res.status(201).json({ success: true, file });
        })
        .catch((err) => {
          return next(new ErrorResponse(err.message));
        });
    })

    .catch((err) => {
      next(err);
    });
};

//get one incoming mail
export const getOneMail = async (req, res, next) => {
  mail
    .findOne({ _id: req.params.mailId })
    .populate({ path: 'from to', seleect: 'name abbr' })
    .exec((err, doc) => {
      if (err) {
        return next(new ErrorResponse(err.message));
      }
      res.status(201).json({ success: true, doc });
    });
};

// get all incoming mails
export const getAllMails = (req, res, next) => {
  mail
    .find()
    .or([{ to: req.user._id }, { from: req.user._id }])
    .populate({ path: 'from', seleect: 'name username' })
    .exec((err, doc) => {
      if (err) {
        return next(new ErrorResponse(err.message));
      } else {
        res.status(201).json({ success: true, doc });
      }
    });
};

/**
 * Logs returns the list of all the requests associated with a given department
 */

//LOGS

export const logs = (req, res, next) => {
  _request
    .find()
    .or([
      { to: req.user.department, messageStatus: 'Completed' },
      { from: req.user.department, messageStatus: 'Completed' },
    ])
    .sort({ modifieddAt: -1 })
    .populate({ path: 'from', select: 'name abbr' })
    .then((doc) => {
      res.status(201).json({ success: true, doc });
    })
    .catch((err) => {
      return next(new ErrorResponse(err.message));
    });
};

/**
 * meta data
 */

// export const forwardedTo = async (req, res, next) => {
//   try {
//     let _req = await _request.findById(req.params.requestId);
//     let result = _req.metaData.seen.find((val) => {
//       val.by == req.user._id;
//     });
//     if (result == undefined) {
//       _req.metaData.seen.push({
//         by: req.user._id,
//         date: Date.now,
//         read: false,
//       });
//       await _req.save();
//     }
//     res.status(201).send({ success: true, doc: _req });
//   } catch (error) {
//     next(error);
//   }
// };

export const seen = async (req, res, next) => {
  try {
    let _req = await _request.findById(req.params.requestId);
    let doc = _req.metaData.seen.find((val) => {
      return val.by.toString() == req.params.id;
    });
    if (doc == undefined) {
      return res.status(201).json({
        success: false,
        message: 'user is not on the forwarded to list',
      });
    }
    let result = _req.metaData.seen.map((val) => {
      if (val.by == req.user._id) {
        val.read = true;
      }
    });

    _req.metaData.seen = result;
    let file = await _req.save();

    res.status(201).send({ success: true, doc: file });
  } catch (error) {
    next(error);
  }
};

export const minute = async (req, res, next) => {
  try {
    let _req = await _request.findById(req.params.requestId);
    const time = Date.now();
    _req.metaData.minute.push({
      by: req.user._id,
      date: time,
      comment: req.body.comment,
    });
    let result = await _req.save();
    res.status(200).send({ success: true, doc: result });
  } catch (error) {
    next(error);
  }
};

export const status = async (req, res, next) => {
  try {
    let _req = await _request.findById(req.params.requestId);
    _req.metaData.status = req.params.status;

    await _req.save();

    res.status(200).send({ success: true, doc: _req });
  } catch (error) {
    next(error);
  }
};

export const supportMail = async (req, res) => {
  let data = {};
  data.from = req.user._id;
  data.title = req.body.title;

  data.message = {
    body: req.body.text,
  };
  user
    .findOne({ username: 'support@ADMIN' })
    .then((doc) => {
      data.to = doc._id;

      mail
        .create(data)
        .then((file) => {
          res.status(201).json({ success: true, file });
        })
        .catch((err) => {
          return next(new ErrorResponse(err.message));
        });
    })

    .catch((err) => {
      next(err);
    });
};
