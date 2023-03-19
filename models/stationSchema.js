const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({ 
    id: { type: String },
    stations: [],
    avg_time_1: { type: Number }
});

const station = mongoose.model('station', stationSchema);
module.exports = station;