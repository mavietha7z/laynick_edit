import mongoose, { Schema } from 'mongoose';

const chargingSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    telco: {
        type: String,
        require: true,
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        require: true,
    },
    code: {
        type: String,
        require: true,
    },
    serial: {
        type: String,
        require: true,
    },
    declared_value: {
        type: Number,
        require: true,
    },
    value: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    request_id: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    trans_id: {
        type: Number,
        require: true,
    },
    status: {
        type: Number,
        require: true,
    },
    approved_at: {
        type: Date,
        default: null,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

export const Charging = mongoose.model('Charging', chargingSchema);
