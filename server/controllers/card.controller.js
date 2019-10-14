import Card from "../models/card";
import Product from "../models/products";
var ObjectId = require("mongodb").ObjectID;

const cardController = {};

cardController.addToCard = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const {id}=req.params;
    Product.findById({_id }, async (err, data) => {
      if (err) {
        res.status(422).json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
        return;
      }
      if (data) {
        const card = new Card({ userId:id, product: data });

        await card.save(err => {
          if (err) {
            res.status(400).json({
              success: false,
              message:
                "Sorry Something Happened We'll get back to you as soon as possible",
              error: err
            });
          } else {
            res.status(200).json({
              success: true,
              message: "Product Successfully add to Cart",
              card
            });
          }
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "This product doesn't exsist" });
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message:
        "Sorry Something Happened We'll get back to you as soon as possible",
      error: err
    });
  }
};

cardController.getCard = async (req, res, next) => {
  const id = req.params.id;

  Card.find({ userId: id }, function(err, data) {
    if (err) {
      res.status(422).json({
        success: false,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible",
        error: err
      });
      return;
    }
    if (data) {
      let products = [];
      data.map(item => products.push(item.product));
      res.status(200).json({
        success: true,
        message: "There is the list of your Products in cart",
        products
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Sorry your card is empty" });
    }
  });
};
cardController.removeCardProduct = async (req, res) => {
  const { productId, userId } = req.params;
  Card.remove(
    { userId, "product._id": ObjectId(productId) },
    async (err, data) => {
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
            message: "Product doesn't exist"
          });
        }
        res.status(200).json({
          success: true,
          message: "Products removed Successfully",
          data
        });
      }
    }
  );
};

cardController.incrementQuantity = async (req, res) => {
  const { productId, userId, newqty } = req.body;
  Card.findOneAndUpdate(
    { userId, "product._id": ObjectId(productId) },
    { $set: { "product.quantity": newqty } },
    async (err, data) => {
      if (err) {
        res.status(400).json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
      } else {
        // if (!data.length) {
        //   res.status(404).json({
        //     success: true,
        //     message: "Product doesn't exist",
        //     data
        //   });
          
        // }
        res.status(200).json({
          success: true,
          message: "Product Quantit Successfully Incremented",
          data
        });
      }
    }
  );
};
cardController.decrementQuantity = async (req, res) => {
  const { productId, userId, newqty } = req.body;
  Card.findOneAndUpdate(
    { userId, "product._id": ObjectId(productId) },
    { $set: { "product.quantity": newqty } },
    (err, data) => {
      if (err) {
        res.status(400).json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
      } else {
        // if (!data.length) {
        //   res.status(404).json({
        //     success: true,
        //     message: "Product doesn't exist",
        //     data
        //   });
        // }
        res.status(200).json({
          success: true,
          message: "Product Quantit Successfully Decremented",
          data
        });
      }
    }
  );
};
module.exports = cardController;

