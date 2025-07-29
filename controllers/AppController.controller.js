const mongoose = require("mongoose");


const patiantSchema = mongoose.model("patiantSchema");
const centerSchema = mongoose.model("centerSchema");
const treatmentSchema = mongoose.model("treatmentSchema");
const treatemntDivisionSchema = mongoose.model("treatemntDivisionSchema");
const patinetimagesSchema = mongoose.model("patinetimagesSchema");


var admin = require("firebase-admin");

var serviceAccount = require("../alHayat-fcm.json");
const firbaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


module.exports.AddPatiant = (req, res, next) => {
  var patiant = new patiantSchema();
  patiant.fullName = req.body.fullName;
  patiant.PhoneNumber = req.body.PhoneNumber;
  patiant.email = req.body.email;
  patiant.Gender = req.body.Gender;
  patiant.doctorAdded = req.body.doctorAdded;
  
  patiant.save((err, doc) => {
    if (!err) {
      console.log(doc.id)
      return res.status(200).send({ success: true, message: doc });

    } else {
      if (err.code == 11000) res.status(422).send(["Error"]);
      else return next(err);
    }
  });
};

module.exports.GetPatiant = (req, res, next) => {



  patiantSchema.find({ doctorAdded: req.params.id, deleted: false }, async (err, doc) => {
    if (err) {
        return res.status(200).json({ status: false,message:[] });
    }
    if (!doc || doc.length === 0) {
        return res.status(200).json({ status: false,message:[] });
    }

    try {
        const patientsWithTreatments = [];
        let counter = 0;
        var treatment = []; 

        doc.forEach(async (patient, index) => {
            try {
                const treat = await treatmentSchema.findOne({ patiantId: patient._id,centerId:null }).sort({ 'createdAt': -1 }).exec();
                patient['Treatment'] = treat || null;
                treatment[counter] = treat || null;
                
                patientsWithTreatments.push(patient);
                counter++;

                if (counter === doc.length) {
                    // All treatments fetched, send response
                    // patientsWithTreatments[0].append("fff","sss");
                    console.log(doc[0])
                    return res.status(200).json({ message: patientsWithTreatments,treatmentResult :treatment  });
                }
            } catch (error) {
                console.error('Error fetching treatment:', error);
                return res.status(200).json({ status: false,message:[] });
            }
        });
    } catch (error) {
        console.error('Error fetching treatments for patients:', error);
        return res.status(200).json({ status: false,message:[] });
    }
});


   pipeline = [
    // {
    //   $match: {
    //     doctorAdded: mongoose.Types.ObjectId(req.params.id),
    //     deleted: false
    //   }
    // },
    {
      $lookup: {
        from: 'treatmentSchema', // Name of the treatment collection
        localField: 'patiantId', // Field from the patient collection
        foreignField: '_id', // Field from the treatment collection
        as: 'treatments'
      }
    },
    // {
    //   $sort: {
    //     'treatments.createdAt': -1
    //   }
    // },
    // {
    //   $group: {
    //     _id: '$_id',
    //     patientInfo: { $first: '$$ROOT' },
    //     lastTreatment: { $first: { $arrayElemAt: ['$treatments', 0] } }
    //   }
    // }
  ];




};

module.exports.DeletePatiant = (req, res, next) => {


  patiantSchema.deleteOne({ _id: req.body.idItem }, (err, roll) => {
    if (!roll){
      return res.status(200).json({ status: false, message: "NotUpdated" });
    }
    else {
      return res.status(200).send({ message: "Updated" });
    }
  });
};


module.exports.AddCenter = (req, res, next) => {
  var Center = new centerSchema();
  Center.Name = req.body.Name;
  Center.PhoneNumber = req.body.PhoneNumber;
  Center.Discount = req.body.Discount;
  Center.Address = req.body.Address;
  Center.doctorAdded = req.body.doctorAdded;
  
  Center.save((err, doc) => {
    if (!err) {
      console.log(doc.id)
      return res.status(200).send({ success: true, message: "Data Addedd" });

    } else {
      if (err.code == 11000) res.status(422).send(["Error"]);
      else return next(err);
    }
  });
};

