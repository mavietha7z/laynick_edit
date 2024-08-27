import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: [
        {
            _id: false,
            value: {
                type: String,
            },
        },
    ],
    price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    times_used: {
        type: Number,
        default: 0,
    },
    hacked: {
        type: Boolean,
        default: true,
    },
    status: {
        type: Boolean,
        default: true,
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

export const Product = mongoose.model('Product', productSchema);
