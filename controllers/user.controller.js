const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const Roll = mongoose.model("Roll");
const bycrypt = require('bcryptjs');


module.exports.register = (req, res, next) => {

  console.log(req.body)
  var user = new User();
  user.fullName = req.body.fullName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.phoneNumber = req.body.phoneNumber;
  user.TypeRoll = req.body.TypeRoll;
  user.doctorId = req.body.doctorId;
  user.idNumber = req.body.idNumber;

  
  if( req.body.centerId!=null)
  {
    user.centerId =   req.body.centerId;
  }
  user.save((err, doc) => {
    if (!err) res.send(doc);
    else {
      if (err.code == 11000) res.status(422).send(["Duplicate email address"]);
      else return next(err);
    }
  });
};





module.exports.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate("local", (err, user, info) => {
    // error from passport middleware

    if (err) {
      return res.status(400).json(err);
    }
    // registered user
    if (user) {
      return res.status(200).json({ token: user.generateJwt(),userId:user._id,userData:user });
    }
    // unknown user or wrong password
    else return res.status(404).json(info);
  })(req, res);
};

module.exports.UpdateFCMToken = (req, res, next) => {
  User.updateOne({ _id: req.body.userid },{$set: {fcmToken : req.body.fcmToken}}, (err, doc) => {
    if (!doc){
      return res.status(200).json({ status: false, message: "NotUpdated" });
    }
    else {
      return res.status(200).send({status: true, message: "Updated" });
    }
  });
};

module.exports.GetSuperVisorName = (req, res, next) => {
  User.findOne({ _id: req._id }, (err, user) => {
    if (!user)
      return res.status(200).json({
        status: true,
        user: __dirname.pick(user, ["fullname", "email"])
      });
    else
      return res.status(200).json({
        status: true,
        user: __dirname.pick(user, ["fullname", "email"])
      });
  });
};



module.exports.getUsers = (req, res, next) => {
  User.find({"TypeRoll": {$ne: "admin"}}, (err, doc) => {
 
    if (!doc)
    return res.status(200).json({ status: false, message: "Not Found" });
  else {
 
    return res.status(200).send({ message: doc });
  }
  });
};

module.exports.getUserDetails = (req, res, next) => {
  User.findOne({_id: req.params.id}, (err, doc) => {
 
    if (!doc)
    return res.status(200).json({ status: false, message: "Not Found" });
  else {
 
    return res.status(200).send({ message: doc });
  }
  }).populate("centerId");
};

module.exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.body.idItem }, (err, roll) => {
      if (!roll){
        return res.status(200).json({ status: false, message: "NotUpdated" });
      }
      else {
        return res.status(200).send({ message: "Updated" });
      }
    });
};

module.exports.authenticateTest = (req, res, next) => {
  // call for passport authentication
  var userModule = new User();
  userModule.email = req.body.email;
  userModule.SuperPublicKey = req.body.SuperPublicKey;

  userModule.password = req.body.password;

  passport.authenticate("local", (err, user, info) => {
    // error from passport middleware

    if (err) {
      return res.status(400).json(err);
    }
    // registered user
    if (user) {
      User.findOne({ email: userModule.email }, (err, user) => {
        if (user) {
          if(user.IsBlocked == true){
            return res.status(200).json({
              message: "Account Is Blocked , Try Again Later !"
            });
          }
          else
          {
          if(user.SuperPublicKey == null || userModule.SuperPublicKey == null)
          {
            console.log("false metamasknull"+user.SuperPublicKey + "jjjj"+userModule.SuperPublicKey);

            return res.status(200).json({
              message: "Make sure youre logged in with your ethereum account"
            });
          }
          if (
            user.SuperPublicKey.toLowerCase() ==
            userModule.SuperPublicKey.toLowerCase()
          ) {

            if(user.TypeRoll == "UniversityAdmin" || user.TypeRoll=="AdminCertificate")
            return res.status(200).json({ token: user.generateJwt() , UserId: user._id ,UniversityId : user.UniversityId });
            else
            return res.status(200).json({ token: user.generateJwt() , UserId: user._id ,UniversityId : "NotFound" });

          } else {
            console.log("false metamask");

            return res.status(200).json({
              message: "Make sure youre logged in with your ethereum account"
            });
          }
        }
        } else {

          return res.status(404).json(info);
        }
      });
    }
    // unknown user or wrong password
    else return res.status(404).json(info);
  })(req, res);
};
module.exports.userProfile = (req, res, next) => {
  User.findOne({ _id: req._id }, (err, user) => {
    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });
    else
      return res.status(200).json({
        status: true,
        user: __dirname.pick(user, ["fullname", "email"])
      });
  });
};

module.exports.CheckRandom = (req, res, next) => {
  console.log("heerr raand func");
  console.log("params" + req.body.Key);
  User.findOne(
    { SuperCode: req.body.Key },

    (err, user) => {
      if (!user)
        return res.status(200).json({ status: false, message: "KeyNotFound" });
      else return res.status(404).json({ status: true, message: "KeyFound" });
    }
  );
};

module.exports.AddSupervisor = (req, res, next) => {
  var supervisor = new User();

  supervisor.fullName = req.body.fullName;
  supervisor.email = req.body.email;
  supervisor.password = req.body.password;
  supervisor.key = req.body.key;
  supervisor.SuperPublicKey = req.body.SuperPublicKey;
  supervisor.SuperCode = req.body.SuperCode;
  supervisor.UniversityId = req.body.UniversityId;
  supervisor.TypeRoll = req.body.TypeRoll;
  supervisor.Blocked = false;
  supervisor.save((err, doc) => {
    if (!err) res.send(doc);
    else {

      if (err.code == 11000) res.status(422).send(["Duplicate email address"]);
      else return next(err);
    }
  });
};


