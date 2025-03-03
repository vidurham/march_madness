import React, { useState, useRef, useEffect } from 'react';
import { CircleDot as BasketballIcon, Search, X } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeConference, setActiveConference] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedTeamData = teams.find(t => t.name === selectedTeam);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Filter teams based on search term and active conference
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConference = !activeConference || team.conference === activeConference;
    return matchesSearch && matchesConference;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length >= 3);
  };

  // Handle clicking outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        <BasketballIcon className="h-4 w-4 text-orange-500" />
        {label}
      </label>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={selectedTeam || searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            setShowDropdown(value.length >= 3);
          }}
          onFocus={(e) => {
            // Clear the input if it shows the selected team
            if (e.target.value === selectedTeam) {
              setSearchTerm('');
            }
            // Show dropdown if we have 3+ characters
            if (e.target.value.length >= 3) {
              setShowDropdown(true);
            }
          }}
          onTouchStart={(e) => {
            // Ensure touch events work properly on iOS
            if (e.target instanceof HTMLInputElement) {
              e.target.focus();
            }
          }}
          placeholder="Search teams..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className="w-full px-4 py-2 pl-10 rounded-lg bg-blue-900/95 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        {(searchTerm || selectedTeam) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setShowDropdown(false);
              if (selectedTeam) {
                onSelectTeam('');
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white p-2 -mr-2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Conference List */}
      <div className="mb-4 max-h-32 overflow-y-auto bg-white/5 rounded-lg p-2 text-xs space-y-1 -webkit-overflow-scrolling-touch">
        <div 
          onClick={() => setActiveConference(null)}
          className={`flex justify-between items-center text-blue-200 px-2 py-1 rounded cursor-pointer hover:bg-white/10 active:bg-white/20 transition-colors
            ${!activeConference ? 'bg-orange-500/20 text-orange-300' : ''}`}
        >
          <span>All Teams</span>
          <span className="text-orange-400">{teams.length} teams</span>
        </div>
        {conferenceCounts.map(({ name, count }) => (
          <div
            key={name}
            onClick={() => setActiveConference(name === activeConference ? null : name)}
            className={`flex justify-between items-center text-blue-200 px-2 py-1 rounded cursor-pointer hover:bg-white/10 active:bg-white/20 transition-colors
              ${name === activeConference ? 'bg-orange-500/20 text-orange-300' : ''}`}
          >
            <span>{name}</span>
            <span className="text-orange-400">{count} teams</span>
          </div>
        ))}
      </div>

      {/* Teams Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {showDropdown && (searchTerm.length >= 3 || selectedTeam) && (
          <div className="fixed md:absolute left-0 right-0 md:relative z-50 w-full max-h-[40vh] md:max-h-60 overflow-y-auto rounded-lg bg-blue-900 backdrop-blur-sm border border-white/20 shadow-xl -webkit-overflow-scrolling-touch">
            {filteredTeams.length > 0 ? (
              filteredTeams
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((team) => (
                  <div
                    key={team.name}
                    onClick={() => {
                      onSelectTeam(team.name);
                      setShowDropdown(false);
                      setSearchTerm('');
                    }}
                    className={`px-4 py-3 cursor-pointer hover:bg-white/10 active:bg-white/20 text-white flex items-center justify-between
                      ${team.name === selectedTeam ? 'bg-orange-500/20' : ''}`}
                  >
                    <span>{team.name}</span>
                    <span className="text-sm text-blue-200">{team.conference}</span>
                  </div>
                ))
            ) : (
              <div className="px-4 py-3 text-white/50">No teams found</div>
            )}
          </div>
        )}
        
        <select
          value={selectedTeam}
          onChange={(e) => onSelectTeam(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg bg-blue-900/95 backdrop-blur-sm border transition-all
            ${selectedTeam 
              ? 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.2)]' 
              : 'border-white/30 hover:border-white/50'} 
            focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none text-white
            appearance-none`}
        >
          <option value="" className="bg-blue-900">Select a team...</option>
          {filteredTeams
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((team) => (
              <option key={team.name} value={team.name} className="bg-blue-900">
                {team.name}
              </option>
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