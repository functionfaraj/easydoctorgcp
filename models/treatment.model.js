const mongoose = require('mongoose');
var treatmentSchema = new mongoose.Schema({
  patiantId: {
    
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patiantSchema',
    },
    createdAt: {
    
      type:Date,
      default: Date.now
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

  note:{
    type:String,
    default: '',
  },
  Creditor:{
    type:Number,
    default: 0,
  },
  debtor:{
    type:Number,
    default: 0,
  },
  cumulative:{
    type:Number,
    default: 0,
  },
  typeTransfere:{
    type:String,
    default: "",
  },
  datePay:{
    type:String,
    default: "",
  },
  discountCenter:{
    type:Number,
    default: 0,
  },
  beforeDiscount:{
    type:Number,
    default: 0,
  },
  CRD:{
    type:Number,
    default: 1,
  },
  
  reversed:{
    type:Boolean,
    default: false,
  },
  saltSecret: String
});




mongoose.model('treatmentSchema' , treatmentSchema);
