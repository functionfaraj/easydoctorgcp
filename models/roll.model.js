const mongoose = require('mongoose');
var rollSchema = new mongoose.Schema({
  idSupervisor: {
    type: String
  },
  NameRoll: {
    type: String

  },
  deleted: {
    type: Boolean
  },
  saltSecret: String
});




mongoose.model('Roll' , rollSchema);
