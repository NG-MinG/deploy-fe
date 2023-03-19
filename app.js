const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const routes = require('./models/routeSchema.js');
const locate = require('./models/locateSchema.js');
const station = require('./models/stationSchema.js');

const orderRoutes = require('./routes/orderRoutes');
const checkingRoutes = require('./routes/checkingRoutes');
const Order = require('./models/orderModel.js');
const stationRoutes = require('./routes/stationsRoutes');

const limiter = rateLimit({
  // limiter is now become a middleware function
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try this again in an hour!',
}); // define how many requests per IP we are going to allow in a certain of time

const app = express();
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: '10mb' }));

app.get('/api/v1/locate', async (req, res, next) => { 
  const { address } = req.query || {};

  if (address) {
    const data = await locate.findOne({ name: address}).lean();
    return res.status(200).json({
      geometry: {
        ...data,
      } 
    });
  }
  else {
    const data = await locate.find({}).lean();
    return res.status(200).json({
      geometry: {
        data,
      } 
    });
  }
});

app.post("/api/v1/shipments", async (req, res, next) => {
  const { start, end } = req.body.params;

  // find data from mongoose db by start, end
  const _routes = await routes.findOne({ start: start, end: end }).lean();
  
  let id_arr = [];
  
  _routes.routes.forEach((item) => {
    if (item.id.indexOf('-') < 0) id_arr.push(item.id); 
    else {
      const [id1, id2] = item.id.split('-');
      if (id_arr.indexOf(id1) < 0) id_arr.push(id1);
      if (id_arr.indexOf(id2) < 0) id_arr.push(id2);
    }
  });

  const avg_arr = await station.find({ id: { $in: id_arr } }).lean();
  const avg_time_1 = avg_arr.map((item) => item.avg_time_1);

  const routes_data = _routes.routes.map((route) => { 
    if (route.id.indexOf('-') < 0) return { ...route, avg_time_1: avg_time_1[id_arr.indexOf(route.id)] }
    const [id1, id2] = route.id.split('-');
    return { ...route, avg_time_1: (avg_time_1[id_arr.indexOf(id1)] + avg_time_1[id_arr.indexOf(id2)]) / 2 } 
  });

  const startRoute = routes_data.sort((a, b) => a.numStation * a.avg_time_1 - b.numStation * b.avg_time_1)[0];

  return res.status(200).json({
      map: startRoute.link,
      start: startRoute.start,
      end: startRoute.end,
      station: startRoute.numStation,
      route_id: startRoute.id
  });
});
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/checking', checkingRoutes)
app.post('/api/v1/order', async (req, res, next) => {

  const data = await Order.create({
    ...req.body.params,
  });

  return res.status(200).json({
    message: "Success",
    id: data._id
  })
})
app.use('/api/v1/stations', stationRoutes)

module.exports = app;
