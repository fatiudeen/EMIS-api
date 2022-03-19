import { User as user } from '../models/user.js';
import { request as _request, mail } from '../models/messages.js';
import { Department } from '../models/dept.js';
import ErrorResponse from '../helpers/ErrorResponse.js';

//MANAGE USER DATA
// get user data
export const getUser = (req, res, next) => {
  let id = req.params.id == false ? req.user._id : req.params.id;

  user
    .findById(id)
    .then((doc) => {
      if (!doc) {
        return next(new ErrorResponse('Not Found', 404));
      }
      res.status(200).json({ success: true, doc });
    })
    .catch((err) => {
      return next(new ErrorResponse(err.message));
    });
};

//  UPDATE FULLNAME/RANK/ROLE
export const updateUser = (req, res, next) => {
  let data = {};
  req.body.name != null ? (data.name = req.body.name) : false;
  req.body.rank != null ? (data.rank = req.body.rank) : false;
  //checking if user is an admin, as changing the role of a user can only be done an admin
  req.user.role == 'Admin' ? (data.role = req.body.role) : false;

  if (Object.entries(data).length === 0)
    return next(new ErrorResponse('invalid input', 409));

  user.findOneAndUpdate(
    { username: req.user.username },
    data,
    { new: true },
    (err, doc) => {
      if (err) return next(new ErrorResponse(err.message));

      res.status(200).json({ success: true, doc });
    }
  );
};

//CHANGE PASSWORD
export const changePassword = (req, res, next) => {
  let pass = req.body.oldPassword;
  let newPass = req.body.newPassword;
  let data = {};

  if (newPass.length < 6) {
    return next(new ErrorResponse('password length must be more than 6', 411));
  }

  if (req.user.role === 'Admin') {
    //allow adimin change passwords without using old passwords
    let id = req.params.id;
    console.log(id);
    user
      .findById(id)
      .select('+password')
      .then((doc) => {
        doc.password = req.body.newPassword;

        doc
          .save()
          .then(res.status(200).json({ success: true, doc }))
          .catch(
            next((err) => {
              new ErrorResponse(err.message);
            })
          );
      })
      .catch((err) => {
        return next(new ErrorResponse(err.message));
      });
  } else {
    if (req.body.newPassword != req.body.confirmPassword) {
      return next(new ErrorResponse('confirm the new password', 406));
    }

    user
      .findById(req.user._id)
      .select('+password')
      .then(async (doc) => {
        data.doc = doc;
        data.match = await doc.comparePasswords(pass);
      })
      .then((result) => {
        if (!data.match) {
          return next(new ErrorResponse('incorrect old password', 406));
        }
        let doc = data.doc;
        doc.password = req.body.newPassword;
        doc.save().then(res.status(200).json({ success: true, result }));
      })
      .catch((err) => {
        return next(new ErrorResponse(err.message));
      });
  }
};

//register user
export const registerUser = async (req, res, next) => {
  let username = `${req.body.username}@${req.body.department}`;
  let password = req.body.password;
  let role = req.body.role;
  let department = req.body.department;

  try {
    const _user = await user.findOne({ username }).select('+password');
    if (_user) {
      return next(new ErrorResponse('User exists', 406));
    }
    const dept = await Department.findOne({ abbr: department });
    if (!dept) {
      return next(new ErrorResponse('Department does not exist', 401));
    }
    department = dept;
    let result = await user.create({
      username,
      password,
      role,
      department,
    });

    res.status(201).json({ success: true, result });
  } catch (error) {
    return next(error);
  }
};

//DELETE USER
export const deleteUser = async (req, res, next) => {
  user.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      return next(new ErrorResponse(err.message));
    }
    res.status(200).json({ success: true });
  });
};

//get all users
export const getUsers = (req, res, next) => {
  user.find({}, (err, doc) => {
    if (err) {
      return next(new ErrorResponse(err.message));
    }
    res.status(201).json({ success: true, doc });
  });
};
