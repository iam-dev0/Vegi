import uuid from "uuid-v4";

import Product from "../models/products";
import { containerUrlFrom, BlockBlobURLFrom, uploadStream } from "../azure";
import { myValidationResult } from "../utils/util";
import favoriteProduct from "../models/favoriteProducts";
var ObjectId = require("mongodb").ObjectID;
const productController = {};

// productController.getProducts = async (req, res) => {
//   // console.log('api/products/   ---getProducts');
//   const products = await Product.find();

//   res.json({ products });
// };

productController.getCount = async (req, res) => {
  const count = await Product.countDocuments();

  res.json({ success: true, message: "Numbers of totally products", count });
};
/* Upload Image to Azure
 */
/*
productController.createProduct = async (req, res) => {
  try {
    const errors = myValidationResult(req).array(); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (errors.length>0) {
      res.status(422).json({ errors: errors});
      return;
    }
    const {files}=req;
    const {description,title,price,stock}=req.body;
    let imagesUrl = [];
    if (files && files.length>0) {
        files.map(file => {
       
          let filename = `${Date.now()}-${uuid()}${file.originalname}`;
          const containerUrl = containerUrlFrom();
          const BlockBlobURL = BlockBlobURLFrom(containerUrl, filename);
          uploadStream(BlockBlobURL, file)
            .then(() => console.log("files uploaded to server"))
            .catch(error => console.log(`Error - ${error}`));
          imagesUrl.push(BlockBlobURL.url);
        
      });
    
    }

    const product = new Product({description,title,price,stock,images:imagesUrl});

    await product.save(err => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json({ status: "200", product });
      }
    });
  } catch (err) {
    res.json({ error: err });
  }
};
*/

/* Upload images to Google Cloud Services Storage
 */

