const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DATABASE_URI);

    console.log(`[STATUS] Connected to Database: ${conn.connection.name}`);
  } catch (err) {
    console.error(err);
    console.log("Unable to Connect to Database")
    // process.exit(1);
}
};

module.exports = connectDB;
