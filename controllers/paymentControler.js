require("dotenv").config();
const path = require("path");
const Formidable = require("formidable");
const crypto = require("crypto");
const request = require("request");
const orderSchema = require("../models/orderSchema");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const Insta = require("instamojo-nodejs");
const url = require("url");
const Users = require("../models/userModel");
const tempSchema = require("../models/temp");
const servOrderSchema = require("../models/servOrderSchema");
let orderId;
// const Insta = require('instamojo-nodejs');

const CLIENT_ID = process.env.playground_client_id;
const CLIENT_SECRET = process.env.playground_client_secret;
const REDIRECT_URI = process.env.playground_REDIRECT_URI;
const REFRESH_TOKEN = process.env.playground_refresh_token;

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECREAT_KEY,
});
const paymentControler = {
  createOrder: async (req, res) => {
    try {
      console.log("ho");
      Insta.setKeys(
        process.env.instamojo_key1,
        process.env.instamojo_key2
      );

      const data = new Insta.PaymentData();
      console.log(data);
     
      data.purpose = req.body.purpose;
      data.amount = req.body.amount;
      data.buyer_name = req.body.buyer_name;
      data.redirect_url = req.body.redirect_url;
      data.email = req.body.email;
      data.phone = req.body.phone;
      data.send_email = true;
      data.custom_fields = req.body.product;
      data.status_state = req.body.status_state;
      data.send_sms = true;
      data.allow_repeated_payments = false;
      console.log(data);
      if(data.amount > 9 && Object.keys(data.purpose).length > 0){
        Insta.createPayment(data, function (error, response) {
          if (error) {
            // some error
          } else {
            // Payment redirection link at response.payment_request.longurl
  
            console.log(response);
            const responseData = JSON.parse(response);
            const result = responseData.payment_request;
            const newOrder = new tempSchema({
              result: result,
              product_array: data.custom_fields,
              status: data.status_state,
            });
            newOrder.save();
            console.log(newOrder);
            const redirectUrl = responseData.payment_request.longurl;
            console.log(responseData);
            return res.status(200).json({ url: redirectUrl });
          }
          
        });
      }else {
        return res.json("payment Destroyed")
      }
      return 
      // const { price } = req.body;
      // var options = {
      //   amount: price, // amount in the smallest currency unit paise
      //   currency: "INR",
      //   receipt: 123,
      // };
      // instance.orders.create(options, function (err, order) {
      //   if (err) {
      //     return res.status(500).json({
      //       error: err,
      //     });
      //   }
      //   orderId = order.id;
      //   return res.json(order);
      // });
    } catch (err) {
      res.json(err);
    }
  },

  paymentCallback: async (req, res) => {
    let url_parts = url.parse(req.url, true),
      responseData = url_parts.query;
    if (responseData.payment_id) {
      let userId = responseData.user_id;
      Insta.setKeys(
        process.env.instamojo_key1,
        process.env.instamojo_key2
      );
      const user = await Users.findOne({ email: userId });
      console.log(user);
      Insta.getPaymentDetails(
        responseData.payment_request_id,
        responseData.payment_id,
        async function (error, response) {
          if (error) {
            // Some error
          } else {
            console.log(user2313123);
            console.log(response);
            if (user2313123.status == "pending") {
              response.payment_request.payment.shipping_address =
                user.address_array[0].addressline1 +
                " " +
                user.address_array[0].addressline2;
              response.payment_request.payment.shipping_city =
                user.address_array[0].city;
              response.payment_request.payment.shipping_state =
                user.address_array[0].state;
              response.payment_request.payment.shipping_pincode =
                user.address_array[0].pincode;
            }
            const sup1 = response.payment_request.payment;
            const newOrder = new orderSchema({
              result: sup1,
              product_array: user2313123.product_array,
              status: user2313123.status,
            });
            newOrder.save(); //s
            if(user2313123.status == "in-progress"){
              const servOrder = new servOrderSchema({
                result: sup1,
                product_array: user2313123.product_array,
                status: user2313123.status,
              });
              servOrder.save();
            }
          }
        }
      );
      return res.redirect('https://www.udyogaasha.com/training/thankyou');
    }
    // const form = Formidable();
    // form.parse(req, (err, fields, files) => {
    //   if (fields) {
    //     const hash = crypto
    //       .createHmac("sha256", process.env.SECREAT_KEY)
    //       .update(orderId + "|" + fields.razorpay_payment_id)
    //       .digest("hex");

    //     if (fields.razorpay_signature === hash) {
    //       const info = {
    //         _id: fields.razorpay_payment_id,
    //         razorpay_order_id: fields.razorpay_order_id,
    //       };
    //       const order = new orderSchema({
    //         _id: info._id,
    //         orders: fields.razorpay_order_id,
    //       });

    //       order.save((err, data) => {
    //         if (err) {
    //           res.status(400).json({
    //             error: "Not able to save in Db",
    //           });
    //         } else {
    //           res.redirect(
    //             `${process.env.FRONTEND}/payment/status/${fields.razorpay_payment_id}`
    //           );
    //         }
    //       });
    //     } else {
    //       res.send("ERROR");
    //     }
    //   }
    // });
  },

  getPayment: async (req, res) => {
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const accessToken = await oAuth2Client.getAccessToken();
    request(
      `https://${process.env.KEY_ID}:${process.env.SECREAT_KEY}@api.razorpay.com/v1/payments/${req.params.paymentId}`,
      function (error, response, body) {
        if (body) {
          const result = JSON.parse(body);
          const { product_array, status } = req.body;
          // res.status(200).json(result);
          const newOrder = new orderSchema({
            result,
            product_array,
            status,
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
                       <h3 style="color: white; margin-bottom: 5px; padding-top: 10px;">Rs.${
                         result.amount / 100
                       }</h3>
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
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${
                         result.id
                       }</h4>
                    </div>
                   <div style="
                               display: block;
                               color: white;
                               width: 60%;                              
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Paid On</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${
                         result.created_at
                       }</h4>
                    </div>
                   <div style="
                               display: block;                               
                               color: white;
                               width: 60%;
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Method</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${
                         result.method
                       }</h4>
                    </div>
                   <div style="
                               display: block;                               
                               color: white;
                               width: 60%;
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Mobile no.</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${
                         result.contact
                       }</h4>
                    </div>
                  <div style="
                               display: block; 
                               color: white;
                               width: 60%;
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Email</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${
                         result.email
                       }</h4>
                    </div>
                    <div style="
                               display: block; 
                               color: white;
                               width: 60%;
                               ">
                       <h4 style="margin-bottom: 0; text-align: start; margin-left: 10%; color: white;">Order Description</h4>
                       <h4 style="margin: 0; text-align: start; margin-left: 10%; color: #1E90FF;">${
                         result.description
                       }</h4>
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
              service: "gmail",
              auth: {
                type: "OAuth2",
                user: "udyogaasha157@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
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
              console.log("Message sent: %s", info.messageId);
              console.log(
                "Preview URL: %s",
                nodemailer.getTestMessageUrl(info)
              );
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
    try {
      const { email, pid } = req.body;
      const check = await orderSchema.findOne({
        "result.buyer_email": email,
        "product_array.productid": pid,
      });
      if (!check) {
        return res.json({ paid: false });
      } else {
        return res.json({ paid: true });
      }
    } catch (err) {
      res.json(err);
    }
  },
  checkPaid_training: async (req, res) => {
    try {
      const { email, pid } = req.body;
      const check = await orderSchema.findOne({
        "result.buyer_email": email,
        "product_array._id": pid,
      });
      if (!check) {
        return res.json({ paid: false });
      } else {
        return res.json({ paid: true });
      }
    } catch (err) {
      res.json(err);
    }
  },
  checkPaid_services: async (req, res) => {
    try {
      const { email, service_name } = req.body;
      const check = await servOrderSchema.findOne({
        "result.buyer_email": email,
        "product_array.name": service_name,
      });
      if (!check) {
        return res.json({ paid: false });
      } else {
        return res.json({ paid: true });
      }
    } catch (err) {
      console.log(err);
    }
  },
  Enrolled_Courses: async (req, res) => {
    try {
      const { email } = req.body;
      const check = await orderSchema.find({
        "result.buyer_email": email,
      });
      res.json(check);
    } catch (err) {
      res.json(err);
    }
  },
  check_pending_products: async (req, res) => {
    try {
      const response = await orderSchema.find({ status: "pending" });
      return res.json(response);
    } catch (err) {
      console.log(err);
    }
  },
  pending_products: async (req, res) => {
    try {
      const { pay_id, email, timestamp } = req.body;
      const res = await orderSchema.findOne({
        "result.payment_id": pay_id,
        "result.buyer_email": email,
        "result.created_at": timestamp,
      });
      if (res) {
        const docu = {
          $set: {
            status: "completed",
          },
        };
        const update = await orderSchema.updateOne(res, docu);
        console.log(update);
        return res.json({ update: true });
      }
    } catch (err) {
      console.log(err);
    }
  },
  check_in_progress: async (req, res) => {
    try {
      const response = await servOrderSchema.find({ status: "in-progress" });
      return res.json(response);
    } catch (err) {
      console.log(err);
    }
  },
  in_progress_services: async (req, res) => {
    try {
      const { pay_id, email, timestamp } = req.body;
      const res = await servOrderSchema.findOne({
        "result.payment_id": pay_id,
        "result.buyer_email": email,
        "result.created_at": timestamp,
      });
      if (res) {
        const docu = {
          $set: {
            status: "completed",
          },
        };
        const update = await servOrderSchema.updateOne(res, docu);
        return res.json({ update: true });
      }
    } catch (err) {
      console.log(err);
    }
  },
  checkPaid_training_2: async (req, res) => {
    try {
      const { email, pid } = req.body;
      const check = await orderSchema.findOne({
        "result.buyer_email": email,
        "product_array._id": pid,
      });
      if (!check) {
        return res.json({ data: "Not found" });
      } else {
        return res.json({ data: check._id });
      }
    } catch (err) {
      res.json(err);
    }
  },
};
module.exports = paymentControler;
