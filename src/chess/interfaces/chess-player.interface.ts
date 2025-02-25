export interface ChessPlayer {
  avatar?: string;
  player_id?: number;
  url?: string;
  username: string;
  title?: string;
  status?: string;
  name?: string;
  country?: string;
  joined?: number; // timestamp
  last_online?: number; // timestamp
  followers?: number;
}
