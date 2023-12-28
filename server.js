const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ItemModel = require("./models/Items");
const userModel = require("./models/ShopperUsers");
const SellerUserModel = require("./models/SellerUsers")

const app = express();
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://kooraprabha48:dGnTeIYS8RXtxf1G@cluster0.cifhezj.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Successfully connected to db");
  app.listen(2000, () => {
    console.log("Express server is started...");
  });
});

app.post("/shopperAuth/login", (req, res) => {
  const { Lemail, Lpassword } = req.body;
  userModel.findOne({ email: Lemail }).then((user) => {
    if (user) {
      if (user.password === Lpassword) {
        res.json("success");
      } else {
        res.json("password was incorrect");
      }
    } else {
      res.json("No user found please Register");
    }
  });
});

app.post("/shopperAuth", (req, res) => {
  userModel
    .create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

app.post("/sellerAuth/login", (req, res) => {
  const { Lemail, Lpassword } = req.body;
  userModel.findOne({ email: Lemail }).then((user) => {
    if (user) {
      if (user.password === Lpassword) {
        res.json("success");
      } else {
        res.json("password was incorrect");
      }
    } else {
      res.json("No user found please Register");
    }
  });
});

app.post("/sellerAuth", (req, res) => {
  SellerUserModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

app.get("/getProducts", (req, res) => {
  ItemModel.find()
    .then((products) => res.json(products))
    .catch((err) => res.json(err));
});

app.post("/createItem", async (req, res) => {
  const { title, description, price, category, image } = req.body;

  if (!title || !price || !description || !category || !image) {
    return res.status(400).json({ message: "Name and price are required" });
  }
  const newItem = new ItemModel({
    title,
    description,
    price,
    category,
    image,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/deleteItem/:id", async (req, res) => {
  const id = req.params.id;

  await ItemModel.findByIdAndDelete(id)
    .then((response) => {
      console.log(response);
      res.status(200).json({success: true,message: "Item deleted successfully", response,});
    })
    .catch((err) => {
      console.error(err);
    });
});

app.put('/updateItem/:editingProductId', async (req, res) => {
  const productId = req.params.editingProductId;
  const updatedProduct = req.body;

  try {
    // Use findByIdAndUpdate to update the product
    const updatedItem = await ItemModel.findByIdAndUpdate(productId, updatedProduct, { new: true });

    if (updatedItem) {
      res.json({ success: true, message: 'Product updated successfully', updatedItem });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});