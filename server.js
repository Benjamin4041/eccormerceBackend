const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/userSchema");
const {
  modifyUser,
  deleteUser,
  viewAllUsers,
  register,
  viewUser,
  login,
  adminRegister,
  product,
  getAllProduct,
  creatProduct,
  deleteProduct,
  updateProduct,
  getProduct,
} = require("./controller/controller");
const app = express();
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let uri = process.env.mongodb_uri;

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

let port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", login);

// create admin account
app.post("/adminregister", adminRegister);

// create user route
app.post("/user", register);

// get all users route
app.get("/users", viewAllUsers);

// get a particular user route
app.get("/users/:id", viewUser);

// update user infor
app.put("/user/:id", modifyUser);

// delete user
app.delete("/user/:id", deleteUser);

// product
app.get("/allproducts", getAllProduct);

app.post("/product", creatProduct);

app.get("/product/:id", getProduct);

app.put("/product/:id", updateProduct);

app.delete("/product/:id", deleteProduct);

// category


app.post("/category", (req, res) => {});

app.get("/category", (req, res) => {});

app.put("/category/:id", (req, res) => {});


app.delete("/category/:id", (req, res) => {});

//order
app.post("/order", (req, res) => {});

app.get("/order", (req, res) => {});

app.put("/order/:id", (req, res) => {});

app.delete("/order/:id", (req, res) => {});

app.listen(port, () => {
  console.log("listening at port http://localhost:" + port);
});
