export interface LichessUserInterface {
  id: string;
  username: string;
  title?: string;
  patron?: boolean;
  perfs?: Record<string, unknown>;
  profile?: {
    country?: string;
    bio?: string;
    firstName?: string;
    lastName?: string;
    links?: string;
  };
  email?: string;
  createdAt?: number;
  seenAt?: number;
  playTime?: {
    total: number;
    tv: number;
  };
}
