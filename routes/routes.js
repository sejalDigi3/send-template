const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const app = express();
const axios = require("axios");
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' });
const ExcelJS = require('exceljs'); // Import the exceljs library
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser'); // Make sure to include body-parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const {
  templateMsg,
  customMessageContent,
  alluserOfourPanel,
  ChattingMsg,
  NumberModel,
  categoryManage,
  campaignsSchema,
  campaignHistory
} = require("../model/schema");


// Define a sample route
router.get("/api/savetemplateentry/:param1/:param2", async (req, res) => {
  const number = req.params.param1;
  const templateName = req.params.param2;

  const saveIntoMDb = new templateMsg({
    phoneOfTemp: number,
    selectTemp: templateName,
  });
  const msgHasBeenStoredInDB = await saveIntoMDb.save();
  const responseData = { message: "This is data from the server!" };
  res.json(responseData);
});

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/Register", (req, res) => {
  res.render("Register");
});
// side bar routes

// template message starts
router.get("/templateMessage", auth, async (req, res) => {
  try {
    const showInSelectBox = await NumberModel.find({});

    const categoriesSet = new Set();
    const mobileNumbers = [];

    showInSelectBox.forEach(item => {
      categoriesSet.add(item.categories);
      mobileNumbers.push(item.mobile);
    });
    const categories = Array.from(categoriesSet);

    res.render("templateMessage", { categories, mobileNumbers });
  } catch (error) {
    console.log(error);
  }
});

// template message 
// router.post('/sendtemplateMessages', upload.single('extractExcel'), auth, async (req, res) => {
//   const { sameBtn } = req.body; // Assuming you're using body-parser middleware
  
