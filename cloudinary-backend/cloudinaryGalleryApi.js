// Express endpoint to securely fetch Cloudinary images using Admin API credentials

const express = require('express');
const router = express.Router();
const axios = require('axios');

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

// GET /api/cloudinary-gallery
router.get('/cloudinary-gallery', async (req, res) => {
  try {
    // Log to confirm the route is hit
    console.log('GET /api/cloudinary-gallery called');
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&context=true`;
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    // Log the raw response to see what Cloudinary returns
    //console.log('Cloudinary API raw response:', JSON.stringify(response.data, null, 2));
    // Log the first image's context for quick check
    if (response.data.resources && response.data.resources.length > 0) {
      //console.log('First image context:', response.data.resources[0].context);
    }
    const formatted = response.data.resources.map((img) => ({
      url: img.secure_url,
      created_at: img.created_at,
      // Get caption and description from context.custom if available
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
