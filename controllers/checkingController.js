const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const { Mongoose } = require('mongoose');
const station = require('../models/stationSchema');
const socketIO = require('../server');

exports.deliveryCheck = catchAsync(async (req, res, next) => {
  let { data } = req.query;

  data = JSON.parse(data);

  for (let e of data) {
    const order = await Order.findOne({_id: e.id});

    if (order.isOnBus === false) {
      await Order.updateOne({_id: e.id}, {isOnBus: true});
      order.history.push({ checkin_date: new Date() });
      order.save();
    }
    else {
      const current_date = new Date();

      order.history[order.current].checkout_date = current_date;

      function DateDiff(date1, date2) {
        var datediff = date1.getTime() - date2.getTime(); //store the getTime diff - or +
        return datediff; //Convert values to -/+ days and return value      
      }

      const v = DateDiff(new Date(current_date), new Date(order.history[order.current].checkin_date)) / order.path[order.current].numStation;

      const stations = await station.findOne({ id: order.path[order.current].numRoute });
      stations.avg_time_1 = ((stations.avg_time_1 * 60000 + v) / 2) / 60000;
      await stations.save();

      await order.save();
      await Order.updateOne({_id: e.id}, {isOnBus: false, current: e.current+1});
    }
  }

  socketIO.onChangeStation(data);
  res.status(200).json({
      status: 'success',
      data,
  });
});

exports.customerGetPackage = catchAsync(async (req, res, next) => {
  const { idUser } = req.params;
  const data = await Order.find().lean();
  
  for (let e of data) {
    if (idUser === e.idUser) {
      await Order.updateOne({_id: e._id}, {status: "Đã giao hàng"});
    }
  }

  res.status(200).json({
      status: 'success',
      data,
  });
});