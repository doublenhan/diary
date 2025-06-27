import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;
    console.log({ CLOUD_NAME, API_KEY, API_SECRET });

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

    res.status(200).json(formatted);
  } catch (err) {
  console.error('Cloudinary API error:', {
    message: err.message,
    data: err?.response?.data,
    status: err?.response?.status,
    stack: err.stack,
  });
  res.status(500).json({ error: 'Failed to fetch images from Cloudinary.' });
}
}
