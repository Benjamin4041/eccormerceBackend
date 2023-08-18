const res = require("express/lib/response");
const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const ProductSchema = require("../model/productSchema");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("../config/cloud");
const fs = require("fs");
const OrderSchema = require("../model/orderSchema");
const { default: mongoose } = require("mongoose");
const newAddress = require("../model/addressSchema");

require("dotenv").config();

const directory = "./images";

//register user
let register = async (req, res) => {
  try {
    const body = req.body; // Get the user data from the request body
    const { email, password } = body;
    let checkUser = await User.findOne({ email });

    if (checkUser != null) {
      res.send("user already exsist");
    } else {
      if (body.password === body.confirmPassword && password.length >= 8) {
        if (email.includes("@") && email.includes(".com") && email.length > 5) {
          let salt = await bcrypt.genSalt(10);
          let hashPassword = await bcrypt.hash(password, salt);
          let hashRole = await bcrypt.hash("customer", salt);

          body.password = hashPassword;
          body.role = hashRole;

          const user = new User(body);
          const data = await user.save();
          res.send(data); // Send the saved user data as the response
        } else {
          res.send("enter a proper email address");
        }
      } else {
        res.send("password don't match or lenth is less than 8");
      }
    }

    // Create a new instance of the User model with the data

    // Save the user to the database
  } catch (error) {
    console.log(error);
    res.json({ error: "Internal server error" }); // Handle any errors and send an error response
  }
};

let adminRegister = async (req, res) => {
  try {
    const body = req.body; // Get the user data from the request body
    const { email, password, role } = body;
    let checkUser = await User.findOne({ email });

    if (checkUser != null) {
      res.send("user already exsist");
    } else {
      if (body.password === body.confirmPassword && password.length >= 8) {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);
        let roleHash = await bcrypt.hash("admin", salt);

        body.password = hash;
        body.role = roleHash;

        const user = new User(body);
        const data = await user.save();
        res.send(data); // Send the saved user data as the response
      } else {
        res.send("password don't match or lenth is less than 8");
      }
    }

    // Create a new instance of the User model with the data

    // Save the user to the database
  } catch (error) {
    console.log(error);
    res.json({ error: "Internal server error" }); // Handle any errors and send an error response
  }
};

//update user controller
let modifyUser = async (req, res) => {
  try {
    let keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key] == "") {
        delete req.body[key];
      } else {
        req.body.key;
      }
    });
    if (req.body == {}) {
      res.send("these's nothing to change");
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); // Find and update the user by the provided ID
    res.send(user); // Send the updated user as the response
  } catch (error) {
    res.status(500).send(error.message); // Handle any errors and send an error response
  }
};

// delete user
let deleteUser = async (req, res) => {
  try {
    let deletedUser = await User.findByIdAndDelete(req.params.id);
    console.log(deletedUser);
    res.send("deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// see one user details
let viewUser = async (req, res) => {
  try {
    let userDetails = await User.findById(req.params.id);
    res.send(userDetails);
  } catch (error) {
    console.log(error);
  }
};

// see all users
let viewAllUsers = async (req, res) => {
  try {
    let user = await User.find({});
    return res.json(user);
  } catch (err) {
    return res.send(err);
  }
};

// check if admin

let handleAdmin = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let checkAdminStatus = await bcrypt.compare("admin", user.role);
    if (checkAdminStatus) {
      console.log({ success: true, message: "You have access" });
      return res.send({ success: true, message: "You have access" });
    }
    res.send({ success: false, message: "Unauthorized" });
  } catch (error) {
    console.log(error);
  }
};

//login

let login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let checkUser = await User.findOne({ email }).select("+password");
    if (checkUser == null) {
      res.send("Check Email or Password");
    }

    let passCheck = await bcrypt.compare(password, checkUser.password);

    if (passCheck) {
      console.log("login successful");
      let id = { id: checkUser._id };
      id = id.id + "";
      let token = jwt.sign(
        { id: id, role: checkUser.role },
        process.env.Jwt_secret,
        { expiresIn: "1d" }
      );
      // return res.send("login successful this is your \n token: " + token);
      return res.send({ message: true, token, userId: checkUser._id });
    }
    console.log("Check Email or Password");
    res.send("Check Email or Password");
  } catch (err) {
    console.log(err);
  }
};

// forgot password

let forgotpassword = () => {};

