
const mongoose = require ('mongoose');

// Use environment variable for MongoDB connection URL, fallback to localhost for development
const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/EasyDoctorDB";

mongoose.connect(mongoUrl, { 
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoReconnect: true 
}, (err) => {
  if(!err) { 
    console.log('MongoDB connected successfully to:', mongoUrl.replace(/\/\/[^:]+:[^@]+@/, '//*:*@')); // Hide credentials in logs
  } else { 
    console.error('MongoDB connection error:', JSON.stringify(err, undefined, 2));
    // Don't exit process, let the app handle the error gracefully
  }
});

// Handle mongoose connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection closed through app termination');
    process.exit(0);
  });
});

require('./user.model');
require('./roll.model');
require('./patiant.model');
require('./center.model');
require('./treatmentDivision.model');
require('./treatment.model');
require('./patinetimages.model');