//   if (sameBtn === 'multipleNumbers') {
//     const phoneNumbers = req.body.phoneOfTemp;
//     const messageContent = req.body.selectTemp;
//     const allPhoneNumbers = phoneNumbers.split(',');
//     for (const phoneNumber of allPhoneNumbers) {
//       try {
//         const response = await axios.post(
//           'https://graph.facebook.com/v17.0/116168451372633/messages',
//           {
//             messaging_product: "whatsapp",
//             to: phoneNumber.trim(), // Remove any leading/trailing whitespace
//             type: "template",
//             template: {
//               name: messageContent,
//               language: {
//                 code: "en_US",
//               },
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer EAAWqeZCMrJ6sBO7zUipLVLmnOdyF0ZBPcMyJC17gRmcZAZAnn3mMbRkvb19SFMiwvZCaIhuZAeB1C0QCrgfJK193Hav9kIDsKM5ZCvFAVkjgAkb57BOj2DWULJmEDvdxjpp01hpsznvZA7ZBVaO22QQdFjmfa0bggPndsH81BegAEgD8hSak3Pz8woVvPwLOMKAOnNLVEiDggLACVbaru`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const savingTemplateMessageInDB = new templateMsg({
//           phoneOfTemp: phoneNumbers,
//           selectTemp: messageContent
//         })
//         await savingTemplateMessageInDB.save();
//         console.log(`Message sent to ${phoneNumber}`);
//         console.log(`See here phone numbers ${phoneNumbers}`)
//         console.log(`See here selected template name ${messageContent}`)
//       } catch (error) {
//         // console.error(`Error sending message to ${phoneNumber}:`, error.response?.status, error.response?.data);
//         console.log(`See here phone numbers ${phoneNumbers}`)
//         console.log(`See here selected template name ${messageContent}`);
//         console.log(`See here Error ${error}`);
//       }
//     }
//     console.log('Mobile Number is checked');
//   }
//   else if (sameBtn === 'bulkUploadInput') {
//     const messageContent = req.body.selectTemp;
//     const excelFile = req.file;
//     if (excelFile) {
//       try {
//         // Process the Excel file using exceljs
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = await workbook.xlsx.load(excelFile.buffer);
//         const firstSheet = worksheet.getWorksheet(1);
//         const jsonData = [];
//         firstSheet.eachRow((row, rowNumber) => {
//           if (rowNumber > 1) { // Skip header row
//             const name = row.getCell(1).value;
//             const mobile = row.getCell(2).value;
//             jsonData.push({ name, mobile });
//           }
//         });
//         console.log('Received Excel file:', excelFile.originalname);
//         console.log('Excel File Data:');
//         console.log(jsonData);
//         for (const entry of jsonData) {
//           const number = entry.mobile;
//           try {
//             const response = await axios.post(
//               'https://graph.facebook.com/v17.0/116168451372633/messages',
//               {
//                 messaging_product: "whatsapp",
//                 to: number,
//                 type: "template",
//                 template: {
//                   name: messageContent,
//                   language: {
//                     code: "en_US",
//                   },
//                 },
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer EAAWqeZCMrJ6sBO7zUipLVLmnOdyF0ZBPcMyJC17gRmcZAZAnn3mMbRkvb19SFMiwvZCaIhuZAeB1C0QCrgfJK193Hav9kIDsKM5ZCvFAVkjgAkb57BOj2DWULJmEDvdxjpp01hpsznvZA7ZBVaO22QQdFjmfa0bggPndsH81BegAEgD8hSak3Pz8woVvPwLOMKAOnNLVEiDggLACVbaru`,
//                   "Content-Type": "application/json",
//                 },
//               }
//             );
//             console.log(`Message sent to ${number}`);
//             console.log(`${numbers} see here ${error} mobile numbers ${messageContent}`)
//           } catch (error) {
//             console.error(`Error sending message to ${number}: ${messageContent} ${error.message}`);
//           }
//         }
//       } catch (error) {
//         console.error('Error processing Excel file:', error);
//       }
//     }
//     // Handle bulk upload saving logic here
//   } // save message with select category contacts
//   else if (sameBtn === 'selectedCategoryInput') {
//     const messageContent = req.body.selectTemp;
//     const showInSelectBox = await NumberModel.find({});
//     const selectedCategory = req.body.category;
//     console.log('Selected Category:', selectedCategory);
//     const mobileNumbersOfSelectedCategory = showInSelectBox
//       .filter(item => item.categories === selectedCategory)
//       .map(item => item.mobile);
//     console.log('Selected Category:', selectedCategory);
//     console.log('Mobile Numbers of Selected Category:', mobileNumbersOfSelectedCategory);
//     for (const phoneNumber of mobileNumbersOfSelectedCategory) {
//       try {
//         const response = await axios.post(
//           'https://graph.facebook.com/v17.0/116168451372633/messages',
//           {
//             messaging_product: "whatsapp",
//             to: phoneNumber, // Remove any leading/trailing whitespace
//             type: "template",
//             template: {
//               name: messageContent,
//               language: {
//                 code: "en_US",
//               },
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer EAAWqeZCMrJ6sBO7zUipLVLmnOdyF0ZBPcMyJC17gRmcZAZAnn3mMbRkvb19SFMiwvZCaIhuZAeB1C0QCrgfJK193Hav9kIDsKM5ZCvFAVkjgAkb57BOj2DWULJmEDvdxjpp01hpsznvZA7ZBVaO22QQdFjmfa0bggPndsH81BegAEgD8hSak3Pz8woVvPwLOMKAOnNLVEiDggLACVbaru`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         console.log(`Message sent to ${phoneNumber} messageContent : ${messageContent}`);
//       } catch (error) {
//         console.error(`Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`);
//       }
//     }
//     console.log('Select Category is checked');
//     // Handle select category logic here
//   } else {
//     console.log('No radio button is checked');
//   }
//   res.send('message has been sent successfully!');
// });

router.get("/getMobileNumbers", auth, async (req, res) => {
  try {
    const selectedCategory = req.query.category;
    const mobileNumbers = await NumberModel.find({ categories: selectedCategory }, { mobile: 1, _id: 0 });
    res.json({ mobileNumbers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch mobile numbers." });
  }
});

// router.get("/templateMsgHistory", auth, async (req, res) => {
//   const ITEMS_PER_PAGE = 5; // Number of items to display per page
//   try {
//     const totalDataInDb = await templateMsg.find({}).count();

//     const page = req.query.page || 1; // Get the requested page from the query string
//     const skip = (page - 1) * ITEMS_PER_PAGE; // Calculate the number of documents to skip

//     const sortField = req.query.sortField || "index"; // Get the sorting field (default: 'index')
//     const sortOrder = req.query.sortOrder || "asc"; // Get the sorting order (default: 'asc')

//     const sortQuery = {};
//     sortQuery[sortField] = sortOrder === "asc" ? 1 : -1;

//     const totalCount = await templateMsg.count({});
//     const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

//     const allTemDetails = await templateMsg
//       .find({})
//       .skip(skip)
//       .limit(ITEMS_PER_PAGE)
//       .sort(sortQuery);
//     // Modify the date format to remove the timezone part

//     allTemDetails.forEach((item) => {
//       if (item.date) {
//         const dateWithoutTimeZone = new Date(item.date).toLocaleString(
//           "en-US",
//           { timeZone: "Asia/Kolkata" }
//         );
//         item.date = dateWithoutTimeZone;
//       }
//     });

//     res.render("templateMsgHistory", {
//       ITEMS_PER_PAGE,
//       totalDataInDb,
//       items: allTemDetails,
//       currentPage: parseInt(page),
//       totalPages,
//       sortField,
//       sortOrder,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.get("/customMessage", auth, async (req, res) => {
//   const showInSelectBox = await NumberModel.find({});

//   const categoriesSet = new Set();
//   const mobileNumbers = [];

//   showInSelectBox.forEach(item => {
//     categoriesSet.add(item.categories);
//     mobileNumbers.push(item.mobile);
//   });
//   const categories = Array.from(categoriesSet);
//   res.render("customMessage", { categories, mobileNumbers });
// });

// // custom message sending route
// router.post("/sendCustomMessage", upload.single('extractExcel'), async (req, res) => {
//   const sameBtnValue = req.body.sameBtn;
//   const attachBtnValue = req.body.attachbtn;
//   const phoneNumbers = req.body.mobileNumber;
//   const getMsg = req.body.customMsgData;
//   const allPhoneNumbers = phoneNumbers.split(',');
//   console.log(`these are the phone numbers ${allPhoneNumbers}}`);
//   if (sameBtnValue.includes("NumbersInput") && attachBtnValue === "imageSelected") {
//     try {
//       // Extract data from the request
//       const mobileNumbers = req.body.mobileNumber.split(',');
//       const captionss = req.body.customMsgData;
//       // const imageLink = req.file ? req.file.path : req.body.uploadOnlyIMG;
//       const imageLink = req.file ? req.file.path : (req.body.uploadOnlyIMG ? req.body.uploadOnlyIMG : undefined);


//       // Prepare the message payload
//       const messagePayload = {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to: mobileNumbers,
//         type: "image",
//         image: {
//           link: imageLink,
//           caption: captionss
//         }
//       };
//       console.log('Request Payload:', messagePayload);

//       // Make a request to the Facebook Graph API
//       const response = await axios.post('https://graph.facebook.com/v17.0/116168451372633/messages/', messagePayload, {
//         headers: {
//           'Authorization': 'Bearer EAAWqeZCMrJ6sBO7zUipLVLmnOdyF0ZBPcMyJC17gRmcZAZAnn3mMbRkvb19SFMiwvZCaIhuZAeB1C0QCrgfJK193Hav9kIDsKM5ZCvFAVkjgAkb57BOj2DWULJmEDvdxjpp01hpsznvZA7ZBVaO22QQdFjmfa0bggPndsH81BegAEgD8hSak3Pz8woVvPwLOMKAOnNLVEiDggLACVbaru', // Replace with your actual access token
//           'Content-Type': 'application/json',
//         },
//       });

//       // Handle the API response as needed
//       console.log('API Response:', response.data);
//       res.status(200).json({ success: true, message: 'Message sent successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: 'Error sending message' });
//     }
//   }


//   // dont do anything here this is working...
//   else {
//     for (const phoneNumber of allPhoneNumbers) {
//       try {
//         const response = await axios.post(
//           'https://graph.facebook.com/v17.0/116168451372633/messages',
//           {
//             messaging_product: "whatsapp",
//             recipient_type: "individual",
//             to: phoneNumber.trim(), // Remove any leading/trailing whitespace
//             type: "text",
//             text: {
//               body: `${getMsg}`
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer EAAWqeZCMrJ6sBO7zUipLVLmnOdyF0ZBPcMyJC17gRmcZAZAnn3mMbRkvb19SFMiwvZCaIhuZAeB1C0QCrgfJK193Hav9kIDsKM5ZCvFAVkjgAkb57BOj2DWULJmEDvdxjpp01hpsznvZA7ZBVaO22QQdFjmfa0bggPndsH81BegAEgD8hSak3Pz8woVvPwLOMKAOnNLVEiDggLACVbaru`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         // customMessageContent
//         const savingCustomMessageInDB = new customMessageContent({
//           mobileNumber: phoneNumbers,
//           customMsgData: getMsg
//         })
//         await savingCustomMessageInDB.save();
//         console.log(`this is the only message : ${response}`);
//         console.log(`Message sent to ${phoneNumber}`);
//         // console.log('message is saved in the database...');
//       } catch (error) {
//         console.error(`Error sending message to ${phoneNumber}: ${error.message}`);
//       }
//     }
//   }
// });
// router.get("/customMsgHistory", auth, async (req, res) => {
//   try {
//     const customMessage = await customMessageContent.find({});
//     res.render("customMsgHistory", { iterate: customMessage });
//   } catch (error) {
//     res.status(500).send("internal server Error");
//   }
// });

