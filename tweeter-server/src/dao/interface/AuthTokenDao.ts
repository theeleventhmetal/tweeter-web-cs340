// AI-assisted: see AI-ATTRIBUTION.md

export interface SessionEntity {
  token: string;
  alias: string;
  expiresAt: number;
}

export interface AuthTokenDao {
  createSession(session: SessionEntity): Promise<void>;
  getSession(token: string): Promise<SessionEntity | null>;
  deleteSession(token: string): Promise<void>;
}