let resetPassword = async (req, res) => {
  try {
    let { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return res.send("Passwords are not the same");
    }
    let newEncryptedPass = await bcrypt.hash(password, 10);

    let user = await User.findById(req.params.id).select("+password");

    user.password = newEncryptedPass;
    await user.save();
    return res.send({ message: "password changed Successfuly\n", user });
  } catch (error) {
    console.log(error);
  }
};

// for products
let getAllProduct = async (req, res) => {
  try {
    let products = await ProductSchema.find({});
    res.send(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

let creatProduct = async (req, res) => {
  try {
    let path = req.file.path;
    let cloudImg = await cloudinary.uploader.upload(path, {
      imageName: Date.now(),
      width: 500,
      heigth: 500,
      crop: "fill",
      folder: "Cloths",
    });
    let file = cloudImg.secure_url;
    req.body.productImage = {
      imageUrl: file,
      imageId: cloudImg.public_id,
    };
    let createdProduct = new ProductSchema(req.body);
    let data = await createdProduct.save();
    res.send({ data, file });
    console.log({ data, file });

    // this is for deleting the image from the image folder after it has been uploaded to the cloud
    return fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      for (const file of files) {
        fs.unlink(`${directory}/${file}`, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log(`Deleted file: ${file}`);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

let deleteProduct = async (req, res) => {
  try {
    let productDetails = await ProductSchema.findById(req.params.id);
    let imageId = productDetails.productImage.imageId;
    if (imageId) {
      await cloudinary.uploader.destroy(imageId);
      await ProductSchema.findByIdAndDelete(req.params.id);
      res.send({
        message: "Product deleted successfuly",
        deletedItem: productDetails,
      });
    } else {
      await ProductSchema.findByIdAndDelete(req.params.id);
      res.send({
        message: "Product deleted successfuly",
        deletedItem: productDetails,
      });
    }

    // fs.readdir(directory, (err, files) => {
    //   if (err) {
    //     console.error("Error reading directory:", err);
    //     return;
    //   }

    //   for (const file of files) {
    //     fs.unlink(`${directory}/${file}`, (err) => {
    //       if (err) {
    //         console.error("Error deleting file:", err);
    //       } else {
    //         console.log(`Deleted file: ${file}`);
    //       }
    //     });
    //   }
    // });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};


let updateProduct = async (req, res) => {
  try {
    // Uncomment and adjust this section to handle optional or empty values
    for (const key in req.body) {
      if (req.body[key] === "") {
        delete req.body[key];
      }
    }
    let path = req.file.path;
    let cloudImg = await cloudinary.uploader.upload(path, {
      imageName: Date.now(),
      width: 500,
      heigth: 500,
      crop: "fill",
      folder: "Cloths",
    });
    let file = cloudImg.secure_url;
    req.body.productImage = {
      imageUrl: file,
      imageId: cloudImg.public_id,
    };


    const updatedProduct = await ProductSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated", detail: updatedProduct });
    // this is for deleting the image from the image folder after it has been uploaded to the cloud
    return fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      for (const file of files) {
        fs.unlink(`${directory}/${file}`, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log(`Deleted file: ${file}`);
          }
        });
      }
    });



  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

let getProduct = async (req, res) => {
  try {
    let product = await ProductSchema.findById(req.params.id);
    res.send(product);
  } catch (error) {
    console.log(error.message);
  }
};

let productSearch = async (req, res) => {
  try {
    // let{searched}=req.body
    let search = await ProductSchema.find({ productName: req.body.searched });
    res.send(search);
  } catch (error) {
    console.log(error);
  }
};

let userSearch = async (req, res) => {
  try {
    // let{searched}=req.body
    let search = await User.find({ fullname: req.body.searched });
    res.send(search);
  } catch (error) {
    console.log(error);
  }
};

let createOrders = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let newOrder = new OrderSchema(req.body);

    newOrder.customerName = user.fullname;

    let result = await newOrder.save();
    res.send(result);
    /** 
 * for me to get the time in the formart it is in the  frontend you need to do
time.split("T").join(" ").replace("Z","").split(".")[0]
'2023-07-19 16:15:16' 
 */
  } catch (error) {
    console.log(error);
  }
};

let deleteOrder = async () => {
  try {
    let deletedOrder = OrderSchema.findByIdAndDelete(req.params.id);
    console.log(deleteOrder);
    res.send({ success: true, message: "This order has been deleted" });
  } catch (error) {
    console.log(error);
  }
};

let viewAllOrders = async (req, res) => {
  try {
    let orders = await OrderSchema.find({});
    res.send(orders);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

let allAdminUsers = async (req, res) => {
  try {
    let allUsers = await User.find({});

    // Use Promise.all to wait for all asynchronous comparisons
    let filtered = await Promise.all(
      allUsers.map(async (user) => {
        const isCustomer = await bcrypt.compare("admin", user.role);
        return isCustomer ? user : null;
      })
    );

    // Filter out the null values (users that are not customers)
    filtered = filtered.filter((user) => user !== null);

    res.send(filtered);
  } catch (error) {
    console.log(error);
  }
};

let allUsers = async (req, res) => {
  try {
    let allUsers = await User.find({});

    // Use Promise.all to wait for all asynchronous comparisons
    let filtered = await Promise.all(
      allUsers.map(async (user) => {
        const isCustomer = await bcrypt.compare("customer", user.role);
        return isCustomer ? user : null;
      })
    );

    // Filter out the null values (users that are not customers)
    filtered = filtered.filter((user) => user !== null);

    res.send(filtered);
  } catch (error) {
    console.log(error);
  }
};

let addToCart = async (req, res) => {
  try {
    let product = await ProductSchema.findById(req.body.id);
    let user = await User.findById(req.params.id);
    let userPurchasedQuantity = req.body.userPurchasedQuantity;

    let newProduct = product.toObject();
    Reflect.deleteProperty(newProduct, "productQuantity");

    newProduct.userPurchasedQuantity = userPurchasedQuantity;
    newProduct.subTotal = newProduct.productPrice * userPurchasedQuantity;

    user.cart.push(newProduct);

    let cart = user.cart;

    /*
    try getting the user first then then update the user content to 
    what you want and then pass it to the next line of code which 
    would do the update.
    */
    // res.send(user);
    let updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { cart: cart },
      { new: true }
    );
    res.send({
      "success status": true,
      message: "Product Added successfuly",
    });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

let deleteFromCart = async (req, res) => {
  try {
    let product = await ProductSchema.findById(req.body.id);
    let user = await User.findById(req.params.id);
    let userCart = user.cart;
    userCart.splice(
      userCart.indexOf((item) => item._id === req.body.id),
      1
    );
    let updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { cart: userCart },
      { new: true }
    );
    res.send(updateUser);
  } catch (error) {
    console.log(error);
  }
};

let addAddress = async (req, res) => {
  try {
    let userDetail = await User.findById(req.params.id);
    let updatedUserDetails = userDetail.toObject();
    let createAddress = new newAddress(req.body);
    await createAddress.save();
    let addresses = [...updatedUserDetails.address, createAddress];
    let updateUserDetail = await User.findByIdAndUpdate(
      req.params.id,
      { address: addresses },
      { new: true }
    );
    res.send(updateUserDetail);
  } catch (error) {
    // Handle validation errors

    // Handle other unexpected errors
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

let deleteAddress = async (req, res) => {
  try {
    let userDetail = await User.findById(req.params.id);
    await newAddress.findByIdAndDelete(req.body.id);
    let updatedUserDetails = userDetail.toObject();
    updatedUserDetails = updatedUserDetails.address.filter(
      (item) => item._id != req.body.id
    );
    userDetail = await User.findByIdAndUpdate(
      req.params.id,
      { address: updatedUserDetails },
      { new: true }
    );
    res.send({ message: "Address deleted", "user detail": userDetail });
  } catch (error) {
    console.log(error);
  }
};

let pageNotFound = async (req, res) => {
  try {
    res.statusCode = 404;

    return res.send("page does not exsist");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  modifyUser,
  deleteUser,
  viewAllUsers,
  register,
  viewUser,
  login,
  adminRegister,
  getAllProduct,
  deleteProduct,
  updateProduct,
  creatProduct,
  getProduct,
  pageNotFound,
  resetPassword,
  forgotpassword,
  createOrders,
  viewAllOrders,
  productSearch,
  userSearch,
  allAdminUsers,
  allUsers,
  addToCart,
  deleteFromCart,
  addAddress,
  deleteAddress,
  handleAdmin,
  deleteOrder,
};
