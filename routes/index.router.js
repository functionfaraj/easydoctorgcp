const express = require("express");
const jwtHelper = require("../config/jwtHelper");
const router = express.Router();
var multer = require("multer");
var DIR = "./uploads/";
var upload = multer({ dest: DIR }).single("photo");
var path = require("path");
var crypto = require("crypto");
const fs = require('fs');


function generateUniqueFileName(file) {
  return new Promise((resolve, reject) => {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return reject(err);
      resolve(raw.toString("hex") + path.extname(file.originalname));
    });
  });
}



var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Assuming req.user.id contains the user ID
    console.log(req.body)

    const userId = req.body.id;
    // Assuming req.body.patientId contains the patient ID
    const patientId = req.body.patientId;
    const destination = `./uploads/${userId}/${patientId}/`;

    // Ensure the destination directory exists
    fs.mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },
  filename: function(req, file, cb) {
    generateUniqueFileName(file)
      .then((fileName) => {
        cb(null, fileName);
      })
      .catch((err) => {
        cb(err);
      });
  }
});

// Multer upload configuration
var upload = multer({ storage: storage }).single("photo");

// POST route for uploading images
router.post("/", function(req, res, next) {

  upload(req, res, function(err) {
    if (err) {
      console.error(err);
      return res.status(422).send("An error occurred");
    }
    const imagePath = req.file.path;
    console.log("Image uploaded successfully:", imagePath);
    return res.status(200).json({ path: imagePath });
  });
});


// var storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: function(req, file, cb) {
//     crypto.pseudoRandomBytes(16, function(err, raw) {
//       if (err) return cb(err);

//       cb(null, raw.toString("hex") + path.extname(file.originalname));
//     });
//   }
// });

// var upload = multer({ storage: storage }).single("photo");



// router.post("/", function(req, res, next) {
//   console.log("INNSSIIDD");
//   var path = "";
//   upload(req, res, function(err) {
//     if (err) {
//       console.log(err);
//       return res.status(422).send("an Error occured");
//     }
//     path = req.file.path;
//     console.log(path);
//     return res.status(200).json({ path: path });
//   });
// });




router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

// Upload Logo University

var storageUploadLogo = multer.diskStorage({
  destination: "./uploads/UniversityLogo",
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err);

      cb(null, raw.toString("hex") + path.extname(file.originalname));
    });
  }
});
var uploadLogo = multer({ storage: storageUploadLogo }).single("photo");
router.post("/UploadUniversityLogo", function(req, res, next) {

  var path = "";
  uploadLogo(req, res, function(err) {
    if (err) {
      console.log(err);
      return res.status(422).send("an Error occured");
    }
    path = req.file.path;
    console.log(path);
    return res.status(200).json({ path: path });
  });
});


const ctrlUser = require("../controllers/user.controller");
router.get("/home", jwtHelper.verifyJwtToken, ctrlUser.userProfile);

router.post("/register", ctrlUser.register);
router.get("/getUsers",jwtHelper.verifyJwtToken, ctrlUser.getUsers);
router.post("/deleteUser",jwtHelper.verifyJwtToken, ctrlUser.deleteUser);
router.get("/getUserDetails/:id", ctrlUser.getUserDetails);

router.post("/authenticate", ctrlUser.authenticate);
router.post("/authenticateTest", ctrlUser.authenticateTest);

router.post("/AddSupervisor", ctrlUser.AddSupervisor);
router.post("/AddAdminUniversity", ctrlUser.AddAdminUniversity);
router.post("/AddAdminCertificate", ctrlUser.AddAdminCertificate);

// router.get("/GetSuperVisorName", ctrlUser.GetSuperVisorName);
// router.get("/GetSuperVisorName",jwtHelper.verifyJwtToken, ctrlUser.GetSuperVisorName);
// router.post("/CheckRandom", ctrlUser.CheckRandom);

