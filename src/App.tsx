import React, { useState } from 'react';
import { CircleDot as BasketballIcon, Trophy, ArrowRight, Bell as WhistleIcon } from 'lucide-react';
import OpenAI from 'openai';
import TeamSelector from './components/TeamSelector';
import MatchupDisplay from './components/MatchupDisplay';
import { UNIQUE_NCAA_TEAMS } from './utils/team-utils';
import { Team } from './types';

// Define prompt types
const PROMPT_TYPES = {
  CLASSIC_STADIUM: {
    label: "Classic Basketball Stadium",
    generate: (team1: Team, team2: Team) => 
      `Create a dynamic basketball matchup promotional image featuring the ${team1.name} in ${team1.colors} versus the ${team2.name} in ${team2.colors} in a modern basketball arena. Show the teams facing off with dramatic lighting and a packed stadium in the background. Make it look like a professional sports promotional poster.`
  },
  VINTAGE_PROGRAM: {
    label: "Vintage Basketball Program",
    generate: (team1: Team, team2: Team) => 
      `Create a vintage basketball program cover featuring ${team1.name} in ${team1.colors} vs ${team2.name} in ${team2.colors} Use retro typography, aged paper texture, and classic illustration style reminiscent of old sports programs. Include art deco elements and weathered effects.`
  },
  ANCIENT_ARENA: {
    label: "Ancient Colosseum Mascot Battle",
    generate: (team1: Team, team2: Team) => 
      `Create an epic basketball matchup image featuring a monster ${team1.mascot} in ${team1.colors} versus a monster ${team2.mascot} in ${team2.colors} in a magnificent ancient Roman colosseum setting. Combine classical architecture with basketball elements, dramatic lighting, and a sense of historical grandeur. Include marble columns, stone archways, and ancient spectators.`
  },
  MYTHICAL_BATTLE: {
    label: "Mythical Mascot Battle",
    generate: (team1: Team, team2: Team) => 
      `Create an epic fantasy battle scene featuring a giant ${team1.mascot} in ${team1.colors} armor facing off against a giant ${team2.mascot} in ${team2.colors} armor. Set in a mythical realm with magical elements, dramatic lighting, and fantasy landscape. Make it look like an epic clash between legendary creatures, while incorporating basketball elements subtly in their armor or weapons. Include magical effects and mystical atmosphere.`
  },
  CELESTIAL_ARENA: {
    label: "Celestial Arena",
    generate: (team1: Team, team2: Team) => 
      `Create a cosmic basketball matchup image featuring ${team1.name} in ${team1.colors} versus ${team2.name} in ${team2.colors} in a spectacular celestial arena. Show the teams competing in a basketball court floating in space, surrounded by galaxies, nebulae, and cosmic phenomena. Include dramatic lighting effects and stellar elements.`
  },
} as const;

type PromptType = keyof typeof PROMPT_TYPES;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend service
});

function App() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [showMatchup, setShowMatchup] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [matchupImage, setMatchupImage] = useState('');
  const [selectedPromptType, setSelectedPromptType] = useState<PromptType>('CLASSIC_STADIUM');
  const [error, setError] = useState<string | null>(null);

  const generateDallePrompt = (team1: Team, team2: Team) => {
    return PROMPT_TYPES[selectedPromptType].generate(team1, team2);
  };

  const handleCreateMatchup = async () => {
    if (team1 && team2) {
      setShowMatchup(true);
      setGeneratingImage(true);
      setError(null); // Reset error state
      try {
        const team1Data = UNIQUE_NCAA_TEAMS.find((t: Team) => t.name === team1);
        const team2Data = UNIQUE_NCAA_TEAMS.find((t: Team) => t.name === team2);
        
        if (!team1Data || !team2Data) throw new Error('Team data not found');

        const prompt = generateDallePrompt(team1Data, team2Data);
        
        // Add console log to see the request configuration
        console.log('DALL-E Request Configuration:', {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard"
        });

        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard"
        });

        if (response.data[0]?.url) {
          setMatchupImage(response.data[0].url);
        } else {
          throw new Error('No image was generated');
        }
      } catch (error) {
        console.error('Failed to generate image:', error);
        setError(error instanceof Error ? error.message : 'Failed to generate image. Please try again.');
        setMatchupImage(''); // Clear any previous image
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
    setError(null);
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

            {/* Add Prompt Type Selector */}
            <div className="mt-8 text-center">
              <label htmlFor="promptType" className="block text-lg mb-2 text-blue-100">
                Select Matchup Style
              </label>
              <select
                id="promptType"
                value={selectedPromptType}
                onChange={(e) => setSelectedPromptType(e.target.value as PromptType)}
                className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Object.entries(PROMPT_TYPES).map(([key, { label }]) => (
                  <option key={key} value={key} className="bg-blue-900">
                    {label}
                  </option>
                ))}
              </select>
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
                <div className="flex flex-col items-center justify-center min-h-[50vh] md:h-[1024px]">
                  <BasketballIcon className="h-12 w-12 text-orange-500 animate-spin" />
                  <p className="mt-4 text-blue-200">Generating your matchup image...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] md:h-[1024px]">
                  <div className="text-red-400 mb-4">⚠️ {error}</div>
                  <button
                    onClick={() => {
                      setError(null);
                      handleCreateMatchup();
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-full text-sm transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : matchupImage ? (
                <div className="relative w-full flex justify-center group">
                  <div className="w-full md:w-[1024px] aspect-square rounded-lg overflow-hidden relative">
                    <img 
                      src={matchupImage} 
                      alt={`${team1} vs ${team2} matchup`}
                      className="w-full h-full object-cover group-hover:shadow-lg transition-shadow"
                    />
                    {/* Controls in top-right corner */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <a
                        href={matchupImage}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-black/0 hover:bg-black/50 transition-colors cursor-pointer"
                        title="Open Image in New Tab"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(matchupImage, '_blank');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </a>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: `${team1} vs ${team2} Matchup`,
                              text: `Check out this epic matchup between ${team1} and ${team2}!`,
                              url: matchupImage
                            }).catch(console.error);
                          } else {
                            navigator.clipboard.writeText(matchupImage).then(() => {
                              alert('Image URL copied to clipboard!');
                            }).catch(console.error);
                          }
                        }}
                        className="p-2 rounded-full bg-black/0 hover:bg-black/50 transition-colors"
                        title="Share Image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Save instructions */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-blue-200 whitespace-nowrap">
                    <p className="md:hidden">Hold the image to save to your device</p>
                    <p className="hidden md:block">Right click to save image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] md:h-[1024px] text-blue-200">
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