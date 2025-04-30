const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const generateToken = require('../config/jwtConfig');
const connectDB = require('../config/dbConfig');
const User = require('../models/userModel');
const path = require('path');

// Load environment variables from the project root .env
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });
  
  // Mute output for password input, but allow prompt text
  rl._writeToOutput = function (stringToWrite) {
    if (rl.stdoutMuted && !stringToWrite.includes('\u001b')) {
      // For each character of user input, mask with '*'
      rl.output.write('*'.repeat(stringToWrite.length));
    } else {
      rl.output.write(stringToWrite);
    }
  };
  
// Utility to prompt questions, optionally hide input
const question = (query, hide = false) => {
  return new Promise((resolve) => {
    // First, ensure prompt text is shown
    rl.stdoutMuted = false;
    rl.question(query, (answer) => {
      rl.output.write('\n');
      resolve(answer);
    });
    // Then if hiding, enable mask for user typing
    if (hide) rl.stdoutMuted = true;
  });
};

async function createAdmin() {
  try {
    // Prompt for admin details
    const adminEmail = await question('Enter admin email: ');
    const adminPassword = await question('Enter admin password: ', true);
    const adminPassword2 = await question('Confirm admin password: ', true);

    if (adminPassword !== adminPassword2) {
      console.error('Error: Passwords do not match.');
      process.exit(1);
    }

    // Connect to db
    connectDB();

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({ 
        name: 'Admin', 
        email: adminEmail, 
        password: hashedPassword, 
        role: 'admin' 
    });

    await admin.save();
    const token = generateToken(admin._id)
    console.log("Given below is you token for admin :\n", token)
    console.log('Admin user created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdmin();
