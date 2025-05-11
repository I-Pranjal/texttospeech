const dotenv = require('dotenv');
const { ElevenLabsClient } = require('elevenlabs');
const { v4: uuid } = require('uuid');

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  throw new Error('Missing ELEVENLABS_API_KEY in environment variables');
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});
console.log('ElevenLabs client initialized', client);

// Helper: Convert Web ReadableStream to Buffer
async function webReadableStreamToBuffer(webStream) {
  const reader = webStream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks);
}

async function createAudioFileFromText(text) {
  try {
    const audioStream = await client.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
      model_id: 'eleven_multilingual_v2',
      text,
      output_format: 'mp3_44100_128',
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
        use_speaker_boost: true,
        speed: 1.0,
      },
    });

    const audioBuffer = await webReadableStreamToBuffer(audioStream);
    return audioBuffer;
  } catch (error) {
    console.error('Error generating audio:', error);
    throw error;
  }
}

module.exports = { createAudioFileFromText };
