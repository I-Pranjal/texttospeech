const express = require('express');
const { createAudioFileFromText } = require('./texttospeech'); // Assuming this file is named app.js
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
console.log('API Key available:', !!process.env.ELEVENLABS_API_KEY);

app.post('/generate-audio', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const audioBuffer = await createAudioFileFromText(text);
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': 'attachment; filename="output.mp3"',
        });
        res.send(audioBuffer);
    } catch (error) {
        console.error('Error generating audio:', error);
        res.status(500).json({ error: 'Failed to generate audio' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});