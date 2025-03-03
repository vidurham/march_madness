import React from 'react';
import { CircleDot as BasketballIcon } from 'lucide-react';
import { Team } from '../types';

interface TeamSelectorProps {
  label: string;
  selectedTeam: string;
  onSelectTeam: (team: string) => void;
  teams: Team[];
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  label,
  selectedTeam,
  onSelectTeam,
  teams
}) => {
  const selectedTeamData = teams.find(t => t.name === selectedTeam);

  // Group teams by conference
  const teamsByConference = teams.reduce((acc, team) => {
    if (!acc[team.conference]) {
      acc[team.conference] = [];
    }
    acc[team.conference].push(team);
    return acc;
  }, {} as Record<string, Team[]>);

  // Sort conferences alphabetically
  const sortedConferences = Object.keys(teamsByConference).sort();

  // Get conference counts for display
  const conferenceCounts = sortedConferences.map(conf => ({
    name: conf,
    count: teamsByConference[conf].length
  }));

  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        <BasketballIcon className="h-4 w-4 text-orange-500" />
        {label}
      </label>

      {/* Conference List Display */}
      <div className="mb-4 max-h-32 overflow-y-auto bg-white/5 rounded-lg p-2 text-xs space-y-1">
        {conferenceCounts.map(({ name, count }) => (
          <div key={name} className="flex justify-between items-center text-blue-200 px-2 py-1 rounded hover:bg-white/5">
            <span>{name}</span>
            <span className="text-orange-400">{count} teams</span>
          </div>
        ))}
      </div>

      <div className="relative">
        <select
          value={selectedTeam}
          onChange={(e) => onSelectTeam(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border transition-all
            ${selectedTeam 
              ? 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.2)]' 
              : 'border-white/30 hover:border-white/50'} 
            focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none text-white
            appearance-none`}
        >
          <option value="" className="bg-blue-900">Select a team...</option>
          {sortedConferences.map((conference) => (
            <optgroup key={conference} label={`${conference} (${teamsByConference[conference].length} teams)`}>
              {teamsByConference[conference]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((team) => (
                  <option key={team.name} value={team.name} className="bg-blue-900">
                    {team.name} {team.mascot}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="border-l-2 border-t-2 border-white/50 w-2 h-2 transform rotate-135"></div>
        </div>
      </div>
      {selectedTeamData && (
        <div className="mt-2 text-sm text-blue-200">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            {selectedTeamData.conference}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSelector;