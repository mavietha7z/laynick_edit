import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    full_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
    membership: {
        type: String,
        enum: ['default', 'vip'],
        default: 'default',
    },
    chargings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Charging',
        },
    ],
    carts: {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            default: null,
        },
        used: {
            type: Number,
            default: null,
        },
    },
    history_hacks: [
        {
            _id: false,
            account_id: {
                type: String,
                required: true,
            },
            nickname: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                enum: ['pending', 'success', 'failed'],
                default: 'pending',
            },
            info: {
                type: {
                    type: String,
                    default: null,
                },
                username: {
                    type: String,
                    default: null,
                },
                password: {
                    type: String,
                    default: null,
                },
            },
            created_at: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    wallet: {
        type: Number,
        default: 0,
    },
    ip: {
        type: String,
        default: '',
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

export const User = mongoose.model('User', userSchema);
