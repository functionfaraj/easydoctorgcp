const mongoose = require('mongoose');
var notificationsSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },

  message:{
    type:String,
    default:""
  },
  DateString: {
    type:Date,
        default:""
  },

  userRecived: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  saltSecret: String
});




mongoose.model('notificationsSchema' , notificationsSchema);
