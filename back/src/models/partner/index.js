import mongoose, { Schema } from 'mongoose';

const partnerSchema = new Schema({
    partner_name: {
        type: String,
        require: true,
    },
    partner_id: {
        type: String,
        default: '',
    },
    partner_key: {
        type: String,
        default: '',
    },
    partner_url: {
        type: String,
        require: true,
    },
    ip: {
        type: String,
        default: '',
    },
    status: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

export const Partner = mongoose.model('Partner', partnerSchema);
