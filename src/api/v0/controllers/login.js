import { User as user } from '../models/user.js';
import ErrorResponse from '../helpers/ErrorResponse.js';
import { mail } from '../models/messages.js';

//login route
export const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorResponse('provide a username and a password', 400));
  }

  try {
    const _user = await user.findOne({ username }).select('+password');

    if (!_user) {
      return next(new ErrorResponse('Invalid Details', 401));
    }

    const isMatch = await _user.comparePasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid Details', 401));
    }
    const token = _user.getSignedToken();
    res.status(201).json({ success: true, token, doc: _user });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const username = `forgot@PASSWORD`;
  const defaultPassword = Math.floor(Math.random() * 10000000);
  let randomUser;

  try {
    randomUser = await user
      .findOne({
        username,
      })
      .select('+password');

    if (!randomUser) {
      await user.create({
        username,
        name: 'DHQ USER',
        password: defaultPassword,
        role: 'Admin',
      });
    } else {
      randomUser.password = defaultPassword;
      randomUser.role = 'Admin';

      await randomUser.save();

      let data = {};
      data.from = randomUser._id;
      data.title = `${req.body.name}: ${req.body.title}`;

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
    }
  } catch (error) {
    throw new ErrorResponse(error);
  }
};
