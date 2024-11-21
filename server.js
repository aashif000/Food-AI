require('dotenv').config();  // Make sure to load environment variables
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Correct import
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());  // Enabling CORS for all routes

// Initialize Google Generative AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// POST endpoint for generating a response based on the provided prompt
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send('Prompt is required');
    }

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);

    // Return the generated content as a JSON response
    const generatedText = await result.response.text();

    res.json({ text: generatedText });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
