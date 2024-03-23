const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const app = express();
const axios = require("axios");
const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' });
const ExcelJS = require("exceljs"); // Import the exceljs library
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser"); // Make sure to include body-parser
router.use(bodyParser.json());
// const languages = require('..');
const bcrypt = require("bcryptjs");
const languages = require('../views/data/languages.json');
router.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const {
  templateMsg,
  customMessageContent,
  alluserOfourPanel,
  ChattingMsg,
  NumberModel,
  GroupManage,
  campaignsSchema,
  campaignHistory,
  Subscription,
  Ticket
} = require("../model/schema");

//Role
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

router.get("/templateMessage", auth, async (req, res) => {
  try {
    const showInSelectBox = await NumberModel.find({});

    const GroupsSet = new Set();
    const mobileNumbers = [];

    showInSelectBox.forEach((item) => {
      GroupsSet.add(item.Groups);
      mobileNumbers.push(item.mobile);
    });
    const Groups = Array.from(GroupsSet);

    res.render("templateMessage", { Groups, mobileNumbers });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getMobileNumbers", auth, async (req, res) => {
  try {
    const selectedGroup = req.query.Group;
    const mobileNumbers = await NumberModel.find(
      { Groups: selectedGroup },
      { mobile: 1, _id: 0 }
    );
    res.json({ mobileNumbers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch mobile numbers." });
  }
});

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

router.get("/update/:id", auth, async (req, res) => {
  try {
    const user = await alluserOfourPanel.findById(req.params.id);
    res.render("edit", { user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


// Example Express route for deleting a campaign
router.delete('/deleteCampaign/:id', async (req, res) => {
  try {
    console.log("fjeowjfo");
    const campaignId = req.params.id;
    console.log("fjewjfew", req.params);
    // Use Mongoose to delete the campaign from the database
    const deletedCampaign = await campaignsSchema.findByIdAndDelete(campaignId);

    if (!deletedCampaign) {
      // If the campaign with the given ID is not found
      return res.status(404).send('Campaign not found');
    }

    // If the campaign is successfully deleted
    res.status(200).send('Campaign deleted successfully');
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).send('Failed to delete campaign');
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


router.get("/getLogindata", auth, async (req, res) => {
  try {
    const countDetails = await templateMsg.find({}).count();
    const countDetailsOFCustomMsg = await customMessageContent.find({}).count();
    const contDetailOfCampaign = await campaignHistory.find({}).count();
    res.render("index", {
      countDetails,
      countDetailsOFCustomMsg,
      contDetailOfCampaign,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

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
    return res
      .status(200)
      .json({
        name: user.name,
        mobile: user.mobile,
        Groups: user.Groups,
      });
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
    const newGroup = req.body.newGroup;
    console.log(newGroup);
    // console.log(newname);
    // console.log(newmobile);
    //update users name and mobile in mongodb
    const user = await NumberModel.findOneAndUpdate(
      { _id: userId },
      { name: newname, mobile: newmobile, Groups: newGroup },

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

//Group_management
router.get("/Group_management", auth, async (req, res) => {
  try {
    const Groups = await GroupManage.find();
    res.render("Group_management", { Groups });
  } catch (error) {
    console.log(error);
  }
});

router.get("/Group_management/edit/:id", async (req, res) => {
  try {
    const GroupId = req.params.id;
    const Group = await GroupManage.findById(GroupId);
    res.render("edit_Group", { Group });
  } catch (error) {
    console.log(error);
  }
});

router.post("/Group_management/update/:id", async (req, res) => {
  try {
    const GroupId = req.params.id;
    const updatedGroupName = req.body.GroupName;
    const Group = await GroupManage.findById(GroupId);
    Group.GroupName = updatedGroupName;
    await Group.save();
    res.redirect("/Group_management");
  } catch (error) {
    console.log(error);
  }
});

router.get("/Group_management/delete/:id", async (req, res) => {
  try {
    const GroupId = req.params.id;
    await GroupManage.findByIdAndRemove(GroupId);
    res.redirect("/Group_management");
  } catch (error) {
    console.log(error);
  }
});

router.get("/contacts", auth, async (req, res) => {
  try {
    const Groups = await GroupManage.find();
    const GroupNames = Groups.map((Group) => Group.GroupName);
    // console.log(GroupNames);
    // console.log(`now check here : ${GroupNames}`);
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page parameter is provided
    const perPage = 5; // Number of records to display per page
    let sortOrder = 1;
    const CountTotalNumbers = await NumberModel.find({}).count();
    // Check the 'sort' query parameter to determine the sorting order
    if (req.query.sort === "-username") {
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
        Groups: user.Groups,
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
      GroupNames, // Add GroupNames here if it's defined in your route handler.
      updatedGroup: req.query.updatedGroup, // Pass the updated Group to the view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/updateGroups", async (req, res) => {
  const selectedPhoneNumbers = req.body.selectedIds; // Assuming you are sending phone numbers from the client-side
  const selectedGroup = req.body.Group;
  console.log(`now can you check : ${selectedGroup}`);
  try {
    const result = await NumberModel.updateMany(
      { mobile: { $in: selectedPhoneNumbers } }, // Filter based on phone numbers
      { $set: { Groups: selectedGroup } }
    );

    console.log("Documents updated:", result);
    res.redirect("/contacts");
  } catch (error) {
    console.error("Error updating documents:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating documents." });
  }
});

//campaigns
router.get("/campaigns", auth, async (req, res) => {
  try {
    const campaignhistory = await campaignHistory.find({});
    const campaigns = await campaignsSchema.find({});
    const showingcampaignHistory = await campaignHistory.find({});
    res.render("campaigns", { campaigns, campaignhistory, showingcampaignHistory });
  } catch (error) {
    console.log(error);
  }
});

router.get("/createCampaigns", auth, async (req, res) => {
  try {
    const showInSelectBox = await NumberModel.find({});

    const GroupsSet = new Set();
    const mobileNumbers = [];

    showInSelectBox.forEach((item) => {
      GroupsSet.add(item.Groups);
      mobileNumbers.push(item.mobile);
    });
    //  console.log("Mobile Numbers:", mobileNumbers);
    const Groups = Array.from(GroupsSet);

    res.render("createCampaigns", { Groups });
  } catch (error) {
    console.log(error);
  }
});

// save campaigns data campaignsSchema
router.post("/createCampaigns", async (req, res) => {
  try {
    const phoneOfTemp = req.body.phoneOfTemp;
    const messageType = req.body.messageType;
    const message =
      messageType === "template" ? req.body.selectTemp : req.body.customMsgData;
    // Create a new Campaign document
    const newCampaign = new campaignsSchema({
      phoneOfTemp,
      messageType,
      message,
    });
    console.log(phoneOfTemp);
    // Save the campaign document to the database
    await newCampaign.save();
    res.redirect("/campaigns");
    // if (messageType === 'template') {
    //   // Redirect to the template route
    //   res.redirect(`/sendCampaignMessage?phoneOfTemp=${phoneOfTemp}&messageType=template`);
    // } else if (messageType === 'custom') {
    //   // Redirect to the custom route
    //   res.redirect(`/sendCampaignMessage?phoneOfTemp=${phoneOfTemp}&messageType=custom`);
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while saving the campaign.");
  }
});

router.get("/sendCampaignMessage", auth, async (req, res) => {
  try {
    // Extract query parameters from the URL
    const phoneOfTemp = req.query.phoneOfTemp;
    const messageType = req.query.messageType;

    // Query the database to find the campaign details based on the parameters
    const campaignDetails = await campaignsSchema.findOne({
      phoneOfTemp,
      messageType,
    });

    const showInSelectBox = await NumberModel.find({});

    const GroupsSet = new Set();
    const mobileNumbers = [];

    showInSelectBox.forEach((item) => {
      GroupsSet.add(item.Groups);
      mobileNumbers.push(item.mobile);
    });

    const Groups = Array.from(GroupsSet);
    // Render the 'sendCampaignMessage' view with the retrieved data
    res.render("sendCampaignMessage", {
      phoneOfTemp,
      messageType,
      Groups,
      mobileNumbers,
      campaign: campaignDetails,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/SentMessagetothisCampaign",
  upload.single("extractExcel"),
  auth,
  async (req, res) => {
    try {
      const UserId = req.user;
      const user = await alluserOfourPanel
        .findOne({ _id: UserId })
        .select("APILink BearerToken");
      const APILink = user.APILink;
      const BearerToken = user.BearerToken;
      // const user = await alluserOfourPanel.findOne({ _id: UserId._id });

      console.log(`see APIlink ${APILink} and see BearerToken ${BearerToken}`);

      const phoneNumbersInput = req.body.MobileNumberswithComma;
      const showthisAnimation = "Sending...";
      // Check which radio button is selected
      const selectedOption = req.body.sameName;
      const messageContent = req.body.messageContent;
      const messageType = req.body.messageType;

      const showInSelectBox = await NumberModel.find({});
      // console.log(showInSelectBox);

      // console.log(`message Type :${messageType} and message content : ${messageContent} `);
      // BulkUpload Csv File
      if (selectedOption === "Templatemessage") {
        // condition for Template message
        if (messageType == "template") {
          const campName = req.body.campaignName;
          const MsgType = req.body.messageType;
          const MsgContent = req.body.messageContent;
          console.log(
            `campaignname: ${campName} MsgType: ${MsgType}. MsgContent: ${MsgContent}`
          );
          const excelFile = req.file;
          if (excelFile) {
            try {
              // Process the Excel file using exceljs
              const workbook = new ExcelJS.Workbook();
              const worksheet = await workbook.xlsx.load(excelFile.buffer);
              const firstSheet = worksheet.getWorksheet(1);
              const jsonData = [];
              firstSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                  // Skip header row
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
                fileName: excelFile.originalname,
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
                  console.error(
                    `Error sending message to ${number}: ${messageContent} ${error.message}`
                  );
                }
              }
            } catch (error) {
              console.error("Error processing Excel file:", error);
            }
          }
        }
        //condition for Template message Ends

        // condition for custom message upload file starts
        if (messageType == "custom") {
          const campName = req.body.campaignName;
          const MsgType = req.body.messageType;
          const MsgContent = req.body.messageContent;
          console.log(
            `campaignname: ${campName} MsgType: ${MsgType}. MsgContent: ${MsgContent}`
          );

          const excelFile = req.file;
          if (excelFile) {
            try {
              const workbook = new ExcelJS.Workbook();
              const worksheet = await workbook.xlsx.load(excelFile.buffer);
              const firstSheet = worksheet.getWorksheet(1);
              const jsonData = [];

              firstSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                  // Skip header row
                  const name = row.getCell(1).value;
                  const mobile = row.getCell(2).value;
                  jsonData.push({ name, mobile });
                }
              });

              console.log("Received Excel file:", excelFile.originalname);
              console.log("Excel File Data:");
              console.log(jsonData);
              // Iterate through the phone numbers and send the message
              // Iterate through the phone numbers and send the message
              const SaveCampaigncontact = new campaignHistory({
                // _id: new ObjectId(),
                campaignName: campName,
                messageType: MsgType,
                message: MsgContent,
                excelData: jsonData,
                fileName: excelFile.originalname,
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
                      text: {
                        body: `${MsgContent}`,
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
                  console.error(
                    `Error sending message to ${number}: ${MsgContent} ${error.message}`
                  );
                }
              }
            } catch (error) {
              console.error("Error processing Excel file:", error);
            }
          }
        }
        // condition for custom message
      }

      // Multiple MobileNumber input field
      else if (selectedOption === "singleInputField") {
        // const campName = req.body.phoneOfTemp;
        // const MsgContent = req.body.messageContent;
        // const MsgType = req.body.messageType;
        const campName = req.body.campaignName;
        const MsgType = req.body.messageType;
        const MsgContent = req.body.messageContent;
        const phoneNumbers = phoneNumbersInput.split(",");
        console.log(
          `campaignname: ${campName} MsgType: ${MsgType}. MsgContent: ${MsgContent}. MoNo: ${phoneNumbers}`
        );

        if (messageType == "template") {
          const SaveCampaigncontact = new campaignHistory({
            // _id: new ObjectId(),
            campaignName: campName,
            messageType: MsgType,
            message: MsgContent,
            phoneNumbers: phoneNumbersInput,
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
              console.error(
                `Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`
              );
            }
          }
        }
        // custom message condition Starts
        if (messageType == "custom") {
          console.log(
            `campaignname: ${campName} MsgType: ${MsgType}. MsgContent: ${MsgContent}. MoNo: ${phoneNumbers}`
          );

          const SaveCampaigncontact = new campaignHistory({
            // _id: new ObjectId(),
            campaignName: campName,
            messageType: MsgType,
            message: MsgContent,
            phoneNumbers: phoneNumbersInput,
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
                    body: `${messageContent}`,
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
              console.error(
                `Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`
              );
            }
          }
        }
        // custom message condition Ends
      }
      // Select Group
      else if (selectedOption === "selectCat") {
        const campName = req.body.campaignName;
        const MsgType = req.body.messageType;
        const MsgContent = req.body.messageContent;

        const showInSelectBox = await NumberModel.find({});
        const selectedGroup = req.body.Group;
        console.log("Selected Group:", selectedGroup);
        // Filter mobile numbers based on the selected Group
        const mobileNumbersOfSelectedGroup = showInSelectBox
          .filter((item) => item.Groups === selectedGroup)
          .map((item) => item.mobile);
        console.log("Selected Group:", selectedGroup);
        console.log(
          "Mobile Numbers of Selected Group:",
          mobileNumbersOfSelectedGroup
        );

        if (messageType == "template") {
          const SaveCampaigncontact = new campaignHistory({
            // _id: new ObjectId(),
            campaignName: campName,
            messageType: MsgType,
            message: MsgContent,
            phoneNumbers: phoneNumbersInput,
            GroupName: selectedGroup,
            GroupNumber: mobileNumbersOfSelectedGroup,
          });
          // console.log(`before saving : ${SaveCampaigncontact.campaignName}`);
          await SaveCampaigncontact.save();

          for (const phoneNumber of mobileNumbersOfSelectedGroup) {
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
              console.log(
                `Message sent to ${phoneNumber} messageContent : ${messageContent}`
              );
            } catch (error) {
              console.error(
                `Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`
              );
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
            GroupName: selectedGroup,
            GroupNumber: mobileNumbersOfSelectedGroup,
          });
          // console.log(`before saving : ${SaveCampaigncontact.campaignName}`);
          await SaveCampaigncontact.save();

          for (const phoneNumber of mobileNumbersOfSelectedGroup) {
            try {
              const response = await axios.post(
                APILink,
                {
                  messaging_product: "whatsapp",
                  recipient_type: "individual",
                  to: phoneNumber.trim(), // Remove any leading/trailing whitespace
                  type: "text",
                  text: {
                    body: `${MsgContent}`,
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
              console.error(
                `Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`
              );
            }
          }
        }
      } else {
        res.send("Cannot Send Please Select");
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
      res.redirect("/campaigns"); // Send a response to the client
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
  }
);

router.get("/campaignHistory", auth, async (req, res) => {
  try {
    const campaignhistory = await campaignHistory.find({});
    console.log(campaignhistory);
    res.render("campaignHistory", { campaignhistory });
  } catch (error) {
    console.log(error);
  }
});

router.get("/detaildcampaignHistory", auth, async (req, res) => {
  try {
    const showingcampaignHistory = await campaignHistory.find({});
    // console.log(showingcampaignHistory);
    res.render("DetailCampaignHistory", { showingcampaignHistory });
  } catch (error) {
    console.log(error);
  }
});

//setting
router.get("/setting", auth, async (req, res) => {
  try {
    const UserId = req.user;
    const user = await alluserOfourPanel.findOne({ _id: UserId._id });
    console.log(user);
    res.render("setting", { userEmail: user });
  } catch (error) {
    console.log(`here is the error ${error}`);
  }
});

router.post("/saveAPICredentials", auth, async (req, res) => {
  try {
    const userEmail = req.body.userEmail; // Assuming userEmail is already available
    const UserId = req.user;
    const user = await alluserOfourPanel.findOne({ _id: UserId._id });

    const APILink = req.body.API_LINK;
    const BearerToken = req.body.BearerToken;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const regex = /\/(\d{7,})\//;
    const match = APILink.match(regex);
    let extractedNumber = null;
    if (match) {
      extractedNumber = match[1];
      console.log("Extracted Number:", extractedNumber); // Log the extracted number
    }

    // Make request to Facebook Graph API
    const GRAPH_API_URL = `https://graph.facebook.com/v18.0/${extractedNumber}?fields=verified_name,code_verification_status,display_phone_number,quality_rating,id`;
    const response = await fetch(GRAPH_API_URL, {
      headers: {
        Authorization: `Bearer ${BearerToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    console.log("Extracted Data from API:", data); // Log the extracted data from the API

    // Update the user document with the API credentials and extracted data
    user.APILink = APILink;
    user.BearerToken = BearerToken;
    user.extractedNumber = extractedNumber;
    user.verified_name = data.verified_name || "";
    user.code_verification_status = data.code_verification_status || "";
    user.display_phone_number = data.display_phone_number || "";
    user.quality_rating = data.quality_rating || "";
    user.id = data.id || 0;

    // Save the updated user document
    const savedDate = await user.save();
    console.log(savedDate);

    return res
      .status(200)
      .json({
        message: "API credentials and extracted data saved successfully",
        user: user,
      });
  } catch (error) {
    console.error("Error saving API credentials:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


//superAdmin
router.get("/superAdmin", async (req, res) => {
  try {
    const allusers = await alluserOfourPanel.find({});
    res.render("superAdmin", { allusers });
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
});

router.post("/deactivateUser", async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);

    // Find the user by userId
    const user = await alluserOfourPanel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the user is a superadmin
    if (user.isSuperAdmin) {
      return res
        .status(403)
        .send("Superadmins cannot deactivate their own account");
    }

    // Update user record to mark as deactivated
    await alluserOfourPanel.findByIdAndUpdate(userId, { isActive: false });
    res.status(200).send("User deactivated successfully");
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).send("An error occurred while deactivating user");
  }
});


router.post("/toggleUserStatus", async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(`activate user id ${userId}`);

    // Find the user by userId
    const user = await alluserOfourPanel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the user is a superadmin
    if (user.isSuperAdmin) {
      return res
        .status(403)
        .send("Superadmins cannot toggle their own account status");
    }

    // Toggle the user's isActive status
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).send("User status toggled successfully");
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).send("An error occurred while toggling user status");
  }
});

router.get("/usersDetails/:userId", async (req, res) => {
  try {
    // Extract userId from request parameters
    const userId = req.params.userId;

    // Fetch user details from the database based on userId
    const userDetails = await alluserOfourPanel
      .find({ _id: userId })
      .select(
        "fname lname phoneNum userEmail code_verification_status display_phone_number id quality_rating verified_name"
      );

    // If userDetails is null or undefined, handle the case appropriately
    if (!userDetails) {
      // Handle case when userDetails is not found
      return res.status(404).send("User details not found");
    }

    // Render the "usersDetails" page with user details
    res.render("usersDetails", { userDetails: userDetails });
  } catch (error) {
    // Handle any errors that occur during fetching user details
    console.error("Error fetching user details:", error);
    res.status(500).send("Internal Server Error");
  }
});

//Templates
router.get("/viewAllTemplates", auth, (req, res) => {
  try {
    res.render('viewAllTemplates', { languages: languages });

  } catch (error) {
    res.status(500).send("internal server Error");
  }
});

router.get("/viewAllreports", auth, (req, res) => {
  try {
    res.render("reports");
  } catch (error) {
    res.status(500).send("internal server Error");
  }
});

module.exports = router;

// template message

// router.get("/customMsgHistory", auth, async (req, res) => {
//   try {
//     const customMessage = await customMessageContent.find({});
//     res.render("customMsgHistory", { iterate: customMessage });
//   } catch (error) {
//     res.status(500).send("internal server Error");
//   }
// });

// router.post('/sendtemplateMessage', async (req, res) => {
//   try {
//     const { recipients, selectTemp } = req.body;
//     const phoneNumberArray = recipients.split(',').map(phone => phone.trim());
//     console.log(req.body);
//     console.log(phoneNumberArray, "phoneNumberArray");
//     for (const recipient of phoneNumberArray) {
//       console.log("rec", recipient);
//       const response = await axios.post(
//         'https://graph.facebook.com/v19.0/239145135951200/messages',
//         {
//           messaging_product: "whatsapp",
//           to: recipient,
//           type: "template",
//           template: {
//             name: selectTemp,
//             language: {
//               code: "en"
//             }
//           }
//         },
//         {
//           headers: {
//             Authorization: 'Bearer EAAWqeZCMrJ6sBADM8i3BxBDr1jZBd9pdakNpZBUv7bjBZBOhmbHAFGYDOZA09VnwuE7VtJgMyksnmoMgJBtVFfL1cUkiJx43q1ZAPTPdzL4VJVYRMAdXyysuJtXI7T0T8HGuNJFDGm6YsH1k85xh0khvyic2CiGbcMmcBpvOa4jGrNn7L1bsyJ4wZC8z4eKO3e7thrjycvvigZDZD',
//             "Content-Type": "application/json"
//           },
//         }
//       );
//       console.log(`Message sent to ${recipient}`);
//     }

//     res.status(200).send('Messages sent successfully');
//   } catch (error) {
//     console.error('Error sending messages:', error);
//     res.status(500).send('Error sending messages');
//   }
// });


// //commentout for sometime
// router.post('/sendtemplateMessages', async (req, res) => {
//   const { sameBtn } = req.body; // Assuming you're using body-parser middleware

//   if (sameBtn === 'multipleNumbers') {
//     const phoneNumbers = req.body.phoneOfTemp;
//     const messageContent = req.body.selectTemp;
//     const allPhoneNumbers = phoneNumbers.split(',');
//     for (const phoneNumber of allPhoneNumbers) {
//       try {
//         const response = await axios.post(
//           'https://graph.facebook.com/v18.0/116168451372633/messages',
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
//     console.log(req.body);
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
//               'https://graph.facebook.com/v18.0/116168451372633/messages',
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
//   } // save message with select Group contacts
//   else if (sameBtn === 'selectedGroupInput') {
//     const messageContent = req.body.selectTemp;
//     const showInSelectBox = await NumberModel.find({});
//     const selectedGroup = req.body.Group;
//     console.log('Selected Group:', selectedGroup);
//     const mobileNumbersOfSelectedGroup = showInSelectBox
//       .filter(item => item.Groups === selectedGroup)
//       .map(item => item.mobile);
//     console.log('Selected Group:', selectedGroup);
//     console.log('Mobile Numbers of Selected Group:', mobileNumbersOfSelectedGroup);
//     for (const phoneNumber of mobileNumbersOfSelectedGroup) {
//       try {
//         const response = await axios.post(
//           'https://graph.facebook.com/v18.0/116168451372633/messages',
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
//     console.log('Select Group is checked');
//     // Handle select Group logic here
//   } else {
//     console.log('No radio button is checked');
//   }
//   res.send('message has been sent successfully!');
// });


//now template working
router.post('/sendtemplateMessages', upload.single('extractExcel'), auth, async (req, res) => {
  const { checkBoxExample, sameBtn } = req.body;

  if (sameBtn === 'multipleNumbers') {
    const phoneNumbers = req.body.phoneOfTemp;
    const messageContent = req.body.selectTemp;
    const allPhoneNumbers = phoneNumbers.split(',');
    for (const phoneNumber of allPhoneNumbers) {
      try {
        const response = await axios.post(
          'https://graph.facebook.com/v18.0/243678098829351/messages',
          {
            messaging_product: "whatsapp",
            to: phoneNumber.trim(), // Remove any leading/trailing whitespace
            type: "template",
            template: {
              name: messageContent,
              language: {
                code: "en",
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer EAAWqeZCMrJ6sBO7zUipLVLmnOdyF0ZBPcMyJC17gRmcZAZAnn3mMbRkvb19SFMiwvZCaIhuZAeB1C0QCrgfJK193Hav9kIDsKM5ZCvFAVkjgAkb57BOj2DWULJmEDvdxjpp01hpsznvZA7ZBVaO22QQdFjmfa0bggPndsH81BegAEgD8hSak3Pz8woVvPwLOMKAOnNLVEiDggLACVbaru`,
              "Content-Type": "application/json",
            },
          }
        );

        const savingTemplateMessageInDB = new templateMsg({
          phoneOfTemp: allPhoneNumbers.join(','),
          selectTemp: messageContent
        })
        await savingTemplateMessageInDB.save();
        console.log(`Message sent to ${phoneNumber}`);
        console.log(`See here phone numbers ${phoneNumbers}`)
        console.log(`See here selected template name ${messageContent}`)
      } catch (error) {
        // console.error(`Error sending message to ${phoneNumber}:`, error.response?.status, error.response?.data);
        console.log(`See here phone numbers ${phoneNumbers}`)
        console.log(`See here selected template name ${messageContent}`);
        console.log(`See here Error ${error}`);
      }
    }
    console.log('Mobile Number is checked');
  }
  else if (sameBtn === 'bulkUploadInput') {
    const messageContent = req.body.selectTemp;
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
        console.log('Received Excel file:', excelFile.originalname);
        console.log('Excel File Data:');
        console.log(jsonData);

        // Initialize an array to store phone numbers
        const phoneNumbers = [];

        for (const entry of jsonData) {
          const number = entry.mobile;
          phoneNumbers.push(number); // Push each number to the array
          try {
            const response = await axios.post(
              'https://graph.facebook.com/v18.0/243678098829351/messages',
              {
                messaging_product: "whatsapp",
                to: number,
                type: "template",
                template: {
                  name: messageContent,
                  language: {
                    code: "en",
                  },
                },
              },
              {
                headers: {
                  Authorization: `Bearer EAAWqeZCMrJ6sBO7zUipLVLmnOdyF0ZBPcMyJC17gRmcZAZAnn3mMbRkvb19SFMiwvZCaIhuZAeB1C0QCrgfJK193Hav9kIDsKM5ZCvFAVkjgAkb57BOj2DWULJmEDvdxjpp01hpsznvZA7ZBVaO22QQdFjmfa0bggPndsH81BegAEgD8hSak3Pz8woVvPwLOMKAOnNLVEiDggLACVbaru`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(`Message sent to ${number}`);
          } catch (error) {
            console.error(`Error sending message to ${number}: ${messageContent} ${error.message}`);
          }
        }
        console.log(phoneNumbers);
        // Save the phone numbers array to the database
        const savingTemplateMessageInDB = new templateMsg({
          phoneOfTemp: phoneNumbers.join(','), // Convert array to string
          selectTemp: messageContent
        });
        await savingTemplateMessageInDB.save();

      } catch (error) {
        console.error('Error processing Excel file:', error);
      }
    }
    // Handle bulk upload saving logic here
  }
  else if (sameBtn === 'selectedGroupInput') {
    const messageContent = req.body.selectTemp;
    const showInSelectBox = await NumberModel.find({});
    const selectedGroup = req.body.Group;
    console.log('Selected Group:', selectedGroup);
    const mobileNumbersOfSelectedGroup = showInSelectBox
      .filter(item => item.Groups === selectedGroup)
      .map(item => item.mobile);
    console.log('Selected Group:', selectedGroup);
    console.log('Mobile Numbers of Selected Group:', mobileNumbersOfSelectedGroup);

    // Save the phone numbers array to the database
    const savingTemplateMessageInDB = new templateMsg({
      phoneOfTemp: mobileNumbersOfSelectedGroup.join(','), // Convert array to string
      selectTemp: messageContent
    });
    await savingTemplateMessageInDB.save();

    for (const phoneNumber of mobileNumbersOfSelectedGroup) {
      try {
        const response = await axios.post(
          'https://graph.facebook.com/v18.0/243678098829351/messages',
          {
            messaging_product: "whatsapp",
            to: phoneNumber,
            type: "template",
            template: {
              name: messageContent,
              language: {
                code: "en",
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer EAAWqeZCMrJ6sBO7zUipLVLmnOdyF0ZBPcMyJC17gRmcZAZAnn3mMbRkvb19SFMiwvZCaIhuZAeB1C0QCrgfJK193Hav9kIDsKM5ZCvFAVkjgAkb57BOj2DWULJmEDvdxjpp01hpsznvZA7ZBVaO22QQdFjmfa0bggPndsH81BegAEgD8hSak3Pz8woVvPwLOMKAOnNLVEiDggLACVbaru`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(`Message sent to ${phoneNumber} messageContent : ${messageContent}`);
      } catch (error) {
        console.error(`Error sending message to ${phoneNumber}: ${messageContent} ${error.message}`);
      }
    }
    console.log('Select Group is checked');
    // Handle select Group logic here
  }
  else {
    // Send a response indicating success without creating a campaign
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Sent Successfully</title>
      </head>
      <body>
        <center><h1>Message has been sent successfully!</h1></center>
      </body>
      </html>
    `);
  }
  if (checkBoxExample === 'on') {
    try {
      const phoneOfTemp = req.body.phoneOfTemp;
      const messageType = req.body.selectTemp;
      const campaignName = req.body.campaignName;
      console.log(req.body);
      // Create a new Campaign document
      const newCampaign = new campaignsSchema({
        phoneOfTemp,
        messageType,
        message: messageType,
        campaignName: campaignName
      });
      console.log("fnal schmea ", newCampaign);
      // Save the campaign document to the database
      await newCampaign.save();

      // Send a response indicating success
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Sent Successfully</title>
        </head>
        <body>
          <center><h1>Message has been sent successfully and campaign created!</h1></center>
        </body>
        </html>
      `);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while saving the campaign.");
    }
  }
});


// CRUD Operations



router.get("/campaignHistory", auth, async (req, res) => {
  try {
    const campaignhistory = await campaignHistory.find({});
    console.log(campaignhistory);
    res.render("campaignHistory", { campaignhistory });
  } catch (error) {
    console.log(error);
  }
});

// // Read all subscriptions
// router.get('/helpsupport', async (req, res) => {
//   try {
//     const subscriptions = await Subscription.find();

//     res.render("Subscriptions", { subscriptions });
//   } catch (error) {
//     console.error('Error fetching subscriptions:', error);
//     res.status(500).send('Failed to fetch subscriptions');
//   }
// });


// Handle POST request to upload a contact
router.post('/uploadContact', async (req, res) => {
  try {
    const { name, mobile } = req.body;

    // Create a new contact object
    const newContact = new NumberModel({
      name,
      mobile
    });

    // Save the contact to the database
    await newContact.save();

    // Send a success response
    res.status(200).send('Contact added successfully');
  } catch (error) {
    // Handle error
    console.error('Error adding contact:', error);
    res.status(500).send('Error adding contact');
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

//   const GroupsSet = new Set();
//   const mobileNumbers = [];

//   showInSelectBox.forEach(item => {
//     GroupsSet.add(item.Groups);
//     mobileNumbers.push(item.mobile);
//   });
//   const Groups = Array.from(GroupsSet);
//   res.render("customMessage", { Groups, mobileNumbers });
// });

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

//cut
// router.get('/sendtemplatemessagess/:phoneNumber/:selectTemp/:otpCode', async (req, res) => {
//   try {
//     const { phoneNumber, selectTemp, otpCode } = req.params;

//     const response = await axios.post(
//       `https://graph.facebook.com/v18.0/243678098829351/messages?phone=${phoneNumber}`,
//       {
//         messaging_product: "whatsapp",
//         to: phoneNumber,
//         type: "template",
//         template: {
//           name: selectTemp,
//           language: {
//             "code": "en"
//           },
//           components: [
//             {
//               type: "body",
//               "parameters": [
//                 {
//                   "type": "text",
//                   "text": otpCode,
//                 }
//               ]
//             }
//           ],
//         }
//       },
//       {
//         headers: {
//           Authorization: 'Bearer    EAAWqeZCMrJ6sBO2nZCLcUirtdE77KegWssKhPymZAtDitZBR29TwEQ9INU5NQXOURqcieZBKg8B4ZCSszXQX3yjBkB8VrZBey0t7CD2wzCPFTHYJjhNDcSOZACJtXlPdrwpqZA27QCsweZBssZBClpJFSMHPhTbuD6QjkGzzZBQBu17ppvr1SnzR6DjV1OO3vY8MjHYuffdcMNrlF9H6L12BVQkNhZBnZCrZAHjr1eU',
//           "Content-Type": "application/json"
//         },
//       }
//     );

//     console.log("Response:", response.data);
//     res.status(200).send('Message sent successfully');
//   } catch (error) {
//     console.error('Error sending message:', error.response.data);
//     res.status(500).send('Error sending message');
//   }
// });


// //copy working with r token
// router.post('/sendtemplateMessage', async (req, res) => {
//   try {
//     const { recipients, selectTemp } = req.body;
//     const phoneNumberArray = recipients.split(',').map(phone => phone.trim());
//     console.log(req.body);
//     console.log(phoneNumberArray, "phoneNumberArray");
//     for (const recipient of phoneNumberArray) {
//       console.log("rec", recipient);
//       const response = await axios.post(
//         'https://graph.facebook.com/v18.0/243678098829351/messages',
//         {
//           messaging_product: "whatsapp",
//           to: recipient,
//           type: "template",
//           template: {
//             name: selectTemp,
//             language: {
//               code: "en"
//             }
//           }
//         },
//         {
//           headers: {
//             Authorization: 'Bearer EAAWqeZCMrJ6sBO7zUipLVLmnOdyF0ZBPcMyJC17gRmcZAZAnn3mMbRkvb19SFMiwvZCaIhuZAeB1C0QCrgfJK193Hav9kIDsKM5ZCvFAVkjgAkb57BOj2DWULJmEDvdxjpp01hpsznvZA7ZBVaO22QQdFjmfa0bggPndsH81BegAEgD8hSak3Pz8woVvPwLOMKAOnNLVEiDggLACVbaru',
//             "Content-Type": "application/json"
//           },
//         }
//       );
//       console.log(`Message sent to ${recipient}`);
//     }

//     res.status(200).send('Messages sent successfully');
//   } catch (error) {
//     console.error('Error sending messages:', error);
//     res.status(500).send('Error sending messages');
//   }
// });

// Handle POST request to upload a contact
app.post('/uploadContact', async (req, res) => {
  try {
    const { name, mobile } = req.body;

    // Create a new contact object
    const newContact = new Contact({
      name,
      mobile
    });

    // Save the contact to the database
    await newContact.save();

    // Send a success response
    res.status(200).send('Contact added successfully');
  } catch (error) {
    // Handle error
    console.error('Error adding contact:', error);
    res.status(500).send('Error adding contact');
  }
});

router.post('/change-password', async (req, res) => {
  const userId = '65e2c189696522966abd1520';
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // // Retrieve the current user's ID from session or token
  // const userId = req.session.userId; // Example: using session

  try {
    // Retrieve the user from the database
    const user = await alluserOfourPanel.findById(userId);
    console.log("here", user);
    // Check if the old password matches
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.userpassword);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: 'Invalid old password' });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.userpassword = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/campaignHistory", auth, async (req, res) => {
  try {
    const campaignhistory = await campaignHistory.find({});
    console.log(campaignhistory);
    res.render("campaignHistory", { campaignhistory });
  } catch (error) {
    console.log(error);
  }
});

//help & support
router.get("/support", async (req, res) => {
  const supporthistory = await Ticket.find({});
  console.log(supporthistory);
  res.render("support", { supporthistory });
});

// Get a particular ticket by ID
router.get('/subscriptionDetails/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.render("support", { ticket });
  } catch (error) {
    console.error('Error fetching Ticket:', error);
    res.status(500).json({ error: 'Failed to fetch Ticket' });
  }
});

router.post('/addtickets', async (req, res) => {
  try {
    const { content, messages } = req.body;
    const newTicket = new Ticket({ content, messages });
    await newTicket.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put('/helpsupport/:id', async (req, res) => {
  try {
    const { content, messages } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { content, messages },
      { new: true }
    );
    res.status(200).send(updatedTicket);
  } catch (error) {
    console.error('Error updating Ticket:', error);
    res.status(500).send('Failed to update Ticket');
  }
});

router.delete('/helpsupport/:id', async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).send('Ticket not found');
    }
    res.status(200).send('Ticket deleted successfully');
  } catch (error) {
    console.error('Error deleting Ticket:', error);
    res.status(500).send('Failed to delete Ticket');
  }
});

router.post('/addreply/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const supportTicket = await Ticket.findById(id);
    if (supportTicket) {
      supportTicket.reply = reply;
      const updatedTicket = await supportTicket.save();
      res.status(200).json({ message: 'Reply added successfully', updatedTicket });
    } else {
      res.status(404).json({ error: 'Support ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//subscription
router.get("/subscription", async (req, res) => {
  const subscriptionhistory = await Subscription.find({});
  console.log(subscriptionhistory);
  res.render("subscription", { subscriptionhistory });
});

router.get('/findsubscriptionDetails/:id', async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'subscription not found' });
    }
    console.log("here", subscription);
    // res.render("support", { subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

router.post('/addsubscriptions', async (req, res) => {
  try {
    console.log("addsubscriptions");
    const { name, description, price, duration } = req.body;
    console.log(req.body);
    const newsubscription = new Subscription({ name, description, price, duration });
    await newsubscription.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put('/subscription/:id', async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const updatedsubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { name, description, price, duration },
      { new: true }
    );
    res.status(200).send(updatedsubscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).send('Failed to update subscription');
  }
});

router.delete('/subscription/:id', async (req, res) => {
  try {
    const deletedsubscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!deletedsubscription) {
      return res.status(404).send('subscription not found');
    }
    res.status(200).send('subscription deleted successfully');
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).send('Failed to delete subscription');
  }
});







