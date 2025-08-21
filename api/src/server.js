require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./index');

const PORT = process.env.PORT || 7777;
const MONGO_URL = process.env.MONGO_URL ;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });