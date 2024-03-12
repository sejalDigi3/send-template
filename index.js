const express = require('express')
const app = express();
const path = require('path')
require('dotenv').config();
const port = process.env.PORT || 8888;
const cookieParser = require('cookie-parser');
const axios = require('axios');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ejs = require('ejs');
app.set('view engine', 'ejs');

const multer = require('multer');
const csvtojson = require('csvtojson');
const xlsx = require("xlsx");
const upload = multer({ dest: 'uploads/' });

require('./database/conn');
const {
  alluserOfourPanel,
  templateMsg,
  customMessageContent,
  ChattingMsg,
  NumberModel,
  GroupManage
}
  = require('./model/schema');



app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use("", require('./routes/routes'))


const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const nodemailer = require('nodemailer');
const uuid = require('uuid'); // Import the uuid library

// Create a Nodemailer transporter with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rahulwaghela191919@gmail.com',
    pass: 'ywfkswrvdawwxdoz',
  },
});

// this post request for register
app.post('/Register', async (req, res) => {
  try {
    const { fname, lname, phoneNum, userEmail, userpassword, cpassword } = req.body;
    // Check if the phone number already exists in the database
    // const existingUser = await alluserOfourPanel.findOne({ phoneNum });
    const existingUser = await alluserOfourPanel.findOne({ phoneNum }).maxTimeMS(20000); // Increase timeout to 20 seconds
    const existingEmail = await alluserOfourPanel.findOne({ userEmail });
    if (existingUser) {
      return res.render('Register', {
        validationErrors: ['Phone number is already registered.'],
        fname,
        lname,
        phoneNum,
        userEmail,
      });
    }
    if (existingEmail) {
      return res.render('Register', {
        validationErrors: ['Email is already registered.'],
        fname,
        lname,
        phoneNum,
        userEmail,
      });
    }
    // Generate a unique verification token using uuid
    const verificationToken = uuid.v4(); // Use uuid to generate a random UUID
    const empData = new alluserOfourPanel({
      fname,
      lname,
      phoneNum,
      userEmail,
      userpassword,
      cpassword,
      registertoken: verificationToken,
    });
    try {
      await empData.validate();
    } catch (validationError) {
      // Collect validation errors and pass them to the template
      const validationErrors = Object.values(validationError.errors).map((err) => err.message);
      return res.render('Register', {
        validationErrors,
        fname,
        lname,
        phoneNum,
        userEmail,
      });
    }
    // saving all data inlcuding verification token
    await empData.save();
    //i've create a verification link with the token
    const verificationLink = `http://localhost:${port}/verify/${verificationToken}`;
    // const verificationLink = `https://whatsapppanel-v0.onrender.com/verify/${verificationToken}`;

    console.log(verificationLink);
    // Send a verification email
    const mailOptions = {
      from: 'rahulwaghela191919@gmail.com',
      to: userEmail,
      subject: 'Email Verification',
      text: `Click the following link to verify your email: ${verificationLink}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending failed:', error);
        return res.status(500).send('Email sending failed.');
      }
      console.log('Email sent:', info.response);
      res.render('verificationSent'); // You can render a page indicating that the verification email has been sent.
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).send('Registration failed.');
  }
});
app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  const user = await alluserOfourPanel.findOne({ registertoken: token });
  if (!user) {
    res.render('verificationFailed');
  } else {
    user.isVerified = true;
    await user.save();
    res.render('verificationSuccess');
  }
});


// this post request is for login
app.post('/', async (req, res) => {
  try {
    const userEmail = req.body.userEmail;
    const userpassword = req.body.userpassword;
    // Check if either userEmail or userpassword is empty
    if (!userEmail || !userpassword) {
      const loginErrors = ['Please provide username and password'];
      return res.render('login', { loginErrors });
    }
    const getUserEmail = await alluserOfourPanel.findOne({ userEmail: userEmail });
    if (getUserEmail === null) { // Check explicitly for null
      // Handle the case where the user with the provided email is not found
      const loginErrors = ['User not found.'];
      return res.render('login', { loginErrors });
    }

    //  now check the status here
    if (!getUserEmail.isActive) {
      const loginErrors = ['Your account is deactivated. Please contact the admin.'];
      return res.render('login', { loginErrors });
    }



    const isPasswordValid = await bcrypt.compare(userpassword, getUserEmail.userpassword);
    // getUserEmail.userpassword===userpassword
    if (isPasswordValid) {
      const token = await getUserEmail.genrateAuthToken();
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + oneDayInMilliseconds)
      });
      const countDetails = await templateMsg.find({}).count();
      res.render('index', { countDetails }); // Redirect to a dashboard or profile page
    } else {
      // Handle login errors
      const loginErrors = ['Incorrect username or password.'];
      res.render('login', { loginErrors });
    }
  } catch (error) {
    // Handle other login errors
    console.error(error); // Log the error for debugging
    const loginErrors = ['An error occurred. Please try again later.'];
    res.render('login', { loginErrors });
  }
});
// this post request will save Template message in database
app.post('/saveTemplateInDb', async (req, res) => {
  try {
    const { phoneOfTemp, selectTemp } = req.body
    const saveIntoMDb = new templateMsg({
      phoneOfTemp: phoneOfTemp,
      selectTemp: selectTemp
    })
    if (!phoneOfTemp || !selectTemp) {
      res.redirect('templateMessage');
    } else {
      let msgHasBeenStoredInDB = await saveIntoMDb.save();
      res.redirect('templateMessage');
    }
    //  console.log(msgHasBeenStoredInDB);
  } catch (error) {
    if (error) throw error
  }
});
// this post request will save Custom message in database
app.post('/saveCustomDb', async (req, res) => {
  try {
    const { mobileNumber, customMsgData } = req.body
    const saveCustomMsgIntoDb = new customMessageContent({
      mobileNumber: mobileNumber,
      customMsgData: customMsgData
    })
    if (!mobileNumber || !customMsgData) {
      res.redirect('customMessage');
    } else {
      let msgHasBeenStoredInDB = await saveCustomMsgIntoDb.save();
      console.log(`after save the data ${msgHasBeenStoredInDB}`);
      res.redirect('customMessage');
    }
  } catch (error) {
    if (error) throw error
  }
});
// forgot password functionality start.................................
app.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword');
});

app.post('/forgot-password', async (req, res) => {
  try {
    const userEmail = req.body.userEmail;

    // Check if the email exists in the database
    const existingUser = await alluserOfourPanel.findOne({ userEmail });
    if (!existingUser) {
      return res.send({
        error: 'Email not found. Please enter a valid email address.',
      });
    }
    // Generate a unique reset token using uuid
    let resetToken = uuid.v4();
    // Set an expiration time for the reset token (e.g., 1 hour)
    resetToken = Date.now() + 3600000; // 1 hour in milliseconds

    // Update the user's document in the database with the reset token and expiration time
    await alluserOfourPanel.updateOne(
      { userEmail },
      {
        resetToken
      }
    )
    // Create a reset password link with the reset token

    const resetLink = `http://localhost:${port}/reset-password?resetToken=${resetToken}`;
    // Send an email with the reset password link
    const mailOptions = {
      from: process.env.MYEMAIL,
      to: userEmail,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending failed:', error);
        return res.status(500).send('Email sending failed.');
      }
      console.log('Email sent:', info.response);
      res.send('Email has been Sent Successfully'); // Render a page indicating that the reset password email has been sent.
    });
  } catch (error) {
    console.error('Forgot password failed:', error);
    res.status(500).send('Forgot password failed.');
  }
});
app.get('/reset-password', async (req, res) => {
  try {
    const resetToken = req.query.resetToken;

    // Check if the reset token exists and is not expired
    // console.log('Reset Token:', resetToken);
    const userFound = await alluserOfourPanel.findOne({ resetToken: resetToken });
    // console.log('User Found:', userFound);

    if (!userFound) {
      return res.send({
        resetPasswordError: 'Invalid or expired reset token. Please request a new one.',
      });
    }

    res.render('reset-password', { resetToken: resetToken });
  } catch (error) {
    console.error('Reset password page loading failed:', error);
    res.status(500).send('Reset password page loading failed.');
  }
});

