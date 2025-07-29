const mongoose = require('mongoose');
var patiantSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: ""
  },

  PhoneNumber:{
    type:String,
    default:""
  },

  email:{
    type:String,
    default:""
  },

  Gender:{
    type:String,
    default:""
  },
  doctorAdded:  
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deleted:  
  {
    type:Boolean,
    default:false
  },
  saltSecret: String
});




mongoose.model('patiantSchema' , patiantSchema);
