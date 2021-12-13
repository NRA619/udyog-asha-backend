const services = require("../models/service");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const serviceCtrl = {
  apply: async (req, res) => {
    try {
      const { email, service, subservice } = req.body;
      const user = await services.findOne({ email });
      var digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var otpLength = 12;
      var otp = "";
      for (let i = 1; i <= otpLength; i++) {
        var index = Math.floor(Math.random() * digits.length);
        otp = otp + digits[index];
      }
      if (user) {
        if (service == "business_support") {
          const query = await services.findOne({
            email: email,
            "business_support.subservice": subservice,
          });
          
          if (query) {
            return res.json({ applied: "already_applied" });
          } else {
            const query1 = { email: email };
            const document = {
              $push: {
                business_support: {
                  subservice: subservice,
                  ref_no: otp,
                },
              },
            };
            const update = await services.updateOne(query1, document);
            const output = `
            <div>Service: ${subservice}</div>
            <div>ref_no.: ${otp}</div>
            <div>Please don't share this no. with anyone</div>
            <div>Thanks for choosing our service</div>
            `
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
                to: email, // list of receivers
                subject: "Service Recipt", // Subject line
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
            console.log(update);
          }
        }
        if (service == "registration") {
          const query = await services.findOne({ email: email, "registration.subservice": subservice });
          if (query) {
            return res.json({ applied: "already_applied" });
          } else {
            const query1 = { email: email };
            const document = {
              $push: {
                registration: {
                  subservice: subservice,
                  ref_no: otp,
                },
              },
            };
            const update = await services.updateOne(query1, document);
            const output = `
            <div>Service: ${subservice}</div>
            <div>ref_no.: ${otp}</div>
            <div>Please don't share this no. with anyone</div>
            <div>Thanks for choosing our service</div>
            `
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
                to: email, // list of receivers
                subject: "Service Recipt", // Subject line
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
            console.log(update);
          }
        }
        if (service == "print_media") {
          const query = await services.findOne({ email: email, "print_media.subservice": subservice });
          if (query) {
            return res.json({ applied: "already_applied" });
          } else {
            const query1 = { email: email };
            const document = {
              $push: {
                print_media: {
                  subservice: subservice,
                  ref_no: otp,
                },
              },
            };
            const update = await services.updateOne(query1, document);
            const output = `
            <div>Service: ${subservice}</div>
            <div>ref_no.: ${otp}</div>
            <div>Please don't share this no. with anyone</div>
            <div>Thanks for choosing our service</div>
            `
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
                to: email, // list of receivers
                subject: "Service Recipt", // Subject line
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
            console.log(update);
          }
        }
        if (service == "social_media_marketing") {
          const query = await services.findOne({
            email: email,
            "social_media_marketing.subservice": subservice,
          });
          if (query) {
            return res.json({ applied: "already_applied" });
          } else {
            const query1 = { email: email };
            const document = {
              $push: {
                social_media_marketing: {
                  subservice: subservice,
                  ref_no: otp,
                },
              },
            };
            const update = await services.updateOne(query1, document);
            const output = `
            <div>Service: ${subservice}</div>
            <div>ref_no.: ${otp}</div>
            <div>Please don't share this no. with anyone</div>
            <div>Thanks for choosing our service</div>
            `
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
                to: email, // list of receivers
                subject: "Service Recipt", // Subject line
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
            console.log(update);
          }
        }
      } else {
        if (service == "business_support") {
          const newservice = new services({
            email: email,
            business_support: {
              subservice: subservice,
              ref_no: otp,
            },
          });
          newservice.save();
          const output = `
            <div>Service: ${subservice}</div>
            <div>ref_no.: ${otp}</div>
            <div>Please don't share this no. with anyone</div>
            <div>Thanks for choosing our service</div>
            `
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
                to: email, // list of receivers
                subject: "Service Recipt", // Subject line
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
        }
        if (service == "registration") {
          const newservice = new service({
            email: email,
            registration: {
              subservice: subservice,
              ref_no: otp,
            },
          });
          newservice.save();
          const output = `
            <div>Service: ${subservice}</div>
            <div>ref_no.: ${otp}</div>
            <div>Please don't share this no. with anyone</div>
            <div>Thanks for choosing our service</div>
            `
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
                to: email, // list of receivers
                subject: "Service Recipt", // Subject line
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
        }
        if (service == "print_media") {
          const newservice = new service({
            email: email,
            print_media: {
              subservice: subservice,
              ref_no: otp,
            },
          });
          newservice.save();
          const output = `
            <div>Service: ${subservice}</div>
            <div>ref_no.: ${otp}</div>
            <div>Please don't share this no. with anyone</div>
            <div>Thanks for choosing our service</div>
            `
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
                to: email, // list of receivers
                subject: "Service Recipt", // Subject line
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
        }
        if (service == "social_media_marketing") {
          const newservice = new service({
            email: email,
            social_media_marketing: {
              subservice: subservice,
              ref_no: otp,
            },
          });
          newservice.save();
          const output = `
            <div>Service: ${subservice}</div>
            <div>ref_no.: ${otp}</div>
            <div>Please don't share this no. with anyone</div>
            <div>Thanks for choosing our service</div>
            `
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
                to: email, // list of receivers
                subject: "Service Recipt", // Subject line
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
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = serviceCtrl;
