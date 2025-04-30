require("dotenv").config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@communitylearninghub.4szbtom.mongodb.net/?retryWrites=true&w=majority&appName=communityLearningHub`;
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