module.exports.AddAdminCertificate = (req, res, next) => {
  var supervisor = new User();

  supervisor.fullName = req.body.fullname;
  supervisor.email = req.body.email;
  supervisor.password = req.body.password;
  supervisor.SuperPublicKey = req.body.SuperPublicKey;
  supervisor.UniversityId = req.body.UniversityId;
  supervisor.TypeRoll = req.body.TypeRoll;
  supervisor.Blocked = false;
  supervisor.save((err, doc) => {
    if (!err){
      return res.status(200).json({ status: true, message: "AdminCertAdded" });
    }
    else {

      if (err.code == 11000) res.status(422).send(["Duplicate email address"]);
      else return next(err);
    }
  });
};


module.exports.AddAdminUniversity = (req, res, next) => {
  var supervisor = new User();

  supervisor.fullName = req.body.fullname;
  supervisor.email = req.body.email;
  supervisor.password = req.body.password;
  supervisor.key = req.body.key;
  supervisor.SuperPublicKey = req.body.SuperPublicKey;
  supervisor.SuperCode = req.body.SuperCode;
  supervisor.UniversityId = req.body.UniversityId;
  supervisor.TypeRoll = req.body.TypeRoll;
  supervisor.Blocked = false;
  supervisor.save((err, doc) => {
    if (!err){
      return res.status(200).json({ status: true, message: "AdminAdded" });
    }
    else {

      if (err.code == 11000) res.status(422).send(["Duplicate email address"]);
      else return next(err);
    }
  });
};

module.exports.SetRollName = (req, res, next) => {
  var RollModule = new Roll();
  RollModule.idSupervisor = req._id;
  RollModule.NameRoll = req.body.RollName;
  RollModule.deleted = false;
  RollModule.save((err, doc) => {
    if (!err) res.send(doc);
    else {
      console.log("Error inside Addsuper func" + err);
    }
  });
};

module.exports.GetRollName = (req, res, next) => {
  Roll.find({ deleted: false }, (err, roll) => {
    if (!roll)
      return res.status(200).json({ status: false, message: "KeyNotFound" });
    else {
      return res.status(200).send({ message: roll });
    }
  });
};

module.exports.DeleteRoll = (req, res, next) => {
  var RollModule = new Roll();
Roll.updateOne({ _id: req.body.IdRoll },{$set: {deleted: true}}, (err, roll) => {
    if (!roll){
      return res.status(200).json({ status: false, message: "NotUpdated" });
    }
    else {
      return res.status(200).send({ message: "Updated" });
    }
  });
};

module.exports.GetTypeCurrentRoleType = (req, res, next) => {
  console.log(req.body)
  User.findOne({ _id: req.body.userid }, (err, roll) => {
    console.log(roll)
    if (!roll){

      return res.status(200).json({ status: false, message: roll });
    }
    else {

      return res.status(200).send({ message: roll['TypeRoll'] });
    }
  });
};



module.exports.GetAdminsUniversity = (req, res, next) => {

  User.find({ UniversityId  : req.body.UniversityId }, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "NotFound" });
    else {

      return res.status(200).send({ message: doc });
    }
  });
};


module.exports.ChangeStatusUserBlocked = (req, res, next) => {

User.updateOne({ _id: req.body.userid },{$set: {IsBlocked : req.body.status}}, (err, doc) => {
    if (!doc){
      return res.status(200).json({ status: false, message: "NotUpdated" });
    }
    else {
      return res.status(200).send({ message: "Updated" });
    }
  });
};


module.exports.SetVerifyCodeForgetPassword = (req, res, next) => {
  User.findOne({email: req.body.UserEmail }, (err, user) => {
    if (!user)
    {
      return res.status(200).json({ status: false, message: "EmailNotExists" });
    }
    else
    {
      console.log(req.body.Key)
      User.updateOne({ email: req.body.UserEmail },{$set: {CodeVerify : req.body.Key}}, (err, doc) => {
        if (!doc){
          console.log("succ")
          return res.status(200).json({ status: false, message: "NotUpdated" });
        }
        else {
          console.log("faler")
          return res.status(200).send({ message: "Updated" });
        }
      });
    }
  });
}

module.exports.RestorePassword = (req, res, next) => {
  User.findOne({ $and: [ { email: req.body.UserEmail }, { CodeVerify :req.body.Key } ] }, (err, user) => {
    if (!user)
    {
      console.log("error Code ")
      return res.status(200).json({ status: false, message: "EmailNotExists" });
    }
    else
    {

      bycrypt.genSalt(10 , (err, salt)=> {

        bycrypt.hash(req.body.NewPassword, salt,  (err, hash)=> {

          var user = new User();
          user.password = hash;
          user.CodeVerify = '';
          user.email = req.body.UserEmail;

          User.updateOne({ email:  user.email },{$set: {CodeVerify : user.CodeVerify , password : user.password} }, (err, doc) => {
            if (!doc){
              return res.status(200).json({ status: false, message: "NotUpdated" });
            }
            else {
              return res.status(200).send({ message: "Updated" });
            }
          });
        });
      });


    }
  });
}

