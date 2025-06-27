// Express endpoint to securely fetch Cloudinary images using Admin API credentials

const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // ✅ Load biến từ file .env

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

// GET /api/cloudinary-gallery
router.get('/cloudinary-gallery', async (req, res) => {
  try {
    console.log('GET /api/cloudinary-gallery called');
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&context=true`;
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const formatted = response.data.resources.map((img) => ({
      url: img.secure_url,
      created_at: img.created_at,
      caption: img.context?.custom?.caption || '',
      description: img.context?.custom?.description || img.context?.custom?.alt || '',
      dateSelected: img.context?.custom?.dateselected || '',
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Cloudinary API error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to fetch images from Cloudinary.' });
  }
});

module.exports = router;
