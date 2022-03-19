import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../../config/config.js';
import constants from '../../../config/constants.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    match: [/^[a-zA-Z]+@[a-zA-Z]+$/i, 'provide a valid username'],
  },
  name: {
    type: String,
    required: false,
    default: '',
  },

  rank: {
    type: String,
    required: false,
    default: '',
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: constants.ENUM.ROLE,
      message: '{VALUE} is not a valid role',
    },
  },

  department: {
    type: mongoose.Types.ObjectId,
    ref: 'Department',
    required: function () {
      if (this.role == 'Admin') {
        return false;
      } else {
        return true;
      }
    },
  },

  avatar: {
    type: String,
    required: false,
    default: '',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre('find', async function (next) {
  this.populate('department');
  next();
});

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, config.jwt_secret, {
    expiresIn: config.jwt_timeout,
  });
};

export default mongoose.model('User', userSchema);