module.exports.GetCenter = (req, res, next) => {

  // centerSchema.find({doctorAdded:req.params.id,deleted:false}, (err, doc) => {
  //   if (!doc)
  //     return res.status(200).json({ status: false, message: "Not Found" });
  //   else {
   
  //     return res.status(200).send({ message: doc });
  //   }
  // })



  

  centerSchema.find({ doctorAdded: req.params.id, deleted: false }, async (err, doc) => {
    if (err) {
        return res.status(200).json({ status: false, message:[],treatmentResult:null });
    }
    if (!doc || doc.length === 0) {
        return res.status(200).json({ status: false, message:[],treatmentResult:null });
    }

    try {
        const patientsWithTreatments = [];
        let counter = 0;
        var treatment = []; 

        doc.forEach(async (patient, index) => {
            try {
                const treat = await treatmentSchema.findOne({ centerId: patient._id, }).sort({ 'createdAt': -1 }).exec();
                patient['Treatment'] = treat || null;
                treatment[counter] = treat || null;
                
                patientsWithTreatments.push(patient);
                counter++;

                if (counter === doc.length) {
                 
                    return res.status(200).json({ message: patientsWithTreatments,treatmentResult :treatment  });
                }
            } catch (error) {
                console.error('Error fetching treatment:', error);
                return res.status(200).json({ status: false,message:[] });
            }
        });
    } catch (error) {
        console.error('Error fetching treatments for patients:', error);
        return res.status(200).json({ status: false,message:[],treatmentResult:null });
    }
});

};


module.exports.GetCenterIncom = (req, res, next) => {


  const startDate = new Date(Date.UTC(req.query.year, req.query.month - 1, 1));
  const endDate = new Date(Date.UTC(req.query.year,req.query.month, 0, 23, 59, 59)); // Last day of the month

  console.log(startDate)
  console.log(endDate)
  treatemntDivisionSchema.find({ centerId: req.query.centerId,doctorAdded:req.query.DoctorId,  PayDate: {
    $gte: startDate,
    $lte: endDate
} }, async (err, doc) => {
    if (err) {
      console.log(err)
        return res.status(200).json({ status: false, message:[] });
    }
    if (!doc || doc.length === 0) {
        return res.status(200).json({ status: false, message:[] });
    }

    return res.status(200).json({ status: true, message:doc, });
}).populate("patiantId");

};

module.exports.DeleteCenter = (req, res, next) => {


  centerSchema.deleteOne({ _id: req.body.idItem }, (err, roll) => {
    if (!roll){
      return res.status(200).json({ status: false, message: "NotUpdated" });
    }
    else {
      return res.status(200).send({ message: "Updated" });
    }
  });
};


module.exports.dashboardDetails = (req, res, next) => {


  centerSchema.countDocuments({doctorAdded:req.params.id,deleted:false}, (err, roll) => {
    if (!roll){
    
      return res.status(200).json({  success: false, message: "Error2" });
    }
    else {
      console.log(roll);

      patiantSchema.countDocuments({doctorAdded:req.params.id,deleted:false}, (err, patiantCount) => {
        if (!patiantCount){
        
          return res.status(200).json({ success: false, message: "Erro3r" });
        }
        else {
          console.log(patiantCount);


         

            treatmentSchema.find({doctorAdded:req.params.id, typeTransfere:"Treatment"}, (err, doc) => {
              if (!doc)
                return res.status(200).json({ success: false, message: "Not Found" });
              else {
             
                // return res.status(200).send({success:true, message: doc });
                return res.status(200).send({  success: true,countCenter:roll,countPatiant:patiantCount,LastTreamtent:doc });
              }
            }).sort({ createdAt: -1 }).populate("patiantId")
       

        
        }
      });
      // return res.status(200).send({ message: "success1",countCenter:roll,countPatiant:0 });
    }
  });
};



