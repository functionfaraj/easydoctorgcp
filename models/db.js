
const mongoose = require ('mongoose');
mongoose.connect("mongodb://localhost:27017/EasyDoctorDB",{ useUnifiedTopology: true,useNewUrlParser: true, autoReconnect: true }, (err) => {
  if(!err) { console.log('mongoo connect sucess');}
  else { console.log('error connect'+ JSON.stringify(err , undefined , 2));}

});

require('./user.model');


require('./roll.model');

require('./patiant.model');
require('./center.model');
require('./treatmentDivision.model');
require('./treatment.model');
require('./patinetimages.model');



