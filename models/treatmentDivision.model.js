const mongoose = require('mongoose');
var treatemntDivisionSchema = new mongoose.Schema({
 payAmount:{
    type:Number,
    default: 0,
  },
  createdAt: {
    
    type:Date,
    default: Date.now
},

PayDate: {
    
  type:Date,
  default: ""
},

  treatment:  
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'treatmentSchema',
  },
  doctorAdded:  
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
    centerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'centerSchema',
     
    },

    patiantId: {
    
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patiantSchema',
    },

  saltSecret: String
});




mongoose.model('treatemntDivisionSchema' , treatemntDivisionSchema);
