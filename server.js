const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
var fileupload = require("express-fileupload");


// for .env file

require("dotenv").config();


const app = express();

const port = process.env.PORT || 5000;


// for connecting backend to frontend, Origin is vercel hosting app

app.use(cors({
  origin: "https://udyog-aasha.vercel.app",
  credentials: true,
}));

app.use(express.json());

app.get("/", function(req, res) {
  res.send({ Udyog_Asha: "Welcome to udyog-asha-backend" });
});

app.get("/user", function(req, res) {
  res.send({ Udyog_Asha: "Welcome to user" });
})

app.get("/service/apply", function(req, res) {
  res.send({ Udyog_Asha: "Welcome to user" });
})
//Routes
app.use("/user", require("./routes/userRouter")); // initial route. !!!important
app.use("/tr", require("./routes/train_route"));
app.use("/product", require("./routes/product"));
app.use("/payment", require("./routes/paymentRoute"));
app.use("/Cart",require("./routes/Cart_router"));
app.use("/service",require("./routes/serviceRoute"));
app.use("/admin", require("./routes/admin"));
// const productRoutes = require('./routes/products');
// app.use('/products', productRoutes);

//connect to mongodb
app.use(fileupload());
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
