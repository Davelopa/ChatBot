// Import required modules
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

// Load environment variables from .env file
dotenv.config();

// Create OpenAI configuration object
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create OpenAI API client
const openai = new OpenAIApi(configuration);

// Create Express app
const app = express();
// Enable CORS and JSON parsing for the app
app.use(cors());
app.use(express.json());

// Add route for GET request to '/'
app.get('/', async (req, res) => {
    // Send response with status code 200 and message
    res.status(200).send({
        message: 'Hello from AI',
    })
});

// Add route for POST request to '/'
app.post('/', async (req, res) => {
    try {
        // Get user's message from request body
        const prompt = req.body.prompt;

        // Use OpenAI API to generate response to user's message
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.7,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        // Send response with status code 200 and generated message from OpenAI API
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        // If an error occurs, send a response with status code 500 and the error message
        res.status(500).send({ error })
    }
})

// Start the server on port 5000
app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));