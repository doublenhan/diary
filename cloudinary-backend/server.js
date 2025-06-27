require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinaryGalleryApi = require('./cloudinaryGalleryApi');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/api', cloudinaryGalleryApi);

app.listen(PORT, () => {
  console.log(`Cloudinary backend server running on port ${PORT}`);
});
