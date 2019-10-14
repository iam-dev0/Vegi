import Product from "../models/products";
import { myValidationResult } from "../utils/util";
var ObjectId = require("mongodb").ObjectID;
const productController = {};



productController.createProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const errors = myValidationResult(req).array(); 
    let images = [];
    if (errors.length > 0) {
      res.status(422).json({ errors: errors });
      return;
    }
    const { file } = req;
    const image=`/uploads/${file.filename}`
    const { title, price } = req.body;

    const product = new Product({
      title,
      price,
      image,
      creater: id
    });

    await product.save(err => {
      if (err) {
        res.json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
      } else {
        res.json({
          success: true,
          message: "Product successfully added",
          product
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      message:
        "Sorry Something Happened We'll get back to you as soon as possible",
      error: err
    });
  }
};

productController.getProductsPagination = async (req, res) => {
  var perPage = 10;
  var page = req.query.page || 1;

  Product.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, products) => {
      if (err) {
        return res.json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
      }
      Product.count().exec((err, count) => {
        if (err) {
          return res.json({
            success: false,
            message:
              "Sorry Something Happened We'll get back to you as soon as possible",
            error: err
          });
        }
        res.json({
          success: true,
          message: "List of Products",
          products: products,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
};


productController.deleteProduct = async (req, res) => {
  const { id } = req.params;

  await Product.findByIdAndRemove(id);

  res.json({ status: "200" });
};


module.exports = productController;

/** this ends this file
 * server/controllers/product.controller
 **/
