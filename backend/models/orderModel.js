const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
    {
      start_address: {
            type: String,
            trim: true,
        },
        end_address: {
            type: String,
            trim: true,
        },
        createAt: {
            type: Date,
            default: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
        },
        path: [{
          start: String,
          end: String,
          numRoute: String,
          numStation: Number,
        }],
        status: {
            type: String,
            default: 0,
        },
        current: {
            type: Number,
            trim: true,
            default: 0
        },
        isOnBus: {
          type: Boolean,
          default: false
        },
        idUser: {
            type: String,
            trim: true,
        },
        history: [{
            checkout_date: Date,
            checkin_date: Date,
        }],
        product: [
            {
                name: String,
                price: Number,
                amount: {
                    type: Number,
                    required: [true, 'Must have the amount of product'],
                },
                _id: false,
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;