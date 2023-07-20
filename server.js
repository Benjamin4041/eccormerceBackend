const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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
  allOrders,
  viewAllOrders,
  createOrders,
  productSearch,
  userSearch,
  allAdminUsers,
  allUsers,
} = require("./controller/controller");
require("dotenv").config();
const { adminMiddleware, allMiddleware } = require("./middlewire/middleware");
const multer = require("multer");

const app = express();

app.use(cors());
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

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.originalname.split(".")[1]);
  },
});

const upload = multer({
  storage: storage,
});

//login route
app.post("/api/login", login);

// create admin account
// app.post("/api/adminregister", adminMiddleware, adminRegister);
app.post("/api/adminregister", adminRegister);

// create user route
app.post("/api/registeruser", register);

// get all users route
app.get("/api/users", adminMiddleware, viewAllUsers);

// get a particular user route
app.get("/api/users/:id", allMiddleware, viewUser);

// update user infor
app.put("/api/user/:id", allMiddleware, modifyUser);

// delete user
app.delete("/api/user/:id", adminMiddleware, deleteUser);



// get all the admin detail
app.get('/api/alladminuser',allAdminUsers)


// get all the users detail
app.get('/api/alluser',allUsers)


// forgot password
app.post("/api/forgot_password", () => {
  /* add a mailing system that would send a male*/
});

app.post("/api/reset_password/:id", resetPassword);

// product

app.get("/api/allproducts", allMiddleware, getAllProduct);

app.post(
  "/api/createproduct",
  upload.single("productImage"),
  adminMiddleware,
  creatProduct
);

app.get("/api/product/:id", allMiddleware, getProduct);

app.put("/api/product/:id", adminMiddleware, updateProduct);

app.delete("/api/product/:id", allMiddleware, deleteProduct);

// category

app.post("/api/category", (req, res) => {});

app.get("/api/category", (req, res) => {});

app.put("/api/category/:id", (req, res) => {});

app.delete("/api/category/:id", (req, res) => {});




// create order
app.post("/api/user/:id/createorder/",createOrders);


//get all oders
app.get("/api/allorder",adminMiddleware,viewAllOrders);


// get one order


// update the order
app.put("/api/updateorder/:id", (req, res) => {});


// delete the order
app.delete("/api/deleteorder/:id", (req, res) => {});


//search 

app.post('/api/productsearch',productSearch)
app.post('/api/usersearch',userSearch)



// 404 route
app.get("*", pageNotFound);
//image upload route

// app.post("/api/upload", upload.single("image"), async (req, res) => {});

app.listen(port, async () => {
  try {
    console.log("listening at port http://localhost:" + port);
  } catch (error) {
    console.log(error.message);
  }
});