router.post("/SetRollName", jwtHelper.verifyJwtToken,ctrlUser.SetRollName);
router.get("/GetRollName",ctrlUser.GetRollName);
router.post("/DeleteRoll",ctrlUser.DeleteRoll);
router.post("/GetTypeCurrentRoleType",ctrlUser.GetTypeCurrentRoleType);
router.post("/GetAdminsUniversity", ctrlUser.GetAdminsUniversity);
router.post("/ChangeStatusUserBlocked", ctrlUser.ChangeStatusUserBlocked);
router.post("/SetVerifyCodeForgetPassword", ctrlUser.SetVerifyCodeForgetPassword);
router.post("/RestorePassword", ctrlUser.RestorePassword);


// App Models;
// const centerSchema = require("../controllers/AppController.controller");
const AppSchema = require("../controllers/AppController.controller");
router.post("/AddPatiant", AppSchema.AddPatiant);
router.get("/GetPatiant/:id", AppSchema.GetPatiant);
router.post("/DeletePatiant", AppSchema.DeletePatiant);

router.post("/AddCenter", AppSchema.AddCenter);
router.get("/GetCenter/:id", AppSchema.GetCenter);
router.post("/DeleteCenter", AppSchema.DeleteCenter);

router.get("/dashboardDetails/:id", AppSchema.dashboardDetails);


router.post("/AddTreatmentOrPayment", AppSchema.AddTreatmentOrPayment);
router.post("/UpdatePatiant", AppSchema.UpdatePatiant);
router.post("/UpdateCenter", AppSchema.UpdateCenter);

router.get("/getPatiantPaymentsInfo", AppSchema.getPatiantPaymentsInfo);
router.post("/AddCenterTreatmentOrPayment", AppSchema.AddCenterTreatmentOrPayment);
router.post("/AddPatientImage", AppSchema.AddPatientImage);
router.get("/getPatientImage", AppSchema.getPatientImage);
router.post("/deletePatientImage", AppSchema.deletePatientImage);
router.get("/GetCenterIncom", AppSchema.GetCenterIncom);
router.post("/reversePayment", AppSchema.reversePayment);
// router.post("/SendNewRequest", AppSchema.SendNewRequest);

// router.get("/GetRequests", AppSchema.GetRequests);
// router.get("/GetAllRequestsById/:id", AppSchema.GetAllRequestsById);
// router.get("/GetRequestsByUserId/:id", AppSchema.GetRequestsByUserId);

// router.post("/UpdateRequest", AppSchema.UpdateRequest);


// router.post("/AddStaffRole", AppSchema.AddStaffRole);
// router.get("/GetStaffRole", AppSchema.GetStaffRole);
// router.post("/DeleteStaffRole", AppSchema.DeleteStaffRole);


// router.post("/AddStaffPerson", AppSchema.AddStaffPerson);
// router.get("/GetStaffPerson", AppSchema.GetStaffPerson);
// router.post("/DeleteStaffPerson", AppSchema.DeleteStaffPerson);

// router.get("/GetDoctorByCenter/:id", AppSchema.GetDoctorByCenter);
// router.get("/GetDoctorWorkingCenter/:id", AppSchema.GetDoctorWorkingCenter);
// router.get("/GetAllDoctorInCenters", AppSchema.GetAllDoctorInCenters);



// router.post("/AddComplaint", AppSchema.AddComplaint);
// router.get("/GetComplaint", AppSchema.GetComplaint);
// router.post("/SeenComplaint", AppSchema.SeenComplaint);


// router.post("/UpdateFCMToken", ctrlUser.UpdateFCMToken);


// router.post("/AddNews", AppSchema.AddNews);
// router.get("/GetNews", AppSchema.GetNews);
// router.post("/UpdateNews", AppSchema.UpdateNews);

// router.post("/sendNotification", AppSchema.sendNotification);

// router.get("/getNotificationByUser/:id", AppSchema.getNotificationByUser);

module.exports = router;
