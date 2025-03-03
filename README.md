# March Madness Matchup Maker

An AI-powered web application that generates epic basketball matchup images between NCAA teams using DALL-E 3.

## Features

- Search and select from all NCAA basketball teams
- Filter teams by conference
- Multiple matchup styles:
  - Classic Basketball Stadium
  - Vintage Program
  - Ancient Colosseum Mascot Battle
  - Mythical Mascot Battle
  - Celestial Arena
- AI-generated images using DALL-E 3

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and add your OpenAI API key:
   ```bash
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your OpenAI API key as an environment variable named `VITE_OPENAI_API_KEY`
4. Deploy!

## Security Note

This app uses the OpenAI API key in the frontend for demonstration purposes. For production use, you should:
1. Create a backend API to handle OpenAI requests
2. Never expose your API key in the frontend
3. Implement rate limiting and user authentication 