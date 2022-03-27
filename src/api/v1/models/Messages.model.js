import mongoose from 'mongoose';
import constants from '../../../config/constants.js';

const RequestSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },

    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },

    reference: {
      type: String,
      required: true,
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
          required: false,
        },
      ],
    },

    metaData: {
      seen: [
        {
          by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          date: {
            type: Date,
          },
          read: { type: Boolean },
        },
      ],
      minute: [
        {
          by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          date: {
            type: Date,
          },
          comment: { type: String },
        },
      ],
      status: {
        type: String,
        enum: ['Progress', 'Pending', 'Completed'],
        default: 'Pending',
      },
      forward: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
  },
  { timestamps: true }
);

const MailSchema = new mongoose.Schema(
  {
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
          required: false,
        },
      ],
    },
  },
  { timestamps: true }
);

MailSchema.pre('find', async function (next) {
  this.populate('to from');
  next();
});

RequestSchema.pre('find', async function (next) {
  this.populate('to from');
  next();
});

export const Mail = mongoose.model('mail', MailSchema);

export const Request = mongoose.model('request', RequestSchema);
