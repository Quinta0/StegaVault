import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const formData = new FormData();
  if (req.body.image) {
    formData.append('image', req.body.image);
  }

  try {
    const response = await axios.post('http://localhost:5000/retrieve_password', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve password' });
  }
}
