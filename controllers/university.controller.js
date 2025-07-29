
const mongoose = require('mongoose');


const University = mongoose.model('University');
const UniversityCollege = mongoose.model('UniversityCollege');
const Department = mongoose.model('Department');


module.exports.GetNameUniversity = (req,res,next) => {


University.findOne({ _id:req.body.universityid }, (err, doc) => {
  if (!doc)
    return res.status(200).json({ status: false, message: "KeyNotFound" });
  else {
    return res.status(200).send({ message: doc.university_name   });
  }
});

}

module.exports.AddUniversity = (req,res,next) => {
  var university = new University();
  university.university_name = req.body.university_name;
  university.save((err , doc) => {
    if(!err){
      return res.status(200).json({ status: true, message: doc._id });
    }
      else
      {
        return res.status(200).json({ status: false, message: "NotAdded" });
      }

  });

}


module.exports.AddDetailsUniversity = (req,res,next) => {
  var university = new University();

  University.updateOne({ _id: req.body.universityid },
    {$set: {university_logo_path: req.body.LogoPath
    ,university_contry:req.body.Country
    ,university_Address: req.body.UniversityAddress
    ,university_mobile : req.body.PhoneNumber
    }}, (err, doc) => {
    if (!doc){
      
      return res.status(200).json({ status: false, message: "NotUpdated" });
    }
    else {
     
      return res.status(200).send({ message: "Updated" });
    }
  });

}

module.exports.GetDetailsUniversity = (req,res,next) => {

  University.findOne({ _id: req.body.universityid },
   (err, doc) => {
  if (!doc){
   
    return res.status(200).json({ status: false, message: "NotUpdated" });
  }
  else {
   
    return res.status(200).send({ message: doc });
  }
});

}



// College Models

module.exports.AddUniversityCollege = (req,res,next) => {
  var universitycollege = new UniversityCollege();
  universitycollege.college_name = req.body.collegeName;
  universitycollege.university_id = req.body.universityid;
  universitycollege.save((err , doc) => {
    if(!err){
      // res.send(doc);
      return res.status(200).json({ status: true, message: "Added"});
    }
      else
      {
        return res.status(200).json({ status: false, message: "NotAdded" });
      }

  });

}


module.exports.GetCollgeUniversity = (req, res, next) => {

  UniversityCollege.find({ university_id : req.body.universityid }, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "KeyNotFound" });
    else {
   
      return res.status(200).send({ message: doc });
    }
  });
};


// Department Models

module.exports.GetDepartmetCollege = (req, res, next) => {
  Department.find({ CollegeId : req.body.CollegeId }, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "KeyNotFound" });
    else {

      return res.status(200).send({ message: doc });
    }
  });
};


module.exports.AddDepartment = (req, res, next) => {

  department = new Department();
  department.DepartmentName = req.body.DepartmentName;
  department.CollegeId = req.body.CollegeId;
  department.UniversityId = req.body.universityid;
  department.deleted = false;
  department.save((err , doc) => {
    if(!err){

      return res.status(200).json({ status: true, message: "Added"});
    }
      else
      {
        return res.status(200).json({ status: false, message: "NotAdded" });
      }

  });
};

module.exports.GetDepartmentName = (req,res,next) => {

  Department.findOne({ _id:req.body.DepartmentId }, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "KeyNotFound" });
    else {
      return res.status(200).send({ message: doc.DepartmentName   });
    }
  });
  
  }