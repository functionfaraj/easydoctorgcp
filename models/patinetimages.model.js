const mongoose = require('mongoose');
var patinetimagesSchema = new mongoose.Schema({
  patiantId: {
    
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patiantSchema',
  },
  note: {
    type: String,
    default:""

  },
  createdAt: {
    
    type:Date,
    default: Date.now
},
  imagePath: {
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




mongoose.model('patinetimagesSchema' , patinetimagesSchema);
