require("dotenv").config();
const path = require("path");
const Formidable = require("formidable");
const crypto = require("crypto");
const request = require("request");
const orderSchema = require("../models/orderSchema");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
let orderId;

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECREAT_KEY,
});
const paymentControler = {
  createOrder: async (req, res) => {
    try {
      const { price } = req.body;
      var options = {
        amount: price, // amount in the smallest currency unit paise
        currency: "INR",
        receipt: 123,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        orderId = order.id;
        return res.json(order);
      });
    } catch (err) {
      res.json(err);
    }
  },

  paymentCallback: async (req, res) => {
    const form = Formidable();
    form.parse(req, (err, fields, files) => {
      if (fields) {
        const hash = crypto
          .createHmac("sha256", process.env.SECREAT_KEY)
          .update(orderId + "|" + fields.razorpay_payment_id)
          .digest("hex");

        if (fields.razorpay_signature === hash) {
          const info = {
            _id: fields.razorpay_payment_id,
            razorpay_order_id: fields.razorpay_order_id,
          };
          const order = new orderSchema({
            _id: info._id,
            orders: fields.razorpay_order_id,
          });

          order.save((err, data) => {
            if (err) {
              res.status(400).json({
                error: "Not able to save in Db",
              });
            } else {
              res.redirect(
                `${process.env.FRONTEND}/payment/status/${fields.razorpay_payment_id}`
              );
            }
          });
        } else {
          res.send("ERROR");
        }
      }
    });
  },

  getPayment: async (req, res) => {
    request(
      `https://${process.env.KEY_ID}:${process.env.SECREAT_KEY}@api.razorpay.com/v1/payments/${req.params.paymentId}`,
      function (error, response, body) {
        if (body) {
          const result = JSON.parse(body);
          const {product_array} = req.body;
          // res.status(200).json(result);
          const newOrder = new orderSchema({
            result,
            product_array
          });
          
          newOrder.save();
          if (
            result.error_code == null &&
            result.captured == true &&
            result.captured == true
          ) {
            
            const output = `
            
            <div style = "
                      align-items: center;
                      display: flex;
                      flex-direction: column;
                      ">
        <div style="
                    background-image: linear-gradient(to bottom right, #1589FF, #000080);
                    background-size: cover;
                    display: block;
                    text-align: center;
                    width:100%;
                    height: 100%;
                    ">
            <p style="
                      color: aliceblue;
                      ">Udyog-Asha</p>
            <div style="
                        background-color: #2C3539;
                        width: 100%;
                        height: 100%;
                        display: block;                    
                        padding-bottom: 10px;                      
                        ">
               
                   <div style="
                               display: block;
                               text-align: center;
                               ">
                       <h3 style="color: white; margin-bottom: 5px; padding-top: 10px;">Rs.${result.amount}</h3>
                       <h5 style="color: white; margin: 0;">Paid Successfully</h5>
                   </div>
                   <div style="
                               display: block;
                               background-color: #1589FF;
                               height: 2px;
                               margin-top: 10px; 
                               "></div>
                   <div style="
                               display: block;                   
                               color: white;
                               width: 60%;
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Payment Id</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${result.id}</h4>
                    </div>
                   <div style="
                               display: block;
                               color: white;
                               width: 60%;                              
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Paid On</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${result.created_at}</h4>
                    </div>
                   <div style="
                               display: block;                               
                               color: white;
                               width: 60%;
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Method</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${result.method}</h4>
                    </div>
                   <div style="
                               display: block;                               
                               color: white;
                               width: 60%;
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Mobile no.</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${result.contact}</h4>
                    </div>
                  <div style="
                               display: block; 
                               color: white;
                               width: 60%;
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Email</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${result.email}</h4>
                    </div>
                    <div style="
                               display: block; 
                               color: white;
                               width: 60%;
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Order Description</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${result.description}</h4>
                    </div>
                    <div style="
                                width: 40%;
                                padding-left: 30%;
                                text-align: center;
                                padding-top: 10%; 
                                ">
                        <h5 style="color: white;">
                            Thank you so much for subscribing and purchasing this course.
                        </h5>
                </div>
                </div>
            </div>
       
        </div>
            `;
            let transporter = nodemailer.createTransport({
              service: "Gmail", // true for 465, false for other ports
              auth: {
                user: "udyogaasha157@gmail.com", // generated ethereal user
                pass: "udyog157aasha", // generated ethereal password
              },
              tls: {
                rejectUnauthorized: false,
              },
            });

            // setup email data with unicode symbols
            let mailOptions = {
              from: '"Udyog-Asha" <udyogaasha157@gmail.com>', // sender address
              to: result.email, // list of receivers
              subject: "Payment Recipt", // Subject line
              html: output, // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              // console.log("Message sent: %s", info.messageId);
              // console.log(
              //   "Preview URL: %s",
              //   nodemailer.getTestMessageUrl(info)
              // );
            });

            return res.status(200).json({ paymentSuccess: true });
          } else {
            return res.status(200).json({ paymentSuccess: false });
          }
        }
      }
    );
  },
  checkPaid_product: async (req, res) => {
    try{
      const {email, pid} = req.body
      const check = await orderSchema.findOne({ "result.email": email, "product_array.productid": pid })
      if(!check) {
        return res.json({ paid: false });
      }else {
        return res.json({ paid: true });
      }
    }catch(err){
      res.json(err)
    }
  },
  checkPaid_training: async (req, res) => {
    try{
      const {email, pid} = req.body
      const check = await orderSchema.findOne({ "result.email": email, "product_array._id": pid })
      if(!check) {
        return res.json({ paid: false });
      }else {
        return res.json({ paid: true });
      }
    }catch(err){
      res.json(err)
    }
  }
};
module.exports = paymentControler;
