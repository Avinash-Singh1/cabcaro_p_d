const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Driver = require('./models/Driver');
const Passenger = require('./models/Passenger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes

// Serve frontend - Driver (Default)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve frontend - Passenger
app.get('/passenger', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'passenger.html'));
});

// Driver Registration API
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, mobileNumber, licenseNumber, city } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ mobileNumber }, { licenseNumber }] 
    });

    if (existingDriver) {
      return res.status(400).json({ 
        success: false, 
        message: 'Driver with this mobile or license already registered.' 
      });
    }

    const newDriver = new Driver({
      fullName,
      mobileNumber,
      licenseNumber,
      city: city || 'Delhi NCR'
    });

    await newDriver.save();

    const count = await Driver.countDocuments();

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Welcome to cabcaro.com.',
      isEarlyBird: count <= 500
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// Passenger Registration API
app.post('/api/register-passenger', async (req, res) => {
  try {
    const { fullName, mobileNumber, city } = req.body;

    // Check if passenger already exists
    const existingPassenger = await Passenger.findOne({ mobileNumber });

    if (existingPassenger) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passenger with this mobile number already registered.' 
      });
    }

    const newPassenger = new Passenger({
      fullName,
      mobileNumber,
      city: city || 'Delhi NCR'
    });

    await newPassenger.save();

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! We will notify you when services start in your area.'
    });

  } catch (error) {
    console.error('Passenger Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
