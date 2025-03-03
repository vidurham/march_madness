export interface Team {
  name: string;
  mascot: string;
  colors: string;
  conference: string;
  logoUrl: string;
}

export interface MatchupProps {
  team1: Team | undefined;
  team2: Team | undefined;
  onReset: () => void;
}