router.get("/viewAllTemplates", auth, (req, res) => {
  try {
    res.render("viewAllTemplates");
  } catch (error) {
    res.status(500).send("internal server Error");
  }
});
// side bar routes

// navbar routes
router.get("/profile", auth, async (req, res) => {
  try {
    const UserId = req.user;
    const user = await alluserOfourPanel.findOne({ _id: UserId._id });
    console.log(user);  

    res.render("profile", { user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

// navbar routes
router.get("/logout", auth, async (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  try {
    req.user.tokens = req.user.tokens.filter((currentElement) => {
      return currentElement.token != req.token;
    });

    res.clearCookie("jwt");
    await req.user.save();
    res.redirect("/");
  } catch (error) {
    res.status(501).send(`this is error  ${error}`);
  }
});

// Edit and Delete API's
router.get("/update/:id", auth, async (req, res) => {
  try {
    const user = await alluserOfourPanel.findById(req.params.id);
    res.render("edit", { user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { fname, lname, phoneNum, userEmail } = req.body;
    // Find the user by ID and update their profile
    await alluserOfourPanel.findByIdAndUpdate(userId, {
      fname,
      lname,
      phoneNum,
      userEmail,
    });
    res.redirect("/profile"); // Redirect to the profile page or another appropriate page
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error - Unable to update");
  }
});

// Edit and Delete API's
router.get("/getLogindata", auth, async (req, res) => {
  try {
    const countDetails = await templateMsg.find({}).count();
    const countDetailsOFCustomMsg = await customMessageContent.find({}).count();
    const contDetailOfCampaign = await campaignHistory.find({}).count();
    res.render("index", { countDetails, countDetailsOFCustomMsg, contDetailOfCampaign });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// router.get('/forgotPassword', (req, res) => {
//   // const gettheUSerEmail=req,
//   res.render('forgotPassword');
// });
// // Define the route for email verification
// router.get('/verify/:token', async (req, res) => {
//   const token = req.params.token;
//   console.log(token)
//   try {
//     const countDetails = await templateMsg.find({}).count();
//     console.log('URL Token:', token);

//     // Find the user in your database by the verification token
//     const user = await alluserOfourPanel.findOne({ registertoken: token });

//     if (!user) {
//       // console.log('No user found for token:', token);
//       return res.status(404).render('verificationFailed', {
//         message: 'Verification token is invalid. Please try again or contact support.',
//       });
//     } else {  
//       await alluserOfourPanel.findByIdAndUpdate(user._id, { $set: { registertoken: null } });
//       res.render('login');
//     }
//     // console.log('Database Token:', user.registertoken);
//   } catch (error) {
//     console.error('Email verification failed:', error);
//     res.status(500).render('verificationFailed', {
//       message: 'Email verification failed. Please try again or contact support.',
//     });
//   }
// });

router.get("/chating", async (req, res) => {
  // const { gettingResponse } = require("../technovartzin/model/schema");
  // require("../technovartzin/index");
  try {
    // const findTheMessage = await gettingResponse.find({}, "message");
    const showourMessage = await ChattingMsg.find({}, "gettingMsg");
    res.render("chating", { showourMessage });
  } catch (error) {
    console.error("Other error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//render the popup model for editing name and mobile individually with existing name and mobile
router.get("/getUserRole/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    // Fetch the user's role from MongoDB
    const user = await NumberModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's role as a response
    return res.status(200).json({ name: user.name, mobile: user.mobile, categories: user.categories });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// handle the route for updating the user's name and mobile
router.post("/updateRole/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const newname = req.body.newname;
    const newmobile = req.body.newmobile;
    const newCategory = req.body.newCategory;
    console.log(newCategory);
    // console.log(newname);
    // console.log(newmobile);
    //update users name and mobile in mongodb
    const user = await NumberModel.findOneAndUpdate(
      { _id: userId },
      { name: newname, mobile: newmobile, categories: newCategory },

      { new: true }
    );

    // Check if the user was found and updated
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send a success response
    return res
      .status(200)
      .json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/category_management', auth, async (req, res) => {
  try {
    const categories = await categoryManage.find();
    res.render('category_management', { categories });
  } catch (error) {
    console.log(error);
  }
});

router.get('/category_management/edit/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryManage.findById(categoryId);
    res.render('edit_category', { category });
  } catch (error) {
    console.log(error);
  }
});

router.post('/category_management/update/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedCategoryName = req.body.categoryName;
    const category = await categoryManage.findById(categoryId);
    category.categoryName = updatedCategoryName;
    await category.save();
    res.redirect('/category_management');
  } catch (error) {
    console.log(error);
  }
});

router.get('/category_management/delete/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    await categoryManage.findByIdAndRemove(categoryId);
    res.redirect('/category_management');
  } catch (error) {
    console.log(error);
  }
});

router.get("/contacts", auth, async (req, res) => {
  try {
    const categories = await categoryManage.find();
    const categoryNames = categories.map(category => category.categoryName);
    // console.log(categoryNames);
    // console.log(`now check here : ${categoryNames}`);
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page parameter is provided
    const perPage = 5; // Number of records to display per page
    let sortOrder = 1;
    const CountTotalNumbers = await NumberModel.find({}).count();
    // Check the 'sort' query parameter to determine the sorting order
    if (req.query.sort === '-username') {
      sortOrder = -1; // Descending order
    }
    // Calculate the number of records to skip based on the current page
    const skip = (page - 1) * perPage;
    const totalUsers = await NumberModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / perPage);

    // Find all users data from MongoDB with the calculated index
    const users = await NumberModel.find()
      .collation({ locale: "en_US", strength: 2 })
      .sort({ name: sortOrder }) // Change 'name' to 'mobile' or the correct property name
      .skip(skip)
      .limit(perPage);
    const formattedUsers = users.map((user, index) => {
      return {
        index: (page - 1) * perPage + index + 1, // Calculate the index
        name: user.name,
        userID: user._id.toHexString(),
        mobile: user.mobile,
        categories: user.categories
      };
    });
    //  console.log(formattedUsers);
    // If there are previous and next pages
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    res.render("contacts", {
      users: formattedUsers,
      totalContacts: totalUsers,
      hasPrevPage,
      hasNextPage,
      prevPage: page - 1,
      nextPage: page + 1,
      sort: req.query.sort || "name",
      CountTotalNumbers,
      categoryNames, // Add categoryNames here if it's defined in your route handler.
      updatedCategory: req.query.updatedCategory, // Pass the updated category to the view
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/updateCategories', async (req, res) => {
  const selectedPhoneNumbers = req.body.selectedIds; // Assuming you are sending phone numbers from the client-side
  const selectedCategory = req.body.category;
  console.log(`now can you check : ${selectedCategory}`);
  try {
    const result = await NumberModel.updateMany(
      { mobile: { $in: selectedPhoneNumbers } }, // Filter based on phone numbers
      { $set: { categories: selectedCategory } }
    );

    console.log('Documents updated:', result);
    res.redirect('/contacts');
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ error: 'An error occurred while updating documents.' });
  }
});

router.get("/campaigns", auth, async (req, res) => {
  try {
    const campaignhistory = await campaignHistory.find({});
    const campaigns = await campaignsSchema.find({});

    res.render('campaigns', { campaigns, campaignhistory });
  } catch (error) {
    console.log(error);
  }
});
  
router.get('/createCampaigns', auth, async (req, res) => {
  try {
    const showInSelectBox = await NumberModel.find({});

    const categoriesSet = new Set();
    const mobileNumbers = [];

    showInSelectBox.forEach(item => {
      categoriesSet.add(item.categories);
      mobileNumbers.push(item.mobile);
    });
    //  console.log("Mobile Numbers:", mobileNumbers);
    const categories = Array.from(categoriesSet);

    res.render("createCampaigns", { categories });
  } catch (error) {
    console.log(error);
  }
})

// save campaigns data campaignsSchema
router.post('/createCampaigns', async (req, res) => {
  try {
    const phoneOfTemp = req.body.phoneOfTemp;
    const messageType = req.body.messageType;
    const message = (messageType === 'template') ? req.body.selectTemp : req.body.customMsgData;
    // Create a new Campaign document
    const newCampaign = new campaignsSchema({
      phoneOfTemp,
      messageType,
      message,
    });
    console.log(phoneOfTemp);
    // Save the campaign document to the database
    await newCampaign.save();
    res.redirect('/campaigns')
    // if (messageType === 'template') {
    //   // Redirect to the template route
    //   res.redirect(`/sendCampaignMessage?phoneOfTemp=${phoneOfTemp}&messageType=template`);
    // } else if (messageType === 'custom') {
    //   // Redirect to the custom route
    //   res.redirect(`/sendCampaignMessage?phoneOfTemp=${phoneOfTemp}&messageType=custom`);
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while saving the campaign.');
  }
});

router.get('/sendCampaignMessage', auth, async (req, res) => {
  try {
    // Extract query parameters from the URL
    const phoneOfTemp = req.query.phoneOfTemp;
    const messageType = req.query.messageType;

    // Query the database to find the campaign details based on the parameters
    const campaignDetails = await campaignsSchema.findOne({ phoneOfTemp, messageType });

    const showInSelectBox = await NumberModel.find({});

    const categoriesSet = new Set();
    const mobileNumbers = [];

    showInSelectBox.forEach(item => {
      categoriesSet.add(item.categories);
      mobileNumbers.push(item.mobile);
    });

    const categories = Array.from(categoriesSet);
    // Render the 'sendCampaignMessage' view with the retrieved data
    res.render('sendCampaignMessage', {
      phoneOfTemp,
      messageType,
      categories,
      mobileNumbers,
      campaign: campaignDetails,
    });
  } catch (error) {
    console.log(error);
  }
});



router.post('/SentMessagetothisCampaign', upload.single('extractExcel'),auth, async (req, res) => {
  try {
    const UserId = req.user;
    const user = await alluserOfourPanel.findOne({ _id: UserId }).select('APILink BearerToken');
    const APILink = user.APILink;
    const BearerToken = user.BearerToken;
    // const user = await alluserOfourPanel.findOne({ _id: UserId._id });
    
    console.log(`see APIlink ${APILink} and see BearerToken ${BearerToken}`);  

    const phoneNumbersInput = req.body.MobileNumberswithComma
    const showthisAnimation = "Sending...";
    // Check which radio button is selected
    const selectedOption = req.body.sameName;
    const messageContent = req.body.messageContent;
    const messageType = req.body.messageType;

    const showInSelectBox = await NumberModel.find({});
    // console.log(showInSelectBox);

    // console.log(`message Type :${messageType} and message content : ${messageContent} `);
    // BulkUpload Csv File
    if (selectedOption === 'Templatemessage') {
      // condition for Template message  
      if (messageType == "template") {
        const campName = req.body.campaignName;
        const MsgType = req.body.messageType;
        const MsgContent = req.body.messageContent;
        console.log(`campaignname: ${campName} MsgType: ${MsgType}. MsgContent: ${MsgContent}`);
        const excelFile = req.file;
        if (excelFile) {
          try {
            // Process the Excel file using exceljs
            const workbook = new ExcelJS.Workbook();
            const worksheet = await workbook.xlsx.load(excelFile.buffer);
            const firstSheet = worksheet.getWorksheet(1);
            const jsonData = [];
            firstSheet.eachRow((row, rowNumber) => {
              if (rowNumber > 1) { // Skip header row
                const name = row.getCell(1).value;
                const mobile = row.getCell(2).value;
                jsonData.push({ name, mobile });
              }
            });
            // console.log('Received Excel file:', excelFile.originalname);
            // console.log('Excel File Data:');
            // console.log(jsonData);
                    
            const SaveCampaigncontact = new campaignHistory({
              // _id: new ObjectId(),
              campaignName: campName,
              messageType: MsgType,
              message: MsgContent,
              excelData: jsonData,
              fileName: excelFile.originalname
            });
            await SaveCampaigncontact.save();

            for (const entry of jsonData) {
              const number = entry.mobile;
              try {
                const response = await axios.post(
                  APILink,
                  {
                    messaging_product: "whatsapp",
                    to: number,
                    type: "template",
                    template: {
                      name: MsgContent,
                      language: {
                        code: "en_US",
                      },
                    },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${BearerToken}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                console.log(`Message sent to ${number}`);

              } catch (error) {
                console.error(`Error sending message to ${number}: ${messageContent} ${error.message}`);
              }
            }
          } catch (error) {
            console.error('Error processing Excel file:', error);
          }
        }
      }
      //condition for Template message Ends

      // condition for custom message upload file starts
      if (messageType == "custom") {
        const campName = req.body.campaignName;
        const MsgType = req.body.messageType;
        const MsgContent = req.body.messageContent;
        console.log(`campaignname: ${campName} MsgType: ${MsgType}. MsgContent: ${MsgContent}`);

        const excelFile = req.file;
        if (excelFile) {
          try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = await workbook.xlsx.load(excelFile.buffer);
            const firstSheet = worksheet.getWorksheet(1);
            const jsonData = [];

            firstSheet.eachRow((row, rowNumber) => {
              if (rowNumber > 1) { // Skip header row
                const name = row.getCell(1).value;
                const mobile = row.getCell(2).value;
                jsonData.push({ name, mobile });
              }
            });

            console.log('Received Excel file:', excelFile.originalname);
            console.log('Excel File Data:');
            console.log(jsonData);
            // Iterate through the phone numbers and send the message
            // Iterate through the phone numbers and send the message
            const SaveCampaigncontact = new campaignHistory({
              // _id: new ObjectId(),
              campaignName: campName,
              messageType: MsgType,
              message: MsgContent,
              excelData: jsonData,
              fileName: excelFile.originalname

            });
            await SaveCampaigncontact.save();
            for (const entry of jsonData) {
              // Create a new campaignHistory document and save it to the database
              const number = entry.mobile;
              try {
                const response = await axios.post(
                  APILink,
                  {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: number,
                    type: "text",
                    "text": {
                      "body": `${MsgContent}`
                    },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${BearerToken}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                console.log(`Message sent to ${number}`);
              } catch (error) {
                console.error(`Error sending message to ${number}: ${MsgContent} ${error.message}`);
              }
            }
          } catch (error) {
            console.error('Error processing Excel file:', error);
          }
        }
      }
      // condition for custom message
    }

    // Multiple MobileNumber input field
    else if (selectedOption === 'singleInputField') {
      // const campName = req.body.phoneOfTemp;
      // const MsgContent = req.body.messageContent;
      // const MsgType = req.body.messageType;
      const campName = req.body.campaignName;
      const MsgType = req.body.messageType;
      const MsgContent = req.body.messageContent;
      const phoneNumbers = phoneNumbersInput.split(',');
      console.log(`campaignname: ${campName} MsgType: ${MsgType}. MsgContent: ${MsgContent}. MoNo: ${phoneNumbers}`);

      if (messageType == "template") {

        const SaveCampaigncontact = new campaignHistory({
          // _id: new ObjectId(),
          campaignName: campName,
          messageType: MsgType,
          message: MsgContent,
          phoneNumbers: phoneNumbersInput
        });
       const savedBTemAndCstmVAl = await SaveCampaigncontact.save();
       console.log(savedBTemAndCstmVAl);
        
        console.log(`${messageContent} or ${messageType} or ${phoneNumbers}`);
        for (const phoneNumber of phoneNumbers) {
          try {
            const response = await axios.post(
              APILink,
              {
                messaging_product: "whatsapp",
                to: phoneNumber.trim(), // Remove any leading/trailing whitespace
                type: "template",
                template: {
                  name: messageContent,
                  language: {
                    code: "en_US",
                  },
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${BearerToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(`Message sent to ${phoneNumber}`);
          } catch (error) {
            console.error(`Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`);
          }
        }
      }
      // custom message condition Starts
      if (messageType == "custom") {
        console.log(`campaignname: ${campName} MsgType: ${MsgType}. MsgContent: ${MsgContent}. MoNo: ${phoneNumbers}`);

        const SaveCampaigncontact = new campaignHistory({
          // _id: new ObjectId(),
          campaignName: campName,
          messageType: MsgType,
          message: MsgContent,
          phoneNumbers: phoneNumbersInput
        });
        await SaveCampaigncontact.save();
        console.log(`${messageContent} or ${messageType} or ${phoneNumbers}`);

        for (const phoneNumber of phoneNumbers) {
          try {
            const response = await axios.post(
              APILink,
              {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: phoneNumber.trim(), // Remove any leading/trailing whitespace
                type: "text",
                text: {
                  body: `${messageContent}`
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${BearerToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(`Message sent to ${phoneNumber}`);
          } catch (error) {
            console.error(`Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`);
          }
        }
      }
      // custom message condition Ends
    }
    // Select category
    else if (selectedOption === 'selectCat') {
      const campName = req.body.campaignName;
      const MsgType = req.body.messageType;
      const MsgContent = req.body.messageContent;

      const showInSelectBox = await NumberModel.find({});
      const selectedCategory = req.body.category;
      console.log('Selected Category:', selectedCategory);
      // Filter mobile numbers based on the selected category
      const mobileNumbersOfSelectedCategory = showInSelectBox
        .filter(item => item.categories === selectedCategory)
        .map(item => item.mobile);
      console.log('Selected Category:', selectedCategory);
      console.log('Mobile Numbers of Selected Category:', mobileNumbersOfSelectedCategory);

      if (messageType == "template") {
        const SaveCampaigncontact = new campaignHistory({
          // _id: new ObjectId(),
          campaignName: campName,
          messageType: MsgType,
          message: MsgContent,
          phoneNumbers: phoneNumbersInput,
          categoryName: selectedCategory,
          categoryNumber: mobileNumbersOfSelectedCategory
        });
        // console.log(`before saving : ${SaveCampaigncontact.campaignName}`);
        await SaveCampaigncontact.save();

        for (const phoneNumber of mobileNumbersOfSelectedCategory) {
          try {
            const response = await axios.post(
              APILink,
              {
                messaging_product: "whatsapp",
                to: phoneNumber, // Remove any leading/trailing whitespace
                type: "template",
                template: {
                  name: MsgContent,
                  language: {
                    code: "en_US",
                  },
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${BearerToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(`Message sent to ${phoneNumber} messageContent : ${messageContent}`);
          } catch (error) {
            console.error(`Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`);
          }
        }
      }
      if (messageType == "custom") {
        // console.log("message Type is", messageType);
        const SaveCampaigncontact = new campaignHistory({
          campaignName: campName,
          messageType: MsgType,
          message: MsgContent,
          phoneNumbers: phoneNumbersInput,
          categoryName: selectedCategory,
          categoryNumber: mobileNumbersOfSelectedCategory
        });
        // console.log(`before saving : ${SaveCampaigncontact.campaignName}`);
        await SaveCampaigncontact.save();

        for (const phoneNumber of mobileNumbersOfSelectedCategory) {
          try {
            const response = await axios.post(
              APILink,
              {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: phoneNumber.trim(), // Remove any leading/trailing whitespace
                type: "text",
                text: {
                  body: `${MsgContent}`
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${BearerToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(`Message sent to ${phoneNumber}`);
          } catch (error) {
            console.error(`Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`);
          }
        }
      }
    }
    else {
      res.send('Cannot Send Please Select');
    }
    // const campaigns = await campaignsSchema.find({});
    const campaignhistory = await campaignHistory.find({});
    campaignhistory.forEach((item) => {
      if (item.createdAt) {
        const originalDate = new Date(item.createdAt);
        if (!isNaN(originalDate)) {
          const dateWithoutTimeZone = originalDate.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          });
          item.createdAt = dateWithoutTimeZone;
        } else {
          console.error(`Invalid date: ${item.createdAt}`);
        }
      }
    });
    // console.log();

    // write here
    res.redirect('/campaigns'); // Send a response to the client
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});
// save campaigns

router.get('/campaignHistory', auth, async (req, res) => {
  try {
    const campaignhistory = await campaignHistory.find({});
    console.log(campaignhistory);
    res.render('campaignHistory', { campaignhistory });
  } catch (error) {
    console.log(error);
  }
})

router.get('/detaildcampaignHistory', auth, async (req, res) => {
  try {
    const showingcampaignHistory = await campaignHistory.find({});
    // console.log(showingcampaignHistory);
    res.render('DetailCampaignHistory', { showingcampaignHistory });
  } catch (error) {
    console.log(error);
  }
})

router.get('/setting',auth,async(req, res) => {
  try {
    const UserId = req.user;
    const user = await alluserOfourPanel.findOne({ _id: UserId._id });
    console.log(user);
    res.render('setting',{userEmail:user});
  } catch (error) {
    console.log(`here is the error ${error}`);
  }
})

// router.post("/saveAPICredentials",auth,async (req, res) => {
//   try {
//     const userEmail = req.body.userEmail; // Assuming userEmail is already available
//     // Find the existing user document by email
//     const UserId = req.user;
//     const user = await alluserOfourPanel.findOne({ _id: UserId._id });
//     // console.log(user);  

//     const APILink = req.body.API_LINK;
//     const BearerToken = req.body.BearerToken;

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Update the user document with the API credentials
//     user.APILink = APILink;
//     user.BearerToken = BearerToken;

//     // Save the updated user document
//     await user.save();

//     return res.status(200).json({ message: 'API credentials saved successfully' });
//   } catch (error) {
//     console.error('Error saving API credentials:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// test this
router.post("/saveAPICredentials", auth, async (req, res) => {
  try {
    const userEmail = req.body.userEmail; // Assuming userEmail is already available
    const UserId = req.user;
    const user = await alluserOfourPanel.findOne({ _id: UserId._id });

    const APILink = req.body.API_LINK;
    const BearerToken = req.body.BearerToken;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const regex = /\/(\d{7,})\//;
    const match = APILink.match(regex);
    let extractedNumber = null;
    if (match) {
      extractedNumber = match[1];
      console.log('Extracted Number:', extractedNumber); // Log the extracted number
    }

    // Make request to Facebook Graph API
    const GRAPH_API_URL = `https://graph.facebook.com/v17.0/${extractedNumber}?fields=verified_name,code_verification_status,display_phone_number,quality_rating,id`;
    const response = await fetch(GRAPH_API_URL, {
      headers: {
        Authorization: `Bearer ${BearerToken}`,
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();

    console.log('Extracted Data from API:', data); // Log the extracted data from the API

    // Update the user document with the API credentials and extracted data
    user.APILink = APILink;
    user.BearerToken = BearerToken;
    user.extractedNumber = extractedNumber;
    user.verified_name = data.verified_name || '';
    user.code_verification_status = data.code_verification_status || '';
    user.display_phone_number = data.display_phone_number || '';
    user.quality_rating = data.quality_rating || '';
    user.id = data.id || 0;

    // Save the updated user document
    const savedDate = await user.save();
    console.log(savedDate)

    return res.status(200).json({ message: 'API credentials and extracted data saved successfully', user: user });
  } catch (error) {
    console.error('Error saving API credentials:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// test this

router.get('/superAdmin', async(req,res)=>{
   try {
    const allusers= await alluserOfourPanel.find({})
       res.render('superAdmin',{allusers});  
   } catch (err) {
     if(err){
      console.log(err)
     }
   }
});
// check deactivate status 
router.post('/deactivateUser', async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);
    
    // Find the user by userId
    const user = await alluserOfourPanel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the user is a superadmin
    if (user.isSuperAdmin) {
      return res.status(403).send('Superadmins cannot deactivate their own account');
    }

    // Update user record to mark as deactivated
    await alluserOfourPanel.findByIdAndUpdate(userId, { isActive: false });
    res.status(200).send('User deactivated successfully');
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).send('An error occurred while deactivating user');
  }
});
// check active status 
// router.post('/toggleUserStatus', async (req, res) => {
//   try {
//         const userId = req.body.userId;

//         console.log(`activate user id ${userId}`)
//         // Find the user by userId
//         const user = await alluserOfourPanel.findById(userId);
//       if (!user) {
//           return res.status(404).send('User not found');
//       }
//       // Toggle the user's isActive status
//       user.isActive = !user.isActive;
//       await user.save();
//       res.status(200).send('User status toggled successfully');
//   } catch (error) {
//       console.error('Error toggling user status:', error);
//       res.status(500).send('An error occurred while toggling user status');
//   }
// });

router.post('/toggleUserStatus', async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(`activate user id ${userId}`);
    
    // Find the user by userId
    const user = await alluserOfourPanel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the user is a superadmin
    if (user.isSuperAdmin) {
      return res.status(403).send('Superadmins cannot toggle their own account status');
    }

    // Toggle the user's isActive status
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).send('User status toggled successfully');
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).send('An error occurred while toggling user status');
  }
});
router.get('/usersDetails/:userId', async (req, res) => {
  try {
      // Extract userId from request parameters
      const userId = req.params.userId;

      // Fetch user details from the database based on userId
      const userDetails = await alluserOfourPanel.find({ _id: userId }).select('fname lname phoneNum userEmail code_verification_status display_phone_number id quality_rating verified_name');

      // If userDetails is null or undefined, handle the case appropriately
      if (!userDetails) {
          // Handle case when userDetails is not found
          return res.status(404).send("User details not found");
      }

      // Render the "usersDetails" page with user details
      res.render('usersDetails', { userDetails: userDetails });
  } catch (error) {
      // Handle any errors that occur during fetching user details
      console.error("Error fetching user details:", error);
      res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