// app.post('/reset-password', async (req, res) => {
//   try {
//     const resetToken = req.body.resetToken;
//     // const userEmailPass = req.body.userEmail;
//     console.log(resetToken);
//     console.log(req.body.newPassword);
//     // console.log(`New Password: ${userEmailPass}`);
//     // console.log('Reset Token:', resetToken);

//     // const currentTime = Date.now();
//     // console.log('Current Time:', currentTime);

//     const userDetail = await alluserOfourPanel.findOne({ resetToken: resetToken });

//     console.log('User Found in Database:', userDetail);

//     if (!userFound) {
//       console.error('Invalid or expired reset token.');
//     }
//     // res.send("verification successfully")
//     // Set the new password and clear the reset token and expiration
//     userDetail.userpassword = newPassword;
//     userDetail.resetToken = null;
//     // userFound.resetTokenExpiration = undefined;

//     // Save the updated user document
//     await userDetail.save();

//     // Redirect to a login page or dashboard
//     res.render('login');
//   } catch (error) {
//     console.error('Password reset failed:', error);
//     res.status(500).send('Password reset failed.');
//   }
// });
app.post('/reset-password', async (req, res) => {
  try {
    const resetToken = req.body.resetToken;
    // const resetToken = req.query.resetToken;
    console.log(`this resetToken using req.body :  >> ${resetToken}`);;
    const newPassword = req.body.newPassword; // Assuming you receive the new password in the request body

    const userDetail = await alluserOfourPanel.findOne({ resetToken });
    // const allUSer = await alluserOfourPanel.find({});
    // console.log(allUSer);

    console.log('User Found in Database:', userDetail);

    if (!userDetail) { // Fix the variable name here
      console.error('Invalid or expired reset token.');
      return res.status(400).send('Invalid or expired reset token.');
    }

    // Set the new password and clear the reset token
    userDetail.userpassword = newPassword;
    userDetail.resetToken = null;

    // Save the updated user document
    await userDetail.save();

    // Redirect to a login page or dashboard
    res.render('login');
  } catch (error) {
    console.error('Password reset failed:', error);
    res.status(500).send('Password reset failed.');
  }
});


