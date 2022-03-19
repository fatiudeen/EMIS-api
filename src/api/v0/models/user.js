import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
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
        values: ['Registry', 'Cheif Clerk', 'PA', 'Director', 'Cheif', 'Admin'],
        message: '{VALUE} is not a valid role',
      },
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

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
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIMEOUT,
  });
};

const User = mongoose.model('User', userSchema);

export { User };
