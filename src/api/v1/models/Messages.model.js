import mongoose from 'mongoose';
import constants from '../../../config/constants.js';

const bodySchema = new mongoose.Schema({
  date: {
    type: String,
    default: Date.now,
  },

  title: {
    type: String,
    required: true,
  },

  message: {
    body: {
      type: String,
      required: false,
    },
    attachment: [
      {
        type: String,
        required: function () {
          if (this.message.body.required === false) {
            return true;
          }
        },
      },
    ],
  },
});

const RequestSchema = new mongoose.Schema(
  {
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },

    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },

    reference: {
      type: String,
      required: true,
    },

    message: bodySchema,

    messageStatus: {
      type: String,
      enum: constants.ENUM.MESSAGE_STATUS,
      default: constants.ENUM.MESSAGE_STATUS[0],
    },

    metaData: {
      seenBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          date: {
            type: String,
            default: Date.now,
          },
          note: {
            type: String,
          },
        },
      ],
      editedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          date: {
            type: String,
            default: Date.now,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const MailSchema = new mongoose.Schema({
  to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  message: bodySchema,

  messageStatus: {
    type: String,
    enum: ['Sent', 'Pending', 'Sent'],
    default: 'pending',
  },
});

MailSchema.pre('find', async function (next) {
  this.populate('to from');
  next();
});

RequestSchema.pre('find', async function (next) {
  this.populate('to from');
  next();
});

export const mail = mongoose.model('mail', MailSchema);

export const request = mongoose.model('request', RequestSchema);
