import { db } from './firebase';

const express = require('express');
const postRoute = express.Router();

// Helper function to post to a Facebook Page
async function postToFacebookPage(userToken: string, message: string) {
  // Get the user's managed pages
  const response = await fetch(`https://graph.facebook.com/me/accounts?access_token=${userToken}`);
  const data = await response.json();
  const page = data.data[0]; // Here we pick the first page
  const pageAccessToken = page.access_token;
  const pageId = page.id;

  // Post a message to the page
  const postResponse = await fetch(`https://graph.facebook.com/${pageId}/feed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      access_token: pageAccessToken
    }),
  });

  return postResponse.json();
}

// Route to post a message on a Facebook Page
import { Request, Response } from 'express';

postRoute.post('/facebook/page', async (req: Request, res: Response) => {
  const userId = req.body?.user?.id;
  const sessionToken = req.body?.user?.accessToken;
  const message = req.body?.message || 'Hello from Node backend with Firebase!';

  // Option 2: Retrieve token from Firestore if not in session
  let accessToken = sessionToken;
  if (!accessToken && userId) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        accessToken = userDoc?.data()?.['accessToken'] ?? '';
      }
    } catch (err) {
      console.error('Error fetching token from Firestore:', err);
    }
  }

  if (!accessToken) return res.status(401).send('Not authenticated.');

  try {
    const response = await postToFacebookPage(accessToken, message);
    return res.json(response);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
});

export default postRoute;
