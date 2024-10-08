import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Use CORS to allow requests from your extension
app.use(cors({
    origin: '*' // Allow all origins (you can specify the extension's origin instead for better security)
}));

// API endpoint to handle YouTube searches
app.get('/api/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${query}&type=video&part=snippet&maxResults=50`;

    try {
        const response = await fetch(youtubeApiUrl);
        const data = await response.json();

        console.log('YouTube API Response:', data);

        res.json(data);
    } catch (error) {
        console.error('Error fetching data from YouTube API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
