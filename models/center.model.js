const mongoose = require('mongoose');
var centerSchema = new mongoose.Schema({
  Name: {
    type: String,
    default:""
  },
  PhoneNumber: {
    type: String,
    default:""

  },
  Address: {
    type: String,
    default:""
  },
  Discount: {
    type: String,
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




mongoose.model('centerSchema' , centerSchema);
