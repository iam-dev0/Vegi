import { myValidationResult } from "../utils/util";
import User from "../models/users";
const UsersController = {};

/* GET*/
UsersController.getUsers = async (req, res) => {
  await User.find({}, async (err, data) => {
    if (err) {
      res.status(400).json({
        success: false,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible",
        error: err
      });
      return;
    }
    let NewUsers = data.map(item => {
      item.password = "";
      return item;
    });

    res.status(200).json({
      success: true,
      message: "List of User",
      data: NewUsers
    });
  });
};

UsersController.getUser = async (req, res) => {
  const { id } = req.params;

  await User.findById(id)
    .then(response => {
      response.password = "";
      res.status(200).json({
        success: true,
        message: "",
        data: response
      });
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
};
UsersController.GetAddressData = async (req, res) => {
  /*
 
    */

  const { id } = req.params;
  await User.findOne({ _id: id }, async (err, data) => {
    if (err) {
      res.status(200).json({
        success: true,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible",
        error: err
      });
    }
    data.password = "";
    res.status(200).json({
      success: true,
      message: "Sucessfully Edited the Address data",
      data: data.address
    });
  });
};
UsersController.GetContactInfo = async (req, res) => {
  const { id } = req.params;

  await User.findOne({ _id: id }, async (err, data) => {
    if (err) {
      console.log(error);
      res.status(200).json({
        success: true,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible",
        error: err
      });
    }
    data.password = "";
    res.status(200).json({
      success: true,
      message: "Sucessfully Edited the Address data",
      data: { address: data.address, phone: data.phone }
    });
  });
};
UsersController.GetPhonesData = async (req, res) => {
  const { id } = req.params;
  const { phone } = req.body;

  await User.findOne({ _id: id }, async (err, data) => {
    if (err) {
      res.status(200).json({
        success: true,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible",
        error: err
      });
    }
    data.password = "";
    res.status(200).json({
      success: true,
      message: "Sucessfully Edited the Address data",
      data: {
        phone_added: data.phone_added,
        phone_verified: data.phone_verified,
        phone: data.phone
      }
    });
  });
};

/*POST */

UsersController.createUser = async (req, res) => {
  try {
    const errors = myValidationResult(req).array(); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible",
        error: err
      });
      return;
    }
    let { username, email, password, is_admin } = req.body;
    is_admin = is_admin ? is_admin : false;
    const { file } = req;
    const image = `/uploads/${file.filename}`;
    User.findOne({ email }, function(err, data) {
      if (err) {
        res.status(422).json({
          success: false,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
        return;
      }
      if (!data) {
        const user = new User({
          username,
          email,
          password,
          profile_image: image,
          is_admin
        });

        user.save((err, data) => {
          if (err) {
            res.json({ error: err });
          } else {
            data.password = "";
            res.status(200).json({
              success: true,
              message: "User Sucessfully Registered",
              data
            });
          }
        });
      } else {
        res.send({ success: false, message: "User already Registered", data });
      }
    });
  } catch (err) {
    res.status(422).json({
      success: false,
      message:
        "Sorry Something Happened We'll get back to you as soon as possible",
      error: err
    });
  }
};

UsersController.Login = async (req, res) => {
  const errors = myValidationResult(req).array(); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (errors.length > 0) {
    res.status(422).json({
      success: false,
      message:
        "Sorry Something Happened We'll get back to you as soon as possible",
      error: err
    });
    return;
  }
  const { email, password } = req.body;
  User.findOne({ email }, function(err, data) {
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
      if (data.password === password) {
        //console.log("Done Login");
        //req.session.userId = data.unique_id;
        //console.log(req.session.userId);
        data.password = "";
        res.status(200).json({
          success: true,
          message: "Successfully login",
          data: data
        });
      } else {
        res.status(400).json({ success: false, message: "Login fail" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "This Email Is not regestered!" });
    }
  });
};
UsersController.AddAddressData = async (req, res) => {
  /*
        model for req: 
        {
            "contact": "contact", no required
            "street": "street", required
            "city": "city", required
            "province": "province", required
            "zip": "zip", required
        }
    */

  const { id } = req.params;
  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        address: req.body,
        address_is_available: true,
        phone: req.body.phone,
        phone_added: true
      }
    },
    async (err, data) => {
      if (err) {
        console.log(error);
        res.status(200).json({
          success: true,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
      }
      data.password = "";
      res.status(200).json({
        success: true,
        message: "Sucessfully Edited the Address data",
        data: data
      });
    }
  );
};

/*PUT */

