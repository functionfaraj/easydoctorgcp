require ('./config/config');
require('./config/passportConfig');

// Add error handling for database connection
try {
  require ('./models/db');
} catch (error) {
  console.error('Database connection error during startup:', error);
  // Continue startup even if DB connection fails initially
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const rtsIndex = require('./routes/index.router');
const nodemailer = require("nodemailer");
// const details = requier("./details.json");

var app = express();
var path=require('path');
var fs = require('fs');
const bycrypt = require('bcryptjs');

console.log('Starting application...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

app.use (bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use('/api',rtsIndex);
app.use(cors({ origin: "*" }));

// Health check endpoint for Cloud Run
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 8080,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});


// bycrypt.genSalt(10 , (err, salt)=> {

//   bycrypt.hash("123456", salt,  (err, hash)=> {


//     console.log(hash)
//     // this.password = hash;
//     // this.saltSecret = salt;
 
//   });
// });

// Use PORT environment variable or default to 8080 for Cloud Run
const PORT = process.env.PORT || 8080;
// app.listen("3000" , () => console.log('server start at posrt : 3000'));
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running successfully on port ${PORT}`);
  console.log(`🌍 Server accessible at http://0.0.0.0:${PORT}`);
  console.log(`🏥 Health check available at http://0.0.0.0:${PORT}/api/health`);
  console.log(`📅 Server started at: ${new Date().toISOString()}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});


app.get('/uploads/:directory/:subdirectory/:filename', function (req, res) {
  const directory = req.params.directory;
  const subdirectory = req.params.subdirectory;
  const filename = req.params.filename;

  const filePath = path.join(__dirname, 'uploads', directory, subdirectory, filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).send('File not found');
    }

    // Serve the file
    res.sendFile(filePath);
  });
});

app.get('/uploads/:directory/:subdirectory/:filename', function (req, res) {
  const directory = req.params.directory;
  const subdirectory = req.params.subdirectory;
  const filename = req.params.filename;

  const filePath = path.join(__dirname, 'uploads', directory, subdirectory, filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).send('File not found');
    }

    // Serve the file
    res.sendFile(filePath);
  });
});


app.get('/uploads/:id', function (req, res) {
  fs.lstat(path.join('./uploads/', req.params.id), (err, stats) => {
    if(err)
        return console.log(err); //Handle error
        console.log(req.params.id)


       fs.createReadStream(path.join('./uploads/', req.params.id)).pipe(res)
});

})
app.get('/uploads/UniversityLogo/:id', function (req, res) {
  fs.lstat(path.join('./uploads/UniversityLogo/', req.params.id), (err, stats) => {
    if(err)
        return console.log(err); //Handle error

       fs.createReadStream(path.join('./uploads/UniversityLogo', req.params.id)).pipe(res)
});

})

app.post("/sendmail", (req, res) => {

  let user = req.body;
  sendMail(user, (err, info) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send({ error: "Failed to send email" });
    } else {
      console.log("Email has been sent");
      res.send(info);
    }
  });
});

const sendMail = (user, callback) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "meheministry@gmail.com",
      pass: "Mehe@123"
    }
  });


  const mailOptions = {
    from: '"test"',
    to: user.UserEmail,
    subject: "<Message subject>",
    html: "<h1>Youre code verification account is : </h1> " + user.Key
  };
  transporter.sendMail(mailOptions, callback);

}



app.use(function(req, res, next) {
  //set headers to allow cross origin request.
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
  });

