const mongoose = require('mongoose');

const locateSchema = mongoose.Schema({ 
    name: { type: String },
    lng: { type: Number },
    lat: { type: Number }
});

const locate = mongoose.model('locate', locateSchema);
module.exports = locate;