UsersController.UploadImageUser = async (req, res) => {
  let image = "";
  const { id } = req.params;
  try {
    const { file } = req;
    if (file.cloudStorageError) {
      res.status(422).json({
        success: false,
        errors: cloudStorageError,
        message:
          "Sorry Something Happened We'll get back to you as soon as possible"
      });
      return;
    }
    const {
      file: { cloudStorageImageUrl }
    } = req;

    if (cloudStorageImageUrl) {
      image = cloudStorageImageUrl;
    }
    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          profile_image: image
        }
      },
      async (err, data) => {
        if (err) {
          res.status(200).json({
            success: true,
            message:
              "Sorry Something Happened We'll get back to you as soon as possible",
            error: error
          });
        }
        data.password = "";
        res.status(200).json({
          success: true,
          message: "Sucessfully Edited the Address data",
          data: data
        });
      }
    );
  } catch (err) {
    res.json({
      success: false,
      message:
        "Sorry Something Happened We'll get back to you as soon as possible",
      error: err
    });
  }
};
UsersController.editEmail = async (req, res) => {
  /*
        model for req: 
            {
                "verified": false,
                "email": "correo@pedroruizhidalgo.es"
            }
    */
  const { email } = req.body;
  const { id } = req.params;
  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        email: email
      }
    },
    async (err, data) => {
      if (err) {
        res.status(200).json({
          success: true,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: error
        });
      }
      data.password = "";
      res.status(200).json({
        success: true,
        message: "Sucessfully Edited the Address data",
        data: data
      });
    }
  );
};
UsersController.contactInfo = async (req, res) => {
  const { id } = req.params;
  const { line, city, country, zip, phone } = req.body;
  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: { address: { line, city, country, zip }, phone, phone_added: true }
    },
    async (err, data) => {
      if (err) {
        console.log(error);
        res.status(200).json({
          success: true,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
      }
      data.password = "";
      res.status(200).json({
        success: true,
        message: "Sucessfully Edited the Address data",
        data: data
      });
    }
  );
};
UsersController.EditAddressData = async (req, res) => {
  const { id } = req.params;
  await User.findOneAndUpdate(
    { _id: id },
    { $set: { addresses: req.body, addresses_is_available: true } },
    async (err, data) => {
      if (err) {
        res.status(200).json({
          success: true,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
      }
      data.password = "";
      res.status(200).json({
        success: true,
        message: "Sucessfully Edited the Address data",
        data: data
      });
    }
  );
};
UsersController.editPhonesData = async (req, res) => {
  /*
        model for phones
    {
        phoneType: { type: String, required: false },
        prefix: { type: String, required: false},
        number: { type: String, required: true },
        subfix: { type: String, requied: false},
        memo: { type: String, required: false, description: "use if you need other data" },

        required: false
    }
    */

  const { id } = req.params;
  const { phone } = req.body;

  await User.findOneAndUpdate(
    { _id: id },
    { $set: { phones: phone } },
    async (err, data) => {
      if (err) {
        res.status(200).json({
          success: true,
          message:
            "Sorry Something Happened We'll get back to you as soon as possible",
          error: err
        });
      }
      data.password = "";
      res.status(200).json({
        success: true,
        message: "Sucessfully Edited the Address data",
        data: data
      });
    }
  );
};

/* DELETE */
UsersController.deleteEmails = async (req, res) => {
  const { email } = req.params;
  const { id } = req.params;

  await User.update(
    { _id: id },
    { $pull: { emails: { _id: email } } },
    { safe: true }
  )
    .then(User => {
      console.log(User);
    })
    .catch(e => console.log(e))
    .then(() => {
      res.json({ status: "200" });
    });
};

UsersController.deleteAddresses = async (req, res) => {
  const { address } = req.params;
  const { id } = req.params;

  await User.update(
    { _id: id },
    { $pull: { addresses: { _id: address } } },
    { safe: true }
  )
    .then(response => {
      console.log(User);
    })
    .catch(e => console.log(e))
    .then(() => {
      res.json({ status: "200" });
    });
};

UsersController.deletePhones = async (req, res) => {
  const { phone } = req.params;
  const { id } = req.params;

  await User.update(
    { _id: id },
    { $pull: { phones: { _id: phone } } },
    { safe: true }
  )
    .then(response => {
      console.log(response);
    })
    .catch(e => console.log(e))
    .then(() => {
      res.json({ status: "200" });
    });
};

UsersController.deleteUser = async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndRemove(id).then(() => {
    res.json({ status: "200" });
  });
};

module.exports = UsersController;

/** this ends this file
 * server/controllers/User.controller
 **/
