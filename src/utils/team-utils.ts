import { NCAA_TEAMS } from '../data/teams';
import { Team } from '../types';

// Remove duplicate teams based on name
export const getUniqueTeams = (): Team[] => {
  const teamNames = new Set<string>();
  const uniqueTeams: Team[] = [];

  for (const team of NCAA_TEAMS) {
    if (!teamNames.has(team.name)) {
      teamNames.add(team.name);
      uniqueTeams.push(team);
    }
  }

  return uniqueTeams;
};

// Get unique teams array
export const UNIQUE_NCAA_TEAMS = getUniqueTeams();

// Log the counts
console.log(`Original NCAA teams: ${NCAA_TEAMS.length}`);
console.log(`Unique NCAA teams: ${UNIQUE_NCAA_TEAMS.length}`);

// Get random unique teams
export const getRandomUniqueTeams = (count: number = 2): Team[] => {
  const teamsCopy = [...UNIQUE_NCAA_TEAMS];
  const result: Team[] = [];
  
  for (let i = 0; i < count; i++) {
    if (teamsCopy.length === 0) break;
    const randomIndex = Math.floor(Math.random() * teamsCopy.length);
    result.push(teamsCopy[randomIndex]);
    teamsCopy.splice(randomIndex, 1);
  }
  
  return result;
}; 