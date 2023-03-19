
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');

exports.getAll = catchAsync(async (req, res, next) => {
  const { numRoute, nameStation, idUser } = req.query;
  const doc = await Order.find({idUser}).lean();

  if (!numRoute) {
    return res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  }

  let end = '';
  const data = [];
  for (let e of doc) {
    if (e.path[e.current].start === nameStation 
      && e.path[e.current].numRoute === numRoute
      && !e.isOnBus
      && e.status === "Đang giao hàng") {
      if (end === '') {
        end = e.path[e.current].end;
        data.push({ id : e._id, current: e.current });
      } else if (end == e.path[e.current].end) {
        data.push({ id : e._id, current: e.current });
      }
    }
    if (data.length === 4)
      break;
  }

  res.status(200).json({
      status: 'success',
      data,
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const doc = await Order.findOne({_id: req.params.id}).exec();

  res.status(200).json({
      status: 'success',
      data: doc,
  });
});