import React from 'react';
import { ArrowLeft, CircleDot as BasketballIcon, Trophy } from 'lucide-react';
import { MatchupProps } from '../types';

const MatchupDisplay: React.FC<MatchupProps> = ({ team1, team2, onReset }) => {
  if (!team1 || !team2) return null;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20">
      <button
        onClick={onReset}
        className="mb-6 flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Selection
      </button>

      <div className="relative">
        {/* Court lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* Team 1 */}
          <div className="flex-1 text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/50 to-blue-700/50 backdrop-blur-sm flex items-center justify-center shadow-xl overflow-hidden border-4 border-white/10">
              {team1.logoUrl ? (
                <img 
                  src={team1.logoUrl} 
                  alt={`${team1.name} logo`}
                  className="w-24 h-24 object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                  }}
                />
              ) : (
                <BasketballIcon className="h-16 w-16 text-white" />
              )}
              <BasketballIcon className="h-16 w-16 text-white fallback-icon hidden" />
            </div>
            <div className="text-3xl font-bold mb-2">{team1.name}</div>
            <div className="text-sm opacity-75 space-y-1">
              <div className="bg-white/5 rounded-full py-1 px-4">{team1.conference}</div>
              <div className="bg-white/5 rounded-full py-1 px-4">{team1.colors}</div>
            </div>
          </div>

          {/* VS */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Trophy className="h-10 w-10" />
            </div>
            <div className="absolute -inset-4 rounded-full border-2 border-dashed border-orange-500/30 animate-spin-slow"></div>
          </div>

          {/* Team 2 */}
          <div className="flex-1 text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/50 to-blue-700/50 backdrop-blur-sm flex items-center justify-center shadow-xl overflow-hidden border-4 border-white/10">
              {team2.logoUrl ? (
                <img 
                  src={team2.logoUrl} 
                  alt={`${team2.name} logo`}
                  className="w-24 h-24 object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                  }}
                />
              ) : (
                <BasketballIcon className="h-16 w-16 text-white" />
              )}
              <BasketballIcon className="h-16 w-16 text-white fallback-icon hidden" />
            </div>
            <div className="text-3xl font-bold mb-2">{team2.name}</div>
            <div className="text-sm opacity-75 space-y-1">
              <div className="bg-white/5 rounded-full py-1 px-4">{team2.conference}</div>
              <div className="bg-white/5 rounded-full py-1 px-4">{team2.colors}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
          Epic March Madness Matchup!
        </div>
        <div className="text-blue-300 flex items-center justify-center gap-2">
          <BasketballIcon className="h-4 w-4 animate-bounce" />
          {team1.name} vs {team2.name}
          <BasketballIcon className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default MatchupDisplay;