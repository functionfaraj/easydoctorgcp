const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: 'name not can empty'
  },
  email: {
    type: String,
    required: 'email not can empty',
    unique: true
  },
  password: {
    type: String,
    required: 'password not can empty',
    minlength: [4,'password more than 4 digit']
  },
  key: {

  },

fcmToken:{
default:""
},
phoneNumber:{
  type: String,
  default:""
  },
  idNumber:{
    type: String,
    default:""
    },

  centerId: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'centerSchema',
  },
  doctorId:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctorSchema',
  },
  TypeRoll: {
    type: String,

  },
  IsBlocked : {
    type : Boolean
  },
  CodeVerify: {

  },
  saltSecret: String
});

// userSchema.path('email').validate(function (email) {
//   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//   return emailRegex.test(email); // Assuming email has a text attribute
// }, 'The e-mail field cannot be empty.')

userSchema.pre('save', function (next){

  bycrypt.genSalt(10 , (err, salt)=> {

    bycrypt.hash(this.password, salt,  (err, hash)=> {

      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

userSchema.method.verifyPassword = function (password) {
  return bycrypt.compareSync(password , this.password);
}

userSchema.methods.generateJwt = function () {
  return jwt.sign({
      _id: this._id
  }, "SECRET#123",
      {
          expiresIn: "30000000m"
      });
}
mongoose.model('User' , userSchema);
