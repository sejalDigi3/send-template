const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
require('dotenv').config();

const templateSchema = new mongoose.Schema({
  phoneOfTemp: {
    type: String,
  },
  selectTemp: {
    type: String,
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
/*
  registered business name
  addreses
  contact number
  GST NO
  PanNo
  GST Certificate Upload
  owners AdharCard
*/
const customMsgSchema = new mongoose.Schema({
  mobileNumber: {
    type: Number,
  },
  customMsgData: {
    type: String,
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const usersSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, 'First Name is required'],
      trim: true,
    },
    lname: {
      type: String,
      required: [true, 'Last Name is required'],
      trim: true,
    },
    phoneNum: {
      type: String,
      required: [true, 'Phone Number is required'],
      validate: {
        validator: function (value) {
          // Custom phone number validation logic (e.g., regex)
          // Replace the regex pattern with your desired phone number validation logic
          return /^\d{10}$/.test(value); // Example: Validates a 10-digit phone number
        },
        message: 'Invalid phone number format',
      },
    },
    userEmail: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email is already Registered'], // Typo fixed: unique validator syntax
      trim: true,
      validate: {
        validator: function (value) {
          // Custom email validation logic (e.g., regex)
          // Replace the regex pattern with your desired email validation logic
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value); // Example: Validates email format
        },
        message: 'Invalid email format',
      },
    },
    userpassword: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      trim: true,
    },
    resetToken: String,
    APILink: String,
    BearerToken: String,
    verified_name: String,
    code_verification_status: String,
    display_phone_number: String,
    quality_rating: String,
    id: Number,

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    registertoken: String,
    isActive: {
      type: Boolean,
      default: true, // Default value is true (active)
    },
    isSuperAdmin: {
      type: Boolean,
      default: false, // Default value is false (not a super admin)
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);
//superadmin
usersSchema.pre('save', function (next) {
  // Check if the phone number matches the specified one
  if (this.phoneNum === '9157808228') {
    this.isSuperAdmin = true; // Set isSuperAdmin to true
  }
  next(); // Proceed with saving
});

// middleware for authentication
usersSchema.methods.genrateAuthToken = async function () {
  try {
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.JSON_TOKEN);
    // console.log(`in schema file ${token}`)validationErrors
    this.tokens = this.tokens.concat({ token: token });
    await this.save()
    return token;
  } catch (error) {
    console.log(error);
  }
  console.log(this._id);
}
// middleware for has the pasword
usersSchema.pre('save', async function (next) {
  if (this.isModified('userpassword')) {
    // Hash the 'userpassword' field if it's modified
    this.userpassword = await bcrypt.hash(this.userpassword, 10);
  }
  next();
});

// schema for chat section Starts
const realTimechat = new mongoose.Schema({
  gettingMsg: {
    type: String,
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
// schema for chat section Ends

// upload contacts schema starts
const numberSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  Groups: {
    type: String,
    default: 'uncategorized',
  }
}, { timestamps: true });
// upload contacts schema Ends



// Define a static method to update Group by name and mobile
numberSchema.statics.updateGroupByNameAndMobile = async function (name, mobile, newGroup) {
  try {
    const result = await this.updateMany({ name, mobile }, { $set: { Groups: newGroup } });
    return result;
  } catch (error) {
    throw error;
  }
};


// Group management
const GroupSchema = new mongoose.Schema({
  GroupName: {
    type: String,
  },
}, { timestamps: true }); // Use timestamps option to automatically add createdAt and updatedAt fields

// campaigns Schema
const campaignSchema = new mongoose.Schema({
  // phoneOfTemp: String,
  phoneOfTemp: [String],
  messageType: String, // To store the selected radio button value
  message: String,    // Custom Message Data
  campaignName: String, // New field to store the name of the campaign
}, { timestamps: true });
// campaigns Schema

// collecthistory of Campaign
const contactNumbersSchema = new mongoose.Schema({
  campaignName: String,
  messageType: String,
  message: String,
  excelData: [
    {
      name: {
        type: String
      },
      mobile: {
        type: String
      },
    },
  ],
  phoneNumbers: String,
  GroupName: String,
  GroupNumber: [{}],
  fileName: String
}, { timestamps: true });

// collecthistory of Campaign
const subscriptionSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  duration: String,
});


// Ticket Schema
const TicketSchema = new mongoose.Schema({
  name: {
    type: String
  },
  content: {
    type: String
  },
  messages: {
    type: String
  },
  status: {
    type: Number,
    default: 0
  },
  img: {
    type: String
  },
  reply: {
    type: String,
    default: "no"
  }
}, { timestamps: true });


// Subscription Model
const Subscription = mongoose.model('Subscription', subscriptionSchema);
const Ticket = mongoose.model('TicketSchema', TicketSchema);
const templateMsg = new mongoose.model('templateMsg', templateSchema);
const alluserOfourPanel = new mongoose.model('alluserOfourPanel', usersSchema);
const customMessageContent = new mongoose.model('customMessage', customMsgSchema)
const ChattingMsg = new mongoose.model('ChattingMsg', realTimechat)
const NumberModel = mongoose.model('NumberModel', numberSchema);
const GroupManage = new mongoose.model('GroupManage', GroupSchema);
const campaignsSchema = new mongoose.model('campaignsSchema', campaignSchema);
const campaignHistory = new mongoose.model('campaignHistory', contactNumbersSchema);
const User = mongoose.model('User', usersSchema);
module.exports = {
  alluserOfourPanel,
  templateMsg,
  customMessageContent,
  ChattingMsg,
  NumberModel,
  GroupManage,
  campaignsSchema,
  campaignHistory,
  User,
  Subscription,
  Ticket
};