module.exports.AddTreatmentOrPayment = (req, res, next) => {
var PatiantId = req.body.patiantId;


// console.log(req.body.Divisions.length)




// return res.status(200).json({ success: false, message: "NotUpdated" });
var Treatment = new treatmentSchema();

if(req.body.centerId){
  treatmentSchema.countDocuments({centerId:req.body.centerId}, (err, payCount) => {
    if (err){
      console.log("Iam Heer"+err)
      return res.status(200).json({ success: false, message:"Error" });
    }
    else {
    
      if(payCount>0)
      {
  
     
        treatmentSchema.findOne({centerId:req.body.centerId}, (err, doc) => {
          if (!doc)
            return res.status(200).json({ success: false, message: "Not Found" });
          else {
         
            // return res.status(200).send({ message: doc });
  
  
            var Comulative = doc.cumulative;
  
            if(req.body.typeTransfere == "Treatment")
            {
  
              console.log("Heer1")
              Treatment.patiantId = req.body.patiantId;
              Treatment.doctorAdded = req.body.doctorAdded;
              if( req.body.centerId!=null)
              Treatment.centerId = req.body.centerId;
              Treatment.note = req.body.note;
              Treatment.Creditor = req.body.Creditor;
              Treatment.debtor = req.body.debtor;
              // Treatment.datePay = req.body.datePay;
              Treatment.cumulative = req.body.TreamtmentAmount+Comulative;
              Treatment.typeTransfere = req.body.typeTransfere;
              Treatment.discountCenter = req.body.discountCenter;
              Treatment.beforeDiscount = req.body.beforeDiscount;
              Treatment.CRD = 1;
  
              Treatment.save((err, doc) => {
                if (!err) {
                  console.log(doc.id)


                   if(req.body.Divisions.length > 0)
                   {
                    let counter = 0;
                    req.body.Divisions.forEach(async (divisionPayment, index) => {
                      try {
                        var TreatmentDivisio = new treatemntDivisionSchema();
                        TreatmentDivisio.patiantId  = req.body.patiantId;
                        if( req.body.centerId!=null)
                        TreatmentDivisio.centerId = req.body.centerId;
                        TreatmentDivisio.doctorAdded  = req.body.doctorAdded;
                        TreatmentDivisio.treatment  =doc.id;
                        TreatmentDivisio.PayDate  =divisionPayment['datePay'];
                        TreatmentDivisio.payAmount  = divisionPayment['Amount'];
                       

                        const treat = await  TreatmentDivisio.save((err, doc) => {
                          if (!err) {
                       
                            console.log("Success")
                           
                          } else {
                            // return res.status(200).send({ success: false, message: "Data Not Addedd" });
                            console.log(err)
                          }
                        });

                        counter++;

                     
                        if (counter === req.body.Divisions.length) {
                          // All treatments fetched, send response
                          // patientsWithTreatments[0].append("fff","sss");
                     
                          return res.status(200).send({ success: true, message: "Data Addedd" });
                      }
                         console.log(divisionPayment['datePay'])
                      } catch (error) {
                          console.error('Error fetching treatment:', error);
                          return res.status(200).send({ success: true, message: "Data Addedd" });
                      }
                    });
                   }
                   else

                  return res.status(200).send({ success: true, message: "Data Addedd" });
            
                } else {
                  return res.status(200).send({ success: false, message: "Data Not Addedd" });
          
                }
              });
            }
            else
            if(req.body.typeTransfere == "Payment")
            {
  
  if(req.body.TreamtmentAmount<=Comulative)
  {
  
    // Treatment.patiantId = req.body.patiantId;
    Treatment.doctorAdded = req.body.doctorAdded;
    Treatment.centerId = req.body.centerId;
    // Treatment.note = req.body.note;
    Treatment.Creditor = req.body.Creditor;
    Treatment.debtor = req.body.debtor;
    Treatment.cumulative =Comulative- req.body.TreamtmentAmount;
    Treatment.typeTransfere = req.body.typeTransfere;
    Treatment.datePay = req.body.datePay;
    Treatment.discountCenter = req.body.discountCenter;
    Treatment.beforeDiscount = req.body.beforeDiscount;
    Treatment.CRD = -1;
  
    console.log(Treatment);
    Treatment.save((err, doc) => {
      if (!err) {
        console.log(doc.id)
        return res.status(200).send({ success: true, message: "Data Addedd" });
  
      } else {
        return res.status(200).send({ success: false, message: "Data Not Addedd" });
  
      }
    });
  }
  else{
    return res.status(200).json({ success: false, message: "Amount should be Less Than Total" });
  
  }
  
  
              // return res.status(200).json({ success: false, message: "No Data Found" });
        
            }
            else
            {
              return res.status(200).json({ success: false, message: "Error in Type Transfare" });
            }
  
          }
        }).sort({ createdAt: -1 })
  
      }
      else{
     
  
        // when add the first Treatment
       
        if(req.body.typeTransfere == "Treatment")
        {
          Treatment.patiantId = req.body.patiantId;
          Treatment.doctorAdded = req.body.doctorAdded;
          Treatment.centerId = req.body.centerId;
          Treatment.note = req.body.note;
          Treatment.Creditor = req.body.Creditor;
          Treatment.debtor = req.body.debtor;
          Treatment.cumulative = req.body.TreamtmentAmount;
          Treatment.typeTransfere = req.body.typeTransfere;
          Treatment.discountCenter = req.body.discountCenter;
          Treatment.beforeDiscount = req.body.beforeDiscount;
          Treatment.CRD = 1;
          
  
          Treatment.save((err, doc) => {
            if (!err) {
              console.log(doc.id)
              // return res.status(200).send({ success: true, message: "Data Addedd" });


              if(req.body.Divisions.length > 0)
              {
               let counter = 0;
             
               req.body.Divisions.forEach(async (divisionPayment, index) => {
                 try {
                   var TreatmentDivisio = new treatemntDivisionSchema();
                   TreatmentDivisio.patiantId  = req.body.patiantId;
                   if( req.body.centerId!=null)
                   TreatmentDivisio.centerId = req.body.centerId;
                   TreatmentDivisio.doctorAdded  = req.body.doctorAdded;
                   TreatmentDivisio.treatment  =doc.id;
                   TreatmentDivisio.PayDate  =divisionPayment['datePay'];
                   TreatmentDivisio.payAmount  = divisionPayment['Amount'];
                  

                   const treat = await  TreatmentDivisio.save((err, doc) => {
                     if (!err) {
                  
                       console.log("Success")
                      
                     } else {
                       // return res.status(200).send({ success: false, message: "Data Not Addedd" });
                       console.log(err)
                     }
                   });

                   counter++;

                
                   if (counter === req.body.Divisions.length) {
                     // All treatments fetched, send response
                     // patientsWithTreatments[0].append("fff","sss");
                
                     return res.status(200).send({ success: true, message: "Data Addedd" });
                 }
                    console.log(divisionPayment['datePay'])
                 } catch (error) {
                     console.error('Error fetching treatment:', error);
                     return res.status(200).send({ success: true, message: "Data Addedd" });
                 }
               });
              }
              else

             return res.status(200).send({ success: true, message: "Data Addedd" });

        
            } else {
              return res.status(200).send({ success: false, message: "Data Not Addedd" });
      
            }
          });
  
  
    
        }
        else
        if(req.body.typeTransfere == "Payment")
        {
          return res.status(200).json({ success: false, message: "No Data Found" });
    
        }
        else
        {
          return res.status(200).json({ success: false, message: "Error in Type Transfare" });
        }
  
  
  
      }
      // console.log(payCount);
      // return res.status(200).send({  success: true,countCenter:roll,countPatiant:patiantCount });
    }
  });
}
else
{
treatmentSchema.countDocuments({patiantId:PatiantId,centerId:null}, (err, payCount) => {
  if (err){
    console.log("Iam Heer"+err)
    return res.status(200).json({ success: false, message:"Error" });
  }
  else {
  
    if(payCount>0)
    {

   
      treatmentSchema.findOne({patiantId:req.body.patiantId,centerId:null}, (err, doc) => {
        if (!doc)
          return res.status(200).json({ success: false, message: "Not Found" });
        else {
       
          // return res.status(200).send({ message: doc });


          var Comulative = doc.cumulative;

          if(req.body.typeTransfere == "Treatment")
          {

            Treatment.patiantId = req.body.patiantId;
            Treatment.doctorAdded = req.body.doctorAdded;
            if( req.body.centerId!=null)
            Treatment.centerId = req.body.centerId;
            Treatment.note = req.body.note;
            Treatment.Creditor = req.body.Creditor;
            Treatment.debtor = req.body.debtor;
            // Treatment.datePay = req.body.datePay;
            Treatment.cumulative = req.body.TreamtmentAmount+Comulative;
            Treatment.typeTransfere = req.body.typeTransfere;
            Treatment.discountCenter = req.body.discountCenter;
            Treatment.beforeDiscount = req.body.beforeDiscount;
            Treatment.CRD = 1;

            Treatment.save((err, doc) => {
              if (!err) {
                console.log(doc.id)
                return res.status(200).send({ success: true, message: "Data Addedd" });
          
              } else {
                return res.status(200).send({ success: false, message: "Data Not Addedd" });
        
              }
            });
          }
          else
          if(req.body.typeTransfere == "Payment")
          {

if(req.body.TreamtmentAmount<=Comulative)
{

  Treatment.patiantId = req.body.patiantId;
  Treatment.doctorAdded = req.body.doctorAdded;
  // Treatment.centerId = req.body.centerId;
  // Treatment.note = req.body.note;
  Treatment.Creditor = req.body.Creditor;
  Treatment.debtor = req.body.debtor;
  Treatment.cumulative =Comulative- req.body.TreamtmentAmount;
  Treatment.typeTransfere = req.body.typeTransfere;
  Treatment.datePay = req.body.datePay;
  Treatment.discountCenter = req.body.discountCenter;
  Treatment.beforeDiscount = req.body.beforeDiscount;
  Treatment.CRD = -1;

  console.log(Treatment);
  Treatment.save((err, doc) => {
    if (!err) {
      console.log(doc.id)
      return res.status(200).send({ success: true, message: "Data Addedd" });

    } else {
      return res.status(200).send({ success: false, message: "Data Not Addedd" });

    }
  });
}
else{
  return res.status(200).json({ success: false, message: "Amount should be Less Than Total" });

}


            // return res.status(200).json({ success: false, message: "No Data Found" });
      
          }
          else
          {
            return res.status(200).json({ success: false, message: "Error in Type Transfare" });
          }

        }
      }).sort({ createdAt: -1 })

    }
    else{
   

      // when add the first Treatment
     
      if(req.body.typeTransfere == "Treatment")
      {
        Treatment.patiantId = req.body.patiantId;
        Treatment.doctorAdded = req.body.doctorAdded;
        // Treatment.centerId = req.body.centerId;
        Treatment.note = req.body.note;
        Treatment.Creditor = req.body.Creditor;
        Treatment.debtor = req.body.debtor;
        Treatment.cumulative = req.body.TreamtmentAmount;
        Treatment.typeTransfere = req.body.typeTransfere;
        Treatment.discountCenter = req.body.discountCenter;
        Treatment.beforeDiscount = req.body.beforeDiscount;
        Treatment.CRD = 1;
        

        Treatment.save((err, doc) => {
          if (!err) {
            console.log(doc.id)
            return res.status(200).send({ success: true, message: "Data Addedd" });
      
          } else {
            return res.status(200).send({ success: false, message: "Data Not Addedd" });
    
          }
        });


  
      }
      else
      if(req.body.typeTransfere == "Payment")
      {
        return res.status(200).json({ success: false, message: "No Data Found" });
  
      }
      else
      {
        return res.status(200).json({ success: false, message: "Error in Type Transfare" });
      }



    }
    // console.log(payCount);
    // return res.status(200).send({  success: true,countCenter:roll,countPatiant:patiantCount });
  }
});
}






};

