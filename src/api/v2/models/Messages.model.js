import mongoose from 'mongoose';
// import constants from '../../../config/constants.js';

const RequestSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
      required: true,
    },

    _to: {
      type: Boolean,
      required: true,
    },

    from: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
      required: true,
    },

    onModel: {
      type: String,
      required: true,
      enum: ['Department', 'User'],
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
        enum: ['progress', 'pending', 'completed'],
        default: 'pending',
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

const ConversationSchema = new mongoose.Schema(
  {
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
      type: String,
    },
    alias: {
      type: String,
    },
    group: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'conversations',
    },
    to: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

RequestSchema.pre('find', async function (next) {
  this.populate('to from');
  this.select('-_to -forward -onModel');
  this.sort({ createdAt: -1 });
  next();
});

RequestSchema.pre('findById', async function (next) {
  this.populate('to from');
  this.select('-_to -forward -onModel');
  next();
});

RequestSchema.pre('findOne', async function (next) {
  this.populate('to from');
  this.select('-_to -forward -onModel');
  next();
});

const Request = mongoose.model('request', RequestSchema);

const Conversation = mongoose.model('conversation', ConversationSchema);

const Message = mongoose.model('message', MessageSchema);

export { Message, Conversation, Request };
