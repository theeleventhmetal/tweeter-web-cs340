// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken } from "tweeter-shared";
import { AuthTokenDao } from "../dao/interface/AuthTokenDao";
import { DaoFactory } from "../dao/DaoFactory";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export class AuthorizationService {
  private authTokenDao: AuthTokenDao;

  public constructor(daoFactory: DaoFactory) {
    this.authTokenDao = daoFactory.createAuthTokenDao();
  }

  public async validate(authToken: AuthToken): Promise<string> {
    const session = await this.authTokenDao.getSession(authToken.token);

    if (session == null) {
      throw new Error("[Unauthorized] Invalid auth token");
    }

    if (Date.now() > session.expiresAt * 1000) {
      await this.authTokenDao.deleteSession(authToken.token);
      throw new Error("[Unauthorized] Session expired");
    }

    return session.alias;
  }

  public async createSession(alias: string, token: string): Promise<void> {
    const expiresAt = Math.floor((Date.now() + SESSION_DURATION_MS) / 1000);
    await this.authTokenDao.createSession({ token, alias, expiresAt });
  }

  public async endSession(authToken: AuthToken): Promise<void> {
    await this.authTokenDao.deleteSession(authToken.token);
  }
}
