import mongoose from 'mongoose';

const bodySchema = new mongoose.Schema({
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
});

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
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          date: {
            type: String,
            default: Date.now,
          },
        },
      ],
      minute: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          date: {
            type: String,
            default: Date.now,
          },
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

export const mail = mongoose.model('mail', MailSchema);

export const request = mongoose.model('request', RequestSchema);
