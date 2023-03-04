const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv');
const app = express();
const pinRoutes = require('./routes/pins');
const userRoutes = require('./routes/users');

env.config();

app.use(express.json());

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => console.log(err));

app.use('/api/pins', pinRoutes);
app.use('/api/users', userRoutes);

app.listen(8800, () => {
  console.log('Backend is running!');
});
