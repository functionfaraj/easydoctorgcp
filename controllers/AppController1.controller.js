const mongoose = require("mongoose");

const centerSchema = mongoose.model("centerSchema");
const doctorSchema = mongoose.model("doctorSchema");
const departmentSchema = mongoose.model("departmentSchema");
const cardmentSchema = mongoose.model("cardmentSchema");
const User = mongoose.model("User");
const centerWorkingDaySchema = mongoose.model("centerWorkingDaySchema");
const doctorWorkingDaySchema = mongoose.model("doctorWorkingDaySchema");
const requestSchema = mongoose.model("requestSchema");
const staffroleSchema = mongoose.model("staffroleSchema");
const staffPersonSchema = mongoose.model("staffPersonSchema");
const complaintSchema = mongoose.model("complaintSchema");
const newsSchema = mongoose.model("newsSchema");
const notificationsSchema = mongoose.model("notificationsSchema");
const patiantSchema = mongoose.model("patiantSchema");


var admin = require("firebase-admin");

var serviceAccount = require("../alHayat-fcm.json");
const firbaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


module.exports.AddCenter = (req, res, next) => {
  var center = new centerSchema();
  center.nameAr = req.body.nameAr;
  center.nameEn = req.body.nameEn;
  center.Address = req.body.Address;
  center.TelNumber = req.body.TelNumber;
  center.Email = req.body.Email;
  center.Tel2Number = req.body.Tel2Number;
  center.whatsappNumber = req.body.whatsappNumber;
center.FaxNumber = req.body.FaxNumber;





  center.save((err, doc) => {
    if (!err) {
      console.log(doc.id)

     var newdata = req.body.dayWorking;
     newdata["centerId"] = doc.id;

     console.log(newdata);
    
     centerWorkingDaySchema.create( newdata,(error, obj) => {
      if (error) {
        // res.status(500).send({ success: false, message: error });
        return;
      }

      console.log(obj.id)

      centerSchema.findOneAndUpdate({ _id: doc.id }, {centerWorkingDays:obj.id}, { new: false }, (error, obj) => {
        if (error) {
          res.status(500).send({ success: false, message: err });
          return;
        }
      });

      // return res.status(200).send({ success: true, message: "Data Addedd" });

    });

      // res.send(doc);
    } else {
      if (err.code == 11000) res.status(422).send(["Error"]);
      else return next(err);
    }
  });
};



module.exports.GetCenters = (req, res, next) => {

  centerSchema.find({}, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "Not Found" });
    else {
   
      return res.status(200).send({ message: doc });
    }
  })
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




module.exports.AddDoctor = (req, res, next) => {
  var doctor = new doctorSchema();
  doctor.nameAr = req.body.nameAr;
  doctor.nameEn = req.body.nameEn;
  doctor.phoneNumber = req.body.phoneNumber;
  doctor.Email = req.body.email;
  doctor.password = req.body.password;
  doctor.pathImage = req.body.pathImage;
  doctor.departments = req.body.arrayDepartment;

  console.log(req.body)

  

  doctor.save((err, doc) => {
    if (!err) {
      console.log(doc.id)



for(var j = 0;j<req.body.dayWorking.length;j++)
{
  console.log("Heeroo");
  console.log(req.body.centers[j][0]['item_id']);
  var newdata = req.body.dayWorking[j];
  newdata["doctorId"] = doc.id;
  newdata["centerId"] =req.body.centers[j][0]['item_id'];
  console.log(newdata);
    
  doctorWorkingDaySchema.create( newdata,(error, obj) => {
   if (error) {
     // res.status(500).send({ success: false, message: error });
     return;
   }

   console.log(obj.id)

   doctorSchema.findOneAndUpdate({ _id: doc.id }, {doctorWorkingDays:obj.id}, { new: false }, (error, obj) => {
     if (error) {
       res.status(500).send({ success: false, message: err });
       return;
     }
   });



 });

 if(j+1 == req.body.dayWorking.length)
 {
  return res.status(200).send({ success: true, message: "Data Addedd" });
 }
}

      // res.send(doc);
    } else {
      if (err.code == 11000) res.status(422).send(["Error"]);
      else return next(err);
    }
  });



  // doctor.save((err, doc) => {
  //   if (!err) {
  //     res.send(doc);
  //   } else {
  //     if (err.code == 11000) res.status(422).send(["Error"]);
  //     else return next(err);
  //   }
  // });
};



module.exports.GetDoctors = (req, res, next) => {

  doctorSchema.find({}, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "Not Found" });
    else {
   
      return res.status(200).send({ message: doc });
    }
  }).populate("departments");
};


module.exports.GetDoctorByCenter = (req, res, next) => {

  doctorWorkingDaySchema.find({centerId:req.params.id}, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "Not Found" });
    else {
   
      return res.status(200).send({ message: doc });
    }
  }). populate( {
    path: 'doctorId',
    model: 'doctorSchema',
  });
};

module.exports.GetAllDoctorInCenters = (req, res, next) => {

  doctorWorkingDaySchema.find({doctorId:{$ne:null}}, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "Not Found" });
    else {
   
      return res.status(200).send({ message: doc });
    }
  }). populate( {
    path: 'doctorId',
    model: 'doctorSchema',
  },).populate(
    {
      path: 'centerId',
      model: 'centerSchema',
      
    }
  );
};

module.exports.GetDoctorWorkingCenter = (req, res, next) => {

  doctorWorkingDaySchema.find({doctorId:req.params.id}, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "Not Found" });
    else {
   
      return res.status(200).send({ message: doc });
    }
  }). populate( {
    path: 'centerId',
    model: 'centerSchema',
  });
};



module.exports.DeleteDoctor = (req, res, next) => {


  doctorSchema.deleteOne({ _id: req.body.idItem }, (err, roll) => {
      if (!roll){
        return res.status(200).json({ status: false, message: "NotUpdated" });
      }
      else {
        return res.status(200).send({ message: "Updated" });
      }
    });
  };


  module.exports.AddDepartment = (req, res, next) => {
    var department = new departmentSchema();
    department.nameAr = req.body.nameAr;
    department.nameEn = req.body.nameEn;
    department.descEn = req.body.descEn;
    department.descAr = req.body.descAr;
    department.pathImage = req.body.pathImage;
    

  
  
    department.save((err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        if (err.code == 11000) res.status(422).send(["Error"]);
        else return next(err);
      }
    });
  };
  
  
  
  module.exports.GetDepartments = (req, res, next) => {
  
    departmentSchema.find({}, (err, doc) => {
      if (!doc)
        return res.status(200).json({ status: false, message: "Not Found" });
      else {
     
        return res.status(200).send({ message: doc });
      }
    });
  };
  
  module.exports.Deletedepartment = (req, res, next) => {


    departmentSchema.deleteOne({ _id: req.body.idItem }, (err, roll) => {
        if (!roll){
          return res.status(200).json({ status: false, message: "NotUpdated" });
        }
        else {
          return res.status(200).send({ message: "Updated" });
        }
      });
    };



    module.exports.AddCard = (req, res, next) => {
      var Card = new cardmentSchema();
      Card.URL = req.body.URL;
      Card.pathImage = req.body.pathImage;
    
      Card.save((err, doc) => {
        if (!err) {
          res.send(doc);
        } else {
          if (err.code == 11000) res.status(422).send(["Error"]);
          else return next(err);
        }
      });
    };
    
    
    
    module.exports.GetCards = (req, res, next) => {
    
      cardmentSchema.find({}, (err, doc) => {
        if (!doc)
          return res.status(200).json({ status: false, message: "Not Found" });
        else {
       
          return res.status(200).send({ message: doc });
        }
      });
    };
    
    module.exports.DeleteCard = (req, res, next) => {
  
  
      cardmentSchema.deleteOne({ _id: req.body.idItem }, (err, roll) => {
          if (!roll){
            return res.status(200).json({ status: false, message: "NotUpdated" });
          }
          else {
            return res.status(200).send({ message: "Updated" });
          }
        });
      };


      

      module.exports.SendNewRequest = (req, res, next) => {
        var Request = new requestSchema();
        Request.patientName = req.body.patientName;
        Request.phoneNumber = req.body.phoneNumber;
        Request.departmentId = req.body.departmentId;
        Request.DoctorId = req.body.DoctorId;
        Request.DateString = req.body.DateString;
        Request.timeString = req.body.timeString;
        Request.note = req.body.note;
        Request.idNumber = req.body.idNumber;
        Request.userId = req.body.userId;
      
        console.log(req.body)
        if(req.body.bookType === true)
        Request.forFamily = true;
      else
      Request.forFamily = false;

      console.log(Request)
      
        Request.save((err, doc) => {
          if (!err) {
            res.send({success:true,message: doc});
          } else {
            res.send({success:false,message: err});
            // if (err.code == 11000) res.status(422).send(["Error"]);
            // else return next(err);
          }
        });
      };
      

      module.exports.GetRequests = (req, res, next) => {

        requestSchema.find({    DateString : {$gte: new Date(),},}, (err, doc) => {
          if (!doc)
            return res.status(200).json({ status: false, message: "Not Found" });
          else {
         
            return res.status(200).send({ message: doc });
          }
        }).populate("departmentId").populate("DoctorId");
      };

      module.exports.GetAllRequestsById = (req, res, next) => {

        requestSchema.find({   DateString : {$lt: new Date(),}, userId:req.params.id}, (err, doc) => {
          if (!doc)
            return res.status(200).json({ status: false, message: "Not Found" });
          else {
         
            return res.status(200).send({ message: doc });
          }
        }).populate("departmentId").populate("DoctorId");
      };


      module.exports.GetRequestsByUserId = (req, res, next) => {

        requestSchema.find({    DateString : {$gte: new Date(),}, userId:req.params.id}, (err, doc) => {
          if (!doc)
            return res.status(200).json({ status: false, message: "Not Found" });
          else {
         
            return res.status(200).send({ message: doc });
          }
        }).populate("departmentId").populate("DoctorId");
      };

      module.exports.UpdateRequest = (req, res, next) => {
        const firbaseAdmin = admin.app();
        var StatusDetails = req.body.Status ;
        requestSchema.findOneAndUpdate({ _id:  req.body.idItem }, {Status:StatusDetails}, (error, obj) => {
          if (error) {

          

            return res.status(200).json({ status: false, message: "NotUpdated" });

          }
          else
          {
            console.log("HIII");
            // if(obj['userId']['fcmToken']!=null)
            // console.log(obj['userId']['fcmToken']);

            const TokenFCM =String( obj['userId']['fcmToken']);
          

            if (TokenFCM && typeof TokenFCM === 'string' && TokenFCM.trim() !== '') {
              console.log(TokenFCM);

              var message;
              
              
                    if( req.body.Status == 1){

                      message = {
                    notification: {
                      title: "لقد تمت الموافقه على الحجز",
                      body: "يرجى عدم التاخر عن الموعد ونتمنى لك الشفاء التام"
                    }
                  };
                }
                else{
                  message = {
                    notification: {
                      title: "نعتذر عن الغاء الحجز الخاص بك",
                      body: "يرجى اختيار موعد اخر ونتمنى لك الشفاء التام"
                    }
                  };
                }


              const registrationTokens = [TokenFCM];

              admin.messaging().sendToDevice(registrationTokens, message)
                .then((response) => {
                  console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                  console.error('Error sending message:', error);
                });


  //  firbaseAdmin.messaging().send({
  //             token:TokenFCM,
  //             notification:{
  //                 title:"test",
  //                 body:reminder[i].Description
  //             }
  //         });

              // var message_notification;
              // firbaseAdmin.messaging().subscribeToTopic(["cdAGKZADh0MLihPr61MHXh:APA91bHwRKZwC8iOEkBjZ5TTECMXHkyyqe0Oe99SM94F-cXXVgu-lNXdbJrnLqfMf-CMzkQ0LzkCE_zkBfTR29kpYSVXHN-XpGuLijM9XJk5A7-zM6T43yJ6jz_M57Si_ATGd2XxrG85"], 'myTopic')
              //   .then((response) => {
              //     console.log('Successfully subscribed to topic:', response);
                
              //     if( req.body.Status == 1){

              //      message_notification = {
              //       notification: {
              //         title: "لقد تمت الموافقه على الحجز",
              //         body: "يرجى عدم التاخر عن الموعد ونتمنى لك الشفاء التام"
              //       }
              //     };
              //   }
              //   else{
              //     message_notification = {
              //       notification: {
              //         title: "نعتذر عن الغاء الحجز الخاص بك",
              //         body: "يرجى اختيار موعد اخر ونتمنى لك الشفاء التام"
              //       }
              //     };
              //   }
            
              //     firbaseAdmin.messaging().sendToTopic('myTopic', message_notification)
              //       .then(response2 => {
              //         console.log(response2);
              //       })
              //       .catch(error => {
              //         console.error('Error sending notification to topic:', error);
              //       });
              //   })
              //   .catch((error) => {
              //     console.error('Error subscribing to topic:', error);
              //   });
            } else {
              console.error('Invalid FCM token:', TokenFCM);
            }

         

            return res.status(200).send({ message: "Updated" });
          }
        
          
        }).populate("userId");
      };


      module.exports.AddStaffRole = (req, res, next) => {
        var staffrole = new staffroleSchema();
        staffrole.nameAr = req.body.nameAr;
        staffrole.nameEn = req.body.nameEn;

      
        staffrole.save((err, doc) => {
          if (!err) {
            res.send(doc);
          } else {
            if (err.code == 11000) res.status(422).send(["Error"]);
            else return next(err);
          }
        });
      };
      
      
      
      module.exports.GetStaffRole = (req, res, next) => {
      
        staffroleSchema.find({}, (err, doc) => {
          if (!doc)
            return res.status(200).json({ status: false, message: "Not Found" });
          else {
         
            return res.status(200).send({ message: doc });
          }
        });
      };
      
      module.exports.DeleteStaffRole = (req, res, next) => {
    
    
        staffroleSchema.deleteOne({ _id: req.body.idItem }, (err, roll) => {
            if (!roll){
              return res.status(200).json({ status: false, message: "NotUpdated" });
            }
            else {
              return res.status(200).send({ message: "Updated" });
            }
          });
        };



        module.exports.AddStaffPerson = (req, res, next) => {
          var staffPerson = new staffPersonSchema();
          staffPerson.nameAr = req.body.nameAr;
          staffPerson.nameEn = req.body.nameEn;
          staffPerson.pathImage = req.body.pathImage;
          staffPerson.staffrole = req.body.staffrole;
  
        
          staffPerson.save((err, doc) => {
            if (!err) {
              res.send(doc);
            } else {
              if (err.code == 11000) res.status(422).send(["Error"]);
              else return next(err);
            }
          });
        };
        
        
        
        module.exports.GetStaffPerson = (req, res, next) => {
        
          staffPersonSchema.find({}, (err, doc) => {
            if (!doc)
              return res.status(200).json({ status: false, message: "Not Found" });
            else {
           
              return res.status(200).send({ message: doc });
            }
          }).populate("staffrole");
        };
        
        module.exports.DeleteStaffPerson = (req, res, next) => {
      
      
          staffPersonSchema.deleteOne({ _id: req.body.idItem }, (err, roll) => {
              if (!roll){
                return res.status(200).json({ status: false, message: "NotUpdated" });
              }
              else {
                return res.status(200).send({ message: "Updated" });
              }
            });
          };
  


          module.exports.AddComplaint = (req, res, next) => {

            console.log( req.body)
            var complaint = new complaintSchema();
            complaint.patientName = req.body.patientName;
            complaint.phoneNumber = req.body.phoneNumber;
            complaint.complaintDetails = req.body.complaintDetails;
            complaint.DateString = new Date();

            complaint.save((err, doc) => {
              if (!err) {
                res.send(doc);
              } else {
                if (err.code == 11000) res.status(422).send(["Error"]);
                else return next(err);
              }
            });
          };
          

          module.exports.GetComplaint = (req, res, next) => {

            complaintSchema.find({    isSeen : false}, (err, doc) => {
              if (!doc)
                return res.status(200).json({ status: false, message: "Not Found" });
              else {
             
                return res.status(200).send({ message: doc });
              }
            })
          };


          module.exports.SeenComplaint = (req, res, next) => {

            complaintSchema.findOneAndUpdate({ _id:  req.body.idItem }, {isSeen:true}, { new: false }, (error, obj) => {
              if (error) {
                return res.status(200).json({ status: false, message: "NotUpdated" });
                return;
              }
              else
              {
                return res.status(200).send({ message: "Updated" });
              }
            
              
            });
          };

     

          module.exports.AddNews = (req, res, next) => {
            var News = new newsSchema();
            News.title = req.body.title;
            News.desc = req.body.Desc;
            News.pathImage = req.body.pathImage;
            News.createdAt = new Date();
            var AddedDate = new Date();
            var today = new Date();
            console.log(req.body.NumberDays);
            if(req.body.NumberDays !=null)
            {
            
              AddedDate.setDate(today.getDate()+ parseInt(req.body.NumberDays));
            }
            else{
              AddedDate.setDate(today.getDate()+30);
            }
         
            News.expiryAt = AddedDate;

          
    
            News.save((err, doc) => {
              if (!err) {
                res.send(doc);
              } else {
                if (err.code == 11000) res.status(422).send(["Error"]);
                else return next(err);
              }
            });
         
         
          };
          
          
          
          module.exports.GetNews = (req, res, next) => {
          
            newsSchema.find({isHide:false, expiryAt : {$gte: new Date(),},}, (err, doc) => {
              if (!doc)
                return res.status(200).json({ status: false, message: "Not Found" });
              else {
             
                return res.status(200).send({ message: doc });
              }
            }).populate("staffrole");
          };


          module.exports.UpdateNews = (req, res, next) => {
           
            var StatusDetails = req.body.Status ;
            newsSchema.findOneAndUpdate({ _id:  req.body.idItem }, {isHide:StatusDetails}, (error, obj) => {
              if (error) {
    
              
    
                return res.status(200).json({ status: false, message: "NotUpdated" });
    
              }
              else
              {
              
                
                return res.status(200).send({ message: "Updated" });
              }
            
              
            }).populate("userId");
          };

          module.exports.sendNotification = (req, res, next) => {

            console.log( req.body)
            var Notification = new notificationsSchema();
            Notification.title = req.body.title;
            Notification.message = req.body.Desc;
            Notification.DateString = new Date();
            if(req.body.centerId!=null)
            {
             

              User.find({centerId:req.body.centerId}, (err, doc) => {
    if (!doc)
      return res.status(200).json({ status: false, message: "Not Found" });
    else {

      let tokens = [];
      let userId = [];
      console.log(doc)
      for(var i = 0;i<doc.length;i++)
      {
       
        tokens.push( String( doc[i].fcmToken));
        userId.push(String( doc[i]._id))
      }
      console.log(tokens)
      
   
      Notification.userRecived = userId;
      Notification.save((err, doc) => {
        if (!err) {

          if(tokens.length>0)
          {

            console.log("Heerrooo");
             topic = '/topics/';
    
            topic = topic+new Date().toString().replaceAll(" ","");
            topic= topic.toString().replaceAll(":","");
            topic= topic.toString().replaceAll("+","");
            topic= topic.toString().replaceAll("(","");
            topic= topic.toString().replaceAll(")","");
            console.log(topic);
            // Create the topic
            const messaging = firbaseAdmin.messaging();
            messaging.subscribeToTopic(tokens,topic)
              .then(() => {
                console.log('Subscribed to topic successfully');
              })
              .catch((error) => {
                console.error('Error subscribing to topic:', error);
              });
    
    
    
              const message = {
                notification: {
                  title: req.body.title,
                  body:  req.body.Desc,
                },
                topic:topic,
              };
              
              firbaseAdmin.messaging().send(message)
                .then((response) => {
                  console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                  console.error('Error sending message:', error);
                });
          }
         return res.send(doc);
        } else {
          if (err.code == 11000) res.status(422).send(["Error"]);
          else return next(err);
        }
      });



   

   

      // return res.status(200).send({ message: doc });
    }
  });
            }
            else
            {
              Notification.save((err, doc) => {
                if (!err) {

                  const topic = '/topics/allDevices';

                  // Create the topic
                  const messaging = firbaseAdmin.messaging();
                  messaging.subscribeToTopic(topic)
                    .then(() => {
                      console.log('Subscribed to topic successfully');
                    })
                    .catch((error) => {
                      console.error('Error subscribing to topic:', error);
                    });



                    const message = {
                      notification: {
                        title: 'Your Notification Title',
                        body: 'Your Notification Body',
                      },
                      topic: 'allDevices',
                    };
                    
                    firbaseAdmin.messaging().send(message)
                      .then((response) => {
                        console.log('Successfully sent message:', response);
                      })
                      .catch((error) => {
                        console.error('Error sending message:', error);
                      });
                  res.send(doc);
                } else {
                  if (err.code == 11000) res.status(422).send(["Error"]);
                  else return next(err);
                }
              });
            }
           
        
          };

          module.exports.getNotificationByUser = (req, res, next) => {

            console.log(req.params.id )
            notificationsSchema.find({userRecived:  { $in: [req.params.id] }}, (err, doc) => {
              console.log(doc)
              if (!doc)
                return res.status(200).json({ status: false, message: "Not Found" });
              else {
             
                console.log(doc)
                return res.status(200).send({ message: doc });
              }
            });
          };