module.exports.UpdatePatiant = (req, res, next) => {
           
  var StatusDetails = req.body.Status ;
  if(StatusDetails == "Update"){
   

    patiantSchema.findOneAndUpdate({ _id:  req.body.idItem }, {fullName: req.body.fullName,
      PhoneNumber:req.body.PhoneNumber,
      email:req.body.email,
      Gender: req.body.Gender
    }, (error, obj) => {
      if (error) {
        return res.status(200).json({ success: false, message: "NotUpdated" });
      }
      else
      {
      
        
        return res.status(200).send({success:true, message: "Updated" });
      }
    
      
    }).populate("userId");
  }
  else
  if(StatusDetails == "Delete")
  {
    patiantSchema.findOneAndUpdate({ _id:  req.body.idItem }, {deleted:1}, (error, obj) => {
      if (error) {
        return res.status(200).json({ success: false, message: "NotUpdated" });
      }
      else
      {
      
        
        return res.status(200).send({success: true, message: "Updated" });
      }
    
      
    })
  }
  else
  return res.status(200).json({ status: false, message: "NotUpdated" });


};

module.exports.UpdateCenter = (req, res, next) => {
           
  var StatusDetails = req.body.Status ;
  if(StatusDetails == "Update"){
   


    centerSchema.findOneAndUpdate({ _id:  req.body.idItem }, {Name: req.body.Name,
      PhoneNumber:req.body.PhoneNumber,
      Discount:req.body.Discount,
      Address: req.body.Address
    }, (error, obj) => {
      if (error) {
        return res.status(200).json({ success: false, message: "NotUpdated" });
      }
      else
      {
      
        
        return res.status(200).send({success:true, message: "Updated" });
      }
    
      
    });
  }
  else
  if(StatusDetails == "Delete")
  {
    centerSchema.findOneAndUpdate({ _id:  req.body.idItem }, {deleted:1}, (error, obj) => {
      if (error) {
        return res.status(200).json({ success: false, message: "NotUpdated" });
      }
      else
      {
      
        
        return res.status(200).send({success:true, message: "Updated" });
      }
    
      
    })
  }
  else
  return res.status(200).json({ status: false, message: "NotUpdated" });


};


