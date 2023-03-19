const mongoose = require('mongoose');

const routeSchema = mongoose.Schema({ 
    "start": { type: String },
    "end": { type: String },
    "routes": [
        {
            "id": { type: String },
            "StartStation": [{type: String}],
            "EndStation": [{type: String}],
            "numStation": { type: Number },
            "link": { type: String }
        }
    ]
});

const route = mongoose.model('route', routeSchema);
module.exports = route;