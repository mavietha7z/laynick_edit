import mongoose, { Schema } from 'mongoose';

const settingSchema = new Schema({
    apikey_login: {
        type: String,
        default: '',
    },
    banner_url: {
        type: String,
        default: '',
    },
    notify: {
        text: {
            type: String,
            default: '',
        },
        html: {
            type: String,
            default: '',
        },
    },
    charging_rank: [
        {
            _id: false,
            nickname: {
                type: String,
            },
            amount: {
                type: Number,
            },
        },
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

export const Setting = mongoose.model('Setting', settingSchema);