module.exports.getPatiantPaymentsInfo = (req, res, next) => {

  console.log(req.params);
  console.log(req.query);

if(req.query.Type == "Center")
{
  treatmentSchema.find({centerId:req.query.id}, (err, doc) => {
    if (!doc)
      return res.status(200).json({ success: false, message: "Not Found" });
    else {
   
      return res.status(200).send({success:true, message: doc });
    }
  }).sort({ createdAt: -1 })
}
else{

  treatmentSchema.find({patiantId:req.query.id,centerId:null}, (err, doc) => {
    if (!doc)
      return res.status(200).json({ success: false, message: "Not Found" });
    else {
   
      return res.status(200).send({success:true, message: doc });
    }
  }).sort({ createdAt: -1 })
};
}


module.exports.AddCenterTreatmentOrPayment = (req, res, next) => {
  var PatiantId = req.body.patiantId;
  
  var Treatment = new treatmentSchema();
  
  treatmentSchema.countDocuments({patiantId:PatiantId}, (err, payCount) => {
    if (err){
      console.log("Iam Heer"+err)
      return res.status(200).json({ success: false, message:"Error" });
    }
    else {
    
      if(payCount>0)
      {
  
     
        treatmentSchema.findOne({patiantId:req.body.patiantId}, (err, doc) => {
          if (!doc)
            return res.status(200).json({ success: false, message: "Not Found" });
          else {
         
            // return res.status(200).send({ message: doc });
  
  
            var Comulative = doc.cumulative;
  
            if(req.body.typeTransfere == "Treatment")
            {
  
              Treatment.patiantId = req.body.patiantId;
              Treatment.doctorAdded = req.body.doctorAdded;
              if( req.body.centerId!=null)
              Treatment.centerId = req.body.centerId;
              Treatment.note = req.body.note;
              Treatment.Creditor = req.body.Creditor;
              Treatment.debtor = req.body.debtor;
              // Treatment.datePay = req.body.datePay;
              Treatment.cumulative = req.body.TreamtmentAmount+Comulative;
              Treatment.typeTransfere = req.body.typeTransfere;
              Treatment.discountCenter = req.body.discountCenter;
              Treatment.beforeDiscount = req.body.beforeDiscount;
              Treatment.CRD = 1;
  
              Treatment.save((err, doc) => {
                if (!err) {
                  console.log(doc.id)
                  return res.status(200).send({ success: true, message: "Data Addedd" });
            
                } else {
                  return res.status(200).send({ success: false, message: "Data Not Addedd" });
          
                }
              });
            }
            else
            if(req.body.typeTransfere == "Payment")
            {
  
  if(req.body.TreamtmentAmount<=Comulative)
  {
  
    Treatment.patiantId = req.body.patiantId;
    Treatment.doctorAdded = req.body.doctorAdded;
    // Treatment.centerId = req.body.centerId;
    // Treatment.note = req.body.note;
    Treatment.Creditor = req.body.Creditor;
    Treatment.debtor = req.body.debtor;
    Treatment.cumulative =Comulative- req.body.TreamtmentAmount;
    Treatment.typeTransfere = req.body.typeTransfere;
    Treatment.datePay = req.body.datePay;
    Treatment.discountCenter = req.body.discountCenter;
    Treatment.beforeDiscount = req.body.beforeDiscount;
    Treatment.CRD = -1;
  
    console.log(Treatment);
    Treatment.save((err, doc) => {
      if (!err) {
        console.log(doc.id)
        return res.status(200).send({ success: true, message: "Data Addedd" });
  
      } else {
        return res.status(200).send({ success: false, message: "Data Not Addedd" });
  
      }
    });
  }
  else{
    return res.status(200).json({ success: false, message: "Amount should be Less Than Total" });
  
  }
  
  
              // return res.status(200).json({ success: false, message: "No Data Found" });
        
            }
            else
            {
              return res.status(200).json({ success: false, message: "Error in Type Transfare" });
            }
  
          }
        }).sort({ createdAt: -1 })
  
      }
      else{
     
  
        // when add the first Treatment
       
        if(req.body.typeTransfere == "Treatment")
        {
          Treatment.patiantId = req.body.patiantId;
          Treatment.doctorAdded = req.body.doctorAdded;
          Treatment.centerId = req.body.centerId;
          Treatment.note = req.body.note;
          Treatment.Creditor = req.body.Creditor;
          Treatment.debtor = req.body.debtor;
          Treatment.cumulative = req.body.TreamtmentAmount;
          Treatment.typeTransfere = req.body.typeTransfere;
          Treatment.discountCenter = req.body.discountCenter;
          Treatment.beforeDiscount = req.body.beforeDiscount;
          Treatment.CRD = 1;
          
  
          Treatment.save((err, doc) => {
            if (!err) {
              console.log(doc.id)
              return res.status(200).send({ success: true, message: "Data Addedd" });
        
            } else {
              return res.status(200).send({ success: false, message: "Data Not Addedd" });
      
            }
          });
  
  
    
        }
        else
        if(req.body.typeTransfere == "Payment")
        {
          return res.status(200).json({ success: false, message: "No Data Found" });
    
        }
        else
        {
          return res.status(200).json({ success: false, message: "Error in Type Transfare" });
        }
  
  
  
      }
      // console.log(payCount);
      // return res.status(200).send({  success: true,countCenter:roll,countPatiant:patiantCount });
    }
  });
  
  
  // patiantSchema.findOne({patiantId:PatiantId}, (err, doc) => {
  //   if (!doc)
  //     return res.status(200).json({ status: false, message: "Not Found" });
  //   else {
   
  //     return res.status(200).send({ message: doc });
  //   }
  // }).sort({ createdAt: -1 })
  
  
  
  
  
    // var treatment = new treatmentSchema();
    // Center.Name = req.body.Name;
    // Center.PhoneNumber = req.body.PhoneNumber;
    // Center.Discount = req.body.Discount;
    // Center.Address = req.body.Address;
    // Center.doctorAdded = req.body.doctorAdded;
    
    // Center.save((err, doc) => {
    //   if (!err) {
    //     console.log(doc.id)
    //     return res.status(200).send({ success: true, message: "Data Addedd" });
  
    //   } else {
    //     if (err.code == 11000) res.status(422).send(["Error"]);
    //     else return next(err);
    //   }
    // });
  };



  
  module.exports.AddPatientImage = (req, res, next) => {
    var Pimage = new patinetimagesSchema();
    Pimage.note = req.body.note;
    Pimage.imagePath = req.body.imagePath;
    Pimage.patiantId = req.body.patiantId;
    Pimage.doctorAdded = req.body.doctorAdded;
    
    Pimage.save((err, doc) => {
      if (!err) {
        console.log(doc.id)
        return res.status(200).send({ success: true, message: "Data Addedd" });
  
      } else {
        if (err.code == 11000) res.status(422).send(["Error"]);
        else return next(err);
      }
    });
  };

  module.exports.getPatientImage = (req, res, next) => {

    patinetimagesSchema.find({patiantId:req.query.id,deleted:false}, (err, doc) => {
      if (!doc)
        return res.status(200).json({ success: false, message: "Not Found" });
      else {
     
        return res.status(200).send({success:true, message: doc });
      }
    }).sort({ createdAt: -1 })
  };


  module.exports.deletePatientImage = (req, res, next) => {
    patinetimagesSchema.findOneAndUpdate({ _id:  req.body.idItem }, {deleted:1}, (error, obj) => {
    if (error) {
      return res.status(200).json({ success: false, message: "NotUpdated" });
    }
    else
    {
    
      
      return res.status(200).send({success:true, message: "Updated" });
    }
  
    
  })
}




