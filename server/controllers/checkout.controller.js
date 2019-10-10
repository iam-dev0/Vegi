import Card from "../models/card";
import Product from "../models/products";
import User from "../models/users";
import { Coinbase_API_Key } from "../config/config";
var coinbase = require("coinbase-commerce-node");
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge;
Client.init(Coinbase_API_Key);

const checkout = {};

checkout.createCharge = async (req, res) => {
  const { id } = req.params;
  let userData, products=[],LumSum;
  await Card.find({ userId: id }, async (err, data) => {
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
      products = data;
      // Card.remove({ userId: id }, async (err, data) => {
      //   if (err) {
      //     res.status(400).json({
      //       success: false,
      //       message:
      //         "Sorry Something Happened We'll get back to you as soon as possible",
      //       error: err
      //     });
      //   } else {
      //     if (!data.length) {
      //       res.status(404).json({
      //         success: true,
      //         message: "Product doesn't exist"
      //       });
      //     }
      //     // res.status(200).json({
      //     //   success: true,
      //     //   message: "Products removed Successfully",
      //     //   data
      //     // });
      //   }
     // });
    } else {
      res.status(400).json({ success: false, message: "" });
    }
  });

  if (products.length > 0) {
    await User.findById(id)
      .then(response => {
        userData = response;
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
        return;
      });
 LumSum=LumSumPrice(products);
    var firstChargeObj = new Charge({
      description: `${userData.email}`,
      metadata: {
        "customer_id": "id_1005",
        "customer_name": "Name"
      },
      name: "BitTrade",
      payments: [],
      local_price: {
        amount:  `${LumSum}`,
        currency: "USD"
      },
      pricing_type: "fixed_price"
      // pricing: {
      //   local: { amount: '100.00', currency:'USD' },
      //   // "bitcoin": { "amount": "1.00", "currency": "BTC" },
      //   // "ethereum": { "amount": "10.00", "currency": "ETH" }
      // },
    });

    firstChargeObj.save(function(error, response) {
      console.log("Created charge(callback)");
      console.log(response);
      console.log(error);

      if (response && response.id) {
        Charge.retrieve(response.id, function(error, response) {
          console.log("Retrived charge(callback)");
          console.log(response);
          console.log(error);
          res.status(200).json({
            success: true,
            message: "",
            hosted_url: response.hosted_url
          });
          return;
        });
      }
    });
  }
};

const LumSumPrice= (products) => {
 let price=0;
 products.map((item)=>{
  price=price+item.product.price*item.product.quantity;
 })
 return price;
};
export default checkout;

/** this ends this file
 * server/controllers/card.controller
 **/
