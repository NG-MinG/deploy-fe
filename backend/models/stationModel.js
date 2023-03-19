const mongoose = require('mongoose');
const stationSchema = new mongoose.Schema(
    {
      id: {
            type: String,
            trim: true,
        },
        stations: [{
            type: String,
            trim: true,
        }],
        avg_time_1: Number
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


const Station = mongoose.model('Station', stationSchema);

module.exports = Station;