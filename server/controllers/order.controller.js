import Order from "../models/order";
import Card from "../models/card";
import User from "../models/users";
var ObjectId = require("mongodb").ObjectID;

const OrderController = {};

OrderController.addToOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    let user;
    const { productList } = req.body;

    await User.findById(id)
      .then(response => {
        response.password = "";
        user = response;
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          message:
            "2",
          error: err
        });
        return;
      });

    if (productList) {
      const order = new Order({ buyer: user, orderlist: productList });
      await order.save(err => {
        if (err) {
          res.status(400).json({
            success: false,
            message:
              "1",
            error: err
          });
        } else {
          Card.remove({ userId: id }, err => {
            if (err) {
              console.log(err);
            }
            res.status(200).json({
              success: true,
              message: "Product Ordered",
              order
            });
          });
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Sorry Could find any product you ordered"
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message:
        "Sorry Something Happened We'll get back to you as soon as possible",
      error: err
    });
  }
};

OrderController.getOrder = async (req, res) => {
  await Order.find({}, async (err, data) => {
    if (err) {
      res.status(400).json({
        success: false,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible",
        error: err
      });
    }
    res.status(200).json({
      success: true,
      message: "List of User",
      data: data
    });
  });
};

OrderController.removeOrderProduct = async (req, res) => {
  const { orderId } = req.params;
  Order.remove({ _id: orderId }, async (err, data) => {
    if (err) {
      res.status(400).json({
        success: false,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible",
        error: err
      });
    } else {
      if (data.length) {
        res.status(404).json({
          success: true,
          message: "Order removed Successfully",
        });
      }
      res.status(200).json({
        success: true,
        message: "Faild to remove Order",
        data
      });
    }
  });
};

module.exports = OrderController;
