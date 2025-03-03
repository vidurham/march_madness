import React, { useState } from 'react';
import { CircleDot as BasketballIcon, Trophy, ArrowRight, Bell as WhistleIcon } from 'lucide-react';
import OpenAI from 'openai';
import TeamSelector from './components/TeamSelector';
import MatchupDisplay from './components/MatchupDisplay';
import { UNIQUE_NCAA_TEAMS } from './utils/team-utils';
import { Team } from './types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend service
});

function App() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [showMatchup, setShowMatchup] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [matchupImage, setMatchupImage] = useState('');

  const generateDallePrompt = (team1: Team, team2: Team) => {
    return `Create a dynamic basketball matchup promotional image featuring ${team1.mascot} in ${team1.colors} colors versus ${team2.mascot} in ${team2.colors} colors. The image should be dramatic and epic in style, showing both mascots in a basketball arena setting with dramatic lighting. Make it look like a professional sports promotional poster.`;
  };

  const handleCreateMatchup = async () => {
    if (team1 && team2) {
      setShowMatchup(true);
      setGeneratingImage(true);
      try {
        const team1Data = UNIQUE_NCAA_TEAMS.find((t: Team) => t.name === team1);
        const team2Data = UNIQUE_NCAA_TEAMS.find((t: Team) => t.name === team2);
        
        if (!team1Data || !team2Data) throw new Error('Team data not found');

        const prompt = generateDallePrompt(team1Data, team2Data);
        
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        });

        if (response.data[0]?.url) {
          setMatchupImage(response.data[0].url);
        } else {
          throw new Error('No image generated');
        }
      } catch (error) {
        console.error('Failed to generate image:', error);
        // You might want to show an error message to the user here
      } finally {
        setGeneratingImage(false);
      }
    }
  };

  const resetMatchup = () => {
    setShowMatchup(false);
    setTeam1('');
    setTeam2('');
    setMatchupImage('');
  };

  // Helper function to get primary color from team colors
  const getPrimaryColor = (colors: string) => {
    return colors.split(' and ')[0].toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      {/* Sideways Basketball Court Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Court outline */}
        <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-[200px] border-2 border-white/10"></div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-white/10"></div>
        
        {/* Three-point lines */}
        <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-32 h-96 border-2 border-white/10 rounded-[100px]"></div>
        <div className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 w-32 h-96 border-2 border-white/10 rounded-[100px]"></div>
        
        {/* Free throw circles */}
        <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-2 border-white/10"></div>
        <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-2 border-white/10"></div>
        
        {/* Backboards */}
        <div className="absolute top-[5%] left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white/10"></div>
        <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white/10"></div>
      </div>

      {/* Header */}
      <header className="pt-8 pb-6 px-4 text-center relative">
        <div className="flex justify-center items-center gap-3 mb-2">
          <BasketballIcon className="text-orange-500 h-12 w-12 animate-bounce" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
            March Madness Matchup Maker
          </h1>
          <BasketballIcon className="text-orange-500 h-12 w-12 animate-bounce" />
        </div>
        <p className="text-xl text-blue-100">Create epic matchups between your favorite NCAA teams!</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-20 relative z-10">
        {!showMatchup ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              <TeamSelector 
                label="Home Team"
                selectedTeam={team1}
                onSelectTeam={setTeam1}
                teams={UNIQUE_NCAA_TEAMS}
              />
              
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-3 shadow-lg transform hover:scale-110 transition-transform">
                  <ArrowRight className="h-8 w-8" />
                </div>
              </div>
              
              <TeamSelector 
                label="Away Team"
                selectedTeam={team2}
                onSelectTeam={setTeam2}
                teams={UNIQUE_NCAA_TEAMS}
              />
            </div>
            
            <div className="mt-10 text-center">
              <button
                onClick={handleCreateMatchup}
                disabled={!team1 || !team2}
                className={`px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 mx-auto
                  ${!team1 || !team2 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all shadow-lg'}`}
              >
                <WhistleIcon className="h-6 w-6" />
                Generate Matchup
              </button>
              {(!team1 || !team2) && (
                <p className="mt-3 text-yellow-300 flex items-center justify-center gap-2">
                  <BasketballIcon className="h-4 w-4 animate-spin" />
                  Select both teams to create a matchup
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <MatchupDisplay 
              team1={UNIQUE_NCAA_TEAMS.find((t: Team) => t.name === team1)} 
              team2={UNIQUE_NCAA_TEAMS.find((t: Team) => t.name === team2)}
              onReset={resetMatchup}
            />
            
            {/* AI Generated Image Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-center mb-4">AI Generated Matchup Visual</h2>
              {generatingImage ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <BasketballIcon className="h-12 w-12 text-orange-500 animate-spin" />
                  <p className="mt-4 text-blue-200">Generating your matchup image...</p>
                </div>
              ) : matchupImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={matchupImage} 
                    alt={`${team1} vs ${team2} matchup`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-blue-200">
                  <p>Image will appear here once generated</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Basketball decorations */}
        <div className="fixed -bottom-16 -left-16 h-32 w-32 rounded-full border-4 border-dashed border-orange-500/30 animate-spin-slow"></div>
        <div className="fixed -top-20 -right-20 h-40 w-40 rounded-full border-4 border-dashed border-orange-500/30 animate-spin-slow"></div>
        <div className="fixed top-1/4 -left-12 h-24 w-24 rounded-full border-4 border-dashed border-orange-500/20 animate-spin-slow"></div>
        <div className="fixed bottom-1/4 -right-12 h-24 w-24 rounded-full border-4 border-dashed border-orange-500/20 animate-spin-slow"></div>
      </main>

      <footer className="fixed bottom-0 w-full bg-blue-950/90 backdrop-blur-sm py-3 text-center text-blue-200 border-t border-white/10">
        <p className="flex items-center justify-center gap-2">
          <BasketballIcon className="h-4 w-4" />
          March Madness Matchup Maker
          <BasketballIcon className="h-4 w-4" />
        </p>
      </footer>
    </div>
  );
}

export default App;