const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const User = require("./model/userSchema");
const {
  modifyUser,
  deleteUser,
  viewAllUsers,
  register,
  viewUser,
  login,
  adminRegister,
  getAllProduct,
  creatProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  pageNotFound,
  resetPassword,
} = require("./controller/controller");
require("dotenv").config();
const { adminMiddleware, allMiddleware } = require("./middlewire/middleware");
const multer = require("multer");

const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./images"))
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

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+"."+ file.originalname.split(".")[1]);
  },
});

const upload = multer({
  storage: storage,
});

// 404 route
// app.get("*", pageNotFound);

//login route
app.post("/login", login);

// create admin account
app.post("/adminregister", adminMiddleware, adminRegister);

// create user route
app.post("/user", register);

// get all users route
app.get("/users", adminMiddleware, viewAllUsers);

// get a particular user route
app.get("/users/:id", allMiddleware, viewUser);

// update user infor
app.put("/user/:id", allMiddleware, modifyUser);

// delete user
app.delete("/user/:id", adminMiddleware, deleteUser);


// forgot password
app.post('/forgot_password',()=>{
/* add a mailing system that would send a male*/

})

app.post('/reset_password/:id',resetPassword)
// product
app.get("/allproducts", allMiddleware, getAllProduct);

app.post("/product",adminMiddleware,creatProduct);

app.get("/product/:id", allMiddleware, getProduct);

app.put("/product/:id", adminMiddleware, updateProduct);

app.delete("/product/:id", allMiddleware, deleteProduct);

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

//image upload route

app.post("/upload",upload.single("file"),async (req, res) => {
  try {
    
    console.log('./images/'+req.file.filename)
    
   return res.send({"image":'./images/'+req.file.filename,"body":req.body});
  } catch (error) {
    console.log(error);
  }
});
// app.post("/upload",adminMiddleware ,upload.single('image'), (req, res) => {
//   try {
//     res.send("Image uploaded");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error uploading image");
//   }
// });

app.listen(port, () => {
  console.log("listening at port http://localhost:" + port);
});