productController.createProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const errors = myValidationResult(req).array(); // Finds the validation errors in this request and wraps them in an object with handy functions
    let images = [];
    if (errors.length > 0) {
      res.status(422).json({ errors: errors });
      return;
    }
    const { files } = req;
    if (files.cloudStorageError) {
      res.status(422).json({
        success: false,
        errors: cloudStorageError,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible"
      });
      return;
    }
    const {
      files: { cloudStorageImageUrls }
    } = req;

    if (cloudStorageImageUrls) {
      images = cloudStorageImageUrls;
    }
    const { description, title, price, stock, category, brand } = req.body;

    const product = new Product({
      description,
      title,
      price,
      stock,
      images,
      category,
      brand,
      seller_id: id
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
/*
 for both seach by keyword or category
*/
productController.searchProduct = async (req, res) => {
  const { keyword, is_category } = req.query;
  if (is_category==="true") {
    var reg = new RegExp(keyword, "i");
    Product.find({ category: { $regex: reg } }, function(err, data) {
      if (err) {
        res.status(422).json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          errors: res
        });
        return;
      }

      if (data) {
        let products = data;
        // data.map(item => {
        //   products.push(item);
        // });
        res.status(200).json({
          success: true,
          message: "List of product you searched",
          products
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Sorry can't match any product"
        });
      }
    });
  } else {
    var reg = new RegExp(keyword, "i");
    Product.find({ title: { $regex: reg } }, function(err, data) {
      if (err) {
        res.status(422).json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          errors: res
        });
        return;
      }

      if (data) {
        let products = data;
        // data.map(item => {
        //   products.push(item);
        // });
        res.status(200).json({
          success: true,
          message: "List of product you searched",
          products
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Sorry can't match any product"
        });
      }
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

productController.AddFavoriteProduct = async (req, res, next) => {
  try {
    // const errors = myValidationResult(req).array(); // Finds the validation errors in this request and wraps them in an object with handy functions

    // if (errors.length>0) {
    //   res.status(422).json({ errors: errors});
    //   return;
    // }

    const { userid, productid } = req.params;

    await Product.findOne({ _id: productid }, async (err, data) => {
      if (err) {
        res.status(422).json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          errors: res
        });
        return;
      }
      if (data) {
        const favoriteproduct = new favoriteProduct({ userid, product: data });

        await favoriteproduct.save(err => {
          if (err) {
            res.status(400).json({
              success: false,
              message:
                "Sorry Something Happened We'll get back to you as soon as possible",
              error: err
            });
          } else {
            res.status(200).json({
              status: "200",
              success: true,
              message: "Favorite add successfully",
              product: favoriteproduct
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

productController.GetFavoriteProducts = async (req, res, next) => {
  const userid = req.params.userid;

  favoriteProduct.find({ userid: userid }, function(err, data) {
    if (err) {
      res.status(422).json({
        success: false,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible",
        errors: res
      });
      return;
    }

    if (data) {
      let products = [];
      data.map(item => {
        products.push(item.product);
      });
      res.status(200).json({
        success: true,
        message: "There is the list of your favorite Products",
        products
      });
    } else {
      res.status(400).json({
        success: false,
        message: "You don't have any Faviorate right now"
      });
    }
  });
};

productController.removeFavoriteProduct = async (req, res) => {
  const { userid, productid } = req.params;
  // Product.remove({ _id: userid, product: { _id: productid } }, function(
  //   err,
  //   obj
  // ) {
  //   if (err)
  //     res.status(400).json({
  //       success: false,
  //       message:
  //         "Sorry Something Happened We'll get back to you as soon as possible",
  //       error: err
  //     });
  //   console.log(obj.result.n + " document(s) deleted");
  // });
  favoriteProduct.remove(
    { userid, "product._id": ObjectId(productid) },
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

//Todo-- implement it correclty
productController.editProduct = async (req, res) => {
  const { _id } = req.params;

  const product = {
    code: req.body.code,
    description: req.body.description,
    size: req.body.size,
    weight: req.body.weight,
    price: req.body.price,
    discount: req.body.discount,
    on_sale: req.body.on_sale,
    active: req.body.active,
    stock: req.body.stock,
    broken_stock: req.body.broken_stock,
    to_serve: req.body.to_serve,
    to_receive: req.body.to_receive,
    ubication: req.body.ubication,
    images: req.body.images
  };

  await Product.findByIdAndUpdate(id, { $set: product }, { new: true });

  res.json({ status: "200" });
};

productController.getActives = async (req, res) => {
  const products = await Product.find({ active: true });

  res.json(products);
};

productController.getInactives = async (req, res) => {
  const products = await Product.find({ active: false });

  res.json(products);
};

productController.getActivesCount = async (req, res) => {
  const products = await Product.find({ active: true }).countDocuments();

  res.json(products);
};

productController.getInactivesCount = async (req, res) => {
  const products = await Product.find({ active: false }).countDocuments();

  res.json(products);
};

productController.getProduct = async (req, res) => {
  const product = await Product.findById(req.params._id);

  res.json(product);
};

productController.deleteProduct = async (req, res) => {
  const { id } = req.params;

  await Product.findByIdAndRemove(id);

  res.json({ status: "200" });
};

productController.activateProduct = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  await Product.update({ _id: id }, { $set: { active: true } }, () => {
    res.json({ status: "200" });
  });
};

productController.deactivateProduct = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  await Product.update({ _id: id }, { $set: { active: false } }, () => {
    res.json({ status: "200" });
  });
};

productController.addImage = async (req, res) => {
  const { _id } = req.params;

  const image = {
    image: req.body.image
  };
  const product = await Product.findById(_id);

  product.images.push(image);
  await product.save(err => {
    if (err) {
      res.json(err);
    } else {
      res.json({ status: "200" });
    }
  });
};

productController.brokenStock = async (req, res) => {
  const broken = await Product.find({
    $where: "this.broken_stock >= this.stock"
  });

  res.json(broken);
};

module.exports = productController;

/** this ends this file
 * server/controllers/product.controller
 **/
