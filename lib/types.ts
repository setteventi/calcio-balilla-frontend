export type MatchRole = "attacco" | "difesa" | "misto";
export type MatchWinner = "A" | "B";

export interface PlayerPublic {
  id: string;
  name: string;
}

export interface MatchListItem {
  id: string;
  played_at: string;
  winner_team: MatchWinner;
  score_a: number | null;
  score_b: number | null;
  team_a_player1_role: MatchRole;
  team_a_player2_role: MatchRole;
  team_b_player1_role: MatchRole;
  team_b_player2_role: MatchRole;
  team_a_player1: PlayerPublic;
  team_a_player2: PlayerPublic;
  team_b_player1: PlayerPublic;
  team_b_player2: PlayerPublic;
}

export interface CreateMatchInput {
  team_a_player1_id: string;
  team_a_player1_role: MatchRole;
  team_a_player2_id: string;
  team_a_player2_role: MatchRole;
  team_b_player1_id: string;
  team_b_player1_role: MatchRole;
  team_b_player2_id: string;
  team_b_player2_role: MatchRole;
  winner_team: MatchWinner;
  score_a?: number;
  score_b?: number;
}

export interface PlayerStats {
  playerId: string;
  name: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  weightShare: number;
  elo: number;
  attackWinRate: number | null;
  attackMatches: number;
  defenseWinRate: number | null;
  defenseMatches: number;
}

export interface PairStats {
  playerAId: string;
  playerAName: string;
  playerBId: string;
  playerBName: string;
  matchesTogether: number;
  winsTogether: number;
  winRateTogether: number;
  synergyScore: number | null;
  belowThreshold: boolean;
}

export interface HeadToHeadStats {
  playerAId: string;
  playerAName: string;
  playerBId: string;
  playerBName: string;
  matchesAgainst: number;
  aWinsAgainstB: number;
  aWinRateAgainstB: number;
  belowThreshold: boolean;
}

export interface MatchTimelineEntry {
  matchId: string;
  playedAt: string;
  scoreA: number | null;
  scoreB: number | null;
  eloAfter: Record<string, number>;
}
