const res = require("express/lib/response");
const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const ProductSchema = require("../model/productSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();









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
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt);
        let hashRole = await bcrypt.hash("customer", salt);

        body.password = hashPassword;
        body.role = hashRole;

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
    await User.findByIdAndDelete(req.params.id);
    res.send("deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// see one user details
let viewUser = async (req, res) => {
  try {
    User.findById(req.params.id);
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

//login

let login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let checkUser = await User.findOne({ email }).select("+password");
    if (checkUser == null) {
      res.send("user does not exsist");
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
      return res.send("login successful this is your \n token: " + token);
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

  let createdProduct = new ProductSchema(req.body);
  let data = await createdProduct.save();
  res.send(data);
};

let deleteProduct = async (req, res) => {
  try {
    let delProduct = await ProductSchema.findByIdAndDelete(req.params.id);
    res.send("Product deleted successfuly");
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

let updateProduct = async (req, res) => {
  try {
    let updatedProduct = ProductSchema.findOneAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send("product updated");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

let getProduct = async (req, res) => {
  try {
    let product = await ProductSchema.findById(req.params.id);
    res.send(product);
  } catch (error) {
    console.log(error);
  }
};

let productSearch = () => {};

let userSearch = () => {};

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
};
