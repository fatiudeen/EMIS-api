import mongoose from 'mongoose';

const bodySchema = new mongoose.Schema({
    

    date: {
        type: String,
        default: Date.now
    },

    title:{
        type: String,
        required: true
    },

    message:{
        body:{
            type: String,
            required: false
        },
        attachment:{
            type: String,
            required: false
        }
    }


})


const RequestSchema = new mongoose.Schema({
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },

    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    
    reference: {
        type: String,
        required: true,
        

    },

    
    message: bodySchema,
    
    messageStatus:{
        type: String,
        enum: ['Sent', 'Pending', 'Sent', 'treated'],
        default: 'Pending'
    },

    metaData:{
        seenBy:
            [{ type: mongoose.Schema.Types.ObjectId,
                 ref: 'User',
                 date: {
                    type: String,
                    default: Date.now,
                },
                note:{
                    type: String,
                }
                }],
        editedBy:
            [{ type: mongoose.Schema.Types.ObjectId,
                 ref: 'User',
                 date: {
                    type: String,
                    default: Date.now,
                }
                }],
    }



});

const MailSchema = new mongoose.Schema({
    to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    from: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },


    message: bodySchema,

    messageStatus:{
        type: String,
        enum: ['Sent', 'Pending', 'Sent',],
        default: 'pending'

    }



});

export const mail = mongoose.model(
    'mail',
    MailSchema
);


export const request = mongoose.model(
    'request',
    RequestSchema
);
