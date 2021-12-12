const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');



// for .env file
console.log("hello world")
require("dotenv").config();

console.log("hello worl")
const app = express();
console.log("hello wor")
const port = process.env.PORT || 5000;
console.log("hello wo")

// for connecting backend to frontend, Origin is vercel hosting app
console.log("hello w")
app.use(cors({
  origin: "https://udyog-aasha.vercel.app",
  credentials: true,
}));
console.log("hello")
app.use(express.json());
console.log("hell")
//Routes
app.use("/user", require("./routes/userRouter")); // initial route. !!!important
app.use("/tr", require("./routes/train_route"));
app.use("/product", require("./routes/product"));
app.use("/payment", require("./routes/paymentRoute"));
app.use("/Cart",require("./routes/Cart_router"));
// const productRoutes = require('./routes/products');
// app.use('/products', productRoutes);

//connect to mongodb
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