module.exports.reversePayment = (req, res, next) => {
  var Treatment = new treatmentSchema();
  console.log(req.body.note )
  treatmentSchema.findOne({ _id:  req.body.idItem ,reversed: { $in: [null, false] }}, (error, obj) => {
  if (error) {
    console.log(error)
    return res.status(200).json({ success: false, message: "NotUpdated" });
  }
  else
  {
  
    console.log(obj)
    console.log("iiiii")

    if(req.body.type == "Patient")
    {
      console.log("kkk")
      treatmentSchema.findOne({patiantId:req.body.patiantId,centerId:null}, (err, doc) => {
        if (!doc){
          console.log(err)
          return res.status(200).json({ success: false, message: "Not Found" });
        }
        else {
          console.log("kkkrr")
          console.log(doc.cumulative)


    if(obj.typeTransfere == "Treatment")
    {


      Treatment.patiantId =obj.patiantId;
      Treatment.doctorAdded =obj.doctorAdded;
      if( obj.centerId!=null)
      Treatment.centerId = obj.centerId;
      Treatment.note =req.body.note;
      Treatment.Creditor =obj.debtor;
      Treatment.debtor =obj.Creditor;
      // Treatment.datePay = req.body.datePay;
      Treatment.cumulative = doc.cumulative-obj.debtor;
      Treatment.typeTransfere ="Reversed";
      Treatment.discountCenter =obj.discountCenter;
      Treatment.beforeDiscount =obj.beforeDiscount;
      Treatment.reversed = true;
      Treatment.CRD = -1;

      Treatment.save((err, doc) => {
        if (!err) {
          console.log(doc.id)


  treatmentSchema.findOneAndUpdate({ _id:  req.body.idItem }, { reversed:true}, (error, obj) => {
            if (error) {
              return res.status(200).json({ success: false, message: "NotUpdated" });
            }
            else
            {
            
              
              return res.status(200).send({success:true, message: "Updated" });
            }
          
            
          })

          // return res.status(200).send({ success: true, message: "Data Addedd" });
    
        } else {

        

          return res.status(200).send({ success: false, message: "Data Not Addedd" });
  
        }
      });


    }
    else if(obj.typeTransfere == "Payment")
    {


      Treatment.patiantId =obj.patiantId;
      Treatment.doctorAdded =obj.doctorAdded;
      if( obj.centerId!=null)
      Treatment.centerId = obj.centerId;
      Treatment.note =req.body.note;
      Treatment.Creditor =obj.debtor;
      Treatment.debtor =obj.Creditor;
      // Treatment.datePay = req.body.datePay;
      Treatment.cumulative = doc.cumulative+obj.Creditor;
      Treatment.typeTransfere ="Reversed";
      Treatment.discountCenter =obj.discountCenter;
      Treatment.beforeDiscount =obj.beforeDiscount;
      Treatment.CRD = 1;
      Treatment.reversed = true;

      Treatment.save((err, doc) => {
        if (!err) {
          console.log(doc.id)
            treatmentSchema.findOneAndUpdate({ _id:  req.body.idItem }, { reversed:true}, (error, obj) => {
            if (error) {
              return res.status(200).json({ success: false, message: "NotUpdated" });
            }
            else
            {
            
              
              return res.status(200).send({success:true, message: "Updated" });
            }
          
            
          })
          // return res.status(200).send({ success: true, message: "Data Addedd" });
    
        } else {
          console.log(err)
       
          return res.status(200).send({ success: false, message: "Data Not Addedd" });
  
        }
      });

    }




          // return res.status(200).send({success:true, message: doc });
       
       
        }
      }).sort({ createdAt: -1 })
    }
    else
    if(req.body.type == "Center")
    {
      treatmentSchema.findOne({centerId:req.body.centerId}, (err, doc) => {
        if (!doc){
          console.log(err)
          return res.status(200).json({ success: false, message: "Not Found" });
        }
        else {
          console.log("kkkrr")
          console.log(doc.cumulative)


    if(obj.typeTransfere == "Treatment")
    {


      Treatment.patiantId =obj.patiantId;
      Treatment.doctorAdded =obj.doctorAdded;
      if( obj.centerId!=null)
      Treatment.centerId = obj.centerId;
      Treatment.note =req.body.note;
      Treatment.Creditor =obj.debtor;
      Treatment.debtor =obj.Creditor;
      // Treatment.datePay = req.body.datePay;
      Treatment.cumulative = doc.cumulative-obj.debtor;
      Treatment.typeTransfere ="Reversed";
      Treatment.discountCenter =obj.discountCenter;
      Treatment.beforeDiscount =obj.beforeDiscount;
      Treatment.reversed = true;
      Treatment.CRD = -1;

      Treatment.save((err, doc) => {
        if (!err) {
          console.log(doc.id)


  treatmentSchema.findOneAndUpdate({ _id:  req.body.idItem }, { reversed:true}, (error, obj) => {
            if (error) {
              return res.status(200).json({ success: false, message: "NotUpdated" });
            }
            else
            {
            
              
              return res.status(200).send({success:true, message: "Updated" });
            }
          
            
          })

          // return res.status(200).send({ success: true, message: "Data Addedd" });
    
        } else {

        

          return res.status(200).send({ success: false, message: "Data Not Addedd" });
  
        }
      });


    }
    else if(obj.typeTransfere == "Payment")
    {


      Treatment.patiantId =obj.patiantId;
      Treatment.doctorAdded =obj.doctorAdded;
      if( obj.centerId!=null)
      Treatment.centerId = obj.centerId;
      Treatment.note =req.body.note;
      Treatment.Creditor =obj.debtor;
      Treatment.debtor =obj.Creditor;
      // Treatment.datePay = req.body.datePay;
      Treatment.cumulative = doc.cumulative+obj.Creditor;
      Treatment.typeTransfere ="Reversed";
      Treatment.discountCenter =obj.discountCenter;
      Treatment.beforeDiscount =obj.beforeDiscount;
      Treatment.CRD = 1;
      Treatment.reversed = true;

      Treatment.save((err, doc) => {
        if (!err) {
          console.log(doc.id)
            treatmentSchema.findOneAndUpdate({ _id:  req.body.idItem }, { reversed:true}, (error, obj) => {
            if (error) {
              return res.status(200).json({ success: false, message: "NotUpdated" });
            }
            else
            {
            
              
              return res.status(200).send({success:true, message: "Updated" });
            }
          
            
          })
          // return res.status(200).send({ success: true, message: "Data Addedd" });
    
        } else {
          console.log(err)
       
          return res.status(200).send({ success: false, message: "Data Not Addedd" });
  
        }
      });

    }




          // return res.status(200).send({success:true, message: doc });
       
       
        }
      }).sort({ createdAt: -1 })
    }



    
  }

  
})
}