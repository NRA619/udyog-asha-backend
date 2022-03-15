const Users = require("../models/userModel");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.playground_client_id;
const CLIENT_SECRET = process.env.playground_client_secret;
const REDIRECT_URI = process.env.playground_REDIRECT_URI;
const REFRESH_TOKEN = process.env.playground_refresh_token;

const userCtrl = {
  // google login logic
  googlelogin: async (req, res) => {
    try {
      const { email } = req.body; // req email
      const user = await Users.findOne({ email }); // email find
      if (!user) {
        return res.json({ isExists: false });
      } else {
        return res.json({
          isExists: true,
          email,
        });
      }
    } catch (err) {
      res.json(err);
    }
  },
  //create profile logic
  createprofile: async (req, res) => {
    try {
      const { fullname, age, gender, mobileno, email, password_repeat } =
        req.body; // req fields to store in the data

      // creating instance

      const newUser = new Users({
        fullname,
        age,
        gender,
        mobileno,
        email,
        password_repeat,
      });
      const user = await Users.findOne({ email }); // email find
      if (!user) {
        // user save
        newUser.save();
        return res.json({ isExists: true, email, fullname, mobileno });
      }
      // saving users
      // const token = jwt.sign({id: newUser.email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
      //   res.cookie('token', token,{
      //     httpOnly:true,
      //     path: '/user/refresh_token'
      //   })
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //email login
  emaillogin: async (req, res) => {
    try {
      const { email, password } = req.body; //pass and email
      const user = await Users.findOne({ email });
      if (password == user.password_repeat) {
        //checking password
        return res.json({ isVerified: true, email });
      } else {
        return res.json({ isVerified: false });
      }
    } catch (err) {
      res.json(err);
    }
  },
  getdata: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (user) {
        fullname = user.fullname;
        mobileno = user.mobileno;
        emaillog = user.email;
        return res.json({ fullname, mobileno, emaillog });
      } else {
        res.json("error");
      }
    } catch (err) {
      res.json(err);
    }
  },
  update_address: async (req, res) => {
    try {
      const { email, addline1, addline2, city, pincode, state } = req.body;
      const query = { email: email };
      const document = {
        $set: {
          "address_array.0.addressline1": addline1,
          "address_array.0.addressline2": addline2,
          "address_array.0.city": city,
          "address_array.0.pincode": pincode,
          "address_array.0.state": state,
        },
      };
      const update = await Users.updateOne(query, document);
      res.json({ updatedsuccessfully: true });
    } catch (err) {
      res.json(err);
    }
  },
  add_adress: async (req, res) => {
    try {
      const { email, addline1, addline2, city, pincode, state } = req.body;
      const query = { email: email };
      const document = {
        $push: {
          address_array: {
            addressline1: addline1,
            addressline2: addline2,
            city: city,
            pincode: pincode,
            state: state,
          },
        },
      };
      const update = await Users.updateOne(query, document);
      res.json({ address_added: true });
    } catch (err) {
      res.json(err);
    }
  },
  get_address: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (user.address_array) {
        const address = user.address_array;
        return res.json({ address });
      } else {
        return res.json("error");
      }
    } catch (err) {
      res.json(err);
    }
  },
  forgetpassword: async (req, res) => {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );
      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      const accessToken = await oAuth2Client.getAccessToken();
      const { email } = req.body;
      if (email) {
        const user = await Users.findOne({ email });
        if (!user) {
          return res.json({ otp: "notfound" });
        } else {
          var digits = "0123456789";
          var otpLength = 6;
          var otp = "";
          for (let i = 1; i <= otpLength; i++) {
            var index = Math.floor(Math.random() * digits.length);
            otp = otp + digits[index];
          }
          const output = `
             <div>${otp}</div>
          `
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
            to: email, // list of receivers
            subject: "Forget Password", // Subject line
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
          return res.json({ otp: otp })
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  updatepassword: async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email }) 
    if(!user) {
      return res.json("no user")
    }else {
      const query = { email: email }
      const document = {
        $set: {
          "password_repeat" : password,
        }
      }
      const update = await Users.updateOne(query, document);
      return res.json({ user: "updatedsuccessfully" })
    }
  },
  sendmail: async (req, res) => {
    try{
      const {name, email, query} = req.body
      
      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );
      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      const accessToken = await oAuth2Client.getAccessToken();
      const output = `
             <div>name: ${name}</div>
             <div>email: ${email}</div>
             <div>query: ${query}</div>

          `
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
            to: '<namanrohilla122@gmail.com>', // list of receivers
            subject: "Query", // Subject line
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
          res.json({ done: true })
    }catch (err){
      console.log(err)
    }
  }
  // refresh_token: async (req,res) => {
  //   const {rf_token} = req.body
  //   const user = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
  //     return res.json({user})
  //   })
  //   console.log(user)

  // },
};

module.exports = userCtrl;
