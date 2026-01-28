import { config } from 'dotenv';
config();

// Set the API key provided by the user
if (process.env.NODE_ENV === 'development' && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = 'AIzaSyCHvngI1y3XzZ0Ysmbo3mOoffSHkOblaKE';
}