// CHATE HERE SECTION
app.post('/getMsg', async (req, res) => {
  try {
    const phoneNo = 9157808228; // Replace with your phone number
    const ctMsg = req.body.getTheData; // Replace with your custom message
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: `+91${phoneNo}`,
      type: 'text',
      text: {
        body: `${ctMsg}`,
      },
    };
    const response = await axios.post(
      `${process.env.WHATSAAP_API}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAAP_TOKEN}`, // Replace with your access token
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      console.log(`Message sent successfully to ${phoneNo}`);
    } else {
      console.log(`Cannot send message to ${phoneNo}. Status: ${response.status}`);
    }
    const savemessages = new ChattingMsg({
      gettingMsg: ctMsg
    });
    await savemessages.save();
    // ,{showourMessage}
    // const showourMessage = await ChattingMsg.find({}, 'gettingMsg');
    res.redirect('chating');
  } catch (error) {
    console.log(error);
    res.send("Internal Server Error");
  }
});

// server.js
app.post('/uploadingFile', upload.single('file'), async (req, res) => {
  try {
    // if (!req.file) {
    //     return res.status(400).send({ error: '*No file uploaded' });
    // }

    const filePath = req.file.path; // check the file path
    const fileType = req.file.mimetype;//check the file type
    let jsonArray; //create a array

    //check file type is CSV or XLSX
    if (fileType === 'text/csv') {

      jsonArray = await csvtojson({ //use csvtojson libruary for change all csv data in json format
        noheader: false,
        headers: ['name', 'mobile'],
      }).fromFile(filePath);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // XLSX file: Read and parse using xlsx library
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      jsonArray = xlsx.utils.sheet_to_json(sheet);
    } else {
      // Unsupported file type
      return res.status(400).send({ error: '*Unsupported file type' });
    }
    // Check if the first row contains the" name" and" mobile" headers
    const firstRow = jsonArray[0];
    if (!firstRow || !firstRow.name || !firstRow.mobile) {
      return res.status(400).send({ error: '*Invalid or missing headers' });
    }
    // check that the file contains only two columns (name and mobile)
    if (Object.keys(firstRow).length !== 2) {
      return res.status(400).send({ error: '*File must contain exactly two columns: name and mobile' });
    }

    // Save the CSV and XLSX data to MongoDB using Employee collection
    await NumberModel.insertMany(jsonArray);

    // res.status(200).json({ message: 'File data saved successfully' });
    //render the viewData page

    res.status(200).redirect("/contacts");
  } catch (error) {
    console.error('Error saving File data:', error);
    res.status(500).json({ error: 'Error saving File data', details: error.message });
  }
});


// post request for Group management
app.post('/GroupNameSaveIntoDb', async (req, res) => {
  try {
    const GroupNameInput = req.body.GroupName;

    const saveGroupsInDb = new GroupManage({
      GroupName: GroupNameInput.trim() // Remove leading/trailing spaces
    });

    await saveGroupsInDb.save();
    res.redirect('Group_management');
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`);
})
